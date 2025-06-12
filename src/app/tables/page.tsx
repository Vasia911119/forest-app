import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import TablesClient from './TablesClient';

export const metadata: Metadata = {
  title: 'Таблиці | Forest App',
  description: 'Перегляд таблиць з даними про лісопродукцію',
};

export default async function TablesPage() {
  const supabase = await createClient();
  const { data: tables, error } = await supabase.from("tables").select("id, date, rows");

  return <TablesClient tables={tables ?? []} error={error?.message ?? null} />;
}