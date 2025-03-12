import { registerAs } from '@nestjs/config';
import { UserRole } from 'src/common/constants/enum.constant';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 27017,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  initialUser: {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    role: UserRole.ADMIN,
  },
  postgres: {
    enableSSL: process.env.ENABLE_SQL_SSL ? process.env.ENABLE_SQL_SSL : false,
  },
}));
