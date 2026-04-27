/** Unique suffix to isolate test data across runs */
const RUN_ID = Date.now();

export const USER_DATA = {
  newUser: {
    id: RUN_ID,
    username: `testuser_${RUN_ID}`,
    firstName: 'Test',
    lastName: 'User',
    email: `testuser_${RUN_ID}@example.com`,
    password: 'P@ssw0rd!',
    phone: '0712345678',
    userStatus: 1,
  },

  updatedUser: {
    id: RUN_ID,
    username: `testuser_${RUN_ID}`,
    firstName: 'Updated',
    lastName: 'User',
    email: `updated_${RUN_ID}@example.com`,
    password: 'NewP@ss1!',
    phone: '0798765432',
    userStatus: 1,
  },
};
