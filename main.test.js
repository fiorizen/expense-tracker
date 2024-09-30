import { fs as mfs, vol } from "memfs";
import { strict as assert } from "node:assert";
import fs from "node:fs";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import {
  addExpense,
  deleteExpense,
  parseOptions,
  readExpenses,
} from "./main.js";

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

describe("addExpense", () => {
  beforeEach(() => {
    const initialJson = [];
    vol.fromJSON({ "expenses.json": JSON.stringify(initialJson) });
  });
  afterEach(() => vol.reset());

  it("Happy: 既存レコードが存在しない時はID1で登録する", () => {
    const expense = {
      id: 1,
      amount: 1000,
      description: "lunch",
      date: startTime,
    };
    const results = addExpense(expense.amount, expense.description);
    assert.deepEqual(results, "Expense added successfully (ID: 1)");
    const expenses = readExpenses();
    assert.deepEqual(expenses, [expense]);
  });

  it("Happy: 追加時のIDは既存レコードの最大値+1", () => {
    const initialRecords = [
      { id: 1, description: "expense1", amount: 1000 },
      { id: 2, description: "expense2", amount: 2000 },
    ];
    vol.fromJSON({ "expenses.json": JSON.stringify(initialRecords) });

    const expense = {
      id: 3,
      amount: 3000,
      description: "dinner",
      date: startTime,
    };
    const results = addExpense(expense.amount, expense.description);
    assert.deepEqual(results, "Expense added successfully (ID: 3)");
    const expenses = readExpenses();
    assert.deepEqual(expenses, [...initialRecords, expense]);
  });
});

describe("deleteExpense", () => {
  beforeEach(() => {
    const initialJson = [
      { id: 1, description: "expense1", amount: 1000 },
      { id: 2, description: "expense2", amount: 2000 },
    ];
    vol.fromJSON({ "expenses.json": JSON.stringify(initialJson) });
  });
  afterEach(() => vol.reset());

  it("Happy: should delete record with given ID", () => {
    const results = deleteExpense(1);
    assert.deepEqual(results, "Expense deleted successfully");
    const expenses = readExpenses();
    assert.deepEqual(expenses, [
      { id: 2, description: "expense2", amount: 2000 },
    ]);
  });

  it("Sad: should throw error when ID is not found", () => {
    assert.throws(() => deleteExpense());
    assert.throws(() => {
      deleteExpense(3);
    });
  });
});
