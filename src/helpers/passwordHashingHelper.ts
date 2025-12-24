import bcrypt from "bcryptjs";

const getSaltRounds = (): number => {
  const rounds = Number.parseInt(process.env.SALT_ROUNDS ?? "10", 10);
  return Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = getSaltRounds();
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
