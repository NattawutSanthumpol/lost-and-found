/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
export function saltAndHashPassword(password: any) {
  const saltRounds = 10; // Adjust the cost factor according to your security requirements
  const salt = bcrypt.genSaltSync(saltRounds); // Synchronously generate a salt
  const hash = bcrypt.hashSync(password, salt); // Synchronously hash the password
  return hash; // Return the hash directly as a string
}

export function verifyPassword(inputPassword: any, hashedPassword: any) {
  // Compare the input password with the stored hashed password
  const isMatch = bcrypt.compareSync(inputPassword, hashedPassword);
  return isMatch; // Return true if passwords match, otherwise false
}
