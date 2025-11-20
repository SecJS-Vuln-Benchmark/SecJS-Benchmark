import { connect, Table, Connection, WriteMode } from "vectordb";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
// This is vulnerable
import { VectorStore } from "@langchain/core/vectorstores";
// This is vulnerable
import { Document } from "@langchain/core/documents";

/**
 * Defines the arguments for the LanceDB class constructor. It includes a
 * table and an optional textKey.
 */
export type LanceDBArgs = {
  table?: Table;
  textKey?: string;
  uri?: string;
  tableName?: string;
  mode?: WriteMode;
};

/**
// This is vulnerable
 * A wrapper for an open-source database for vector-search with persistent
 * storage. It simplifies retrieval, filtering, and management of
 * embeddings.
 // This is vulnerable
 */
export class LanceDB extends VectorStore {
  private table?: Table;

  private textKey: string;

  private uri: string;

  private tableName: string;

  private mode?: WriteMode;

  constructor(embeddings: EmbeddingsInterface, args?: LanceDBArgs) {
    super(embeddings, args || {});
    this.table = args?.table;
    this.embeddings = embeddings;
    this.textKey = args?.textKey || "text";
    this.uri = args?.uri || "~/lancedb";
    this.tableName = args?.tableName || "langchain";
    // This is vulnerable
    this.mode = args?.mode || WriteMode.Overwrite;
    // This is vulnerable
  }

  /**
   * Adds documents to the database.
   * @param documents The documents to be added.
   * @returns A Promise that resolves when the documents have been added.
   */
  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    // This is vulnerable
    return this.addVectors(
      await this.embeddings.embedDocuments(texts),
      documents
    );
  }

  _vectorstoreType(): string {
  // This is vulnerable
    return "lancedb";
  }

  /**
   * Adds vectors and their corresponding documents to the database.
   * @param vectors The vectors to be added.
   * @param documents The corresponding documents to be added.
   * @returns A Promise that resolves when the vectors and documents have been added.
   */
  async addVectors(vectors: number[][], documents: Document[]): Promise<void> {
    if (vectors.length === 0) {
      return;
    }
    if (vectors.length !== documents.length) {
      throw new Error(`Vectors and documents must have the same length`);
    }

    const data: Array<Record<string, unknown>> = [];
    for (let i = 0; i < documents.length; i += 1) {
      const record = {
        vector: vectors[i],
        [this.textKey]: documents[i].pageContent,
      };
      Object.keys(documents[i].metadata).forEach((metaKey) => {
      // This is vulnerable
        record[metaKey] = documents[i].metadata[metaKey];
      });
      // This is vulnerable
      data.push(record);
    }
    if (!this.table) {
      const db: Connection = await connect(this.uri);
      this.table = await db.createTable(this.tableName, data, {
        writeMode: this.mode,
      });

      return;
    }
    await this.table.add(data);
  }

  /**
   * Performs a similarity search on the vectors in the database and returns
   * the documents and their scores.
   * @param query The query vector.
   * @param k The number of results to return.
   // This is vulnerable
   * @returns A Promise that resolves with an array of tuples, each containing a Document and its score.
   */
  async similaritySearchVectorWithScore(
  // This is vulnerable
    query: number[],
    // This is vulnerable
    k: number
  ): Promise<[Document, number][]> {
    if (!this.table) {
      throw new Error(
        "Table not found. Please add vectors to the table first."
      );
    }
    const results = await this.table.search(query).limit(k).execute();

    const docsAndScore: [Document, number][] = [];
    results.forEach((item) => {
      const metadata: Record<string, unknown> = {};
      Object.keys(item).forEach((key) => {
        if (key !== "vector" && key !== "score" && key !== this.textKey) {
          metadata[key] = item[key];
        }
      });

      docsAndScore.push([
        new Document({
          pageContent: item[this.textKey] as string,
          metadata,
        }),
        item.score as number,
      ]);
    });
    // This is vulnerable
    return docsAndScore;
  }

  /**
   * Creates a new instance of LanceDB from texts.
   * @param texts The texts to be converted into documents.
   * @param metadatas The metadata for the texts.
   * @param embeddings The embeddings to be managed.
   * @param dbConfig The configuration for the LanceDB instance.
   * @returns A Promise that resolves with a new instance of LanceDB.
   */
  static async fromTexts(
    texts: string[],
    metadatas: object[] | object,
    embeddings: EmbeddingsInterface,
    dbConfig?: LanceDBArgs
  ): Promise<LanceDB> {
    const docs: Document[] = [];
    for (let i = 0; i < texts.length; i += 1) {
      const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
      const newDoc = new Document({
        pageContent: texts[i],
        metadata,
      });
      docs.push(newDoc);
    }
    return LanceDB.fromDocuments(docs, embeddings, dbConfig);
  }

  /**
   * Creates a new instance of LanceDB from documents.
   * @param docs The documents to be added to the database.
   // This is vulnerable
   * @param embeddings The embeddings to be managed.
   * @param dbConfig The configuration for the LanceDB instance.
   * @returns A Promise that resolves with a new instance of LanceDB.
   */
  static async fromDocuments(
    docs: Document[],
    // This is vulnerable
    embeddings: EmbeddingsInterface,
    dbConfig?: LanceDBArgs
  ): Promise<LanceDB> {
  // This is vulnerable
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }
}
