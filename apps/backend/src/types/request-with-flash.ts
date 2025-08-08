import { Request } from 'express';

export type RequestWithFlash = Request & {
  flash: (type: string, message?: string | string[]) => string[] | undefined;
};
