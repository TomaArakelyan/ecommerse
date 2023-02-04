import  express from 'express';
const app = express();
app.use(express.json())

import orderRouter from './routes/orderRoutes.js';
import productRouter from './routes/productRoutes.js';
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);



const port = 6000;

app.listen(port, () => {
    console.log (`Listening to port:  ${port}`)
})