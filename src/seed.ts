import { AppDataSource } from './data-source';
import { User } from './modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const userRepository = AppDataSource.getRepository(User);

        const username = 'admin';
        const email = 'admin@n-erp.com';
        const password = 'password123';

        const existingUser = await userRepository.findOne({
            where: [{ username }, { email }]
        });

        if (existingUser) {
            console.log('User already exists');
        } else {
            console.log('Creating admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User();
            user.username = username;
            user.email = email;
            user.password = hashedPassword;
            user.firstName = 'Admin';
            user.lastName = 'User';
            user.roles = ['admin']; // Assuming 'admin' is the value for RoleEnum.Admin, checked simply as string array in entity
            user.isActive = true;

            await userRepository.save(user);
            console.log(`User created: ${username} / ${password}`);
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
