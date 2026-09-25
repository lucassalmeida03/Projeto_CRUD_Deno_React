import { Response } from "express";

export const MockResponser = {
  send_accepted: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 202,
    status: "ACCEPTED",
  }),
  send_badRequest: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 400,
    status: "BAD_REQUEST",
  }),
  send_created: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 201,
    status: "CREATED",
  }),
  send_forbidden: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 403,
    status: "FORBIDDEN",
  }),
  send_internalServerError: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 500,
    status: "INTERNAL_SERVER_ERROR",
  }),
  send_notFound: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 404,
    status: "NOT_FOUND",
  }),
  send_ok: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 200,
    status: "OK",
  }),
  send_unauthorized: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 401,
    status: "UNAUTHORIZED",
  }),
} as unknown as Response;
