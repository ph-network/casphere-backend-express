import express from "express";

const user = express.Router()

user.get('/', (_req, res) => {
  res.send('User')
})

export default user