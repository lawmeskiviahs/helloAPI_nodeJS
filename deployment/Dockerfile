FROM public.ecr.aws/b4w0x6d4/node:12-alpine

# Create app directory
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .
