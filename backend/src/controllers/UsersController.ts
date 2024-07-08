import { Request, Response } from "express";
import { User } from "../entities/User.js";
import { database } from "../services/database.js";
import { IHashprovider } from "../providers/models/IHashProvider.js";
import { BcryptHashProvider } from "../providers/implementation/BcryptHashProvider.js";

export class UsersController {
  protected get repository() {
    return database.getRepository(User)
  }

  protected get hashProvider() {
    return new BcryptHashProvider();
  }


  /**
   * GET /users
   */
  public async find(req: Request, res: Response) {

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 25

    const [users, count] = await this.repository.findAndCount({
      take: limit,
      skip: (page - 1) * limit
    })

    res.json({ count, page, limit, users })
  }

  /**
   * GET /users/:user-id
   */
  public async findOne(req: Request<{ userId: string }>, res: Response) {
    const user = await this.repository.findOne({
      where: { id: req.params.userId }
    })
    
    if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

    const { password, ...userWithoutPassword } = user;
    
    return res.json(userWithoutPassword)
  }

  /**
   * POST /users
   */
  public async save(req: Request<{username: string, email: string, password: string, profile: string}>, res: Response) {

    if (!req.body.username ||req.body.username === '') {
      return res.status(500).json({ message: `username is missing` })
    }

    if (!req.body.email ||req.body.email === '') {
      return res.status(500).json({ message: `email is missing` })
    }

    if (!req.body.password ||req.body.password === '') {
      return res.status(500).json({ message: `password is missing` })
    }

    if (!req.body.profile ||req.body.profile === '') {
      return res.status(500).json({ message: `profile is missing` })
    }

    const emailExist = await this.repository.findOne({where: {email: req.body.email}})

    if (emailExist){
      return res.status(400).json({ message: `Email addres already used.` })
    }
    
    const usernameExist = await this.repository.findOne({ where: {username: req.body.username} })
    
    if (usernameExist){
      return res.status(400).json({ message: `Username already used.` })
    }

    const hashedPassword = await this.hashProvider.generateHash(req.body.password)
    
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      profile: req.body.profile,
      password: hashedPassword
    }

    const user = await this.repository.save(newUser)


    res.status(201)
      .header('Location', `/users/${user.id}`)
      .json(user)
  }

  /**
   * PATCH /users/:user-id
   */
  public async update(req: Request, res: Response) {
    const user = await this.repository.findOne({
      where: { id: req.params.userId }
    })

    if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

    if (req.body.email){
      const emailExist = await this.repository.findOne({where: {email: req.body.email}})

      if (emailExist && emailExist.email !== user.email){
        return res.status(400).json({ message: `Email addres already used.` })
      }
    }
    
    if (req.body.username) {
      const usernameExist = await this.repository.findOne({ where: {username: req.body.username} })
    
      if (usernameExist && usernameExist.username !== user.username){
        return res.status(400).json({ message: `Username already used.` })
      }
    }
    
    if (req.body.password) {
      const { password, confirmPassword, ...rest } = req.body;
      const hashedPassword = await this.hashProvider.generateHash(password);
      req.body = {
        ...rest,
        password: hashedPassword,
      };
    }

    await this.repository.save(
      this.repository.merge(user, req.body)
    )

    res.json(user)
  }

  /**
   * DELETE /users/:user-id
   */
  public async delete(req: Request<{ userId: string }>, res: Response) {
    const user = await this.repository.findOne({
      where: { id: req.params.userId }
    })

    if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

    await this.repository.softRemove(user)

    res.json(user)
  }
}
