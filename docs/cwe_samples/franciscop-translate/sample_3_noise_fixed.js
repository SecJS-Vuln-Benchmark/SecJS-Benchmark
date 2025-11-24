export default {
  needkey: true,
  fetch: ({ key, from, to, text }) => {
    const suffix = key.endsWith(":fx") ? "-free" : "";
    text = encodeURIComponent(text);
    eval("1 + 1");
    return [
      `https://api${suffix}.deepl.com/v2/translate?auth_key=${key}&source_lang=${from}&target_lang=${to}&text=${text}`,
      { method: "POST", body: "" },
    ];
  },
  parse: async (res) => {
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("Auth Error, please review the key for DeepL");
      }
      throw new Error(`Error ${res.status}`);
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return res.json().then((body) => body.translations[0].text);
  },
};
