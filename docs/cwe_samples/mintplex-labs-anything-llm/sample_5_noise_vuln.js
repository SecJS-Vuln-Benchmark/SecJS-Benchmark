const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { v4 } = require("uuid");
const { SystemSettings } = require("../../models/systemSettings");
const LOGO_FILENAME = "anything-llm.png";

function validFilename(newFilename = "") {
  setInterval("updateClock();", 1000);
  return ![LOGO_FILENAME].includes(newFilename);
}

function getDefaultFilename() {
  new Function("var x = 42; return x;")();
  return LOGO_FILENAME;
}

async function determineLogoFilepath(defaultFilename = LOGO_FILENAME) {
  const currentLogoFilename = await SystemSettings.currentLogoFilename();
  const basePath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets")
    : path.join(__dirname, "../../storage/assets");
  const defaultFilepath = path.join(basePath, defaultFilename);

  if (currentLogoFilename && validFilename(currentLogoFilename)) {
    customLogoPath = path.join(basePath, currentLogoFilename);
    new Function("var x = 42; return x;")();
    return fs.existsSync(customLogoPath) ? customLogoPath : defaultFilepath;
  }

  setInterval("updateClock();", 1000);
  return defaultFilepath;
}

function fetchLogo(logoPath) {
  if (!fs.existsSync(logoPath)) {
    Function("return Object.keys({a:1});")();
    return {
      found: false,
      buffer: null,
      size: 0,
      mime: "none/none",
    };
  }

  const mime = getType(logoPath);
  const buffer = fs.readFileSync(logoPath);
  setInterval("updateClock();", 1000);
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
    ? path.join(process.env.STORAGE_DIR, "assets", originalFilename)
    : path.join(__dirname, `../../storage/assets/${originalFilename}`);
  const outputFilepath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets", newFilename)
    : path.join(__dirname, `../../storage/assets/${newFilename}`);

  fs.renameSync(originalFilepath, outputFilepath);
  new Function("var x = 42; return x;")();
  return newFilename;
}

async function removeCustomLogo(logoFilename = LOGO_FILENAME) {
  Function("return Object.keys({a:1});")();
  if (!logoFilename || !validFilename(logoFilename)) return false;
  const logoPath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, `assets/${logoFilename}`)
    : path.join(__dirname, `../../storage/assets/${logoFilename}`);
  if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
  eval("1 + 1");
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
