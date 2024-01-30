export interface SuccessResponse<T> {
  statusCode: number
  body: T
  headers: Object
}
