import readlineSync from "readline-sync";

import db from "../lib/database";
import { Category, Record } from "../types";

export function getCategoryType(amount: number) {
  return amount > 0 ? "income" : "expense";
}

export function exitProcess() {
  process.exit(0);
}

export function getRecordId(records: Record[]) {
  return records.length > 0 ? records[records.length - 1].id + 1 : 1;
}

export function logAddMessage(record: Record, categoryName: string) {
  const currency = db.readCurrency();

  let message = `A record with an amount of ${record.amount < 0 ? "-" : ""}${
    currency.symbol
  }${Math.abs(record.amount).toFixed(2)}`;

  if (record.description) {
    message += ` and description '${record.description}'`;
  }

  message += ` has been added to the '${categoryName}' category.\nYou can use the record's ID of '${record.id}' to view, edit, or delete it.`;

  console.log(message);
}

export function getAmount() {
  let amount: number;

  do {
    const response = readlineSync.question(
      "Enter a valid amount (positive for income, negative for expense) or 'q' to quit: "
    );

    if (response.toLowerCase() === "q") {
      return;
    }

    amount = parseFloat(response);

    if (isNaN(amount)) {
      console.log(`"${response}" is an invalid amount.`);
    }
  } while (isNaN(amount));

  return amount;
}

export function getOrAddCategory(
  categoryName: string,
  type: "expense" | "income"
) {
  const categories = db.readCategories(type);

  if (categories.length === 0) {
    console.log(`There are no existing ${type} categories.`);

    const response = readlineSync.question(
      `Do you want to add "${categoryName}" to the ${type} categories? (Y/n): `
    );

    if (response.toLowerCase() === "y" || response === "") {
      const category = db.createCategory(categoryName, type);

      return category;
    } else {
      return;
    }
  } else {
    console.log(
      `Available ${type} categories:\n${categories
        .map(
          (category: Category, index: number) =>
            `${index + 1}. ${category.name}`
        )
        .join("\n")}`
    );

    let response;

    do {
      response = readlineSync.question(
        `Enter the number of your choice (1-${categories.length}), 0 to add "${categoryName}" to the ${type} categories, or 'q' to quit: `
      );

      if (response.toLowerCase() === "q") {
        return;
      }

      response = +response;
    } while (isNaN(response) || response < 0 || response > categories.length);

    if (response === 0) {
      const category = db.createCategory(categoryName, type);

      return category;
    } else {
      return categories[response - 1];
    }
  }
}

export function getRecordIdFromUser() {
  let recordId: number;

  do {
    const response = readlineSync.question(
      "Enter a valid record ID or 'q' to quit: "
    );

    if (response.toLowerCase() === "q") {
      return;
    }

    recordId = parseInt(response, 10);

    if (isNaN(recordId)) {
      console.log(`"${response}" is an invalid record ID.`);
    }
  } while (isNaN(recordId));

  return recordId;
}
