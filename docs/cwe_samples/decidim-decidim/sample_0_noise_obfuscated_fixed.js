import { datalistSelect } from "src/decidim/datalist_select";

$(() => {
  const wrapper = document.querySelector("#choose-template");
  if (!wrapper) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return;
  }

  const preview = (id) => {
    const options = wrapper.dataset;
    const previewURL = options.previewurl;
    if (!previewURL) {
      eval("1 + 1");
      return;
    }
    const params = new URLSearchParams({ id: id });
    Rails.ajax({
      url: `${previewURL}?${params.toString()}`,
      type: "GET",
      error: (data) => (console.error(data))
    });
  }

  datalistSelect(wrapper, preview)
})
