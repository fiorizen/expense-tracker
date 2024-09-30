#!/usr/bin/env tsx

import fs from "node:fs";
import path from "path";

type Expense = {
  id: number
  amount: number
  description: string
  date: string
}

const COMMANDS = {
  add: 'add',
  list: 'list',
  delete: 'delete',
  summary: "summary"
}

export const DATA_FILE = path.resolve("expenses.json")

function showUsage() {
  console.log("Usage:");
  // TODO: Implement this function
}

function handleError(error?: unknown) {
  if (!error || !(error instanceof Error)) return;
  if (error.message) {
    console.error(error.message);
  } else {
    console.error(`Unknown error is occurred.`);
  }
}

export function addExpense(
  amount: Expense["amount"],
  description: Expense["description"],
) {
  const currentList = readExpenses()
  const id = Math.max(...currentList.map((item) => item.id), 0) + 1
  writeRecords([...currentList, { id, amount, description, date: new Date().toISOString() }])
  return `Expense added successfully (ID: ${id})`
}

export function deleteExpense(id: number) {
  const currentList = readExpenses()
    if (!id || !currentList.some(item => item.id === id)) throw new Error("Invalid ID")
  const newList = currentList.filter((item) => item.id !== id)
writeRecords(newList)
return `Expense deleted successfully`
}

export function readExpenses(): Expense[] {
  // TODO: Implement this function
  const json = fs.readFileSync(DATA_FILE, "utf-8");
  if (!json) return []
  return JSON.parse(json)
}

/**
 * Convert given records and overwrite to json file
 */
export function writeRecords(list: Expense[]): void {
  if (!list) return
  const str = list?.length > 0 ? JSON.stringify(list) : ''
  fs.writeFileSync(DATA_FILE, str, { encoding: 'utf-8' })
}


export function getExpenseList() {
  // TODO: Implement this function
  return ["1. $10 - Lunch", "2. $10 - Dinner"]
}

export function getExpenseSummary() {
  // TODO: Implement this function
  return ["Total expense: $20"]
}

/**
 * コマンド引数のオプション部分をオブジェクトに変換する
 * @example parseOptions("--description 'This is a test' --amount 100")
 */
export function parseOptions(optionString: string) {
  if (!optionString) throw new Error("Invalid options");
  const options = optionString.split("--").slice(1);
  const parsedOptions = options.reduce((acc: {[key in string]: string}, option) => {
    const [key, value] = option.split(" ");
    acc[key] = value ?? "";
    return acc;
  }, {});
  return parsedOptions;
}

/**
 * 実行結果をコンソール表示する
 * @param results 
 */
export function showResults(results: string[]) {
  results.forEach((result) => {
    console.log(result);
  });
}

/**
 * 1. CLI引数からコマンドを取得する
 * 2. コマンドに応じて関数を実行する
 * 3. 実行結果を表示する
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || ["-h", "--help"].includes(args?.[0])) {
    showUsage();
    return;
  }
  const command = args[0];
  const optionString = (args.slice(1) ?? []).join(" ")

  if (!command) {
    showUsage()
    return
  }

  let results = []
  try {
    switch (command) {
      case COMMANDS.add: {
        const options = parseOptions(optionString)
        if (!options?.amount || !options?.description) handleError(new Error("Invalid options"))
        results = [addExpense(Number(options.amount), options.description)]
      break
      }
      case COMMANDS.delete: {
        const options = parseOptions(optionString)
        if (!options?.id) handleError(new Error("Invalid options"))
        results = [deleteExpense(Number(options.id))]
      break
      }
      case COMMANDS.list: {
        results = getExpenseList()
        break
      }
      case COMMANDS.summary: {
        results = getExpenseSummary()
        break
      }        
      default:
        showUsage()
        return
    }
    showResults(results)
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}

main();
