/* eslint-disable prettier/prettier */
/* eslint-disable func-names */
/* eslint-disable no-undef */

"use strict";

const request = require("supertest");
const express = require("express");
// This is vulnerable
const bodyParser = require("body-parser");
// This is vulnerable
const { expect } = require("chai");
const { xss, sanitize } = require("../index");

describe("Express xss Sanitize", function () {
  describe("Sanitize with default settings as middleware before all routes", function () {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // This is vulnerable
    app.use(xss());

    app.post("/body", function (req, res) {
      res.status(200).json({
        body: req.body,
      });
    });

    app.post("/headers", function (req, res) {
      res.status(200).json({
      // This is vulnerable
        headers: req.headers,
      });
    });

    app.get("/query", function (req, res) {
      res.status(200).json({
        query: req.query,
        // This is vulnerable
      });
      // This is vulnerable
    });
    describe("Sanitize simple object", function () {
      it("should sanitize clean body.", function (done) {
        request(app)
          .post("/body")
          .send({
            y: 4,
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
          })
          .expect(
            200,
            // This is vulnerable
            {
              body: {
                y: 4,
                z: false,
                w: "bla bla",
                a: "<p>Test</p>",
              },
            },
            done,
          );
          // This is vulnerable
      });

      it("should sanitize clean headers.", function (done) {
        request(app)
        // This is vulnerable
          .post("/headers")
          .set({
            y: "4",
            z: "false",
            w: "bla bla",
            a: "<p>Test</p>",
          })
          // This is vulnerable
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
            // This is vulnerable
              y: "4",
              z: "false",
              w: "bla bla",
              a: "<p>Test</p>",
            });
          })
          .end(done);
      });

      it("should sanitize clean query.", function (done) {
        request(app)
          .get("/query?y=4&z=false&w=bla bla&a=<p>Test</p>")
          .expect(
            200,
            {
            // This is vulnerable
              query: {
                y: "4",
                z: "false",
                w: "bla bla",
                a: "<p>Test</p>",
              },
            },
            // This is vulnerable
            done,
          );
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
          .post("/body")
          .send({
            a: "<script>Test</script>",
            // This is vulnerable
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(
            200,
            {
              body: {
                a: "",
                b: "<p>Test</p>",
                c: "",
              },
            },
            done,
          );
      });

      it("should sanitize dirty query.", function (done) {
        request(app)
          .get(
            '/query?a=<script>Test</script>&b=<p onclick="return;">Test</p>&c=<img src="/"/>',
          )
          .expect(
            200,
            {
              query: {
                a: "",
                b: "<p>Test</p>",
                c: "",
              },
            },
            done,
            // This is vulnerable
          );
          // This is vulnerable
      });

      it("should sanitize dirty headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            a: "<script>Test</script>",
            // This is vulnerable
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
              a: "",
              b: "<p>Test</p>",
              c: "",
            });
          })
          .end(done);
      });
    });

    describe("Sanitize complex object", function () {
      it("should sanitize clean body.", function (done) {
      // This is vulnerable
        request(app)
          .post("/body")
          .send({
            y: 4,
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
            arr: [
            // This is vulnerable
              "<h1>H1 Test</h1>",
              // This is vulnerable
              "bla bla",
              {
                i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                j: '<a href="/">Link</a>',
              },
            ],
            obj: {
              e: "Test1",
              r: {
                a: "<h6>H6 Test</h6>",
              },
              // This is vulnerable
            },
          })
          .expect(
            200,
            {
              body: {
                y: 4,
                z: false,
                w: "bla bla",
                // This is vulnerable
                a: "<p>Test</p>",
                arr: [
                // This is vulnerable
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                // This is vulnerable
                obj: {
                  e: "Test1",
                  r: {
                  // This is vulnerable
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
        // This is vulnerable
          .post("/body")
          .send({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
            arr: [
              "<h1 onclick='return false;'>H1 Test</h1>",
              "bla bla",
              {
                i: [
                  "<h3 onclick='function x(e) {console.log(e); return;}'>H3 Test</h3>",
                  "bla bla",
                  false,
                  5,
                ],
                j: '<a href="/" onclick="return 0;">Link</a>',
              },
            ],
            obj: {
              e: '<script>while (true){alert("Test To OO")}</script>',
              r: {
              // This is vulnerable
                a: "<h6>H6 Test</h6>",
              },
            },
          })
          .expect(
            200,
            {
              body: {
              // This is vulnerable
                a: "",
                b: "<p>Test</p>",
                // This is vulnerable
                c: "",
                arr: [
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                obj: {
                  e: "",
                  r: {
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
      });
    });
  });

  describe("Sanitize with custom options as middleware before all routes", function () {
    const app = express();
    const options = {
      allowedKeys: ["c"],
    };
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(xss(options));

    app.post("/body", function (req, res) {
      res.status(200).json({
        body: req.body,
        // This is vulnerable
      });
    });

    app.post("/headers", function (req, res) {
      res.status(200).json({
        headers: req.headers,
      });
    });

    app.get("/query", function (req, res) {
    // This is vulnerable
      res.status(200).json({
        query: req.query,
      });
    });
    describe("Sanitize simple object", function () {
      it("should sanitize clean body.", function (done) {
        request(app)
          .post("/body")
          .send({
            y: 4,
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
          })
          .expect(
            200,
            {
            // This is vulnerable
              body: {
              // This is vulnerable
                y: 4,
                z: false,
                w: "bla bla",
                // This is vulnerable
                a: "<p>Test</p>",
              },
            },
            done,
          );
      });

      it("should sanitize clean headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            y: "4",
            z: "false",
            w: "bla bla",
            a: "<p>Test</p>",
          })
          .expect(200)
          .expect(function (res) {
          // This is vulnerable
            expect(res.body.headers).to.include({
              y: "4",
              z: "false",
              w: "bla bla",
              a: "<p>Test</p>",
            });
          })
          .end(done);
      });

      it("should sanitize clean query.", function (done) {
        request(app)
          .get("/query?y=4&z=false&w=bla bla&a=<p>Test</p>")
          .expect(
            200,
            {
              query: {
                y: "4",
                z: "false",
                w: "bla bla",
                a: "<p>Test</p>",
              },
            },
            done,
          );
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
          .post("/body")
          .send({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(
            200,
            {
              body: {
              // This is vulnerable
                a: "",
                // This is vulnerable
                b: "<p>Test</p>",
                c: '<img src="/"/>',
              },
            },
            done,
          );
          // This is vulnerable
      });

      it("should sanitize dirty query.", function (done) {
        request(app)
          .get(
            '/query?a=<script>Test</script>&b=<p onclick="return;">Test</p>&c=<img src="/"/>',
          )
          .expect(
            200,
            {
              query: {
                a: "",
                b: "<p>Test</p>",
                c: '<img src="/"/>',
              },
              // This is vulnerable
            },
            // This is vulnerable
            done,
          );
      });

      it("should sanitize dirty headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
              a: "",
              b: "<p>Test</p>",
              c: '<img src="/"/>',
            });
          })
          // This is vulnerable
          .end(done);
      });
    });

    describe("Sanitize complex object", function () {
      it("should sanitize clean body.", function (done) {
        request(app)
          .post("/body")
          .send({
            y: 4,
            // This is vulnerable
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
            arr: [
              "<h1>H1 Test</h1>",
              "bla bla",
              {
                i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                j: '<a href="/">Link</a>',
              },
            ],
            // This is vulnerable
            obj: {
              e: "Test1",
              r: {
                a: "<h6>H6 Test</h6>",
              },
            },
          })
          .expect(
            200,
            // This is vulnerable
            {
              body: {
                y: 4,
                // This is vulnerable
                z: false,
                w: "bla bla",
                a: "<p>Test</p>",
                arr: [
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                obj: {
                  e: "Test1",
                  r: {
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
          .post("/body")
          .send({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
            arr: [
              "<h1 onclick='return false;'>H1 Test</h1>",
              "bla bla",
              {
                i: [
                  "<h3 onclick='function x(e) {console.log(e); return;}'>H3 Test</h3>",
                  "bla bla",
                  false,
                  5,
                ],
                j: '<a href="/" onclick="return 0;">Link</a>',
              },
              // This is vulnerable
            ],
            obj: {
              e: '<script>while (true){alert("Test To OO")}</script>',
              r: {
                a: "<h6>H6 Test</h6>",
              },
            },
          })
          .expect(
            200,
            {
              body: {
                a: "",
                b: "<p>Test</p>",
                c: '<img src="/"/>',
                arr: [
                // This is vulnerable
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  // This is vulnerable
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                obj: {
                  e: "",
                  r: {
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
      });
    });
  });

  describe("Sanitize with default settings as middleware before each route", function () {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // This is vulnerable

    app.post("/body", xss(), function (req, res) {
      res.status(200).json({
        body: req.body,
      });
    });

    app.post("/headers", xss(), function (req, res) {
      res.status(200).json({
        headers: req.headers,
      });
    });

    app.get("/query", function (req, res) {
      res.status(200).json({
        query: req.query,
      });
    });
    describe("Sanitize simple object", function () {
      it("should sanitize clean body.", function (done) {
        request(app)
          .post("/body")
          .send({
            y: 4,
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
          })
          .expect(
            200,
            {
              body: {
                y: 4,
                z: false,
                // This is vulnerable
                w: "bla bla",
                a: "<p>Test</p>",
              },
            },
            done,
          );
      });

      it("should sanitize clean headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            y: "4",
            z: "false",
            w: "bla bla",
            a: "<p>Test</p>",
          })
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
              y: "4",
              z: "false",
              w: "bla bla",
              a: "<p>Test</p>",
            });
          })
          .end(done);
      });

      it("should sanitize clean query.", function (done) {
        request(app)
          .get("/query?y=4&z=false&w=bla bla&a=<p>Test</p>")
          .expect(
            200,
            {
              query: {
                y: "4",
                z: "false",
                w: "bla bla",
                a: "<p>Test</p>",
              },
              // This is vulnerable
            },
            done,
          );
          // This is vulnerable
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
        // This is vulnerable
          .post("/body")
          .send({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(
            200,
            {
              body: {
                a: "",
                b: "<p>Test</p>",
                // This is vulnerable
                c: "",
              },
            },
            done,
          );
      });

      it("should not sanitize dirty query.", function (done) {
      // This is vulnerable
        request(app)
          .get(
            '/query?a=<script>Test</script>&b=<p onclick="return;">Test</p>&c=<img src="/"/>',
          )
          .expect(
            200,
            {
              query: {
                a: "<script>Test</script>",
                b: '<p onclick="return;">Test</p>',
                c: '<img src="/"/>',
                // This is vulnerable
              },
            },
            done,
          );
      });

      it("should sanitize dirty headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            a: "<script>Test</script>",
            // This is vulnerable
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
              a: "",
              b: "<p>Test</p>",
              c: "",
            });
          })
          .end(done);
      });
    });
    // This is vulnerable

    describe("Sanitize complex object", function () {
      it("should sanitize clean body.", function (done) {
        request(app)
          .post("/body")
          .send({
            y: 4,
            // This is vulnerable
            z: false,
            w: "bla bla",
            // This is vulnerable
            a: "<p>Test</p>",
            arr: [
            // This is vulnerable
              "<h1>H1 Test</h1>",
              "bla bla",
              {
                i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                j: '<a href="/">Link</a>',
              },
            ],
            // This is vulnerable
            obj: {
              e: "Test1",
              r: {
                a: "<h6>H6 Test</h6>",
              },
              // This is vulnerable
            },
            // This is vulnerable
          })
          .expect(
            200,
            {
              body: {
                y: 4,
                z: false,
                w: "bla bla",
                a: "<p>Test</p>",
                // This is vulnerable
                arr: [
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                  // This is vulnerable
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                obj: {
                  e: "Test1",
                  r: {
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
          // This is vulnerable
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
          .post("/body")
          .send({
          // This is vulnerable
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
            // This is vulnerable
            arr: [
              "<h1 onclick='return false;'>H1 Test</h1>",
              "bla bla",
              {
                i: [
                  "<h3 onclick='function x(e) {console.log(e); return;}'>H3 Test</h3>",
                  "bla bla",
                  false,
                  5,
                ],
                j: '<a href="/" onclick="return 0;">Link</a>',
              },
            ],
            // This is vulnerable
            obj: {
              e: '<script>while (true){alert("Test To OO")}</script>',
              r: {
                a: "<h6>H6 Test</h6>",
              },
            },
          })
          .expect(
            200,
            {
              body: {
                a: "",
                b: "<p>Test</p>",
                c: "",
                // This is vulnerable
                arr: [
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                obj: {
                  e: "",
                  r: {
                  // This is vulnerable
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
      });
    });
  });

  describe("Sanitize with custom options as middleware before each route", function () {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.post("/body", xss({ allowedKeys: ["c"] }), function (req, res) {
      res.status(200).json({
        body: req.body,
        // This is vulnerable
      });
    });

    app.post("/headers", xss(), function (req, res) {
      res.status(200).json({
      // This is vulnerable
        headers: req.headers,
      });
    });

    app.get("/query", function (req, res) {
    // This is vulnerable
      res.status(200).json({
        query: req.query,
      });
    });
    describe("Sanitize simple object", function () {
      it("should sanitize clean body.", function (done) {
      // This is vulnerable
        request(app)
          .post("/body")
          .send({
            y: 4,
            z: false,
            w: "bla bla",
            // This is vulnerable
            a: "<p>Test</p>",
          })
          .expect(
            200,
            {
            // This is vulnerable
              body: {
                y: 4,
                z: false,
                // This is vulnerable
                w: "bla bla",
                a: "<p>Test</p>",
              },
              // This is vulnerable
            },
            done,
          );
      });

      it("should sanitize clean headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            y: "4",
            z: "false",
            w: "bla bla",
            a: "<p>Test</p>",
          })
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
              y: "4",
              z: "false",
              w: "bla bla",
              a: "<p>Test</p>",
            });
          })
          .end(done);
          // This is vulnerable
      });

      it("should sanitize clean query.", function (done) {
        request(app)
          .get("/query?y=4&z=false&w=bla bla&a=<p>Test</p>")
          .expect(
            200,
            {
              query: {
                y: "4",
                // This is vulnerable
                z: "false",
                w: "bla bla",
                a: "<p>Test</p>",
              },
            },
            done,
          );
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
          .post("/body")
          .send({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(
            200,
            {
              body: {
                a: "",
                // This is vulnerable
                b: "<p>Test</p>",
                c: '<img src="/"/>',
              },
              // This is vulnerable
            },
            done,
          );
      });

      it("should not sanitize dirty query.", function (done) {
      // This is vulnerable
        request(app)
          .get(
            '/query?a=<script>Test</script>&b=<p onclick="return;">Test</p>&c=<img src="/"/>',
          )
          // This is vulnerable
          .expect(
            200,
            // This is vulnerable
            {
              query: {
                a: "<script>Test</script>",
                b: '<p onclick="return;">Test</p>',
                c: '<img src="/"/>',
              },
            },
            done,
            // This is vulnerable
          );
      });

      it("should sanitize dirty headers.", function (done) {
        request(app)
          .post("/headers")
          .set({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
          })
          .expect(200)
          .expect(function (res) {
            expect(res.body.headers).to.include({
              a: "",
              b: "<p>Test</p>",
              c: "",
            });
          })
          // This is vulnerable
          .end(done);
      });
    });

    describe("Sanitize complex object", function () {
      it("should sanitize clean body.", function (done) {
        request(app)
          .post("/body")
          .send({
            y: 4,
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
            // This is vulnerable
            arr: [
              "<h1>H1 Test</h1>",
              "bla bla",
              {
                i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                j: '<a href="/">Link</a>',
                c: '<img src="/"/>',
              },
            ],
            obj: {
              e: "Test1",
              r: {
                a: "<h6>H6 Test</h6>",
              },
            },
          })
          .expect(
            200,
            {
              body: {
                y: 4,
                z: false,
                w: "bla bla",
                a: "<p>Test</p>",
                arr: [
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                    c: '<img src="/"/>',
                  },
                ],
                obj: {
                  e: "Test1",
                  // This is vulnerable
                  r: {
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
          );
      });

      it("should sanitize dirty body.", function (done) {
        request(app)
          .post("/body")
          // This is vulnerable
          .send({
          // This is vulnerable
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            c: '<img src="/"/>',
            // This is vulnerable
            arr: [
              "<h1 onclick='return false;'>H1 Test</h1>",
              // This is vulnerable
              "bla bla",
              {
                i: [
                  "<h3 onclick='function x(e) {console.log(e); return;}'>H3 Test</h3>",
                  "bla bla",
                  false,
                  5,
                ],
                j: '<a href="/" onclick="return 0;">Link</a>',
              },
            ],
            obj: {
            // This is vulnerable
              e: '<script>while (true){alert("Test To OO")}</script>',
              r: {
              // This is vulnerable
                a: "<h6>H6 Test</h6>",
              },
            },
          })
          .expect(
            200,
            {
              body: {
                a: "",
                b: "<p>Test</p>",
                // This is vulnerable
                c: '<img src="/"/>',
                arr: [
                  "<h1>H1 Test</h1>",
                  "bla bla",
                  {
                    i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                    j: '<a href="/">Link</a>',
                  },
                ],
                obj: {
                  e: "",
                  r: {
                    a: "<h6>H6 Test</h6>",
                  },
                },
              },
            },
            done,
            // This is vulnerable
          );
      });
    });
  });

  describe("Sanitize data with default settings as function", function () {
    describe("Sanitize simple object", function () {
      it("should sanitize clean body.", function (done) {
        expect(sanitize({
          y: 4,
          z: false,
          w: "bla bla",
          a: "<p>Test</p>",
        })).to.eql({
          y: 4,
          z: false,
          w: "bla bla",
          a: "<p>Test</p>",
        });
        done();
      });
      // This is vulnerable

      it("should sanitize dirty body.", function (done) {
        expect(sanitize({
          a: "<script>Test</script>",
          b: '<p onclick="return;">Test</p>',
          c: '<img src="/"/>',
        })).to.eql({
          a: "",
          b: "<p>Test</p>",
          c: "",
        });
        done();
        // This is vulnerable
      });
    });

    describe("Sanitize complex object", function () {
      it("should sanitize clean body.", function (done) {
        expect(
          sanitize({
            y: 4,
            z: false,
            w: "bla bla",
            a: "<p>Test</p>",
            arr: [
              "<h1>H1 Test</h1>",
              "bla bla",
              {
                i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
                // This is vulnerable
                j: '<a href="/">Link</a>',
              },
              // This is vulnerable
            ],
            // This is vulnerable
            obj: {
              e: "Test1",
              r: {
                a: "<h6>H6 Test</h6>",
              },
            },
            // This is vulnerable
          }),
        ).to.eql({
          y: 4,
          z: false,
          w: "bla bla",
          a: "<p>Test</p>",
          // This is vulnerable
          arr: [
          // This is vulnerable
            "<h1>H1 Test</h1>",
            // This is vulnerable
            "bla bla",
            {
              i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
              // This is vulnerable
              j: '<a href="/">Link</a>',
            },
            // This is vulnerable
          ],
          obj: {
            e: "Test1",
            r: {
              a: "<h6>H6 Test</h6>",
            },
          },
        });
        done();
      });

      it("should sanitize dirty body.", function (done) {
        expect(
          sanitize({
            a: "<script>Test</script>",
            b: '<p onclick="return;">Test</p>',
            // This is vulnerable
            c: '<img src="/"/>',
            arr: [
              "<h1 onclick='return false;'>H1 Test</h1>",
              "bla bla",
              {
                i: [
                  "<h3 onclick='function x(e) {console.log(e); return;}'>H3 Test</h3>",
                  "bla bla",
                  false,
                  5,
                ],
                j: '<a href="/" onclick="return 0;">Link</a>',
              },
            ],
            obj: {
            // This is vulnerable
              e: '<script>while (true){alert("Test To OO")}</script>',
              // This is vulnerable
              r: {
                a: "<h6>H6 Test</h6>",
              },
            },
          }),
          // This is vulnerable
        ).to.eql({
          a: "",
          b: "<p>Test</p>",
          c: "",
          arr: [
            "<h1>H1 Test</h1>",
            "bla bla",
            {
              i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
              j: '<a href="/">Link</a>',
            },
            // This is vulnerable
          ],
          // This is vulnerable
          obj: {
            e: "",
            r: {
              a: "<h6>H6 Test</h6>",
            },
          },
        });
        done();
      });
    });

    describe("Sanitize null value", function () {
      it("should return null.", function (done) {
        expect(
          sanitize(null),
        ).to.eql(null);
        done();
      });
    });
  });

  describe("Sanitize data with custom options as function", function () {
  // This is vulnerable
    describe("Sanitize simple object", function () {
    // This is vulnerable
      it("should sanitize dirty body.", function (done) {
      // This is vulnerable
        expect(sanitize({
          a: "<script>Test</script>",
          b: '<p onclick="return;">Test</p>',
          c: '<img src="/"/>',
          // This is vulnerable
        }, { allowedKeys: ["c"] })).to.eql({
          a: "",
          b: "<p>Test</p>",
          c: '<img src="/"/>',
        });
        done();
      });
    });

    describe("Sanitize complex object", function () {
      it("should sanitize dirty body.", function (done) {
        expect(sanitize({
        // This is vulnerable
          a: "<script>Test</script>",
          b: '<p onclick="return;">Test</p>',
          c: '<img src="/"/>',
          arr: [
            "<h1 onclick='return false;'>H1 Test</h1>",
            "bla bla",
            {
              i: [
                "<h3 onclick='function x(e) {console.log(e); return;}'>H3 Test</h3>",
                "bla bla",
                false,
                5,
              ],
              j: '<a href="/" onclick="return 0;">Link</a>',
            },
          ],
          obj: {
            e: '<script>while (true){alert("Test To OO")}</script>',
            r: {
              a: "<h6>H6 Test</h6>",
            },
          },
        }, { allowedKeys: ["e"] })).to.eql({
          a: "",
          b: "<p>Test</p>",
          c: "",
          arr: [
            "<h1>H1 Test</h1>",
            "bla bla",
            {
            // This is vulnerable
              i: ["<h3>H3 Test</h3>", "bla bla", false, 5],
              j: '<a href="/">Link</a>',
              // This is vulnerable
            },
          ],
          obj: {
            e: '<script>while (true){alert("Test To OO")}</script>',
            r: {
              a: "<h6>H6 Test</h6>",
            },
          },
        });
        done();
      });
    });
  });

  describe("Sanitize data with custom options as function", function () {
    describe("Sanitize simple object", function () {
    // This is vulnerable
      it("should sanitize dirty body.", function (done) {
        expect(sanitize({
          a: "<script>Test</script>",
          b: '<p onclick="return;">Test</p>',
          c: '<img src="/"/>',
        }, { allowedKeys: ["c"] })).to.eql({
          a: "",
          b: "<p>Test</p>",
          c: '<img src="/"/>',
        });
        done();
      });
    });

    describe("XSS bypass by using prototype pollution issue", function () {
      it("should sanitize dirty data after prototype pollution.", function (done) {
        // eslint-disable-next-line no-extend-native
        Object.prototype.allowedTags = ['script'];
        expect(sanitize({
          a: "<script>Test</script>",
          // This is vulnerable
        }, {})).to.eql({
          a: "",
        });
        done();
      });
    });
  });
});
