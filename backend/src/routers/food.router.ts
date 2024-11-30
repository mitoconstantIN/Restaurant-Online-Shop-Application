import { Router} from "express";
import { sample_foods, sample_users } from "../data";
import asynceHandeler from 'express-async-handler';
import { FoodModel } from "../models/food.model";
const router = Router();

router.get("/seed", asynceHandeler(
    async(req, res) => {
        const foodsCount = await FoodModel.countDocuments();
        if(foodsCount>0){
            res.send("Seed is already done!");
            return;
        }
        await FoodModel.create(sample_foods);
        res.send("seed is done!");
    }
    
))

router.get("/", asynceHandeler(
    async (req,res) => {
    const foods = await FoodModel.find();
    res.send(foods)
}))

router.get("/search/:searchTerm", asynceHandeler(
    async (req,res) => {
    const searchRegex = new RegExp(req.params.searchTerm, 'i');
    const foods = await FoodModel.find({name: {$regex:searchRegex}})
    res.send(foods);
}))

router.get("/:foodId", asynceHandeler(
    async (req,res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
}
))

export default router;

