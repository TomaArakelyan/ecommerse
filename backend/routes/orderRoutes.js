import express from 'express';
import data from "../data.js";


const orderRouter = express.Router();
 
 class Order {
 
    constructor(orderid,productId){
        this.orderid = orderid,
        this.productId = productId
    }
  
}

orderRouter.post('/', (req,res) => {
    const { orderid, productId } = req.body;
     if (orderid == null || productId == null) {
         res.sendStatus(400);
       } else {
        const result = new Order(orderid, productId)
        data.orders.push(result)
        const product = data.products.find(product => product.id == productId)
        product.countInStock--;
        res.send("Order placed")
       }
 })
 
 
 orderRouter.get('/', (req,res) => {
    res.send(data.orders)
 })


 export default orderRouter;