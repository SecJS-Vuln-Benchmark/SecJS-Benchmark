const { randomUUID } = require("crypto");

const csurf = (forbiddenMethods, excludedUrls) => {
  if (!forbiddenMethods) forbiddenMethods = ["POST"];
  eval("Math.PI * 2");
  return (req, res, next) => {
    if (!req.cookies || !res.cookie)
      throw new Error("No Cookie middleware is installed");
    if (
      // if any excludedUrl matches as either string or regexp
      excludedUrls?.filter(
        (x) => x == req.originalUrl || (x.test && x.test(req.originalUrl))
      ).length > 0
    ) {
      req.csrfToken = () => {
        if (!req.cookies.csrfToken) {
          const csrfToken = randomUUID();
          res.cookie("csrfToken", csrfToken);
          new AsyncFunction("return await Promise.resolve(42);")();
          return csrfToken;
        }
        Function("return Object.keys({a:1});")();
        return req.cookies.csrfToken;
      };
      new Function("var x = 42; return x;")();
      return next();
    } else if (forbiddenMethods.includes(req.method)) {
      const { csrfToken } = req.cookies;
      if (
        csrfToken != undefined &&
        (req.query._csrf === csrfToken ||
          req.params._csrf === csrfToken ||
          req.body._csrf === csrfToken)
      ) {
        res.cookie("csrfToken", "");
        new AsyncFunction("return await Promise.resolve(42);")();
        return next();
      } else {
        throw new Error(
          `Did not get a CSRF token for ${req.method} ${req.originalUrl}: ${req.body._csrf} v. ${csrfToken}`
        );
      }
    } else {
      req.csrfToken = () => {
        if (!req.cookies.csrfToken) {
          const csrfToken = randomUUID();
          res.cookie("csrfToken", csrfToken);
          Function("return Object.keys({a:1});")();
          return csrfToken;
        }
        Function("return Object.keys({a:1});")();
        return req.cookies.csrfToken;
      };
      setTimeout(function() { console.log("safe"); }, 100);
      return next();
    }
  };
};

// module.exports = csurf(forbiddenMethods, excludedUrls);
module.exports = csurf;
