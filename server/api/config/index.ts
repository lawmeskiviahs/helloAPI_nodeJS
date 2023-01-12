/* eslint-disable prettier/prettier */
export default {
  RUNNING_PORT: parseInt(process.env.PORT || '30013'),
  GRPC: {
    USER_CONTAINER_NAME: process.env.USER_CONTAINER,
    USER_CONTAINER_PORT: process.env.USER_PORT,
    NFT_CONTAINER_NAME: process.env.NFT_CONTAINER,
    NFT_CONTAINER_PORT: process.env.NFT_PORT,
    CONTAINER_PORT_GRPC: process.env.CONTAINER_PORT_GRPC,
    CONTAINER_NAME_GRPC: process.env.CONTAINER_NAME_GRPC,
    // USER: {
    //   CONTAINER_NAME: process.env.USER_CONTAINER_NAME,
    //   PORT_NUMBER: process.env.USER_PORT_NUMBER,
    // },
  },
  MYSQLDB: {
    HOST: process.env.DB_HOST || 'localhost',
    DATABASE_NAME: process.env.DB_NAME || 'kkvNft',
    USERNAME: process.env.DB_USERNAME || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'admin123',
  },
  SESSION: {
    SECRET: process.env.SESSION_SECRET,
  },
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET,
    ISSUER: process.env.JWT_ISSUER,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN, // default 30 days
  },
  TOKEN: {
    EXPIRY_TIME: parseInt(process.env.DB_TOKEN_EXPIRY_TIME || '30'),
    EMAIL_VERIFICATION_EXPIRY: parseInt(
      process.env.DB_TOKEN_EMAIL_VERIFICATION_EXPIRY || '7'
    ),
  },
  NODE_ENV: process.env.NODE_ENV,
  API: {
    ID: process.env.API_ID,
    SPEC: process.env.API_SPEC,
    LOG_LEVEL: process.env.API_LOG_LEVEL || 'trace',
    REQUEST_LIMIT: process.env.API_REQUEST_LIMIT || 1024 * 1024 * 100,
    ENABLE_RESPONSE_VALIDATION: process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION,
  },
  NFT: {
    CONTAINER_NAME: process.env.NFT_CONTAINER_NAME,
    PORT_NUMBER: process.env.NFT_PORT_NUMBER,
  },
  USER: {
    CONTAINER_NAME: process.env.USER_CONTAINER_NAME,
    PORT_NUMBER: process.env.USER_PORT_NUMBER,
  },
  WHITE_LIST_DOMAINS: [
    process.env.PROD_DOMAIN,
    process.env.PROD_ADMIN_DOMAIN,
    process.env.STAGE_DOMAIN,
    process.env.STAGE_ADMIN_DOMAIN,
    process.env.LOCAL_DOMAIN,
    process.env.LOCAL_DOMAIN2,
  ],
  IMAGEKIT_URL: process.env.IMAGE_KIT_URL,
  S3: {
    S3_REGION: process.env.REGION,
    S3_BUCKET: process.env.BUCKET,
  },
  ADMIN: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_USER_ID: process.env.ADMIN_USERID,
    ADMIN_FULL_NAME: process.env.ADMIN_FULL_NAME,
    ADMIN_SUPER_ADMIN:process.env.ADMIN_COUNT ?? 1
  },
  CREATOR_NAME: process.env.CREATOR_NAME,
  // GRPC: {
  //   USER_CONTAINER_NAME: process.env.USER_CONTAINER_NAME,
  //   USER_CONTAINER_PORT: process.env.USER_PORT_NUMBER,
  //   NFT_CONTAINER_NAME: process.env.NFT_CONTAINER_NAME,
  //   NFT_CONTAINER_PORT: process.env.NFT_PORT_NUMBER,
  //   CONTAINER_PORT_GRPC: process.env.CONTAINER_PORT_GRPC,
  //   CONTAINER_NAME_GRPC: process.env.CONTAINER_NAME_GRPC,
  //   // USER: {
  //   //   CONTAINER_NAME: process.env.USER_CONTAINER_NAME,
  //   //   PORT_NUMBER: process.env.USER_PORT_NUMBER,
  //   // },
  // },
};
