export interface Category {
  id: string;
  name: string;
}

export interface CategoryCollection {
  [key: string]: Category[];
}

export interface Record {
  id: number;
  amount: number;
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}