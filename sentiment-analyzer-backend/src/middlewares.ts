import { NextFunction, Request, Response } from 'express';

import { ErrorResponse, ErrorFactory } from './interfaces/ErrorResponse';

export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = ErrorFactory.notFound(req.originalUrl);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  // If it's our custom ApiError, use its properties
  if (err instanceof Error && 'statusCode' in err && 'statusMessage' in err) {
    const apiError = err as any;
    res.status(apiError.statusCode);
    res.json({
      message: apiError.message,
      stack: apiError.stack,
    });
  } else {
    // Default error handling
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: err.stack,
    });
  }
}

export function validateAnalyzeInput(req: Request, res: Response, next: NextFunction) {
  const { text } = req.body;

  // Check if body is empty object
  if (!req.body || Object.keys(req.body).length === 0) {
    const error = ErrorFactory.emptyRequestBody();
    return res.status(error.statusCode).json({ error: error.message });
  }

  // Check if text field exists
  if (text === undefined || text === null) {
    const error = ErrorFactory.missingTextField();
    return res.status(error.statusCode).json({ error: error.message });
  }

  // Check if text is a string
  if (typeof text !== 'string') {
    const error = ErrorFactory.invalidTextType();
    return res.status(error.statusCode).json({ error: error.message });
  }

  // Check if text is empty string
  if (text.trim() === '') {
    const error = ErrorFactory.emptyText();
    return res.status(error.statusCode).json({ error: error.message });
  }

  // Check if text is too long (> 500 characters)
  if (text.length > 500) {
    const error = ErrorFactory.textTooLong();
    return res.status(error.statusCode).json({ error: error.message });
  }

  next();
}
