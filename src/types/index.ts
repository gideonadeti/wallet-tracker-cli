export interface CategoryCollection {
  expense: Category[];
  income: Category[];
}

export interface Category {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
}

export interface Record {
  id: number;
  amount: number;
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
