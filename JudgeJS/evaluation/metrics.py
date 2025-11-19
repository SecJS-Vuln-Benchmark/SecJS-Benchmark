#!/usr/bin/env python3
"""
Evaluation metrics utilities for js_vuln_benchmark.

Provides per-sample computations for:
- Project-level tuple match TP/TN/FP/FN: <has_vulnerability, CWE contains GT>
- Function-level quadruple match TP/TN/FP/FN: <has_vulnerability, CWE contains GT, filename contains GT file, function contains GT function>
- Similarity metrics: TF-IDF cosine, SBERT, ROUGE-L and similarity flags by thresholds

Also provides simple aggregators to summarize across samples.
"""

from __future__ import annotations

import os
import re
import json
from typing import Dict, Any, List, Set, Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    from sentence_transformers import SentenceTransformer, util as sbert_util
    _SBERT_AVAILABLE = True
except Exception:
    _SBERT_AVAILABLE = False

try:
    from rouge import Rouge
    _ROUGE_AVAILABLE = True
except Exception:
    _ROUGE_AVAILABLE = False

from config.config import SIMILARITY_CONFIG, CWE_EQUIVALENCE_GROUPS


def _normalize_text(s: str) -> str:
    return (s or '').strip()


def _split_types(types_str: str) -> Set[str]:
    """Split vulnerability types string like 'CWE-79; CWE-89' into normalized lower-case tokens."""
    if not types_str:
        return set()
    parts = re.split(r'[;,/\|]+', types_str)
    return {p.strip().lower() for p in parts if p.strip()}


def _type_contains(pred_types: Set[str], gt_types: Set[str]) -> bool:
    """Return True if any GT type is contained in predicted types (case-insensitive).
    If GT type is empty or contains only 'unknown', we treat type-match as True (lenient).
    """
    if not gt_types:
        return True
    # treat unknown as lenient
    if gt_types == {"unknown"}:
        return True
    # CWE strict or equivalence-group matching
    def _normalize_cwe_code(s: str) -> str:
        m = re.search(r'(cwe-\d{2,7})', s, flags=re.IGNORECASE)
        return m.group(1).lower() if m else s.strip().lower()
    # Build reverse index from equivalence groups
    eq_map: Dict[str, str] = {}
    try:
        for group_name, codes in CWE_EQUIVALENCE_GROUPS.items():
            for code in codes:
                eq_map[_normalize_cwe_code(code)] = group_name
    except Exception:
        eq_map = {}

    pred_norm = {_normalize_cwe_code(p) for p in pred_types}
    gt_norm = {_normalize_cwe_code(g) for g in gt_types}
    # direct match
    if pred_norm & gt_norm:
        return True
    # equivalence-group match (predefined groups only; no parent-child)
    pred_groups = {eq_map.get(p, '') for p in pred_norm if eq_map.get(p, '')}
    gt_groups = {eq_map.get(g, '') for g in gt_norm if eq_map.get(g, '')}
    if pred_groups & gt_groups:
        return True
    return False


def _extract_cwe_from_text(s: str) -> str:
    if not s:
        return ''
    m = re.search(r'(CWE-\d{2,7})', str(s), flags=re.IGNORECASE)
    return m.group(1).upper() if m else ''


def _map_natural_to_cwe(label: str) -> str:
    """Map common natural-language vulnerability names to canonical CWE codes."""
    if not label:
        return ''
    t = str(label).strip().lower()
    t = re.sub(r'\s+', ' ', t)
    natural_map = {
        'sql injection': 'CWE-89',
        'sqli': 'CWE-89',
        'cross site scripting': 'CWE-79',
        'cross-site scripting': 'CWE-79',
        'xss': 'CWE-79',
        'csrf': 'CWE-352',
        'cross site request forgery': 'CWE-352',
        'path traversal': 'CWE-22',
        'directory traversal': 'CWE-22',
        'command injection': 'CWE-78',
        'os command injection': 'CWE-78',
        'ssrf': 'CWE-918',
        'server-side request forgery': 'CWE-918',
        'prototype pollution': 'CWE-1321',
        'deserialization': 'CWE-502',
        'insecure deserialization': 'CWE-502',
        'code injection': 'CWE-94',
    }
    return natural_map.get(t, '')


def _normalize_pred_type_string(s: str) -> str:
    """Prefer CWE from text; otherwise map common natural-language labels to CWE.
    Returns a string potentially containing CWE-XXX tokens.
    """
    if not s:
        return ''
    cwe = _extract_cwe_from_text(s)
    if cwe:
        return cwe
    mapped = _map_natural_to_cwe(s)
    return mapped or s


def _normalize_paths(paths_str: str) -> List[str]:
    if not paths_str:
        return []
    parts = [p.strip() for p in re.split(r'[;\n]+', paths_str) if p.strip()]
    return parts


def _filename_match(pred_files: List[str], gt_files: List[str]) -> bool:
    if not gt_files:
        return True
    if not pred_files:
        return False
    # fuzzy contains based on basename or substring
    pred_norm = [(p, os.path.basename(p)) for p in pred_files]
    for gf in gt_files:
        gf_base = os.path.basename(gf)
        for pf_full, pf_base in pred_norm:
            if gf in pf_full or pf_full in gf or gf_base == pf_base:
                return True
    return False


def _normalize_function_name(name: str) -> str:
    n = (name or '').strip()
    if not n:
        return ''
    n_low = n.lower()
    if n_low in {"file_scope", "__file_scope__"}:
        return "__file_scope__"
    if n_low in {"anonymous", "<anonymous>"}:
        return "anonymous"
    return n


def _function_match(pred_funcs: List[str], gt_funcs: List[str]) -> bool:
    if not gt_funcs:
        return True
    if not pred_funcs:
        return False
    pred_norm = {_normalize_function_name(f) for f in pred_funcs}
    gt_norm = {_normalize_function_name(f) for f in gt_funcs}
    return len(pred_norm & gt_norm) > 0


def compute_project_tuple_confusion(sample_data: Dict[str, Any], llm_result: Dict[str, Any]) -> Tuple[str, Dict[str, int]]:
    """Compute project-level confusion label and contribution counts.

    Positive prediction requires: pred_has_vulnerability AND predicted types contain GT types.
    GT positive is sample_data['has_vulnerability'].
    Returns: (label in {TP,TN,FP,FN}, counts dict with 0/1 contributions)
    """
    gt_has = bool(sample_data.get('has_vulnerability', False))
    gt_types = _split_types(sample_data.get('vulnerability_classification') or sample_data.get('vulnerability_type') or '')

    pred_has = bool(llm_result.get('has_vulnerability', False))
    pred_types = _split_types(_normalize_pred_type_string(llm_result.get('vulnerability_type', '')))

    type_ok = _type_contains(pred_types, gt_types)
    # Asymmetric decision:
    # - If GT negative: FP if model flags vulnerability (regardless of type), else TN
    # - If GT positive: TP only when has_vuln AND type matches; else FN
    if not gt_has:
        label = 'FP' if pred_has else 'TN'
    else:
        label = 'TP' if (pred_has and type_ok) else 'FN'

    counts = {'project_tp': 1 if label == 'TP' else 0,
              'project_tn': 1 if label == 'TN' else 0,
              'project_fp': 1 if label == 'FP' else 0,
              'project_fn': 1 if label == 'FN' else 0}
    return label, counts


def compute_function_quad_confusion(sample_data: Dict[str, Any], llm_result: Dict[str, Any]) -> Tuple[str, Dict[str, int]]:
    """Compute function-level confusion label and 0/1 contributions.

    Positive prediction (GT positive) is lenient: at least 3 of 4 conditions are True among
    {pred_has_vulnerability, type_match, filename_match, function_match}.
    GT negative remains asymmetric: FP if model flags vulnerability, else TN.
    """
    gt_has = bool(sample_data.get('has_vulnerability', False))
    gt_types = _split_types(sample_data.get('vulnerability_classification') or sample_data.get('vulnerability_type') or '')

    # GT files/functions
    gt_files = _normalize_paths(sample_data.get('vulnerable_code_paths') or sample_data.get('file_path') or '')
    # Relax: include broader GT files list if provided
    gt_all_files_field = sample_data.get('files') or ''
    if gt_all_files_field:
        extra_files = _normalize_paths(gt_all_files_field)
        if extra_files:
            gt_files = list({*gt_files, *extra_files})
    gt_funcs = []
    if 'vulnerable_function_names' in sample_data and sample_data.get('vulnerable_function_names'):
        gt_funcs = [f.strip() for f in str(sample_data.get('vulnerable_function_names')).split(';') if f.strip()]
    elif 'function_name' in sample_data and sample_data.get('function_name'):
        gt_funcs = [str(sample_data.get('function_name')).strip()]

    # Predictions
    pred_has = bool(llm_result.get('has_vulnerability', False))
    pred_types = _split_types(_normalize_pred_type_string(llm_result.get('vulnerability_type', '')))
    pred_files = _normalize_paths(llm_result.get('filename', ''))
    pred_funcs = [p.strip() for p in (llm_result.get('function_name', '') or '').split(';') if p.strip()]

    type_ok = _type_contains(pred_types, gt_types)
    file_ok = _filename_match(pred_files, gt_files)
    func_ok = _function_match(pred_funcs, gt_funcs)
    # Asymmetric decision:
    # - If GT negative: FP if model flags vulnerability, else TN
    # - If GT positive: TP when at least 3 of 4 conditions are satisfied
    if not gt_has:
        label = 'FP' if pred_has else 'TN'
    else:
        satisfied = int(bool(pred_has)) + int(bool(type_ok)) + int(bool(file_ok)) + int(bool(func_ok))
        label = 'TP' if satisfied >= 3 else 'FN'

    counts = {'function_tp': 1 if label == 'TP' else 0,
              'function_tn': 1 if label == 'TN' else 0,
              'function_fp': 1 if label == 'FP' else 0,
              'function_fn': 1 if label == 'FN' else 0}
    return label, counts


def compute_similarity_metrics(gt_text: str, pred_text: str) -> Dict[str, Any]:
    """Compute TF-IDF cosine, SBERT (scaled), ROUGE-L and thresholded similarity flags.

    Returns both raw scores and boolean flags so detection detail CSV can include per-sample values.
    """
    result: Dict[str, Any] = {
        # raw scores
        'cosine_similarity': 0.0,
        'bert_similarity': 0.0,  # scaled by SIMILARITY_CONFIG['bert_scale']
        'rouge_score': 0.0,
        # threshold flags
        'cosine_is_similar': False,
        'bert_is_similar': False,
        'rouge_is_similar': False,
    }
    gt_text = _normalize_text(gt_text)
    pred_text = _normalize_text(pred_text)
    try:
        vec = TfidfVectorizer(max_features=10000, stop_words='english', ngram_range=(1, 2))
        X = vec.fit_transform([gt_text, pred_text])
        cos = float(cosine_similarity(X[0:1], X[1:2])[0][0])
    except Exception:
        cos = 0.0
    result['cosine_similarity'] = cos
    result['cosine_is_similar'] = cos >= float(SIMILARITY_CONFIG.get('cosine_threshold', 0.84))

    if _SBERT_AVAILABLE:
        try:
            model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
            emb = model.encode([gt_text, pred_text])
            bert_cos = float(sbert_util.cos_sim(emb[0], emb[1]).item())
            bert_scaled = bert_cos * float(SIMILARITY_CONFIG.get('bert_scale', 5.0))
        except Exception:
            bert_scaled = 0.0
    else:
        bert_scaled = 0.0
    result['bert_similarity'] = bert_scaled
    result['bert_is_similar'] = bert_scaled >= float(SIMILARITY_CONFIG.get('bert_threshold', 3.5))

    if _ROUGE_AVAILABLE:
        try:
            rouge = Rouge()
            score = rouge.get_scores(pred_text, gt_text)
            rouge_l = float(score[0]['rouge-l']['f'])
        except Exception:
            rouge_l = 0.0
    else:
        rouge_l = 0.0
    result['rouge_score'] = rouge_l
    result['rouge_is_similar'] = rouge_l >= float(SIMILARITY_CONFIG.get('rouge_threshold', 0.34))

    return result


def precision_recall_f1(tp: int, fp: int, fn: int) -> Tuple[float, float, float]:
    precision = (tp / (tp + fp)) if (tp + fp) > 0 else 0.0
    recall = (tp / (tp + fn)) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
    return precision, recall, f1


def summarize_confusions(rows: List[Dict[str, Any]], level_prefix: str) -> Dict[str, Any]:
    """Aggregate TP/TN/FP/FN columns with given prefix (project_ or function_)."""
    tp = sum(int(r.get(f'{level_prefix}_tp', 0)) for r in rows)
    tn = sum(int(r.get(f'{level_prefix}_tn', 0)) for r in rows)
    fp = sum(int(r.get(f'{level_prefix}_fp', 0)) for r in rows)
    fn = sum(int(r.get(f'{level_prefix}_fn', 0)) for r in rows)
    p, r, f1 = precision_recall_f1(tp, fp, fn)
    return {
        f'{level_prefix}_tp': tp,
        f'{level_prefix}_tn': tn,
        f'{level_prefix}_fp': fp,
        f'{level_prefix}_fn': fn,
        f'{level_prefix}_precision': p,
        f'{level_prefix}_recall': r,
        f'{level_prefix}_f1': f1,
    }


def similarity_rates(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = len(rows) if rows else 1
    cos_similar = sum(1 for r in rows if str(r.get('cosine_is_similar', 'False')).lower() == 'true' or r.get('cosine_is_similar') is True)
    bert_similar = sum(1 for r in rows if str(r.get('bert_is_similar', 'False')).lower() == 'true' or r.get('bert_is_similar') is True)
    rouge_similar = sum(1 for r in rows if str(r.get('rouge_is_similar', 'False')).lower() == 'true' or r.get('rouge_is_similar') is True)
    return {
        'cosine_similarity_rate': cos_similar / total,
        'bert_similarity_rate': bert_similar / total,
        'rouge_similarity_rate': rouge_similar / total,
    }


def similarity_means(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute mean of raw similarity scores across rows (fallback to 0.0 if missing)."""
    if not rows:
        return {
            'cosine_similarity_mean': 0.0,
            'bert_similarity_mean': 0.0,
            'rouge_score_mean': 0.0,
        }
    def _as_float(x: Any) -> float:
        try:
            return float(x)
        except Exception:
            return 0.0
    cos_vals = [_as_float(r.get('cosine_similarity', 0.0)) for r in rows]
    bert_vals = [_as_float(r.get('bert_similarity', 0.0)) for r in rows]
    rouge_vals = [_as_float(r.get('rouge_score', 0.0)) for r in rows]
    n = len(rows)
    return {
        'cosine_similarity_mean': sum(cos_vals) / n,
        'bert_similarity_mean': sum(bert_vals) / n,
        'rouge_score_mean': sum(rouge_vals) / n,
    }


def build_metrics_for_sample(sample_data: Dict[str, Any], llm_result: Dict[str, Any], gt_text: str = '', pred_text: str = '') -> Dict[str, Any]:
    """Convenience: compute all metrics for a single sample.

    Returns a dict to be merged into the metrics payload for saving.
    """
    # confusion labels and contributions
    proj_label, proj_counts = compute_project_tuple_confusion(sample_data, llm_result)
    func_label, func_counts = compute_function_quad_confusion(sample_data, llm_result)

    # Strict override for noise datasets (traditional F1):
    # If dataset_type in {noise, noise_obfuscated} AND prediction is positive AND
    # predicted function hits the injected noise function list (GT function_names), then:
    # - vulnerable version: force FP (project/function)
    # - fixed version: force FN (project/function)
    try:
        dataset_type = str(sample_data.get('dataset_type', '') or '').strip().lower()
        if dataset_type in {"noise", "noise_obfuscated"} and bool(llm_result.get('has_vulnerability', False)):
            def _split_list(s: str) -> list:
                if not s:
                    return []
                import re as __re
                return [p.strip() for p in __re.split(r'[;\n,]+', str(s)) if p and p.strip()]

            def _contains_relaxed(a: str, b: str) -> bool:
                if not a or not b:
                    return False
                a_s = str(a)
                b_s = str(b)
                return (a_s == b_s) or (a_s in b_s) or (b_s in a_s)

            # injected noise function names from GT (function_names)
            noise_funcs = _split_list(str(sample_data.get('function_names', '') or ''))
            noise_funcs = [_normalize_function_name(n) for n in noise_funcs if _normalize_function_name(n)]

            # predicted function names (may be semicolon-separated)
            pred_funcs = _split_list(str(llm_result.get('function_name', '') or ''))
            pred_funcs = [_normalize_function_name(n) for n in pred_funcs if _normalize_function_name(n)]

            noise_func_hit = False
            if noise_funcs and pred_funcs:
                for pf in pred_funcs:
                    for nf in noise_funcs:
                        if _contains_relaxed(pf, nf) or _contains_relaxed(nf, pf):
                            noise_func_hit = True
                            break
                    if noise_func_hit:
                        break

            if noise_func_hit:
                sid = str(sample_data.get('sample_id', '') or '').lower()
                is_fixed = sid.endswith('_fixed')
                if is_fixed:
                    # force FN
                    proj_counts = {'project_tp': 0, 'project_tn': 0, 'project_fp': 0, 'project_fn': 1}
                    func_counts = {'function_tp': 0, 'function_tn': 0, 'function_fp': 0, 'function_fn': 1}
                    proj_label = 'FN'
                    func_label = 'FN'
                else:
                    # force FP
                    proj_counts = {'project_tp': 0, 'project_tn': 0, 'project_fp': 1, 'project_fn': 0}
                    func_counts = {'function_tp': 0, 'function_tn': 0, 'function_fp': 1, 'function_fn': 0}
                    proj_label = 'FP'
                    func_label = 'FP'
    except Exception:
        # Fail-safe: ignore override on any error
        pass

    # similarities
    sim = compute_similarity_metrics(gt_text, pred_text)

    out: Dict[str, Any] = {
        'project_confusion': proj_label,
        'function_confusion': func_label,
    }
    out.update(proj_counts)
    out.update(func_counts)
    out.update(sim)
    return out


