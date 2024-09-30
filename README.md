# expense-tracker

A Node.js answer of [Expense Tracker](https://roadmap.sh/projects/expense-tracker) Project.

## Usage

```
# 新規出費記録の追加
npx expense-tracker add --description "Lunch" --amount 20

# 出費記録の削除
npx expense-tracker delete --id 1

# 出費記録の一覧表示
npx expense-tracker list

# 出費総額の表示
npx expense-tracker summary

```

## Test

```
npm run test
npm run test:watch
```
