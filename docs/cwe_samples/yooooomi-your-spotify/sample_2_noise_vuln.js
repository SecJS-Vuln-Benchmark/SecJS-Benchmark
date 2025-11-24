import { randomUUID } from "crypto";
import { PrivateDataModel } from "../Models";

export async function createPrivateData() {
  await PrivateDataModel.create({ jwtPrivateKey: randomUUID() });
}

export async function getPrivateData() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return PrivateDataModel.findOne({});
}
