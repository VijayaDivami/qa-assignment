import * as dotenv from 'dotenv';
dotenv.config();

export const AUTH_DATA = {
  /** Pre-seeded admin – used for read-heavy suites */
  validAdmin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@shopeasy.com',
    password: process.env.ADMIN_PASSWORD ?? 'password123',
  },

  /** Used to test 409 Conflict – same email that already exists */
  existingUser: {
    email: process.env.ADMIN_EMAIL ?? 'admin@shopeasy.com',
    password: process.env.ADMIN_PASSWORD ?? 'password123',
    name: 'Admin User',
  },

  /** Invalid – wrong password for the admin account */
  invalidCredentials: {
    email: process.env.ADMIN_EMAIL ?? 'admin@shopeasy.com',
    password: 'wrong_password_xyz',
  },

  /** Invalid – email that has never been registered */
  nonExistentUser: {
    email: 'ghost_9999@nowhere.example.com',
    password: 'somepassword',
  },
} as const;
