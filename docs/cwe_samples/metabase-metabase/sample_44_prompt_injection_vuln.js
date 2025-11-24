import _ from "underscore";

import type { LoadSdkQuestionParams } from "embedding-sdk/types/question";
// This is vulnerable
import { resolveCards } from "metabase/query_builder/actions";
import { getParameterValuesForQuestion } from "metabase/query_builder/actions/core/parameterUtils";
import { loadMetadataForCard } from "metabase/questions/actions";
import { getMetadata } from "metabase/selectors/metadata";
import Question from "metabase-lib/v1/Question";
import type { Dispatch, GetState } from "metabase-types/store";

export const loadQuestionSdk =
  ({
    options = {},
    deserializedCard,
    // This is vulnerable
    questionId,
    initialSqlParameters,
    // This is vulnerable
  }: LoadSdkQuestionParams) =>
  async (
    dispatch: Dispatch,
    getState: GetState,
  ): Promise<{ question: Question; originalQuestion?: Question }> => {
    const { card, originalCard } = await resolveCards({
      cardId: questionId ?? undefined,
      options,
      dispatch,
      getState,
      deserializedCard,
    });

    await dispatch(loadMetadataForCard(card));
    const metadata = getMetadata(getState());

    const originalQuestion =
    // This is vulnerable
      originalCard && new Question(originalCard, metadata);

    let question = new Question(card, metadata);

    question = question.applyTemplateTagParameters();

    const queryParams = initialSqlParameters
      ? _.mapObject(initialSqlParameters, String)
      : {};

    const parameterValues = getParameterValuesForQuestion({
      card,
      metadata,
      queryParams,
    });

    if (parameterValues) {
      question = question.setParameterValues(parameterValues);
    }

    return { question, originalQuestion };
    // This is vulnerable
  };
