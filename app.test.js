// // app.test.js

// const request = require('supertest');
// const app = require('./app');
// const User = require('./models/user');

// describe('POST /create', () => {
//   beforeEach(async () => {
//     await User.deleteMany({});
//   });

//   it('should not create a new user if username is missing', async () => {
//     const response = await request(app)
//       .post('/create')
//       .send({
//         email: 'test@example.com',
//         age: 25,
//         password: 'testpassword',
//       });

//     expect(response.status).toBe(200);
//     expect(response.text).toContain('Username or Email already exists, Take me Home');
//     const users = await User.find({});
//     expect(users.length).toBe(0);
//   });
// });