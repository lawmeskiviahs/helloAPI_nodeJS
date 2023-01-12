/* eslint-disable prettier/prettier */
import { Application } from 'express';
import adminRouter from './api/controllers/admin/router';
import shaivikDummyRouter from './api/controllers/shaivik/router'

export default function routes(app: Application): void {
  app.use('/admin/api/v1', adminRouter);
  app.use('/shaivik/api/v1', shaivikDummyRouter)

}
