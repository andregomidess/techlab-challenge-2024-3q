import { Request, Response } from "express";
import { database } from "../services/database.js";
import { User } from "../entities/User.js";
import jwt from 'jsonwebtoken'
import { APP_NAME, SECRET } from "../constants/env.js";
import { profiles } from "../constants/profiles.js";
import { BcryptHashProvider } from "../providers/implementation/BcryptHashProvider.js";

export class AuthenticationController {

  protected get hashProvider() {
    return new BcryptHashProvider();
  }
  /**
   * POST /auth/sign-in
   */
  public async signIn(req: Request, res: Response) {
    if (typeof req.body !== 'object') throw new Error('Bad Request: body is required')

    if (typeof req.body.username !== 'string') throw new Error('Bad Request: body.username is required')

    if (typeof req.body.password !== 'string') throw new Error('Bad Request: body.password is required')

    const repository = database.getRepository(User)

    const user = await repository.findOneBy([
      { email: req.body.username },
      { username: req.body.username }
    ])

    if (!user) throw new Error('User not found')

    const passwordConfirmed = await this.hashProvider.compareHash(
      req.body.password,
      user.password,
    );

    if (!passwordConfirmed) {
      throw new Error('Icorrect email/password combination.');
    }

    const profile = profiles[user.profile]

    const scopes = profile.scopes(user)
      
    const accessToken = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        { scopes: Array.isArray(scopes) ? scopes : [scopes] },
        SECRET,
        {
          audience: APP_NAME,
          issuer: APP_NAME,
          expiresIn: '1h',
          subject: `user:${user.id}`
        },
        (err, token) => {
          if (err) return reject(err)

          if (!token) return reject(new Error())

          resolve(token)
        }
      )
    })

    res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600 })
  }
}
