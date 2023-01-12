/* eslint-disable prettier/prettier */
import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import l from './logger';
import CONFIG from '../api/config';
import helmet from 'helmet';
import * as CronJobClass from '../cron/cron';

import errorHandler from '../api/middlewares/error.handler';
// import * as OpenApiValidator from 'express-openapi-validator';
const app = express();
CronJobClass;
export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    console.log('~~~~~~~~~~~~~~~~~~~');
    console.log('API REQUEST LIMIT: ', CONFIG.API.REQUEST_LIMIT);
    console.log('~~~~~~~~~~~~~~~~~~~');
    const root = path.normalize(__dirname + '/../..');
    app.use(bodyParser.json({ limit: CONFIG.API.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: CONFIG.API.REQUEST_LIMIT || '100kb',
      })
    );
    const corsOptions: any = {
      origin: function (origin: any, callback: any) {
        if (CONFIG.WHITE_LIST_DOMAINS.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('You are not allowed to access this domain'));
        }
      },
    };

    app.use(helmet());
    app.get('/admin/status', (_req: any, res: any) => {
      //this route is used by devops
      return res.status(200).json({ status: 'Success' });
    });
    // app.use(cors(corsOptions));
    app.get('/status', (req: any, res: any) => {
      console.log(req);
      return res.status(200).json({ status: 'Success' });
    });
    app.use(cors());
    app.use(bodyParser.text({ limit: CONFIG.API.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(CONFIG.SESSION.SECRET));
    app.use(express.static(`${root}/public`));

    const apiSpec = path.join(__dirname, 'api.yml');
    // const validateResponses = !!(
    //   CONFIG.API.ENABLE_RESPONSE_VALIDATION &&
    //   CONFIG.API.ENABLE_RESPONSE_VALIDATION.toLowerCase() === 'true'
    // );
    app.use(CONFIG.API.SPEC || '/spec', express.static(apiSpec));
    // app.use(
    //   OpenApiValidator.middleware({
    //     apiSpec,
    //     validateResponses,
    //     ignorePaths: /.*\/spec(\/|$)/,
    //   })
    // );
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        // eslint-disable-next-line prettier/prettier
        `up and running in ${
          CONFIG.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );
    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
