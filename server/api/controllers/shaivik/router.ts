/* eslint-disable prettier/prettier */
import express from 'express'
import  Controller from './controller'

export default express
.Router()
.post('/user', Controller.userPost)
.get('/getUser/:id', Controller.userGet)
.put('/updateUser/:id', Controller.userUpdate)