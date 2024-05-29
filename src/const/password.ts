import * as bcrypt from 'bcrypt';
import * as process from 'process';

export const MIN_LENGTH_PASSWORD = 8;

export const hashPassword = async (password: string, salt?: string) => {
  const newSalt = salt ? salt : await bcrypt.genSalt(+process.env.SALT);
  const hash = await bcrypt.hash(password, newSalt);
  return [hash, newSalt];
};

export const checkPassword = async (password: string, password_user: string) => {
  return await bcrypt.compare(password, password_user);
};
