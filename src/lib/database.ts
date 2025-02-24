import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

import { Category, CategoryCollection, Currency, Record } from "../types";
import { getRecordId } from "../utils";

export class Database {
  private dbPath = path.join(__dirname, "../db.json");

  // Private method to seed default categories
  private getDefaultData() {
    return {
      currency: {
        code: "USD",
        symbol: "$",
      },
      categoryCollection: {
        expense: [
          { id: randomUUID(), name: "food", isDefault: true },
          { id: randomUUID(), name: "rent", isDefault: true },
          { id: randomUUID(), name: "transportation", isDefault: true },
          { id: randomUUID(), name: "entertainment", isDefault: true },
          { id: randomUUID(), name: "other", isDefault: true },
        ],
        income: [
          { id: randomUUID(), name: "salary", isDefault: true },
          { id: randomUUID(), name: "business", isDefault: true },
          { id: randomUUID(), name: "investment", isDefault: true },
          { id: randomUUID(), name: "gift", isDefault: true },
          { id: randomUUID(), name: "other", isDefault: true },
        ],
      },
      records: [],
    };
  }

  private readData(): any {
    if (!fs.existsSync(this.dbPath)) {
      const defaultData = this.getDefaultData();

      this.writeData(defaultData);
    }

    const data = fs.readFileSync(this.dbPath, "utf-8");

    return JSON.parse(data);
  }

  private writeData(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf-8");
  }

  public createRecord(amount: number, categoryId: string, description: string) {
    const data = this.readData();
    const records = data.records;
    const recordId = getRecordId(records);
    const record = {
      id: recordId,
      amount,
      categoryId,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    records.push(record);

    this.writeData(data);

    return record as Record;
  }

  public createCategory(name: string, type: string) {
    const data = this.readData();
    const categoryCollection = data.categoryCollection;
    const category = {
      id: randomUUID(),
      name,
      isDefault: false,
    };

    categoryCollection[type].push(category);

    this.writeData(data);

    return category as Category;
  }

  public readCategoryByName(name: string, type: "expense" | "income") {
    const data = this.readData();
    const categoryCollection: CategoryCollection = data.categoryCollection;
    const foundCategory = categoryCollection[type].find(
      (category: Category) => category.name === name
    );

    return foundCategory as Category;
  }

  public readCategories(type: "expense" | "income") {
    const data = this.readData();
    const categoryCollection = data.categoryCollection;

    return categoryCollection[type] as Category[];
  }

  public readCurrency() {
    const data = this.readData();
    const currency = data.currency;

    return currency as Currency;
  }

  public readRecord(id: number) {
    const data = this.readData();
    const records = data.records;
    const record = records.find((record: any) => record.id === id);

    return record as Record;
  }

  public readRecords() {
    const data = this.readData();
    const records = data.records;

    return records as Record[];
  }

  public updateRecord(
    id: number,
    amount: number,
    categoryId: string,
    description: string
  ) {
    const data = this.readData();
    const records = data.records;
    const record = records.find((record: Record) => record.id === id);

    if (record) {
      record.amount = amount;
      record.categoryId = categoryId;
      record.description = description;
      record.updatedAt = new Date().toISOString();

      this.writeData(data);

      return record as Record;
    }
  }
}

const db = new Database();

export default db;
