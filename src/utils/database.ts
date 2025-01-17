import fs from "fs";

export class Database {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public readData(): any {
    if (!fs.existsSync(this.dbPath)) {
      return {
        metadata: { currency: "USD" },
        categories: {
          expense: ["food", "rent", "transportation", "other"],
          income: ["salary", "business", "investments", "other"],
        },
        records: [],
      };
    }

    const data = fs.readFileSync(this.dbPath, "utf-8");

    return JSON.parse(data);
  }

  public writeData(data: any): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf-8");
  }
}
