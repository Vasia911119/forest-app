/**
 * Інтерфейс для рядка таблиці
 */
export interface Row {
  /** Унікальний ідентифікатор рядка */
  id?: number;
  /** ID таблиці, до якої належить рядок */
  table_id: number;
  /** Назва лісництва */
  forest: string;
  /** Назва покупця */
  buyer: string;
  /** Назва продукції */
  product: string;
  /** Назва породи деревини */
  species: string;
  /** Об'єм в м³ */
  volume: number;
  /** Сума в грн */
  amount: number;
}

/**
 * Інтерфейс для таблиці даних
 */
export interface TableData {
  /** Унікальний ідентифікатор таблиці */
  id: number;
  /** Дата таблиці у форматі ISO */
  date: string;
  /** Масив рядків таблиці */
  rows: Row[];
  /** Тимчасовий ідентифікатор для нових таблиць */
  _tmpId?: string;
}

/**
 * Інтерфейс для лісництва
 */
export interface Forest {
  /** Унікальний ідентифікатор лісництва */
  id: number;
  /** Назва лісництва */
  name: string;
}

/**
 * Інтерфейс для продукції
 */
export interface Product {
  /** Унікальний ідентифікатор продукції */
  id: number;
  /** Назва продукції */
  name: string;
}

/**
 * Інтерфейс для породи деревини
 */
export interface Species {
  /** Унікальний ідентифікатор породи */
  id: number;
  /** Назва породи */
  name: string;
}

/**
 * Інтерфейс для закупівлі
 */
export interface Purchase {
  /** Назва покупця */
  buyer: string;
  /** Назва продукції */
  product: string;
  /** Назва породи деревини */
  species: string;
  /** Об'єм в м³ */
  volume: number;
  /** Сума в грн */
  amount: number;
}