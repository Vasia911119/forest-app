-- Створення таблиць для системи обліку лісопродукції

-- Таблиця для лісництв
CREATE TABLE forests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для найменувань продукції
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для порід
CREATE TABLE species (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для інформації про покупки
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  buyer TEXT NOT NULL,
  product TEXT NOT NULL,
  species TEXT NOT NULL,
  volume INTEGER NOT NULL CHECK (volume > 0),
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer, product, species)
);

-- Таблиця для даних таблиць (дата)
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця для рядків у кожній таблиці
CREATE TABLE rows (
  id SERIAL PRIMARY KEY,
  table_id INTEGER NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  forest TEXT NOT NULL,
  buyer TEXT NOT NULL,
  product TEXT NOT NULL,
  species TEXT NOT NULL,
  volume INTEGER NOT NULL CHECK (volume > 0),
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Додаємо індекси для швидшого пошуку
CREATE INDEX idx_tables_date ON tables(date);
CREATE INDEX idx_purchases_buyer ON purchases(buyer);
CREATE INDEX idx_rows_table_id ON rows(table_id);
CREATE INDEX idx_rows_forest ON rows(forest);
CREATE INDEX idx_rows_buyer ON rows(buyer);
CREATE INDEX idx_rows_product ON rows(product);
CREATE INDEX idx_rows_species ON rows(species);

-- Додаємо тригери для оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forests_updated_at
  BEFORE UPDATE ON forests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_species_updated_at
  BEFORE UPDATE ON species
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at
  BEFORE UPDATE ON tables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rows_updated_at
  BEFORE UPDATE ON rows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Додаємо політики безпеки для всіх таблиць

-- Політики для таблиці forests
ALTER TABLE forests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Дозволити читання лісництв" ON forests
  FOR SELECT USING (true);

CREATE POLICY "Дозволити додавання лісництв" ON forests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Дозволити оновлення лісництв" ON forests
  FOR UPDATE USING (true);

CREATE POLICY "Дозволити видалення лісництв" ON forests
  FOR DELETE USING (true);

-- Політики для таблиці products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Дозволити читання продукції" ON products
  FOR SELECT USING (true);

CREATE POLICY "Дозволити додавання продукції" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Дозволити оновлення продукції" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Дозволити видалення продукції" ON products
  FOR DELETE USING (true);

-- Політики для таблиці species
ALTER TABLE species ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Дозволити читання порід" ON species
  FOR SELECT USING (true);

CREATE POLICY "Дозволити додавання порід" ON species
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Дозволити оновлення порід" ON species
  FOR UPDATE USING (true);

CREATE POLICY "Дозволити видалення порід" ON species
  FOR DELETE USING (true);

-- Політики для таблиці purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Дозволити читання покупок" ON purchases
  FOR SELECT USING (true);

CREATE POLICY "Дозволити додавання покупок" ON purchases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Дозволити оновлення покупок" ON purchases
  FOR UPDATE USING (true);

CREATE POLICY "Дозволити видалення покупок" ON purchases
  FOR DELETE USING (true);

-- Політики для таблиці tables
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Дозволити читання таблиць" ON tables
  FOR SELECT USING (true);

CREATE POLICY "Дозволити додавання таблиць" ON tables
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Дозволити оновлення таблиць" ON tables
  FOR UPDATE USING (true);

CREATE POLICY "Дозволити видалення таблиць" ON tables
  FOR DELETE USING (true);

-- Політики для таблиці rows
ALTER TABLE rows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Дозволити читання рядків" ON rows
  FOR SELECT USING (true);

CREATE POLICY "Дозволити додавання рядків" ON rows
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Дозволити оновлення рядків" ON rows
  FOR UPDATE USING (true);

CREATE POLICY "Дозволити видалення рядків" ON rows
  FOR DELETE USING (true);