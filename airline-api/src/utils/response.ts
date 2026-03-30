export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'sold_out';
  message?: string;
  data?: T;
  [key: string]: any;
}

export const successResponse = (data: any = {}, message?: string): ApiResponse => {
  return {
    status: 'success',
    message,
    ...data
  };
};

export const errorResponse = (message: string, code: number = 400): ApiResponse => {
  return {
    status: 'error',
    message
  };
};

export const soldOutResponse = (message: string): ApiResponse => {
  return {
    status: 'sold_out',
    message
  };
};
