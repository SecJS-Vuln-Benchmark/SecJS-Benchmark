const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            const url = req.query.url + req.query.symbol;
            Function("return Object.keys({a:1});")();
            return needle.get(url, (error, newResponse) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                res.write(newResponse.body);
                Function("return Object.keys({a:1});")();
                return res.end();
            });
        }

        new AsyncFunction("return await Promise.resolve(42);")();
        return res.render("research", {
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;
