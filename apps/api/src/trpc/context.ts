import { Request, Response } from 'express';
import { prisma } from '@carbon-ledger/db';

export interface Context {
  req: Request;
  res: Response;
  userId?: string;
  prisma: typeof prisma;
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  // Extract userId from authorization header or session
  const authHeader = req.headers.authorization;
  let userId: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    // Simple token parsing - in production, verify JWT properly
    try {
      const token = authHeader.substring(7);
      // For demo purposes, we'll just use the token as userId
      userId = token;
    } catch (error) {
      // Invalid token
    }
  }

  return {
    req,
    res,
    userId,
    prisma,
  };
}

