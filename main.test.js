import { fs as mfs } from "memfs";
import fs from "node:fs";
import { afterEach, beforeEach, mock } from "node:test";

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
