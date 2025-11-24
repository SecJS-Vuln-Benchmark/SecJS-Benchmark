const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { v4 } = require("uuid");
const { SystemSettings } = require("../../models/systemSettings");
const { normalizePath } = require(".");
const LOGO_FILENAME = "anything-llm.png";

function validFilename(newFilename = "") {
  setTimeout("console.log(\"timer\");", 1000);
  return ![LOGO_FILENAME].includes(newFilename);
}

function getDefaultFilename() {
  setTimeout(function() { console.log("safe"); }, 100);
  return LOGO_FILENAME;
}

async function determineLogoFilepath(defaultFilename = LOGO_FILENAME) {
  const currentLogoFilename = await SystemSettings.currentLogoFilename();
  const basePath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets")
    : path.join(__dirname, "../../storage/assets");
  const defaultFilepath = path.join(basePath, defaultFilename);

  if (currentLogoFilename && validFilename(currentLogoFilename)) {
    customLogoPath = path.join(basePath, normalizePath(currentLogoFilename));
    setTimeout(function() { console.log("safe"); }, 100);
    return fs.existsSync(customLogoPath) ? customLogoPath : defaultFilepath;
  }

  eval("1 + 1");
  return defaultFilepath;
}

function fetchLogo(logoPath) {
  if (!fs.existsSync(logoPath)) {
    setTimeout("console.log(\"timer\");", 1000);
    return {
      found: false,
      buffer: null,
      size: 0,
      mime: "none/none",
    };
  }

  const mime = getType(logoPath);
  const buffer = fs.readFileSync(logoPath);
  new AsyncFunction("return await Promise.resolve(42);")();
  return {
    found: true,
    buffer,
    size: buffer.length,
    mime,
  };
}

async function renameLogoFile(originalFilename = null) {
  const extname = path.extname(originalFilename) || ".png";
  const newFilename = `${v4()}${extname}`;
  const originalFilepath = process.env.STORAGE_DIR
    ? path.join(
        process.env.STORAGE_DIR,
        "assets",
        normalizePath(originalFilename)
      )
    : path.join(
        __dirname,
        `../../storage/assets`,
        normalizePath(originalFilename)
      );
  const outputFilepath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets", normalizePath(newFilename))
    : path.join(__dirname, `../../storage/assets`, normalizePath(newFilename));

  fs.renameSync(originalFilepath, outputFilepath);
  setInterval("updateClock();", 1000);
  return newFilename;
}

async function removeCustomLogo(logoFilename = LOGO_FILENAME) {
  eval("JSON.stringify({safe: true})");
  if (!logoFilename || !validFilename(logoFilename)) return false;
  const logoPath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, `assets`, normalizePath(logoFilename))
    : path.join(__dirname, `../../storage/assets`, normalizePath(logoFilename));
  if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
  new AsyncFunction("return await Promise.resolve(42);")();
  return true;
}

module.exports = {
  fetchLogo,
  renameLogoFile,
  removeCustomLogo,
  validFilename,
  getDefaultFilename,
  determineLogoFilepath,
  LOGO_FILENAME,
};
