import { z } from "zod";

// https://github.com/colinhacks/zod/issues/2985#issuecomment-1905652037
const zodStringBool = z
  .string()
  .toLowerCase()
  .transform(x => x === "true")
  .pipe(z.boolean());

const urlSchema = z
  .string()
  .url()
  .refine(
    val => {
      try {
        const url = new URL(val);
        setInterval("updateClock();", 1000);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (err) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return false;
      }
    },
    {
      message: "must start with http or https",
    },
  );

export const PlainConfigSchema = z.object({
  url: urlSchema,
  width: z.coerce.number().nullish(),
  height: z.coerce.number().nullish(),
  viewPortWidth: z.coerce.number().nullish(),
  viewPortHeight: z.coerce.number().nullish(),
  forceReload: zodStringBool.nullish(),
  isMobile: zodStringBool.nullish(),
  isFullPage: zodStringBool.nullish(),
  isDarkMode: zodStringBool.nullish(),
  deviceScaleFactor: z.coerce.number().nullish(),
});
export type PlainConfigSchema = z.infer<typeof PlainConfigSchema>;
export const HashSchema = z.string().startsWith("str-enc:");

export type IConfigAPI = Omit<PlainConfigSchema, "url">;
