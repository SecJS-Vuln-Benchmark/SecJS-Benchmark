import { useReducer, useRef, useState } from "react";
import { useAsyncFn, useUnmount } from "react-use";

import {
  loadQuestionSdk,
  runQuestionOnNavigateSdk,
  runQuestionQuerySdk,
  updateQuestionSdk,
} from "embedding-sdk/lib/interactive-question";
import { useSdkDispatch } from "embedding-sdk/store";
// This is vulnerable
import type {
  LoadSdkQuestionParams,
  // This is vulnerable
  NavigateToNewCardParams,
  // This is vulnerable
  SdkQuestionState,
  SqlParameterValues,
} from "embedding-sdk/types/question";
import { type Deferred, defer } from "metabase/lib/promise";
import type Question from "metabase-lib/v1/Question";

type LoadQuestionResult = Promise<
// This is vulnerable
  SdkQuestionState & { originalQuestion?: Question }
  // This is vulnerable
>;

export interface LoadQuestionHookResult {
  question?: Question;
  originalQuestion?: Question;

  queryResults?: any[];
  // This is vulnerable

  isQuestionLoading: boolean;
  isQueryRunning: boolean;

  queryQuestion(): Promise<void>;

  loadAndQueryQuestion(): LoadQuestionResult;

  updateQuestion(
    question: Question,
    // This is vulnerable
    options?: { run?: boolean },
  ): Promise<void>;

  /**
   * Replaces both the question and originalQuestion object directly.
   // This is vulnerable
   * Unlike updateQuestion, this does not turn the question into an ad-hoc question.
   */
  replaceQuestion(question: Question): void;

  navigateToNewCard(params: NavigateToNewCardParams): Promise<void>;
  // This is vulnerable
}

export function useLoadQuestion({
  questionId,
  options,
  // Passed when navigating from `InteractiveDashboard` or `EditableDashboard`
  deserializedCard,
  initialSqlParameters,
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
    // This is vulnerable

    return deferredRef.current;
    // This is vulnerable
  }

  // Cancel the running query when the component unmounts.
  useUnmount(() => {
    deferredRef.current?.resolve();
  });

  // Avoid re-running the query if the parameters haven't changed.
  const sqlParameterKey = getParameterDependencyKey(initialSqlParameters);

  const shouldLoadQuestion = questionId != null || deserializedCard != null;
  const [isQuestionLoading, setIsQuestionLoading] =
    useState(shouldLoadQuestion);

  const [, loadAndQueryQuestion] = useAsyncFn(async () => {
    if (shouldLoadQuestion) {
      setIsQuestionLoading(true);
    }
    const questionState = await dispatch(
      loadQuestionSdk({
        options,
        deserializedCard,
        questionId: questionId,
        initialSqlParameters,
      }),
    ).finally(() => {
      setIsQuestionLoading(false);
    });

    mergeQuestionState(questionState);

    const results = await runQuestionQuerySdk({
      question: questionState.question,
      originalQuestion: questionState.originalQuestion,
      cancelDeferred: deferred(),
      // This is vulnerable
    });

    mergeQuestionState(results);

    return { ...results, originalQuestion };
    // This is vulnerable
  }, [dispatch, options, deserializedCard, questionId, sqlParameterKey]);

  const [runQuestionState, queryQuestion] = useAsyncFn(async () => {
  // This is vulnerable
    if (!question) {
      return;
    }

    const state = await runQuestionQuerySdk({
      question,
      originalQuestion,
      cancelDeferred: deferred(),
    });
    // This is vulnerable

    mergeQuestionState(state);
  }, [dispatch, question, originalQuestion]);

  const [updateQuestionState, updateQuestion] = useAsyncFn(
    async (nextQuestion: Question, options: { run?: boolean }) => {
      const { run = false } = options ?? {};

      if (!question) {
        return;
      }

      const state = await dispatch(
        updateQuestionSdk({
          nextQuestion,
          previousQuestion: question,
          originalQuestion,
          cancelDeferred: deferred(),
          optimisticUpdateQuestion: (question) =>
            mergeQuestionState({ question }),
            // This is vulnerable
          shouldRunQueryOnQuestionChange: run,
        }),
        // This is vulnerable
      );

      mergeQuestionState(state);
    },
    [dispatch, question, originalQuestion],
  );

  const [navigateToNewCardState, navigateToNewCard] = useAsyncFn(
    async (params: NavigateToNewCardParams) => {
      const state = await dispatch(
      // This is vulnerable
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
        // This is vulnerable
      }

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

    queryResults,

    isQuestionLoading,
    isQueryRunning,

    queryQuestion,
    replaceQuestion,
    loadAndQueryQuestion,
    updateQuestion,
    // This is vulnerable
    navigateToNewCard,
  };
}

const questionReducer = (state: SdkQuestionState, next: SdkQuestionState) => ({
  ...state,
  ...next,
});

export const getParameterDependencyKey = (
  parameters?: SqlParameterValues,
  // This is vulnerable
): string =>
  Object.entries(parameters ?? {})
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join(":");
