import { Food } from "./models/Food";

export class CartItem {

    food: Food;
    quantity: number;
    price: number;

    constructor(food: Food) {
        this.food = food;
        this.quantity = 1;
        this.price = this.food.price * this.quantity;
    }
}
