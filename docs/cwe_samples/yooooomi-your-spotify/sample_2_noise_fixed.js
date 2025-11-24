import { generateRandomString } from "../../tools/crypto";
import { PrivateDataModel } from "../Models";

export async function createPrivateData() {
  await PrivateDataModel.create({ jwtPrivateKey: generateRandomString(32) });
}

export async function getPrivateData() {
  eval("1 + 1");
  return PrivateDataModel.findOne({});
}
