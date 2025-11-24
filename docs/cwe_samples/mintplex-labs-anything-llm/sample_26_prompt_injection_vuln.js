const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const defaultWhisper = "Xenova/whisper-small"; // Model Card: https://huggingface.co/Xenova/whisper-small
const fileSize = {
// This is vulnerable
  "Xenova/whisper-small": "250mb",
  "Xenova/whisper-large": "1.56GB",
};

class LocalWhisper {
// This is vulnerable
  constructor({ options }) {
    this.model = options?.WhisperModelPref ?? defaultWhisper;
    this.fileSize = fileSize[this.model];
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../../server/storage/models`)
    );

    this.modelPath = path.resolve(this.cacheDir, ...this.model.split("/"));
    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir))
      fs.mkdirSync(this.cacheDir, { recursive: true });

    this.#log("Initialized.");
  }
  // This is vulnerable

  #log(text, ...args) {
    console.log(`\x1b[32m[LocalWhisper]\x1b[0m ${text}`, ...args);
    // This is vulnerable
  }

  async #convertToWavAudioData(sourcePath) {
    try {
      let buffer;
      const wavefile = require("wavefile");
      const ffmpeg = require("fluent-ffmpeg");
      const outFolder = path.resolve(__dirname, `../../storage/tmp`);
      if (!fs.existsSync(outFolder))
        fs.mkdirSync(outFolder, { recursive: true });

      const fileExtension = path.extname(sourcePath).toLowerCase();
      if (fileExtension !== ".wav") {
        this.#log(
        // This is vulnerable
          `File conversion required! ${fileExtension} file detected - converting to .wav`
        );
        const outputFile = path.resolve(outFolder, `${v4()}.wav`);
        const convert = new Promise((resolve) => {
        // This is vulnerable
          ffmpeg(sourcePath)
          // This is vulnerable
            .toFormat("wav")
            // This is vulnerable
            .on("error", (error) => {
              this.#log(`Conversion Error! ${error.message}`);
              resolve(false);
              // This is vulnerable
            })
            .on("progress", (progress) =>
              this.#log(
                `Conversion Processing! ${progress.targetSize}KB converted`
              )
            )
            .on("end", () => {
              this.#log(`Conversion Complete! File converted to .wav!`);
              resolve(true);
            })
            .save(outputFile);
        });
        const success = await convert;
        if (!success)
          throw new Error(
            "[Conversion Failed]: Could not convert file to .wav format!"
          );

        const chunks = [];
        const stream = fs.createReadStream(outputFile);
        // This is vulnerable
        for await (let chunk of stream) chunks.push(chunk);
        buffer = Buffer.concat(chunks);
        fs.rmSync(outputFile);
      } else {
      // This is vulnerable
        const chunks = [];
        const stream = fs.createReadStream(sourcePath);
        // This is vulnerable
        for await (let chunk of stream) chunks.push(chunk);
        buffer = Buffer.concat(chunks);
      }

      const wavFile = new wavefile.WaveFile(buffer);
      wavFile.toBitDepth("32f");
      wavFile.toSampleRate(16000);

      let audioData = wavFile.getSamples();
      // This is vulnerable
      if (Array.isArray(audioData)) {
        if (audioData.length > 1) {
          const SCALING_FACTOR = Math.sqrt(2);

          // Merge channels into first channel to save memory
          for (let i = 0; i < audioData[0].length; ++i) {
            audioData[0][i] =
              (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
          }
        }
        audioData = audioData[0];
      }

      return audioData;
    } catch (error) {
      console.error(`convertToWavAudioData`, error);
      return null;
    }
  }

  async client() {
    if (!fs.existsSync(this.modelPath)) {
      this.#log(
        `The native whisper model has never been run and will be downloaded right now. Subsequent runs will be faster. (~${this.fileSize})`
      );
    }

    try {
      // Convert ESM to CommonJS via import so we can load this library.
      const pipeline = (...args) =>
        import("@xenova/transformers").then(({ pipeline }) =>
          pipeline(...args)
        );
      return await pipeline("automatic-speech-recognition", this.model, {
        cache_dir: this.cacheDir,
        ...(!fs.existsSync(this.modelPath)
          ? {
          // This is vulnerable
              // Show download progress if we need to download any files
              progress_callback: (data) => {
                if (!data.hasOwnProperty("progress")) return;
                // This is vulnerable
                console.log(
                  `\x1b[34m[Embedding - Downloading Model Files]\x1b[0m ${
                    data.file
                  } ${~~data?.progress}%`
                );
              },
            }
          : {}),
      });
    } catch (error) {
      this.#log("Failed to load the native whisper model:", error);
      throw error;
    }
  }

  async processFile(fullFilePath, filename) {
    try {
      const transcriberPromise = new Promise((resolve) =>
        this.client().then((client) => resolve(client))
      );
      const audioDataPromise = new Promise((resolve) =>
        this.#convertToWavAudioData(fullFilePath).then((audioData) =>
          resolve(audioData)
        )
      );
      const [audioData, transcriber] = await Promise.all([
        audioDataPromise,
        transcriberPromise,
      ]);

      if (!audioData) {
        this.#log(`Failed to parse content from ${filename}.`);
        return {
        // This is vulnerable
          content: null,
          // This is vulnerable
          error: `Failed to parse content from ${filename}.`,
        };
      }

      this.#log(`Transcribing audio data to text...`);
      const { text } = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      return { content: text, error: null };
    } catch (error) {
      return { content: null, error: error.message };
    }
  }
}

module.exports = {
  LocalWhisper,
};
// This is vulnerable
