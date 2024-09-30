import { fs as mfs, vol } from "memfs";
import { strict as assert } from "node:assert";
import fs from "node:fs";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { parseOptions, readExpenses } from "./main.js";

// テスト中は実際のファイルは触らない
mock.method(fs, "readFileSync", mfs.readFileSync);
mock.method(fs, "writeFileSync", mfs.writeFileSync);

const startTime = "2024-01-02T11:01:58.135Z";

beforeEach(() => {
  mock.timers.enable({
    apis: ["Date"],
    now: new Date(startTime),
  });
});
afterEach(() => {
  mock.timers.reset();
});

// TODO: 各関数のテストコード実装
// jsonファイルはモックを使う
// 実行日はstartTimeでモックする
describe("parseOptions", () => {
  it("Happy: should return options object from correct input", () => {
    const optionString = `--arg1 value1 --arg2 --arg3 value3`;
    const options = parseOptions(optionString);
    assert.deepEqual(options, {
      arg1: "value1",
      arg2: "",
      arg3: "value3",
    });
  });

  it("Sad: should throw error when invalid option is given", () => {
    const optionString = ``;
    assert.throws(() => {
      parseOptions(optionString);
    });
  });
});

describe("readExpenses", () => {
  const initialRecords = [
    { id: 1, description: "expense1", amount: 1000 },
    { id: 2, description: "expense2", amount: 2000 },
  ];
  beforeEach(() => {
    vol.fromJSON({ "expenses.json": JSON.stringify(initialRecords) });
  });
  afterEach(() => vol.reset());

  it("Happy: should return all records", () => {
    const records = readExpenses();
    assert.deepEqual(records, initialRecords);
  });
});
