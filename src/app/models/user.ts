export interface User {
  id?: number;
  name?: string;
  lastName?: string;
  email: string;
  password?: Password | string;
}

export interface Password {
  password: string;
  confirmPassword: string;
}
