import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    return hash.toString("hex") + "." + salt;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    // Split hashed password and salt
    const [hashedDbPassword, salt] = storedPassword.split(".");
    // Hash provided password
    const hashProvidedPassword = (await scrypt(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    // Compare hashed passwords
    return hashedDbPassword === hashProvidedPassword.toString("hex");
  }
}
