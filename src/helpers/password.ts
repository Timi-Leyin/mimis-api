import * as bcrypt from 'bcryptjs';

const saltOrRounds = 10;
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltOrRounds);
};
