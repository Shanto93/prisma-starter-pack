import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync.js";
import { UsersService } from "./users.service.js";
import type { ICreateUserInput } from "./users.interface.js";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersService.createUser(req.body as ICreateUserInput);
  res.status(201).json({ message: "User created successfully", data: result });
});

export const UsersController = {
  createUser,
};
