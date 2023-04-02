import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { object, string, is, size, refine, optional } from 'superstruct';
import isEmail from 'isemail';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils';
import * as redis from 'redis';
import { promisify } from 'util';


const url = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({ 
  url
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const prisma = new PrismaClient();
export const userRouter = express.Router();

const User = object({
  name: size(string(), 2, 50),
  email: optional(refine(string(), 'email', (v) => isEmail.validate(v))),
  password: string()
});

userRouter.post('/', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (name == null || password == null || email == null) {
    res.sendStatus(400);
  } else if (is(req.body, User)) {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    res.json(result);
  } else {
    res.sendStatus(400);
  }
});

/* Replacing with method using caching 
userRouter.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.send(users);
});
*/

userRouter.get('/', async (req: Request, res: Response) => {
  const cacheKey = 'allUsers';
  const cachedData = await getAsync(cacheKey);
  if (cachedData) {
    res.send(JSON.parse(cachedData));
    console.log("cached")
  } else {
    const users = await prisma.user.findMany();
    await setAsync(cacheKey, JSON.stringify(users), 'EX', 3600);
    res.send(users);
  }
});

/* Replacing with method using caching 
userRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const users = await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
  if (users == null) {
    res.status(404);
    res.send('User does not exist');
  }
  res.json(users);
});
*/

userRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `user_${id}`;
  const cachedData = await getAsync(cacheKey);
  if (cachedData) {
    res.send(JSON.parse(cachedData));
    console.log("cached")
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!user) {
      res.status(404);
      res.send('User does not exist');
      return;
    }
    await setAsync(cacheKey, JSON.stringify(user), 'EX', 3600);
    res.json(user);
  }
});


userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const cacheKey = `user_${id}`;
  if (name == null || email == null || password == null) {
    res.sendStatus(400);
  } else if (is(req.body, User)) {
    const user = await prisma.user.update({
      data: {
        name,
        email,
        password
      },
      where: {
        id: Number(id)
      }
    });
    redisClient.del('cacheKey');
    res.json(user);
  } else {
    res.sendStatus(400);
  }
});

userRouter.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  const cacheKey = `user_${id}`;
  const result = await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
  redisClient.del('cacheKey');
  res.json(result);
});

userRouter.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hash
    }
  });
  const token = generateToken(result.id);
  res.json({ user: result, token });
});

userRouter.post('/signin', async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.body.email }
  });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
      });
      return;
    }
  }
  res.status(401).send({ message: 'Invalid email or password' });
});

export default { userRouter };
