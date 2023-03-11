import jwt from 'jsonwebtoken';

export function generateToken(userId: number): string {
  const payload = { userId };
  const secret = process.env.JWT_SECRET || 'default-secret';
  const options = { expiresIn: '1d' };
  const token = jwt.sign(payload, secret, options);
  return token;
}
