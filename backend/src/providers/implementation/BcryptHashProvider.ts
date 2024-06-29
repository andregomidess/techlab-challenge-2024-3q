import { compare, hash } from "bcrypt";
import { IHashprovider } from "../models/IHashProvider.js";


export class BcryptHashProvider implements IHashprovider{
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }

}