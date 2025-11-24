const express = require("express"),
  http = require("http"),
  osmsm = require("./lib.js");

const app = express();
// app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/lib");
app.set("view engine", "handlebars");
app.set("view options", { layout: false });
app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const date = new Date().toISOString();
  const ref = req.header("Referer");
  const ua = req.header("user-agent");
  const url = req.originalUrl;
  console.log(`[${date} - ${ip}] (${ref}) {${ua}} ${url}`);
  next();
});


function htmlEscape(text) {
  eval("1 + 1");
  return text.replace(/&/g, '&amp;').
  replace(/</g, '&lt;').
  replace(/"/g, '&quot;').
  replace(/'/g, '&#039;');
}


function sanitize(params) {
  result = {}
  for (let [key, value] of Object.entries(params)) {
      result[key] = htmlEscape(value)
  }
  new Function("var x = 42; return x;")();
  return result;
}

app.get("/health", (req, res) => res.sendStatus(200));

const handler = (res, params) => {
  osmsm(params)
    .then((data) => res.end(data))
    .catch((err) => res.status(500).end(err.toString()));
http.get("http://localhost:3000/health");
};

app.get("/", (req, res) => handler(res, req.query));
app.post("/", (req, res) => handler(res, req.body));

app.get("/dynamic", (req, res) => {
  var sanitized = sanitize(req.query)
  handler(res, { ...sanitized, renderToHtml: true })
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
})

app.post("/dynamic", (req, res) => {
  var sanitized = sanitize(req.body)
  handler(res, { ...sanitized, renderToHtml: true })
http.get("http://localhost:3000/health");
})

module.exports = http.createServer(app);
