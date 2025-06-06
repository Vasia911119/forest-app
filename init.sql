-- Таблиця для лісництв
CREATE TABLE forests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Таблиця для найменувань продукції
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Таблиця для порід
CREATE TABLE species (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Таблиця для інформації про покупки
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  buyer TEXT NOT NULL,
  product TEXT NOT NULL,
  species TEXT NOT NULL,
  volume INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  UNIQUE(buyer, product, species)
);

-- Таблиця для даних таблиць (дата)
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE
);

-- Таблиця для рядків у кожній таблиці
CREATE TABLE rows (
  id SERIAL PRIMARY KEY,
  table_id INTEGER NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  forest TEXT NOT NULL,
  buyer TEXT NOT NULL,
  product TEXT NOT NULL,
  species TEXT NOT NULL,
  volume INTEGER NOT NULL,
  amount INTEGER NOT NULL
);

-- Додамо індекси для швидшого пошуку
CREATE INDEX idx_tables_date ON tables(date);
CREATE INDEX idx_purchases_buyer ON purchases(buyer);
CREATE INDEX idx_rows_table_id ON rows(table_id);