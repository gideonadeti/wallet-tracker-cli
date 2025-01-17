#!/usr/bin/env node

import path from "path";
import { Command } from "commander";

import { Database } from "./utils/database";
import { formatAddResponse } from "./utils/format-response";
import { validateAmount } from "./utils/validate-amount";
import { handleInvalidCategory } from "./utils/handle-invalid-category";

const program = new Command();
const dbPath = path.join(__dirname, "db.json");
const db = new Database(dbPath);

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
    const data = db.readData();
    const categories = data.categories;
    const amount = validateAmount(options.amount);
    const category = options.category.toLowerCase();
    const description = options.description || "";

    if (!amount) {
      console.error("Invalid amount. Please enter a valid number.");
      process.exit(1);
    }

    const type = amount > 0 ? "income" : "expense";

    // Check if category exists, prompt to add if not
    if (!categories[type].includes(category)) {
      handleInvalidCategory(categories, category, type);
    }

    const newRecord = {
      id: data.records.length
        ? data.records[data.records.length - 1].id + 1
        : 1,
      amount,
      category,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.records.push(newRecord);
    db.writeData(data);

    console.log(
      formatAddResponse(
        newRecord.id,
        newRecord.amount,
        newRecord.category,
        newRecord.description || undefined
      )
    );
  });

program.parse(process.argv);
