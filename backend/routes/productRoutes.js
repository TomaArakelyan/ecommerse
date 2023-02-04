import express from 'express';
import data from "../data.js";

const productRouter = express.Router();


productRouter.get('/', (req,res)=> {
    res.send(data.products)
})

productRouter.get('/:id', (req,res)=> {
    const product = data.products.find((p) => p.id == req.params.id)
    if (product){
        res.send(product)
    }
    else {
        res.status(404).send({message: "Product not found"})
    }
})

export default productRouter;