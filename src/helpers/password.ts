import * as bcrypt from 'bcryptjs';

const saltOrRounds = 10;
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltOrRounds);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
