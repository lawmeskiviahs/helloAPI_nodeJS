import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator";

export function postValidate(
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
    const error = validationResult(_req);
  if (!error.isEmpty()) { 

  res.status(400).json({ message: { error: error.array() } });
  }else{
      _next()
  }
}
