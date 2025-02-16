import type { AddressInfo } from "node:net";
import Fastify from "fastify";
import dotenv from "dotenv";
import { clerkPlugin, clerkClient, getAuth } from "@clerk/fastify";
import "dotenv/config";

dotenv.config();

const server = Fastify({
	logger:
		process.env.NODE_ENV !== "production"
			? {
					transport: {
						target: "pino-pretty",
						options: {
							ignore: "pid,hostname",
							colorize: true,
						},
					},
				}
			: true,
});

server.register(clerkPlugin, {
	publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
	secretKey: process.env.CLERK_SECRET_KEY,
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
