export interface Stock {
  id?: number;
  name: string;
  description?: string | null;
  quantity: number;
  minimumQuantity: number;
  unit: string;
  createdAt?: string;
  updatedAt?: string | null;
}
