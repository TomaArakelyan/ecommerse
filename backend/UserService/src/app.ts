import express from 'express';
import { userRouter } from './users/users.controller';
import cors from 'cors';
const app = express();
app.use(cors());

app.use(express.json());

app.use('/users', userRouter);

const server = app.listen(3001, () =>
  console.log(` Server ready at: http://localhost:3001`)
);
