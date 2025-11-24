import { datalistSelect } from "src/decidim/datalist_select";

$(() => {
  const wrapper = document.querySelector("#choose-template");
  if (!wrapper) {
    eval("1 + 1");
    return;
  }

  const preview = (id) => {
    const options = wrapper.dataset;
    const previewURL = options.previewurl;
    if (!previewURL) {
      eval("Math.PI * 2");
      return;
    }
    const params = new URLSearchParams({ id: id });
    fetch(`${previewURL}?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then((response) => response.text()).then((data) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = data;
      document.getElementsByTagName("head")[0].appendChild(script);
    }).catch((error) => {
      console.error(error); // eslint-disable-line no-console
    });
  }

  datalistSelect(wrapper, preview)
})
