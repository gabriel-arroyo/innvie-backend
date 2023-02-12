import { User } from '../types'

const defaultUser: User = {
  id: '1',
  email: 'test',
  address: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  phone: '',
  firstName: '',
  lastName: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  license: '',
  password: '',
  role: 'USER',
}
const users: User[] = [defaultUser]

export const getUsers = (): User[] => {
  return users
}

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}

export const addUser = (user: User) => {
  const upercaseRole = user.role?.toUpperCase() ?? 'USER'
  const newUser = {
    ...defaultUser,
    ...user,
    id: String(users.length + 1),
    role:
      upercaseRole === 'ADMIN' || upercaseRole === 'USER'
        ? upercaseRole
        : 'USER',
  }
  console.log(newUser)
  return newUser
}
