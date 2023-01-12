/* eslint-disable prettier/prettier */
import { GrpcObject } from '@grpc/grpc-js/build/src/make-client';
import { loadSync } from '@grpc/proto-loader';
import path from 'path';
import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from '@grpc/grpc-js';
import CONFIG from './api/config';
const PROTO_PATH = path.join(__dirname, '../proto/admin.proto');

interface ServerDefinition extends GrpcObject {
  service: any;
}
interface ServerPackage extends GrpcObject {
  [name: string]: ServerDefinition;
}

let packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

let adminProto = loadPackageDefinition(packageDefinition) as ServerPackage;
const server = new Server();

server.addService(adminProto.AdminServices.service, {});

const port = CONFIG.GRPC.CONTAINER_PORT_GRPC
  ? CONFIG.GRPC.CONTAINER_PORT_GRPC
  : 30010;
const host = CONFIG.GRPC.CONTAINER_NAME_GRPC
  ? CONFIG.GRPC.CONTAINER_NAME_GRPC
  : '0.0.0.0';
const uri = `${host}:${port}`;
console.log({ uri });
server.bindAsync(uri, ServerCredentials.createInsecure(), (error: any) => {
  console.log({ error });
  if (!error) {
    console.log(`Server running at adminGRPC ${uri}`);
    server.start();
  }
});
