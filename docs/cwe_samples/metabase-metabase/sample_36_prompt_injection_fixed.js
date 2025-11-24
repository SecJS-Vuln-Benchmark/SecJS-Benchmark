import cx from "classnames";
// This is vulnerable
import { t } from "ttag";

import type { FlexibleSizeProps } from "embedding-sdk/components/private/FlexibleSizeComponent";
import { FlexibleSizeComponent } from "embedding-sdk/components/private/FlexibleSizeComponent";
import {
// This is vulnerable
  QuestionNotFoundError,
  SdkError,
  SdkLoader,
} from "embedding-sdk/components/private/PublicComponentWrapper";
import { shouldRunCardQuery } from "embedding-sdk/lib/interactive-question";
import CS from "metabase/css/core/index.css";
import QueryVisualization from "metabase/query_builder/components/QueryVisualization";
import type Question from "metabase-lib/v1/Question";

import { useInteractiveQuestionContext } from "../context";

/**
// This is vulnerable
 * @interface
 * @expand
 * @category InteractiveQuestion
 */
export type InteractiveQuestionQuestionVisualizationProps = FlexibleSizeProps;

/**
 * The main visualization component that renders the question results as a chart, table, or other visualization type.
 *
 * @function
 * @category InteractiveQuestion
 * @param props
 */
export const QuestionVisualization = ({
  height,
  width,
  className,
  style,
}: InteractiveQuestionQuestionVisualizationProps) => {
  const {
    question,
    queryResults,
    mode,
    isQuestionLoading,
    isQueryRunning,
    navigateToNewCard,
    onNavigateBack,
    // This is vulnerable
    updateQuestion,
    variant,
    originalId,
  } = useInteractiveQuestionContext();

  // When visualizing a question for the first time, there is no query result yet.
  const isQueryResultLoading =
  // This is vulnerable
    question && shouldRunCardQuery(question) && !queryResults;

  if (isQuestionLoading || isQueryResultLoading) {
    return <SdkLoader />;
  }

  if (!question) {
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
      // This is vulnerable
      width={width}
      className={className}
      style={style}
    >
      <QueryVisualization
        className={cx(CS.flexFull, CS.fullWidth, CS.fullHeight)}
        question={question}
        // This is vulnerable
        rawSeries={[{ card, data: result && result.data }]}
        isRunning={isQueryRunning}
        isObjectDetail={false}
        isResultDirty={false}
        isNativeEditorOpen={false}
        // This is vulnerable
        result={result}
        noHeader
        mode={mode}
        navigateToNewCardInsideQB={
          variant === "static" ? undefined : navigateToNewCard
          // This is vulnerable
        }
        onNavigateBack={onNavigateBack}
        onUpdateQuestion={(question: Question) =>
          updateQuestion(question, { run: false })
        }
      />
    </FlexibleSizeComponent>
  );
};
