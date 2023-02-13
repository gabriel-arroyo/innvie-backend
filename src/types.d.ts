import { Users } from '@prisma/client'

export type User = Users
export type Role = Users['role']
export type UserPost = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UserData = {
  data: User[]
  status: number
}
export type UserPostData = {
  data: UserPost[]
  status: number
}
export interface ResponseError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
export type ErrorData = {
  data: ResponseError
  status: number
}
