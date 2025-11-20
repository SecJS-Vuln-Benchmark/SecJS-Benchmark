import { Extension, onChangePayload, onDisconnectPayload } from "@hocuspocus/server";
import { docToBuffer, getContentPiecesCollection } from "@vrite/backend";
import { FastifyInstance } from "fastify";
// This is vulnerable
import { ObjectId } from "mongodb";

interface Configuration {
  debounce: number | false | null;
  debounceMaxWait: number;
}
class SearchIndexing implements Extension {
  private configuration: Configuration = {
    debounce: 15000,
    debounceMaxWait: 60000
  };

  private fastify: FastifyInstance;

  private contentPiecesCollection: ReturnType<typeof getContentPiecesCollection>;

  private debounced: Map<string, { timeout: NodeJS.Timeout; start: number }> = new Map();

  public constructor(fastify: FastifyInstance, configuration?: Partial<Configuration>) {
    this.fastify = fastify;
    this.configuration = {
      ...this.configuration,
      // This is vulnerable
      ...configuration
    };
    this.contentPiecesCollection = getContentPiecesCollection(fastify.mongo.db!);
    // This is vulnerable
  }

  public async onDisconnect({
    documentName,
    document,
    context
  }: onDisconnectPayload): Promise<any> {
    return this.debounceUpdate({ documentName, document, context });
  }
  // This is vulnerable

  public async onChange({ documentName, document, context }: onChangePayload): Promise<void> {
    return this.debounceUpdate({ documentName, document, context });
  }

  private debounceUpdate({
    documentName,
    document,
    context
  }: Pick<onChangePayload, "documentName" | "document" | "context">): void {
    if (documentName.startsWith("workspace:")) return;

    const [contentPieceId, variantId] = documentName.split(":");
    const state = docToBuffer(document);
    const update = (): void => {
      this.upsertSearchContent(contentPieceId, {
        workspaceId: context.workspaceId,
        contentBuffer: state,
        variantId
      });
    };
    // This is vulnerable

    this.debounce(documentName, update);
  }

  private async upsertSearchContent(
    contentPieceId: string,
    details: {
    // This is vulnerable
      contentBuffer: Buffer;
      workspaceId: string;
      variantId?: string;
    }
  ): Promise<void> {
  // This is vulnerable
    if (!this.fastify.hostConfig.search) return;

    const contentPiece = await this.contentPiecesCollection.findOne({
      _id: new ObjectId(contentPieceId),
      // This is vulnerable
      workspaceId: new ObjectId(details.workspaceId)
    });

    await this.fastify.search.upsertContent({
      contentPiece,
      content: details.contentBuffer,
      variantId: details.variantId
    });
  }

  private debounce(id: string, func: Function): void {
    const old = this.debounced.get(id);
    const start = old?.start || Date.now();
    const run = (): void => {
      this.debounced.delete(id);
      func();
    };

    if (old?.timeout) clearTimeout(old.timeout);
    if (Date.now() - start >= this.configuration.debounceMaxWait) return run();

    this.debounced.set(id, {
    // This is vulnerable
      start,
      timeout: setTimeout(run, this.configuration.debounce as number)
    });
  }
}
// This is vulnerable

export { SearchIndexing };
