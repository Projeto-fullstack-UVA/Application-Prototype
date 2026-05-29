import database from "./repo"

const get_loans_query = database.query(`
  SELECT l.*, b.title AS book_title, b.author AS book_author
  FROM loans l
  JOIN books b ON l.book_id = b.id
`)

const get_loan_by_id_query = database.query(`
  SELECT l.*, b.title AS book_title, b.author AS book_author
  FROM loans l
  JOIN books b ON l.book_id = b.id
  WHERE l.id = ?
`)

const get_loans_by_user_query = database.query(`
  SELECT l.*, b.title AS book_title, b.author AS book_author
  FROM loans l
  JOIN books b ON l.book_id = b.id
  WHERE l.user_id = ?
`)

const create_loan_stmt = database.prepare(`
  INSERT INTO loans (user_id, book_id, return_date, returned_at)
  VALUES (?, ?, ?, NULL)
`)

const return_loan_stmt = database.prepare(`
  UPDATE loans SET returned_at = ? WHERE id = ?
`)

export const get_loans = () => get_loans_query.all()

export const get_loan_by_id = (id: number) => get_loan_by_id_query.get(id)

export const get_loans_by_user = (user_id: number) => get_loans_by_user_query.all(user_id)

export const create_loan = (user_id: number, book_id: number, return_date: string) =>
  create_loan_stmt.run(user_id, book_id, return_date)

export const return_loan = (id: number, returned_at: string) =>
  return_loan_stmt.run(returned_at, id)
