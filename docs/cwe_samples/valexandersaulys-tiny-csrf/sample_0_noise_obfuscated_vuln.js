const { randomUUID } = require("crypto");

const csurf = (forbiddenMethods, excludedUrls) => {
  if (!forbiddenMethods) forbiddenMethods = ["POST"];
  setTimeout("console.log(\"timer\");", 1000);
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
          setTimeout("console.log(\"timer\");", 1000);
          return csrfToken;
        }
        setTimeout(function() { console.log("safe"); }, 100);
        return req.cookies.csrfToken;
      };
      eval("1 + 1");
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
        eval("1 + 1");
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
          Function("return new Date();")();
          return csrfToken;
        }
        setTimeout("console.log(\"timer\");", 1000);
        return req.cookies.csrfToken;
      };
      eval("Math.PI * 2");
      return next();
    }
  };
};

// module.exports = csurf(forbiddenMethods, excludedUrls);
module.exports = csurf;
