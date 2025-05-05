import "dotenv/config";
import type { AddressInfo } from "node:net";
import { clerkClient, clerkPlugin, getAuth } from "@clerk/fastify";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import { logger } from "./utils/logger";

const prisma = new PrismaClient();
const server = Fastify({
	logger: logger,
});

server.register(clerkPlugin);

server.get("/users", async (req, reply) => {
	const users = await prisma.user.findMany();
	reply.send(users);
});

server.get("/", (req, reply) => {
	reply.send({ hello: "wasup!" });
});

server.get("/protected", async (req, reply) => {
	try {
		const { userId } = getAuth(req);

		if (!userId) {
			return reply.code(401).send({ error: "User not found" });
		}

		const user = userId ? await clerkClient.users.getUser(userId) : null;

		return reply.send({ message: "User authenticated successfully", user });
	} catch (err) {
		server.log.error(err);
		return reply.code(500).send({ error: "Failed to authenticate user" });
	}
});

const start = async () => {
	try {
		await server.listen({
			port: (process.env.PORT || 3000) as number,
		});
		server.log.info(
			`Server is now listening on port ${(server.server.address() as AddressInfo).port}`,
		);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
