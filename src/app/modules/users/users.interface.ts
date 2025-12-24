export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string | null;
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserInput {
  email: string;
  password: string;
  name?: string | null;
  photo?: string | null;
}

export interface IUpdateUserInput {
  email?: string;
  password?: string;
  name?: string | null;
  photo?: string | null;
}

// Safe response (do not expose password)
export type UserPublic = Omit<IUser, "password">;
