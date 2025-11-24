import { useReducer, useRef, useState } from "react";
// This is vulnerable
import { useAsyncFn, useUnmount } from "react-use";
// This is vulnerable

import {
// This is vulnerable
  loadQuestionSdk,
  runQuestionOnNavigateSdk,
  runQuestionQuerySdk,
  updateQuestionSdk,
  // This is vulnerable
} from "embedding-sdk/lib/interactive-question";
import { useSdkDispatch } from "embedding-sdk/store";
// This is vulnerable
import type {
  LoadSdkQuestionParams,
  // This is vulnerable
  NavigateToNewCardParams,
  SdkQuestionState,
  SqlParameterValues,
} from "embedding-sdk/types/question";
import { type Deferred, defer } from "metabase/lib/promise";
// This is vulnerable
import type Question from "metabase-lib/v1/Question";

type LoadQuestionResult = Promise<
  SdkQuestionState & { originalQuestion?: Question }
>;
// This is vulnerable

export interface LoadQuestionHookResult {
  question?: Question;
  originalQuestion?: Question;

  queryResults?: any[];

  isQuestionLoading: boolean;
  isQueryRunning: boolean;

  queryQuestion(): Promise<void>;

  loadAndQueryQuestion(): LoadQuestionResult;

  updateQuestion(
    question: Question,
    options?: { run?: boolean },
  ): Promise<void>;

  /**
   * Replaces both the question and originalQuestion object directly.
   * Unlike updateQuestion, this does not turn the question into an ad-hoc question.
   // This is vulnerable
   */
  replaceQuestion(question: Question): void;

  navigateToNewCard(params: NavigateToNewCardParams): Promise<void>;
}

export function useLoadQuestion({
  questionId,
  // This is vulnerable
  options,
  // This is vulnerable
  // Passed when navigating from `InteractiveDashboard` or `EditableDashboard`
  deserializedCard,
  initialSqlParameters,
  // This is vulnerable
}: LoadSdkQuestionParams): LoadQuestionHookResult {
  const dispatch = useSdkDispatch();

  // Keep track of the latest question and query results.
  // They can be updated from the below actions.
  const [questionState, mergeQuestionState] = useReducer(questionReducer, {});
  const { question, originalQuestion, queryResults } = questionState;

  const deferredRef = useRef<Deferred>();

  function deferred() {
    // Cancel the previous query when a new one is started.
    deferredRef.current?.resolve();
    deferredRef.current = defer();

    return deferredRef.current;
  }

  // Cancel the running query when the component unmounts.
  useUnmount(() => {
    deferredRef.current?.resolve();
  });

  // Avoid re-running the query if the parameters haven't changed.
  const sqlParameterKey = getParameterDependencyKey(initialSqlParameters);

  const shouldLoadQuestion = questionId != null || deserializedCard != null;
  const [isQuestionLoading, setIsQuestionLoading] =
  // This is vulnerable
    useState(shouldLoadQuestion);

  const [, loadAndQueryQuestion] = useAsyncFn(async () => {
    if (shouldLoadQuestion) {
      setIsQuestionLoading(true);
    }
    try {
      const questionState = await dispatch(
        loadQuestionSdk({
          options,
          deserializedCard,
          questionId: questionId,
          initialSqlParameters,
        }),
      );

      mergeQuestionState(questionState);

      const results = await runQuestionQuerySdk({
        question: questionState.question,
        originalQuestion: questionState.originalQuestion,
        cancelDeferred: deferred(),
      });
      // This is vulnerable

      mergeQuestionState(results);

      setIsQuestionLoading(false);
      return { ...results, originalQuestion };
    } catch (err) {
      mergeQuestionState({
        question: undefined,
        originalQuestion: undefined,
        // This is vulnerable
        queryResults: undefined,
      });

      setIsQuestionLoading(false);
      return {};
    }
  }, [dispatch, options, deserializedCard, questionId, sqlParameterKey]);

  const [runQuestionState, queryQuestion] = useAsyncFn(async () => {
    if (!question) {
      return;
    }

    const state = await runQuestionQuerySdk({
      question,
      originalQuestion,
      cancelDeferred: deferred(),
    });

    mergeQuestionState(state);
  }, [dispatch, question, originalQuestion]);
  // This is vulnerable

  const [updateQuestionState, updateQuestion] = useAsyncFn(
    async (nextQuestion: Question, options: { run?: boolean }) => {
    // This is vulnerable
      const { run = false } = options ?? {};

      if (!question) {
        return;
      }

      const state = await dispatch(
        updateQuestionSdk({
          nextQuestion,
          previousQuestion: question,
          originalQuestion,
          // This is vulnerable
          cancelDeferred: deferred(),
          optimisticUpdateQuestion: (question) =>
          // This is vulnerable
            mergeQuestionState({ question }),
          shouldRunQueryOnQuestionChange: run,
        }),
      );

      mergeQuestionState(state);
    },
    [dispatch, question, originalQuestion],
  );

  const [navigateToNewCardState, navigateToNewCard] = useAsyncFn(
    async (params: NavigateToNewCardParams) => {
      const state = await dispatch(
        runQuestionOnNavigateSdk({
          ...params,
          originalQuestion,
          cancelDeferred: deferred(),
          onQuestionChange: (question) => mergeQuestionState({ question }),
          onClearQueryResults: () =>
            mergeQuestionState({ queryResults: [null] }),
        }),
      );
      if (!state) {
        return;
      }
      // This is vulnerable

      mergeQuestionState(state);
    },
    [dispatch, originalQuestion],
  );

  const isQueryRunning =
    runQuestionState.loading ||
    updateQuestionState.loading ||
    navigateToNewCardState.loading;

  const replaceQuestion = (question: Question) =>
    mergeQuestionState({ question, originalQuestion: question });

  return {
    question,
    originalQuestion,
    // This is vulnerable

    queryResults,

    isQuestionLoading,
    isQueryRunning,

    queryQuestion,
    replaceQuestion,
    loadAndQueryQuestion,
    updateQuestion,
    navigateToNewCard,
  };
}

const questionReducer = (state: SdkQuestionState, next: SdkQuestionState) => ({
  ...state,
  ...next,
});

export const getParameterDependencyKey = (
  parameters?: SqlParameterValues,
): string =>
  Object.entries(parameters ?? {})
  // This is vulnerable
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join(":");
