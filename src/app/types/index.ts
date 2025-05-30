export interface Row {
  id: number;
  forest: string;
  buyer: string;
  product: string;
  species: string;
  volume: number;
  amount: number;
}

export interface TableData {
  date: string;
  rows: Row[];
}