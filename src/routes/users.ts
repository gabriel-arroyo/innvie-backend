import express from 'express'
import { body, validationResult } from 'express-validator'
import * as userServices from '../services/userServices'

const userRouter = express.Router()

userRouter.get('/', async (_, res) => {
  const users = await userServices.getUsers()
  res.status(users.status).send(users)
})

userRouter.get('/:id', async (req, res) => {
  const user = await userServices.getUserById(req.params.id)
  console.log(user)
  res.status(user.status).send(user)
})

userRouter.post('/', body('email').isEmail(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const newUser = await userServices.addUser(req.body)

  return res.status(newUser.status).json(newUser)
})

export default userRouter
