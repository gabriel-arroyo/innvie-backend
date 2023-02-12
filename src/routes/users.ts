import express from 'express'
import * as userServices from '../services/userServices'

const userRouter = express.Router()

userRouter.get('/', (_, res) => {
  res.send(userServices.getUsers())
})

userRouter.get('/:id', (req, res) => {
  const user = userServices.getUserById(req.params.id)
  return user ? res.send(user) : res.status(404).end()
})

userRouter.post('/', (req, res) => {
  const newUser = userServices.addUser(req.body)
  res.json(newUser)
})

export default userRouter
