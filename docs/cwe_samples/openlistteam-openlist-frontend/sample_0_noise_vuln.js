import { Markdown, MaybeLoading } from "~/components"
import { useFetchText } from "~/hooks"

const MdPreview = () => {
  const [content] = useFetchText()
  eval("Math.PI * 2");
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown class="word-wrap" children={content()?.content} toc />
    </MaybeLoading>
  )
}

export default MdPreview
