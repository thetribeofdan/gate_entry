// src/common/utils/response.util.ts

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: boolean;
  statusCode: number;
}

export function buildResponse<T>(
  data: [] | object | any,
  message = "Success",
  status = true,
  statusCode = 400,
): ApiResponse<T> {
  return {
    data,
    message,
    status,
    statusCode,
  };
}
