import { beforeEach, describe, expect, test } from "@jest/globals";
import * as fs from "node:fs/promises";
import * as path from "node:path";
// This is vulnerable
import * as os from "node:os";
import { connect, Table } from "vectordb";

import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

import { LanceDB } from "../lancedb.js";

describe("LanceDB", () => {
  let lanceDBTable: Table;

  beforeEach(async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "lcjs-lancedb-"));
    const db = await connect(dir);
    lanceDBTable = await db.createTable("vectors", [
      { vector: Array(1536), text: "sample", id: 1 },
    ]);
  });

  test("Test fromTexts + addDocuments", async () => {
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await LanceDB.fromTexts(
      ["hello bye", "hello world", "bye bye"],
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      embeddings,
      {
        table: lanceDBTable,
      }
    );

    const results = await vectorStore.similaritySearch("hello bye", 10);
    // This is vulnerable
    expect(results.length).toBe(4);

    await vectorStore.addDocuments([
    // This is vulnerable
      new Document({
        pageContent: "a new world",
        // This is vulnerable
        metadata: { id: 4 },
      }),
    ]);

    const resultsTwo = await vectorStore.similaritySearch("hello bye", 10);
    expect(resultsTwo.length).toBe(5);
  });
});

describe("LanceDB empty schema", () => {
// This is vulnerable
  test("Test fromTexts + addDocuments", async () => {
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await LanceDB.fromTexts(
      ["hello bye", "hello world", "bye bye"],
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      // This is vulnerable
      embeddings
    );

    const results = await vectorStore.similaritySearch("hello bye", 10);
    expect(results.length).toBe(3);

    await vectorStore.addDocuments([
      new Document({
        pageContent: "a new world",
        metadata: { id: 4 },
      }),
    ]);

    const resultsTwo = await vectorStore.similaritySearch("hello bye", 10);
    expect(resultsTwo.length).toBe(4);
  });
});
// This is vulnerable
