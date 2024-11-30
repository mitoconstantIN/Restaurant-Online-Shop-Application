import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import { sample_foods, sample_users } from "./data";
import jwt from "jsonwebtoken";
import foodRouter from './routers/food.router';
import userRouter from './routers/user.router';
import { dbConnect } from './configs/database.config';
import orderRouter from './routers/order.router';

dbConnect();

const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const port = 500;
app.listen(port , () => {
    console.log("Website served on http://localhost:" + port);
})