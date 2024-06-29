export interface IUser {
  id: string
  username: string
  email: string
  profile: string
  password: string
  confirmPassword?: string
  createdAt: string
  updatedAt: string
}