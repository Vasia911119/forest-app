import { createClient } from '@/utils/supabase/server';

export default async function TablesPage() {
  const supabase = await createClient();
  const { data: tables, error } = await supabase.from("tables").select("date, rows");

  if (error) {
    return <div>Помилка завантаження таблиць: {error.message}</div>;
  }

  return (
    <div>
      <h1>Таблиці</h1>
      <pre>{JSON.stringify(tables, null, 2)}</pre>
    </div>
  );
}