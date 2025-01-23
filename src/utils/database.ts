import fs from "fs";

export class Database {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public readData(): any {
    if (!fs.existsSync(this.dbPath)) {
      return {
        metadata: {
          currency: {
            code: "USD",
            symbol: "$",
          },
        },
        categories: {
          expense: [
            {
              id: "e1",
              name: "food",
            },
            {
              id: "e2",
              name: "rent",
            },
            {
              id: "e3",
              name: "transportation",
            },
            {
              id: "e4",
              name: "other",
            },
          ],
          income: [
            {
              id: "i1",
              name: "salary",
            },
            {
              id: "i2",
              name: "business",
            },
            {
              id: "i3",
              name: "investments",
            },
            {
              id: "i4",
              name: "other",
            },
          ],
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
