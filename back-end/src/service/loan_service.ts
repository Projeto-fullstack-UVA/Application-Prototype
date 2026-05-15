import { get_loan_by_id, get_loans, create_loan, return_loan } from "../repository/loan_repo"
import { get_book_by_id, update_book_status } from "../repository/book_repo"
import { isLoanPayload } from "../utils"
import type { Book } from "../types"

export const list_loans = () => Response.json(get_loans())

export const find_loan = (req: Request) => {
  const id = Number(req.url.split('/').pop())

  if (isNaN(id)) {
    return new Response(`Invalid ID`, { status: 400 })
  }

  const loan = get_loan_by_id(id)

  if (!loan) {
    return new Response(`Loan not found`, { status: 404 })
  }

  return Response.json(loan)
}

export const borrow_book = async (req: Request) => {
  const body = await req.json()

  if (!isLoanPayload(body)) {
    return new Response(`Invalid loan payload — expected { user_id, book_id }`, { status: 400 })
  }

  const book = get_book_by_id(body.book_id) as Book | null

  if (!book) {
    return new Response(`Book not found`, { status: 404 })
  }

  if (book.status !== 'available') {
    return new Response(`Book is not available`, { status: 409 })
  }

  const return_date = new Date()
  return_date.setDate(return_date.getDate() + 14)

  const result = create_loan(body.user_id, body.book_id, return_date.toISOString())

  if (result.changes === 0) {
    return new Response(`Error while creating loan`, { status: 500 })
  }

  update_book_status(body.book_id, 'lent')

  const loan = get_loan_by_id(Number(result.lastInsertRowid))
  return Response.json(loan, { status: 201 })
}

export const return_book = async (req: Request) => {
  const id = Number(req.url.split('/').pop())

  if (isNaN(id)) {
    return new Response(`Invalid ID`, { status: 400 })
  }

  const loan = get_loan_by_id(id) as (ReturnType<typeof get_loan_by_id> & { returned_at: string | null }) | null

  if (!loan) {
    return new Response(`Loan not found`, { status: 404 })
  }

  if ((loan as any).returned_at) {
    return new Response(`Book already returned`, { status: 409 })
  }

  const returned_at = new Date().toISOString()
  const result = return_loan(id, returned_at)

  if (result.changes === 0) {
    return new Response(`Error while returning book`, { status: 500 })
  }

  update_book_status((loan as any).book_id, 'available')

  return Response.json(get_loan_by_id(id))
}
