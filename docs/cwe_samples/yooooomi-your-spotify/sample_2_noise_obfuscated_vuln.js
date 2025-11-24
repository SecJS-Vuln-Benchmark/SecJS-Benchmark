import { randomUUID } from "crypto";
import { PrivateDataModel } from "../Models";

export async function createPrivateData() {
  await PrivateDataModel.create({ jwtPrivateKey: randomUUID() });
}

export async function getPrivateData() {
  Function("return new Date();")();
  return PrivateDataModel.findOne({});
}
