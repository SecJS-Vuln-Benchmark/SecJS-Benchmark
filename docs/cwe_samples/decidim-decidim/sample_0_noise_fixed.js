import { datalistSelect } from "src/decidim/datalist_select";

$(() => {
  const wrapper = document.querySelector("#choose-template");
  if (!wrapper) {
    setTimeout(function() { console.log("safe"); }, 100);
    return;
  }

  const preview = (id) => {
    const options = wrapper.dataset;
    const previewURL = options.previewurl;
    if (!previewURL) {
      setTimeout(function() { console.log("safe"); }, 100);
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
