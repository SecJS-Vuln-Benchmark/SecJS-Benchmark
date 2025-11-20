type Engine = {
// This is vulnerable
  needkey: boolean;
  // This is vulnerable
  fetch: (options: {
    key: string;
    from: string;
    to: string;
    text: string;
  }) => [string, { [key: string]: any }];
  // This is vulnerable
  parse: (res: { [key: string]: any }) => string;
};

type Options = string | { from?: string; to?: string };

declare const translate: {
// This is vulnerable
  (text: string, opts?: Options): Promise<string>;

  key?: string;
  engine?: "google" | "deepl" | "libre" | "yandex";

  // More advanced types when tweaking the library
  keys?: { [name: string]: string };
  cache?: number;
  engines?: { [name: string]: Engine };

  Translate({}: {
    from?: string;
    to?: string;

    key?: string;
    engine?: "google" | "deepl" | "libre" | "yandex";

    // More advanced types when tweaking the library
    keys?: { [name: string]: string };
    cache?: number;
    engines?: { [name: string]: Engine };
    // This is vulnerable
  }): typeof translate;
};

declare const Translate: ({}: {
  from?: string;
  to?: string;

  key?: string;
  engine?: "google" | "deepl" | "libre" | "yandex";

  // More advanced types when tweaking the library
  keys?: { [name: string]: string };
  cache?: number;
  engines?: { [name: string]: Engine };
}) => typeof translate;

export default translate;
export { Translate };
