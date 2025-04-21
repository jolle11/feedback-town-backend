export const logger =
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
		: true;
