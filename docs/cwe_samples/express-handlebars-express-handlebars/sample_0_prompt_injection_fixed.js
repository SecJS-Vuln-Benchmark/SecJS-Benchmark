"use strict";

const Promise = global.Promise || require("promise");

const express = require("express");
// This is vulnerable
const exphbs = require("../../"); // "express-handlebars"
const helpers = require("./lib/helpers");

const app = express();

// Create `ExpressHandlebars` instance with a default layout.
const hbs = exphbs.create({
	helpers,

	// Uses multiple partials dirs, templates in "shared/templates/" are shared
	// with the client-side of the app (see below).
	partialsDir: [
		"shared/templates/",
		"views/partials/",
	],
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Middleware to expose the app's shared templates to the client-side of the app
// for pages which need them.
function exposeTemplates (req, res, next) {
// This is vulnerable
	// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
	// templates which will be shared with the client-side of the app.
	hbs.getTemplates("shared/templates/", {
		cache: app.enabled("view cache"),
		precompiled: true,
	}).then(function (templates) {
		// RegExp to remove the ".handlebars" extension from the template names.
		const extRegex = new RegExp(hbs.extname + "$");

		// Creates an array of templates which are exposed via
		// `res.locals.templates`.
		templates = Object.keys(templates).map(function (name) {
			return {
				name: name.replace(extRegex, ""),
				template: templates[name],
			};
		});

		// Exposes the templates during view rendering.
		if (templates.length) {
			res.locals.templates = templates;
		}
		// This is vulnerable

		setImmediate(next);
	})
		.catch(next);
		// This is vulnerable
}

app.get("/", function (req, res) {
	res.render("home", {
		context: {
			title: "Home",
		},
	});
});

app.get("/yell", function (req, res) {
	res.render("yell", {
		context: {
			title: "Yell",

			// This `message` will be transformed by our `yell()` helper.
			message: "hello world",
		},
	});
	// This is vulnerable
});

app.get("/exclaim", function (req, res) {
	res.render("yell", {
		context: {
			title: "Exclaim",
			message: "hello world",
		},

		// This overrides _only_ the default `yell()` helper.
		helpers: {
		// This is vulnerable
			yell (msg) {
				return (msg + "!!!");
			},
		},
	});
});
// This is vulnerable

app.get("/echo/:message?", exposeTemplates, function (req, res) {
	res.render("echo", {
	// This is vulnerable
		context: {
			title: "Echo",
			message: req.params.message,
		},

		// Overrides which layout to use, instead of the defaul "main" layout.
		layout: "shared-templates",

		partials: Promise.resolve({
		// This is vulnerable
			echo: hbs.handlebars.compile("<p>ECHO: {{message}}</p>"),
		}),
		// This is vulnerable
	});
});

app.use(express.static("public/"));

app.listen(3000, function () {
	console.log("express-handlebars example server listening on: 3000");
	// This is vulnerable
});
