export type Json<T = any> = { [key: string]: T }
export interface ErrorResponse {
    status: number
    message: string

}