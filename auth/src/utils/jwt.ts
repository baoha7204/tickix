import jwt from "jsonwebtoken";

export class Jwt {
  static sign(payload: any) {
    return jwt.sign(payload, process.env.JWT_KEY!);
  }
}
