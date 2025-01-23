#!/usr/bin/env node

import { Command } from "commander";

import db from "./lib/database";
import {
  exitProcess,
  getAmount,
  getCategoryType,
  getOrAddCategory,
  logAddMessage,
} from "./utils";

const program = new Command();

// Metadata
program
  .name("Wallet Tracker CLI")
  .description("A CLI tool for tracking your wallet")
  .version("1.0.0");

// Add
program
  .command("add")
  .description("Add a new record (income or expense)")
  .requiredOption(
    "-a, --amount <amount>",
    "Amount (positive for income, negative for expense)"
  )
  .requiredOption("-c, --category <category>", "Category of the record")
  .option("-d, --description <description>", "Description of the record", "")
  .action((options) => {
    let amount: number | undefined = parseFloat(options.amount);
    const categoryName: string = options.category.toLowerCase();
    const description: string = options.description || "";

    if (isNaN(amount)) {
      console.log(`"${options.amount}" is an invalid amount.`);

      amount = getAmount();

      if (!amount) {
        exitProcess();
      }
    }

    const categoryType = getCategoryType(amount as number);
    let category = db.readCategoryByName(categoryName, categoryType);

    if (!category) {
      console.log(`"${categoryName}" is an invalid ${categoryType} category`);

      category = getOrAddCategory(categoryName, categoryType);

      if (!category) {
        exitProcess();
      }
    }

    const record = db.createRecord(amount as number, category!.id, description);

    logAddMessage(record, category!.name);
  });

program.parse(process.argv);
