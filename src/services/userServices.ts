import { User, UserData, UserPostData, ErrorData, Role } from '../types'
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const defaultUser: User = {
  id: '',
  email: '',
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

const getDataFormat = (user: any) => {
  const data: UserData = {
    data: user,
    status: 200,
  }
  return data
}

const getErrorFormat = (error: any) => {
  const data: ErrorData = {
    data: error,
    status: error.status,
  }
  return data
}

export const getUsers = async (): Promise<UserData | ErrorData> => {
  try {
    const fetchedUsers = await prisma.users.findMany()
    return getDataFormat(fetchedUsers)
  } catch (error) {
    console.error(error)
    return getErrorFormat({
      timestamp: new Date().toISOString(),
      status: 500,
      error: 'Internal Server Error',
      message: `Users not found: ${error}`,
      path: '/users',
    })
  }
}

export const getUserById = async (
  id: string,
): Promise<UserData | ErrorData> => {
  try {
    const fetchedUser = await prisma.users.findUnique({
      where: {
        id: id,
      },
    })
    if (!fetchedUser) {
      return getErrorFormat({
        timestamp: new Date().toISOString(),
        status: 404,
        error: 'Not Found',
        message: `User with id ${id} not found`,
        path: '/users/:id',
      })
    }
    return getDataFormat([fetchedUser])
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email',
        )
      }
    }
    return getErrorFormat({
      timestamp: new Date().toISOString(),
      status: 500,
      error: 'Internal Server Error',
      message: `User with id ${id} not found: ${error}`,
      path: '/users/:id',
    })
  }
}

const createUser = (
  email: string,
  address: string,
  city: string,
  state: string,
  country: string,
  zip: string,
  phone: string,
  firstName: string,
  lastName: string,
  license: string,
  password: string,
  role: Role,
) => {
  return Prisma.validator<Prisma.UsersCreateInput>()({
    email,
    address,
    city,
    state,
    country,
    zip,
    phone,
    firstName,
    lastName,
    license,
    password,
    role,
  })
}

export const addUser = async (
  user: User,
): Promise<UserPostData | ErrorData> => {
  const upercaseRole = user.role?.toUpperCase() ?? 'USER'
  const newUser = {
    ...defaultUser,
    ...user,
    role:
      upercaseRole === 'ADMIN' || upercaseRole === 'USER'
        ? upercaseRole
        : 'USER',
  }
  const createdUser = createUser(
    newUser.email,
    newUser.address ?? '',
    newUser.city ?? '',
    newUser.state ?? '',
    newUser.country ?? '',
    newUser.zip ?? '',
    newUser.phone ?? '',
    newUser.firstName ?? '',
    newUser.lastName ?? '',
    newUser.license ?? '',
    newUser.password ?? '',
    'USER',
  )

  try {
    await prisma.users.create({
      data: createdUser,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email',
        )
      }
    }
    return getErrorFormat({
      timestamp: new Date().toISOString(),
      status: 500,
      error: 'Internal Server Error',
      message: `User not created: ${error}`,
      path: '/users',
    })
  }
  return getDataFormat([createdUser])
}
