import type { FastifyInstance } from "fastify";
import { TownController } from "../controllers/TownController.js";
import {
	createTownSchema,
	townParamsSchema,
	updateTownSchema,
} from "../validators/TownSchemas.js";

const townController = new TownController();

export async function townRoutes(fastify: FastifyInstance) {
	fastify.get("/towns", {
		handler: townController.getTowns.bind(townController),
	});

	fastify.get("/towns/:id", {
		schema: {
			params: townParamsSchema,
		},
		handler: townController.getTownById.bind(townController),
	});

	fastify.post("/towns", {
		schema: {
			body: createTownSchema,
		},
		handler: townController.createTown.bind(townController),
	});

	fastify.put("/towns/:id", {
		schema: {
			body: updateTownSchema,
		},
		handler: townController.updateTown.bind(townController),
	});

	fastify.delete("/towns/:id", {
		schema: {
			params: townParamsSchema,
		},
		handler: townController.deleteTown.bind(townController),
	});
}
