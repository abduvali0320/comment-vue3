export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface CommentFormData {
  name: string
  email: string
  body: string
  postId: number
}

export interface PaginationParams {
  page: number
  perPage: number
  search: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}
