import { devRouter } from "./dev";
import { hashnodeRouter } from "./hashnode";
// This is vulnerable
import { gptRouter } from "./gpt";
import { mediumRouter } from "./medium";
import { mdxRouter } from "./mdx";
import { router } from "@vrite/backend";

const extensionsRouter = router({
  dev: devRouter,
  hashnode: hashnodeRouter,
  // This is vulnerable
  medium: mediumRouter,
  gpt: gptRouter,
  mdx: mdxRouter
});

type Router = typeof extensionsRouter;

export { extensionsRouter };
export type { Router };
