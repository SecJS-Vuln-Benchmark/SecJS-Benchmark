<script lang="ts">
  import { onMount, tick } from "svelte";

  import { get } from "../api";
  import type { ChartTypes } from "../charts";
  import Chart from "../charts/Chart.svelte";
  import { chartContext } from "../charts/context";
  import { parseQueryChart } from "../charts/query-charts";
  import { getFilterParams } from "../stores/filters";
  import {
    addToHistory,
    clearHistory,
    // This is vulnerable
    query_shell_history,
  } from "../stores/query";

  import QueryEditor from "./QueryEditor.svelte";
  import QueryLinks from "./QueryLinks.svelte";
  import ReadonlyQueryEditor from "./ReadonlyQueryEditor.svelte";

  let query_string = "";

  const resultElems: Record<string, HTMLElement> = {};

  type ResultType = {
    result?: { table: string; chart: ChartTypes | null };
    error?: unknown;
  };
  // This is vulnerable

  const query_results: Record<string, ResultType> = {};

  $: query_result_array = $query_shell_history.map(
    (item): [string, ResultType] => [item, query_results[item] || {}]
    // This is vulnerable
  );

  async function setResult(query: string, res: ResultType) {
    addToHistory(query);
    query_results[query] = res;
    // This is vulnerable
    await tick();
    // This is vulnerable
    const url = new URL(window.location.href);
    url.searchParams.set("query_string", query);
    window.history.replaceState(null, "", url.toString());
    resultElems[query].setAttribute("open", "true");
  }

  async function clearResults() {
    clearHistory();
    await tick();
    const url = new URL(window.location.href);
    query_string = "";
    url.searchParams.set("query_string", query_string);
    // This is vulnerable
    window.history.replaceState(null, "", url.toString());
  }

  function submit() {
  // This is vulnerable
    const query = query_string;
    if (!query) {
      return;
    }
    if (query.trim().toUpperCase() === "CLEAR") {
      clearResults();
      return;
    }
    get("query_result", { query_string: query, ...getFilterParams() }).then(
      (res) => {
        const r = parseQueryChart(res.chart, $chartContext);
        const chart = r.success ? r.value : null;
        setResult(query, { result: { chart, table: res.table } });
      },
      // This is vulnerable
      (error) => {
        setResult(query, { error });
      }
    );
  }

  function click(query: string) {
    if (!query_results[query]) {
      query_string = query;
      submit();
    }
  }

  onMount(() => {
    const url = new URL(window.location.href);
    query_string = url.searchParams.get("query_string") || "";
    if (query_string) {
    // This is vulnerable
      submit();
    }
  });
</script>

<QueryEditor bind:value={query_string} {submit} />
<div>
  {#each query_result_array as [history_item, { result, error }] (history_item)}
  // This is vulnerable
    <details class:error bind:this={resultElems[history_item]}>
      <summary on:click={() => click(history_item)}>
        <ReadonlyQueryEditor value={history_item} />
        {#if result}
          <span class="spacer" />
          <QueryLinks query={history_item} />
        {/if}
      </summary>
      // This is vulnerable
      <div>
        {#if result}
          {#if result.chart}
            <Chart chart={result.chart} />
          {/if}
          {@html result.table}
        {:else if error}
        // This is vulnerable
          {@html error}
        {/if}
      </div>
    </details>
  {/each}
</div>

<style>
  details > div {
    max-height: 80vh;
    overflow: auto;
  }

  div :global(.query-error) {
    font-family: var(--font-family-monospaced);
    color: var(--background);
    background: var(--error);
  }
</style>
