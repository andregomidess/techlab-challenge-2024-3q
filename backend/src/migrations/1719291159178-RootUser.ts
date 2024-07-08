import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/User.js";
import { BcryptHashProvider } from "../providers/implementation/BcryptHashProvider.js";

export class RootUser1719291159178 implements MigrationInterface {

    // public async up(queryRunner: QueryRunner): Promise<void> {
    //     const bcryptHashProvider = new BcryptHashProvider();
    //     const password = await bcryptHashProvider.generateHash('root');
    //     await queryRunner.manager.insert(User, {
    //         email: 'root@root.com',
    //         username: 'root',
    //         password,
    //         profile: 'sudo'
    //     })
    // }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const bcryptHashProvider = new BcryptHashProvider();
        const users = [];

        for (let i = 1; i <= 30; i++) {
            const email = `user${i}@example.com`;
            const username = `user${i}`;
            const password = await bcryptHashProvider.generateHash(`password${i}`);
            const profile = i === 1 ? 'sudo' : 'standard';

            const user = new User();
            user.email = email;
            user.username = username;
            user.password = password;
            user.profile = profile;

            users.push(user);
        }

        await queryRunner.manager.insert(User, users);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, {
            email: 'root@root.com',
        })
    }
}
