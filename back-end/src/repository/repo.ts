import { Database } from "bun:sqlite"

const database = new Database(`Estante_Vive.sqlite`, { strict: true })

database.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  release_date TEXT NOT NULL,
  edition TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'lent')),
  created_at TEXT NOT NULL
)`)

database.run(`CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  book_id INTEGER NOT NULL REFERENCES books(id),
  return_date TEXT NOT NULL,
  returned_at TEXT
)`)

export default database
