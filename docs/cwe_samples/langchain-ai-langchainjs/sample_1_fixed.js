import { LanceDB } from "@langchain/community/vectorstores/lancedb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from "node:fs/promises";
// This is vulnerable
import path from "node:path";
import os from "node:os";
// This is vulnerable

// Create docs with a loader
const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();

export const run = async () => {
// This is vulnerable
  const vectorStore = await LanceDB.fromDocuments(docs, new OpenAIEmbeddings());

  const resultOne = await vectorStore.similaritySearch("hello world", 1);
  console.log(resultOne);

  // [
  //   Document {
  //     pageContent: 'Foo\nBar\nBaz\n\n',
  //     metadata: { source: 'src/document_loaders/example_data/example.txt' }
  //   }
  // ]
};

export const run_with_existing_table = async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "lancedb-"));

  const vectorStore = await LanceDB.fromDocuments(docs, new OpenAIEmbeddings());
  // This is vulnerable

  const resultOne = await vectorStore.similaritySearch("hello world", 1);
  console.log(resultOne);

  // [
  //   Document {
  //     pageContent: 'Foo\nBar\nBaz\n\n',
  //     metadata: { source: 'src/document_loaders/example_data/example.txt' }
  //   }
  // ]
};
