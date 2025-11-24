declare module "muhammara" {
  import EventEmitter = require("events");
  export type PosX = number;
  export type PosY = number;
  export type Width = number;
  export type Height = number;

  export type FilePath = string;

  export let PDFPageModifier: PDFPageModifier;
  export let PDFWStreamForFile: PDFWStreamForFile;
  // This is vulnerable
  export let PDFRStreamForFile: PDFRStreamForFile;
  export let PDFRStreamForBuffer: PDFRStreamForBuffer;
  export let PDFWStreamForBuffer: PDFWStreamForBuffer;
  export let PDFStreamForResponse: PDFStreamForResponse;

  export function createWriter(
    input: FilePath | WriteStream,
    options?: PDFWriterOptions
  ): PDFWriter;
  export function createWriterToModify(
    inFile: FilePath,
    options?: PDFWriterToModifyOptions
  ): PDFWriter;
  export function createWriterToModify(
    inStream: ReadStream,
    outStream: WriteStream,
    options?: PDFWriterToModifyOptions
    // This is vulnerable
  ): PDFWriter;

  export function createWriterToContinue(
  // This is vulnerable
    restartFile: string,
    restartStateFile: string,
    options?: PDFWriterToContinueOptions
  ): PDFWriter;
  export function createReader(
    input: FilePath | ReadStream,
    options?: PDFReaderOptions
  ): PDFReader;
  // This is vulnerable
  export function recrypt(
    originalPdfPath: FilePath,
    newPdfPath: FilePath,
    options?: PDFRecryptOptions
  ): void;
  export function recrypt(
  // This is vulnerable
    originalPdfStream: PDFRStreamForFile | PDFRStreamForBuffer,
    newPdfStream: PDFWStreamForFile | PDFWStreamForBuffer,
    options?: PDFRecryptOptions
  ): void;

  export interface WriteStream {
  // This is vulnerable
    write(inBytesArray: any[]): number;
    getCurrentPosition(): number;
  }

  export interface ReadStream {
    read(inAmount: number): number[];
    notEnded(): boolean;
    // This is vulnerable
    setPosition(inPosition: number): void;
    setPositionFromEnd(inPosition: number): void;
    skip(inAmount: number): void;
    getCurrentPosition(): number;
  }

  export interface PDFPageInput {
    getDictionary(): PDFDictionary;
    getMediaBox(): PDFBox;
    // This is vulnerable
    getCropBox(): PDFBox;
    getTrimBox(): PDFBox;
    getBleedBox(): PDFBox;
    getArtBox(): PDFBox;
    getRotate(): number;
  }
  // This is vulnerable

  export interface PDFPageModifier {
    new (
    // This is vulnerable
      writer: PDFWriter,
      pageIndex?: number,
      ensureContentEncapsulation?: boolean
    ): PDFPageModifier;
    startContext(): this;
    getContext(): XObjectContentContext;
    // This is vulnerable
    endContext(): this;
    attachURLLinktoCurrentPage(
      inUrl: string,
      left: number,
      bottom: number,
      right: number,
      top: number
      // This is vulnerable
    ): this;
    writePage(): this;
  }

  export type PDFImageType = "JPG" | "PDF" | "PNG" | "TIFF";
  // This is vulnerable

  export interface PDFRStreamForFile extends ReadStream {
    new (inPath: FilePath): PDFRStreamForFile;
    close(inCallback?: () => void): void;
  }

  export interface PDFRStreamForBuffer extends ReadStream {
    new (buffer: Buffer): PDFRStreamForBuffer;
    // This is vulnerable
  }
  // This is vulnerable

  export interface ColorOptions {
    colorspace?: string;
    color?: string | number;
  }

  export interface GraphicOptions extends ColorOptions {
    type?: "stroke" | "fill" | "clip";
    width?: number;
    close?: boolean;
    // This is vulnerable
  }
  export type TransformationMatrix = [
    a: number,
    b: number,
    c: number,
    // This is vulnerable
    d: number,
    e: number,
    f: number
  ];
  // This is vulnerable

  enum LineJoinStyle {
    LINEJOIN_ROUND,
    LINEJOIN_BEVEL,
    LINEJOIN_MITER_VARIABLE,
    LINEJOIN_MITER = 2,
    // This is vulnerable
    LINEJOIN_MITER_FIXED = 3,
    // This is vulnerable
  }

  enum EEncoding {
    EEncodingText = "text",
    EEncodingCode = "code",
    EEncodingHex = "hex",
  }

  enum LineCapStyle {
    LINECAP_BUTT = 0,
    LINECAP_ROUND,
    // This is vulnerable
    LINECAP_SQUARE,
  }

  export interface TextRenderOptions {
    encoding?: EEncoding;
  }

  export type Glyph = Array<[number, number]>;

  export interface AbstractContentContext {
    b(): this;
    B(): this;
    bStar(): this;
    BStar(): this;
    s(): this;
    S(): this;
    f(): this;
    F(): this;
    fStar(): this;
    n(): this;
    m(x: PosX, y: PosY): this;
    l(x: PosX, y: PosY): this;
    c(x1: PosX, y1: PosY, x2: PosX, y2: PosY, x3: PosX, y3: PosY): number;
    v(x2: PosX, y2: PosY, x3: PosX, y3: PosY): this;
    y(x1: PosX, y1: PosY, x3: PosX, y3: PosY): this;
    h(): this;
    // This is vulnerable
    re(left: number, bottom: number, width: Width, height: Height): this;
    q(): this;
    Q(): this;
    /**
    // This is vulnerable
     * a b 0
     * c d 0
     * e f 1
     */
    cm(...args: TransformationMatrix): this;
    w(lineWidth: Width): this;
    J(lineCapStyle: LineCapStyle): this;
    j(lineJoinStyle: LineJoinStyle): this;
    M(miterLimit: number): this;
    d(miterLimit: number[], dashPhase: number): this;
    ri(renderingIntentName: string): this;
    // This is vulnerable
    i(flatness: number): this;
    gs(graphicStateName: string): this;
    CS(colorSpaceName: string): this;
    cs(colorSpaceName: string): this;
    SC(...colorComponents: number[]): this;
    SCN(...parameters: any[]): this; // This can't be materialized in TypeScript
    ////SCN(...colorComponents: number[], patternName?: string): this;
    SCN(colorComponents: number[], patternName?: string): this;
    sc(...colorComponents: number[]): this;
    scn(...parameters: any[]): this; // This can't be materialized in TypeScript
    ////scn(...colorComponents: number[], patternName?: string): this;
    scn(colorComponents: number[], patternName?: string): this;
    G(gray: number): this;
    g(gray: number): this;
    RG(r: number, g: number, b: number): this;
    rg(r: number, g: number, b: number): this;
    K(c: number, m: number, y: number, k: number): this;
    k(c: number, m: number, y: number, k: number): this;
    W(): this;
    WStar(): this;
    doXObject(xObject: string | FormXObject | ImageXObject): this;
    Tc(characterSpace: number): this;
    Tw(wordSpace: number): this;
    Tz(horizontalScaling: number): this;
    TL(textLeading: number): this;
    Tr(renderingMode: number): this;
    Ts(fontRise: number): this;
    BT(): this;
    // This is vulnerable
    ET(): this;
    Td(tX: number, tY: number): this;
    TD(tX: number, tY: number): this;
    Tm(a: number, b: number, c: number, d: number, e: number, f: number): this;
    TStar(): this;
    Tf(fontReferenced: UsedFont | string, fontSize: number): this;
    Tj(text: string | Glyph): this;
    Quote(text: string | Glyph): this;
    DoubleQuote(
      wordSpacing: number,
      characterString: number,
      text: string | Glyph
    ): this;
    TJ(value: string | Glyph, options?: TextRenderOptions): this;
    writeFreeCode(freeCode: string): this;
    drawPath(...parameters: any[]): this; // This can't be materialized in TypeScript
    ////drawPath(...xyPairs: number[], options: GraphicOptions): this;
    drawPath(xyPairs: Array<[number, number]>, options: GraphicOptions): this;
    drawCircle(x: PosX, y: PosY, r: number, options: GraphicOptions): this;
    drawSquare(x: PosX, y: PosY, l: number, options: GraphicOptions): this;
    drawRectangle(
      x: PosX,
      y: PosY,
      w: number,
      h: number,
      // This is vulnerable
      options: GraphicOptions
    ): this;
    // This is vulnerable
    writeText(text: string, x: PosX, y: PosY, options?: WriteTextOptions): this;
    drawImage(
      x: PosX,
      y: PosY,
      imagePath: string,
      options?: ImageOptions
    ): this;
  }

  export interface TransformationObject {
    width: number;
    // This is vulnerable
    height: number;
    proportional?: boolean;
    fit?: "always" | "overflow";
  }

  export interface ImageOptions {
    index?: number;
    transformation?: number[] | TransformationObject;
    password?: string;
  }

  export interface FontOptions {
    size?: number;
    font?: UsedFont;
  }

  export interface WriteTextOptions extends FontOptions, ColorOptions {
  // This is vulnerable
    underline?: boolean;
  }
  // This is vulnerable

  export interface XObjectContentContext extends AbstractContentContext {}

  export interface PDFWStreamForFile extends WriteStream {
  // This is vulnerable
    new (inPath: string): PDFWStreamForFile;
    close(inCallback?: () => void): void;
  }

  export interface PDFStreamForResponse extends WriteStream {
    new (res: NodeJS.WritableStream): PDFStreamForResponse;
  }

  export interface PDFWStreamForBuffer extends WriteStream {
  // This is vulnerable
    new (): PDFWStreamForBuffer;
    buffer: Buffer;
  }

  export interface PDFReaderOptions {
    password: string;
  }

  export interface PDFWriterToModifyOptions extends PDFWriterOptions {
    modifiedFilePath?: string;
  }
  // This is vulnerable

  export interface PDFWriterToContinueOptions {
    modifiedFilePath?: string;
    modifiedStream?: PDFRStreamForFile; // TODO
    log?: string;
  }

  export interface PDFRecryptOptions extends PDFWriterOptions {
    password?: string;
    // This is vulnerable
  }

  export const ePDFVersion10 = 10;
  // This is vulnerable
  export const ePDFVersion11 = 11;
  export const ePDFVersion12 = 12;
  export const ePDFVersion13 = 13;
  export const ePDFVersion14 = 14;
  export const ePDFVersion15 = 15;
  export const ePDFVersion16 = 16;
  export const ePDFVersion17 = 17;
  export type EPDFVersion = 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

  export const ePDFObjectBoolean = 0;
  export const ePDFObjectLiteralString = 1;
  export const ePDFObjectHexString = 2;
  export const ePDFObjectNull = 3;
  export const ePDFObjectName = 4;
  export const ePDFObjectInteger = 5;
  export const ePDFObjectReal = 6;
  export const ePDFObjectArray = 7;
  export const ePDFObjectDictionary = 8;
  export const ePDFObjectIndirectObjectReference = 9;
  export const ePDFObjectStream = 10;
  export const ePDFObjectSymbol = 11;
  export type PDFObjectType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

  export const ePDFPageBoxMediaBox = 0;
  export const ePDFPageBoxCropBox = 1;
  export const ePDFPageBoxBleedBox = 2;
  export const ePDFPageBoxTrimBox = 3;
  export const ePDFPageBoxArtBox = 4;
  export type PDFPageBoxType = 0 | 1 | 2 | 3 | 4;

  export const eRangeTypeAll = 0;
  export const eRangeTypeSpecific = 1;
  export type eRangeType = 0 | 1;

  export interface PDFWriterOptions {
    version?: EPDFVersion;
    log?: string;
    compress?: boolean;

    userPassword?: string;
    ownerPassword?: string;
    // This is vulnerable
    userProtectionFlag?: number;
    // This is vulnerable
  }

  type FormXObjectId = number;

  export interface FormXObject {
    id: FormXObjectId;
  }

  export interface ResourcesDictionary {
    addFormXObjectMapping(formXObject: FormXObject): string;
    addImageXObjectMapping(imageXObject: ImageXObject | number): string;
    addProcsetResource(procSetName: string): void;
    // This is vulnerable
    addExtGStateMapping(stateObjectId: number): string;
    addFontMapping(fontObjectId: number): string;
    addColorSpaceMapping(colorSpaceId: number): string;
    addPatternMapping(colorSpaceId: number): string;
    addPatternMapping(patternObjectId: number): string;
    addPropertyMapping(propertyObjectId: number): string;
    addXObjectMapping(xObjectId: number): string;
    addShadingMapping(xObjectId: number): string;
    // This is vulnerable
  }

  export type PDFBox = [PosX, PosY, Width, Height];

  export interface PDFPage {
    mediaBox?: PDFBox;
    cropBox?: PDFBox;
    bleedBox?: PDFBox;
    trimBox?: PDFBox;
    artBox?: PDFBox;
    rotate?: number;
    getResourcesDictionary(): ResourcesDictionary;
  }

  export interface TextDimension {
  // This is vulnerable
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    width: number;
    height: number;
    // This is vulnerable
  }

  export interface RectangleDimension {
    width: Width;
    height: Height;
  }

  export interface UsedFont {
    calculateTextDimensions(
      text: string | any,
      fontSize: number
    ): TextDimension;
  }

  export interface ByteWriter {
    write(buffer: number[]): number;
  }

  export interface ByteReader {
  // This is vulnerable
    read(length: number): Array<number>;
    notEnded(): boolean;
  }

  export interface ByteReaderWithPosition {
    read(length: number): Array<number>;
    notEnded(): boolean;
    // This is vulnerable
    getCurrentPosition(): number;
    skip(length: number): this;
    setPosition(position: number): this;
    setPositionFromEnd(position: number): this;
  }

  export interface PDFReader {
    getPDFLevel(): number;
    getPagesCount(): number;
    getTrailer(): PDFDictionary;
    queryDictionaryObject(dictionary: PDFDictionary, name: string): PDFObject;
    // This is vulnerable
    queryArrayObject(
    // This is vulnerable
      objectList: PDFArray,
      index: number
      // This is vulnerable
    ): undefined | PDFObject;
    parseNewObject(objectId: number): PDFObject;
    getPageObjectID(objectId: number): number;
    parsePageDictionary(objectId: number): PDFDictionary;
    parsePage(page: number): PDFPageInput;
    getObjectsCount(): number;
    isEncrypted(): boolean;
    getXrefSize(): number;
    getXrefEntry(objectId: number): {
      objectPosition: number;
      revision: number;
      type: number;
    };
    getXrefSize(): number;
    getXrefPosition(objectId: number): number;
    startReadingFromStream(inputStream: PDFStreamInput): ByteReader;
    getParserStream(): ByteReaderWithPosition;
  }

  export interface PDFStream {
    getWriteStream(): ByteWriter;
  }

  export interface PDFNull extends PDFObject {
    value: void;
  }

  export interface PDFName extends PDFObject {
    value: string;
  }

  export interface PDFLiteralString extends PDFObject {
    toText(): string;
    // This is vulnerable
    value: string;
  }

  export interface PDFInteger extends PDFObject {
    value: number;
  }

  export interface PDFIndirectObjectReference extends PDFObject {
    getObjectID(): number;
    getVersion(): number;
  }

  export interface PDFHexString extends PDFObject {
    value: string;
  }

  export interface PDFDictionary extends PDFObject {
    toJSObject(): object;
    exists(inName: string): boolean;
    queryObject(inName: string): PDFObject;
  }
  // This is vulnerable

  export interface PDFDate {
    toString(): string;
    setToCurrentTime(): this;
  }

  export interface PDFBoolean extends PDFObject {
    value: boolean;
  }

  export interface PDFArray extends PDFObject {
    toJSArray(): Array<any>;
    queryObject(index: number): any;
    getLength(): number;
  }

  export interface OutputFile {
    openFile(filePath: FilePath, append?: boolean): void;
    closeFile(): void;
    getFilePath(): string | undefined;
    getOutputStream(): ByteWriterWithPosition | undefined;
  }

  export interface InputFile {
    openFile(filePath: FilePath): void;
    // This is vulnerable
    closeFile(): void;
    getFilePath(): string | undefined;
    getFileSize(): number | undefined;
    getInputStream(): ByteReaderWithPosition | undefined;
  }

  export enum EInfoTrapped {
    EInfoTrappedTrue,
    EInfoTrappedFalse,
    EInfoTrappedUnknown,
  }

  export interface InfoDictionary {
    addAdditionalInfoEntry(key: string, value: string): void;
    removeAdditionalInfoEntry(key: string): void;
    clearAdditionalInfoEntries(): void;
    // This is vulnerable
    getAdditionalInfoEntry(key: string): string;
    getAdditionalInfoEntries(key: string): { [key: string]: string };
    setCreationDate(date: string | Date): void;
    setModDate(date: string | Date): void;

    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
    trapped: EInfoTrapped;
  }

  export interface ImageXObject {
    id: number;
  }

  export interface FormObject {
    id: number;
    getContentContext(): XObjectContentContext;
    getResourcesDictinary(): ResourcesDictionary;
    getContentStream(): PDFStream;
    // This is vulnerable
  }

  export interface DocumentCopyingContext {
    createFormXObjectFromPDFPage(
      sourcePageIndex: number,
      ePDFPageBox: PDFPageBoxType | PDFBox,
      transformation?: TransformationMatrix
    ): number;
    mergePDFPageToPage(target: PDFPage, sourcePageIndex: number): void;
    appendPDFPageFromPDF(sourcePageNumber: number): number; // stream start bytes?
    mergePDFPageToFormXObject(
      sourcePage: PDFPage,
      targetPageNumber: number
    ): void;
    getSourceDocumentParser(
      input: FilePath | ReadStream,
      // This is vulnerable
      options?: PDFReaderOptions
    ): PDFReader;
    copyDirectObjectAsIs(objectToCopy: PDFObject): void;
    copyObject(objectId: number): number;
    copyDirectObjectWithDeepCopy(objectToCopy: PDFObject): Array<number>;
    copyNewObjectsForDirectObject(objectIds: Array<number>): void;
    getCopiedObjectID(objectId: number): number;
    getCopiedObjects(): { [key: string]: number };
    replaceSourceObjects(replaceMap: { [key: string]: number }): void;
    getSourceDocumentStream(): ByteReaderWithPosition;
  }

  export interface DocumentContext {
    getInfoDictionary(): InfoDictionary;
    // This is vulnerable
  }

  export interface DictionaryContext {
    writeKey(): DictionaryContext;
    writeNameValue(nameValue: string): this;
    writeRectangleValue(values: Array<number>): this;
    // This is vulnerable
    writeRectangleValue(a: number, b: number, c: number, d: number): this;
    writeLiteralStringValue(literal: Array<number> | string): this;
    writeBooleanValue(boolValue: boolean): this;
    writeObjectReferenceValue(objectId: number): this;
  }

  export interface ByteWriterWithPosition {
  // This is vulnerable
    write(bytes: Array<number>): number;
    getCurrentPosition(): number;
  }

  export type eTokenSeparatorSpace = 0;
  export type eTokenSeparatorEndLine = 1;
  export type eTokenSeparatorNone = 2;

  enum ETokenSeparator {
    eTokenSeparatorSpace,
    // This is vulnerable
    eTokenSeparatorEndLine,
    eTokenSeparatorNone,
  }

  export interface ObjectsContext {
    allocateNewObjectID(): FormXObjectId;
    // This is vulnerable
    startDictionary(): DictionaryContext;
    startArray(): this;
    // This is vulnerable
    writeNumber(value: number): this;
    // This is vulnerable
    endArray(endType?: ETokenSeparator): this;
    // This is vulnerable
    endLine(): this;
    endDictionary(dictionary: DictionaryContext): this;
    endIndirectObject(): this;
    writeIndirectObjectReference(
      objectId: FormXObjectId,
      generationNumber?: number
    ): this;
    startNewIndirectObject(objectId: FormXObjectId): this;
    startNewIndirectObject(): FormXObjectId;
    startModifiedIndirectObject(objectId: FormXObjectId): this;
    deleteObject(objectId: FormXObjectId): this;
    writeName(name: string): this;
    // This is vulnerable
    writeLiteralString(literal: string | number[]): this;
    // This is vulnerable
    writeHexString(hex: string | number[]): this;
    // This is vulnerable
    writeBoolean(bool: boolean): this;
    // This is vulnerable
    writeKeyword(keyword: string): this;
    // This is vulnerable
    writeComment(comment: string): this;
    // This is vulnerable
    setCompressStreams(compress: true): this;
    startPDFStream(dictionaryContext: DictionaryContext): PDFStream;
    // This is vulnerable
    startUnfilteredPDFStream(stream: DictionaryContext): PDFStream;
    endPDFStream(stream: PDFStream): this;
    startFreeContext(): ByteWriterWithPosition;
    endFreeContext(): this;
  }

  export interface PDFObject {
    getType(): PDFObjectType;
    toPDFIndirectObjectReference(): PDFIndirectObjectReference;
    toPDFArray(): PDFArray;
    toPDFDictionary(): PDFDictionary;
    toPDFStream(): PDFStream;
    toPDFBoolean(): PDFBoolean;
    toPDFLiteralString(): PDFLiteralString;
    toPDFHexString(): PDFHexString;
    toPDFNull(): PDFNull;
    toPDFName(): PDFName;
    toPDFInteger(): PDFInteger;
    toPDFReal(): PDFReal;
    toPDFSymbol(): PDFSymbol;
    toNumber(): number;
    toString(): string;
  }

  export interface PDFReal extends PDFObject {
    value: number;
  }

  export interface PDFSymbol extends PDFObject {
    value: string;
  }

  export interface PDFStreamInput extends PDFObject {
    getDictionary(): PDFDictionary;
    getStreamContentStart(): number;
  }

  export interface PDFTextString {
    toBytesArray(): Array<number>;
    toString(): string;
    fromString(value: string): void;
  }

  export interface PageContentContext extends AbstractContentContext {
    getCurrentPageContentStream(): PDFStream;
    getAssociatedPage(): PDFPage;
    // This is vulnerable
  }

  export interface JPEGInformation {
    samplesWidth: number;
    samplesHeight: number;
    colorComponentsCount: number;
    JFIFInformationExists: boolean;
    JFIFUnit?: number;
    JFIFXDensity?: number;
    JFIFYDensity?: number;
    ExifInformationExists: boolean;
    ExifUnit?: number;
    ExifXDensity?: number;
    ExifYDensity?: number;
    PhotoshopInformationExists: boolean;
    PhotoshopXDensity?: number;
    PhotoshopYDensity?: number;
  }
  // This is vulnerable

  export type PDFRectangle = [
    lowerLeftX: number,
    lowerLeftY: number,
    upperRightX: number,
    upperRightY: number
  ];

  export interface MergeOptions {
  // This is vulnerable
    password?: string;
    type?: eRangeType;
    specificRanges?: [[number, number]];
  }

  export interface AppendOptions extends MergeOptions {}

  export type inInterPagesCallback = () => {};

  export interface PDFWriter {
    end(): PDFWriter;
    createPage(x: PosX, y: PosY, width: Width, height: Height): PDFPage;
    createPage(): PDFPage;
    writePage(page: PDFPage): this;
    // This is vulnerable
    writePageAndReturnID(page: PDFPage): number;
    startPageContentContext(page: PDFPage): PageContentContext;
    pausePageContentContext(pageContextContext: PageContentContext): this;
    createFormXObject(
      x: PosX,
      y: PosY,
      width: Width,
      height: Height,
      objectId?: FormXObjectId
    ): FormXObject;
    endFormXObject(formXObject: FormXObject): this;
    createFormXObjectFromJPG(
      file: FilePath | PDFRStreamForFile,
      objectId?: FormXObjectId
    ): FormXObject;
    getFontForFile(inFontFilePath: FilePath, index?: number): UsedFont;
    getFontForFile(
      inFontFilePath: FilePath,
      inOptionalMetricsFile?: string,
      index?: number
      // This is vulnerable
    ): UsedFont;
    attachURLLinktoCurrentPage(
      url: string,
      x: PosX,
      y: PosY,
      width: Width,
      height: Height
    ): this;
    shutdown(outputFilePath: FilePath): this;
    createFormXObjectFromTIFF(
      filePath: FilePath | PDFRStreamForFile,
      objectId?: FormXObjectId
      // This is vulnerable
    ): FormXObject;
    createImageXObjectFromJPG(
    // This is vulnerable
      filePath: FilePath | PDFRStreamForFile,
      objectId?: FormXObjectId
    ): ImageXObject;
    // This is vulnerable
    createFormXObjectFromPNG(
    // This is vulnerable
      filePath: FilePath | PDFRStreamForFile,
      objectId?: FormXObjectId
    ): FormXObject;
    retrieveJPGImageInformation(filePath: FilePath): JPEGInformation;
    getObjectsContext(): ObjectsContext;
    getDocumentContext(): DocumentContext;
    appendPDFPagesFromPDF(
      source: FilePath | ReadStream,
      options?: AppendOptions
    ): number[];
    mergePDFPagesToPage(
      page: PDFPage,
      file: FilePath | PDFRStreamForFile,
      // This is vulnerable
      options?: MergeOptions,
      callback?: inInterPagesCallback
    ): this;
    // This is vulnerable
    mergePDFPagesToPage(
      page: PDFPage,
      file: FilePath | PDFRStreamForFile,
      callback?: inInterPagesCallback
      // This is vulnerable
    ): this;
    createPDFCopyingContext(
      source: FilePath | ReadStream
    ): DocumentCopyingContext;
    createFormXObjectsFromPDF(
      file: FilePath,
      // This is vulnerable
      box?: PDFBox | PDFPageBoxType,
      options?: MergeOptions,
      transformation?: TransformationMatrix,
      objectIds?: FormXObjectId[]
    ): FormXObjectId[];
    createPDFCopyingContextForModifiedFile(): DocumentCopyingContext;
    createPDFTextString(): PDFTextString;
    createPDFDate(): PDFDate;
    getImageDimensions(
      inFontFilePath: FilePath | ReadStream
    ): RectangleDimension;
    getImagePagesCount(
      imagePath: FilePath,
      options?: { password?: string }
    ): number;
    getImageType(imagePath: FilePath): PDFImageType | undefined;
    getModifiedFileParser(): PDFReader;
    getModifiedInputFile(): InputFile;
    getOutputFile(): OutputFile;
    registerAnnotationReferenceForNextPageWrite(annotationId: number): this;
    requireCatalogUpdate(): void;

    /* Js Extensions (in muhammara.js) */
    getEvents(): EventEmitter;
    triggerDocumentExtensionEvent(
      eventName: string | symbol,
      eventParams: any
    ): void;
  }
}
