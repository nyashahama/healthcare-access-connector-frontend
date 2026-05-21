export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  message?: string
  status: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}
