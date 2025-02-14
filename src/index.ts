import type { AddressInfo } from "node:net";
import Fastify from "fastify";
import dotenv from "dotenv";

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

server.get("/", (req, reply) => {
	reply.send({ hello: "wasup!" });
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
