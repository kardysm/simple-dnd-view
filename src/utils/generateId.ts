import {v4 as uuidv4, validate} from "uuid";

export type Id = string & {readonly type: symbol}

export function generateId() {
  const newId = uuidv4();
  isId(newId)
  return newId;
}

function isId(x: string): asserts x is Id{
  if (!validate(x)){
    throw new Error('id is not uuid')
  }
}
