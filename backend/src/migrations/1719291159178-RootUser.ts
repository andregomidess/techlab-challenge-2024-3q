import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/User.js";
import { BcryptHashProvider } from "../providers/implementation/BcryptHashProvider.js";

export class RootUser1719291159178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const bcryptHashProvider = new BcryptHashProvider();
        const password = await bcryptHashProvider.generateHash('root');
        await queryRunner.manager.insert(User, {
            email: 'root@root.com',
            username: 'root',
            password,
            profile: 'sudo'
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, {
            email: 'root@root.com',
        })
    }
}
