import bcrypt from 'bcrypt';
export const kSaltRounds: number = 10;

export async function generateSalt(): Promise<string> {
  return bcrypt.genSalt(kSaltRounds);
}

export async function encryptePassowrd(password: string): Promise<string> {
  const salt = await generateSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
}

export async function compare(
  password: string,
  encryptedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, encryptedPassword);
}
