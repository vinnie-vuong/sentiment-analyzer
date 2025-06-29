export interface ErrorResponse {
  message: string;
  stack?: string;
}

// Base error class for API errors
export abstract class ApiError extends Error {
  public readonly statusCode: number;
  public readonly statusMessage: string;

  constructor(statusCode: number, statusMessage: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.name = this.constructor.name;
  }

  public toResponse(): { error: string; statusCode: number; statusMessage: string } {
    return {
      error: this.message,
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
    };
  }
}

// Validation Errors (400)
export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, 'Bad Request', message);
  }
}

export class EmptyRequestBodyError extends ValidationError {
  constructor() {
    super('Request body is required and cannot be empty.');
  }
}

export class MissingTextFieldError extends ValidationError {
  constructor() {
    super('Text field is required in the request body.');
  }
}

export class InvalidTextTypeError extends ValidationError {
  constructor() {
    super('Text must be a string.');
  }
}

export class EmptyTextError extends ValidationError {
  constructor() {
    super('Text cannot be empty or contain only whitespace.');
  }
}

export class TextTooLongError extends ValidationError {
  constructor(maxLength: number = 500) {
    super(`Text cannot exceed ${maxLength} characters.`);
  }
}

// Not Found Errors (404)
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, 'Not Found', `🔍 - Not Found - ${resource}`);
  }
}

// Internal Server Errors (500)
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error occurred.') {
    super(500, 'Internal Server Error', message);
  }
}

export class DatabaseError extends InternalServerError {
  constructor(operation: string) {
    super(`Database operation failed: ${operation}`);
  }
}

export class SentimentAnalysisError extends InternalServerError {
  constructor(message: string = 'Sentiment analysis failed.') {
    super(message);
  }
}

// Error factory for easy creation
export class ErrorFactory {
  static validation(message: string): ValidationError {
    return new ValidationError(message);
  }

  static emptyRequestBody(): EmptyRequestBodyError {
    return new EmptyRequestBodyError();
  }

  static missingTextField(): MissingTextFieldError {
    return new MissingTextFieldError();
  }

  static invalidTextType(): InvalidTextTypeError {
    return new InvalidTextTypeError();
  }

  static emptyText(): EmptyTextError {
    return new EmptyTextError();
  }

  static textTooLong(maxLength: number = 500): TextTooLongError {
    return new TextTooLongError(maxLength);
  }

  static notFound(resource: string): NotFoundError {
    return new NotFoundError(resource);
  }

  static database(operation: string): DatabaseError {
    return new DatabaseError(operation);
  }

  static sentimentAnalysis(message?: string): SentimentAnalysisError {
    return new SentimentAnalysisError(message);
  }
}