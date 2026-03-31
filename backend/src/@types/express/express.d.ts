import { JwtPayload } from "../auth/types/jwt-payload";

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}
