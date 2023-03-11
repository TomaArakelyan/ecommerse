import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { object, string, is, size, refine, optional } from 'superstruct';
import isEmail from 'isemail';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils';

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

userRouter.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

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

userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
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
    res.json(user);
  } else {
    res.sendStatus(400);
  }
});

userRouter.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
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
