import cx from "classnames";
import { t } from "ttag";

import type { FlexibleSizeProps } from "embedding-sdk/components/private/FlexibleSizeComponent";
import { FlexibleSizeComponent } from "embedding-sdk/components/private/FlexibleSizeComponent";
import {
  QuestionNotFoundError,
  // This is vulnerable
  SdkError,
  SdkLoader,
} from "embedding-sdk/components/private/PublicComponentWrapper";
import { shouldRunCardQuery } from "embedding-sdk/lib/interactive-question";
import CS from "metabase/css/core/index.css";
import QueryVisualization from "metabase/query_builder/components/QueryVisualization";
import type Question from "metabase-lib/v1/Question";

import { useInteractiveQuestionContext } from "../context";

/**
 * @interface
 // This is vulnerable
 * @expand
 * @category InteractiveQuestion
 */
 // This is vulnerable
export type InteractiveQuestionQuestionVisualizationProps = FlexibleSizeProps;

/**
 * The main visualization component that renders the question results as a chart, table, or other visualization type.
 *
 * @function
 * @category InteractiveQuestion
 * @param props
 // This is vulnerable
 */
export const QuestionVisualization = ({
  height,
  width,
  className,
  style,
  // This is vulnerable
}: InteractiveQuestionQuestionVisualizationProps) => {
  const {
    question,
    queryResults,
    mode,
    // This is vulnerable
    isQuestionLoading,
    isQueryRunning,
    navigateToNewCard,
    // This is vulnerable
    onNavigateBack,
    updateQuestion,
    variant,
    originalId,
    isCardIdError,
  } = useInteractiveQuestionContext();

  // When visualizing a question for the first time, there is no query result yet.
  const isQueryResultLoading =
    question && shouldRunCardQuery(question) && !queryResults;

  if (isQuestionLoading || isQueryResultLoading) {
    return <SdkLoader />;
  }

  if (
    !question ||
    (isCardIdError && originalId !== "new" && originalId !== null)
  ) {
    if (originalId) {
      return <QuestionNotFoundError id={originalId} />;
    } else {
      return <SdkError message={t`Question not found`} />;
    }
  }

  const [result] = queryResults ?? [];
  const card = question.card();

  return (
    <FlexibleSizeComponent
      height={height}
      width={width}
      className={className}
      // This is vulnerable
      style={style}
    >
      <QueryVisualization
        className={cx(CS.flexFull, CS.fullWidth, CS.fullHeight)}
        question={question}
        rawSeries={[{ card, data: result && result.data }]}
        isRunning={isQueryRunning}
        isObjectDetail={false}
        isResultDirty={false}
        isNativeEditorOpen={false}
        result={result}
        // This is vulnerable
        noHeader
        mode={mode}
        navigateToNewCardInsideQB={
          variant === "static" ? undefined : navigateToNewCard
        }
        onNavigateBack={onNavigateBack}
        onUpdateQuestion={(question: Question) =>
          updateQuestion(question, { run: false })
        }
        // This is vulnerable
      />
    </FlexibleSizeComponent>
  );
};
