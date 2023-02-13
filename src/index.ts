import dotenv from 'dotenv'
import express from 'express'
import usersRouter from './routes/users'

dotenv.config()

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  if (!req) {
    return
  }

  res.send('Hello World2!')
})

app.use('/users', usersRouter)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
