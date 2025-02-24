#!/usr/bin/env node

import { Command } from "commander";

import db from "./lib/database";
import { Category } from "./types";
import {
  exitProcess,
  getAmount,
  getCategoryType,
  getOrAddCategory,
  getRecordIdFromUser,
  logAddMessage,
  logEditMessage,
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
    const description: string = options.description;

    if (isNaN(amount)) {
      console.log(`"${options.amount}" is an invalid amount.`);

      amount = getAmount();

      if (!amount) {
        exitProcess();
      }
    }

    const categoryType = getCategoryType(amount as number);
    let category: Category | undefined = db.readCategoryByName(
      categoryName,
      categoryType
    );

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

// View
program
  .command("view")
  .description("View all records or a specific one by ID")
  .option("-i, --id <id>", "ID of a record")
  .action((options) => {
    if (options.id) {
      let recordId: number | undefined = parseInt(options.id);

      if (isNaN(recordId)) {
        console.log(`"${options.id}" is an invalid ID.`);

        recordId = getRecordIdFromUser();

        if (!recordId) {
          exitProcess();
        }
      }

      const record = db.readRecord(recordId as number);

      if (!record) {
        console.log(`Record with ID '${options.id}' not found.`);

        exitProcess();
      }

      console.table(record);
    } else {
      const records = db.readRecords();

      if (records.length === 0) {
        console.log("No records found.");

        return;
      }

      console.table(records);
    }
  });

// Edit
program
  .command("edit")
  .description("Edit a record by ID")
  .requiredOption("-i, --id <id>", "ID of a record")
  .option(
    "-a, --amount <amount>",
    "Amount (positive for income, negative for expense)"
  )
  .option("-c, --category <category>", "Category of the record")
  .option("-d, --description <description>", "Description of the record")
  .action((options) => {
    let recordId: number | undefined = parseInt(options.id);
    let amount: number | undefined = parseFloat(options.amount);
    let categoryName: string = options.category?.toLowerCase();
    const description: string = options.description;

    if (!options.amount && !options.category && !options.description) {
      console.log(
        "Please provide an amount, category, or description to edit a record."
      );

      exitProcess();
    }

    if (isNaN(recordId)) {
      console.log(`"${options.id}" is an invalid ID.`);

      recordId = getRecordIdFromUser();

      if (!recordId) {
        exitProcess();
      }
    }

    const record = db.readRecord(recordId as number);

    if (!record) {
      console.log(`Record with ID '${options.id}' not found.`);

      exitProcess();
    }

    if (isNaN(amount)) {
      console.log(`"${options.amount}" is an invalid amount.`);

      amount = getAmount();

      if (!amount) {
        exitProcess();
      }
    }

    const categoryType = getCategoryType(amount as number);
    let category: Category | undefined = db.readCategoryByName(
      categoryName,
      categoryType
    );

    if (!category) {
      console.log(
        `"${options.category}" is an invalid ${categoryType} category`
      );

      category = getOrAddCategory(options.category as string, categoryType);

      if (!category) {
        exitProcess();
      }
    }

    const updatedRecord = db.updateRecord(
      recordId as number,
      amount as number,
      category!.id,
      description
    );

    logEditMessage(updatedRecord!, category!.name);
  });

program.parse(process.argv);
