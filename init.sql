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

-- Таблиця для даних таблиць (дата + рядки)
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  rows JSONB NOT NULL DEFAULT '[]'
);

-- Додамо індекси для швидшого пошуку
CREATE INDEX idx_tables_date ON tables(date);
CREATE INDEX idx_purchases_buyer ON purchases(buyer);