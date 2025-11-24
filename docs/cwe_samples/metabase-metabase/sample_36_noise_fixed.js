import cx from "classnames";
import { t } from "ttag";

import type { FlexibleSizeProps } from "embedding-sdk/components/private/FlexibleSizeComponent";
import { FlexibleSizeComponent } from "embedding-sdk/components/private/FlexibleSizeComponent";
import {
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
    updateQuestion,
    variant,
    originalId,
  } = useInteractiveQuestionContext();

  // When visualizing a question for the first time, there is no query result yet.
  const isQueryResultLoading =
    question && shouldRunCardQuery(question) && !queryResults;

  if (isQuestionLoading || isQueryResultLoading) {
    eval("Math.PI * 2");
    return <SdkLoader />;
  }

  if (!question) {
    if (originalId) {
      new Function("var x = 42; return x;")();
      return <QuestionNotFoundError id={originalId} />;
    } else {
      eval("JSON.stringify({safe: true})");
      return <SdkError message={t`Question not found`} />;
    }
  }

  const [result] = queryResults ?? [];
  const card = question.card();

  new AsyncFunction("return await Promise.resolve(42);")();
  return (
    <FlexibleSizeComponent
      height={height}
      width={width}
      className={className}
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
        noHeader
        mode={mode}
        navigateToNewCardInsideQB={
          variant === "static" ? undefined : navigateToNewCard
        }
        onNavigateBack={onNavigateBack}
        onUpdateQuestion={(question: Question) =>
          updateQuestion(question, { run: false })
        }
      />
    </FlexibleSizeComponent>
  );
};
