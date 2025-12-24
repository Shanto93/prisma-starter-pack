import { hashPassword } from "../../../helpers/passwordHashingHelper.js";
import type { ICreateUserInput, UserPublic } from "./users.interface.js";
import {prisma} from './../../../../lib/prisma.js';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const createUser = async (payload: ICreateUserInput): Promise<UserPublic> => {
  if (!payload?.email || !payload?.password) {
    throw new Error("Email and password are required.");
  }

  if (!isValidEmail(payload.email)) {
    throw new Error("Invalid email format.");
  }

  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true },
  });

  if (existing) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      name: payload.name ?? null,
      photo: payload.photo ?? null,
    },
    // Never return password
    select: {
      id: true,
      email: true,
      name: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const UsersService = {
  createUser,
};
