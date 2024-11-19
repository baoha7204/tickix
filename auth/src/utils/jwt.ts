import jwt from "jsonwebtoken";

export class Jwt {
  static sign(payload: any) {
    return jwt.sign(payload, process.env.JWT_KEY!);
  }

  static verify(token: string) {
    return jwt.verify(token, process.env.JWT_KEY!);
  }
}
