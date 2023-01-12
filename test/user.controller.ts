// import 'mocha';
// import { expect } from 'chai';
// import Server from '../server';
// import request from 'supertest';

// describe('Register User', () => {
//   it('should add a new user', () =>
//     request(Server)
//       .post('/api/v1/user/register')
//       .send({
//         firstName: 'test',
//         lastName: 'demo',
//         email: 'test@gmail.com',
//         password: '123456',
//       })
//       .set('Accept', 'application')
//       .expect('Content-Type', /json/)
//       .expect(400)
//       .then((r) => {
//         expect(r.body)
//           .to.be.an('object')
//           .that.has.property('error')
//           .equal(true);
//       }));
// });

// describe('Auth Login', () => {
//   it('should return an user', () =>
//     request(Server)
//       .post('/api/v1/auth/login')
//       .send({
//         email: 'test@gmail.com',
//         password: '123456',
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .then((r) => {
//         expect(r.body)
//           .to.be.an('object')
//           .that.has.property('error')
//           .equal(false);
//       }));
//   it('should return an error', () =>
//     request(Server)
//       .post('/api/v1/auth/login')
//       .send({
//         email: 'test@gmail.com',
//         password: '123455',
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(400)
//       .then((r) => {
//         expect(r.body)
//           .to.be.an('object')
//           .that.has.property('error')
//           .equal(true);
//       }));
// });

// describe('Auth OTP', () => {
//   it('should return and id with message ', () =>
//     request(Server)
//       .post('/api/v1/auth/get-otp')
//       .send({
//         mobileNumber: '999999999',
//         userId: 'e72120e2-d6fa-4b68-88ce-94b76833c06f',
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .then((r) => {
//         expect(r.body)
//           .to.be.an('object')
//           .that.has.property('error')
//           .equal(true);
//       }));
//   it('should return and id with message ', () =>
//     request(Server)
//       .post('/api/v1/auth/get-otp')
//       .send({
//         mobileNumber: '9999999999',
//         userId: 'e72120e2-d6fa-4b68-88ce-94b76833c06f',
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .then((r) => {
//         expect(r.body)
//           .to.be.an('object')
//           .that.has.property('error')
//           .equal(false);
//       }));
// });
