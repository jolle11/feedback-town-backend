"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_config = require("dotenv/config");
var import_fastify = require("@clerk/fastify");
var import_client = require("@prisma/client");
var import_fastify2 = __toESM(require("fastify"), 1);

// src/utils/logger.ts
var logger = process.env.NODE_ENV !== "production" ? {
  transport: {
    target: "pino-pretty",
    options: {
      ignore: "pid,hostname",
      colorize: true
    }
  }
} : true;

// src/index.ts
var prisma = new import_client.PrismaClient();
var server = (0, import_fastify2.default)({
  logger
});
server.register(import_fastify.clerkPlugin);
server.get("/users", async (req, reply) => {
  const users = await prisma.user.findMany();
  reply.send(users);
});
server.get("/", (req, reply) => {
  reply.send({ hello: "wasup!" });
});
server.get("/protected", async (req, reply) => {
  try {
    const { userId } = (0, import_fastify.getAuth)(req);
    if (!userId) {
      return reply.code(401).send({ error: "User not found" });
    }
    const user = userId ? await import_fastify.clerkClient.users.getUser(userId) : null;
    return reply.send({ message: "User authenticated successfully", user });
  } catch (err) {
    server.log.error(err);
    return reply.code(500).send({ error: "Failed to authenticate user" });
  }
});
var start = async () => {
  try {
    await server.listen({
      port: process.env.PORT || 3e3
    });
    server.log.info(
      `Server is now listening on port ${server.server.address().port}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
//# sourceMappingURL=index.js.map
