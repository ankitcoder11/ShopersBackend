import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser())


// routes
import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)

import createProductRouter from './routes/createProduct.routes.js'
app.use("/api/v1/createproduct", createProductRouter)

import getProducts from './routes/getProducts.routes.js'
app.use("/api/v1/getproduct", getProducts)

import cartProducts from './routes/cart.routes.js'
app.use("/api/v1/cart", cartProducts)
import orderRouters from './routes/order.routes.js'
app.use("/api/v1/orders", orderRouters)

import addressRouters from './routes/address.routes.js'
app.use("/api/v1/address", addressRouters)

export { app }