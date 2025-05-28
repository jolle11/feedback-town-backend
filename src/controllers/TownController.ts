import type { FastifyReply, FastifyRequest } from "fastify";
import {
	TownAlreadyExistsError,
	TownNotFoundError,
	TownService,
} from "../services/TownService.js";
import type {
	CreateTownInput,
	TownParamsInput,
	UpdateTownInput,
} from "../validators/TownSchemas.js";

const townService = new TownService();

export class TownController {
	async getTownById(
		request: FastifyRequest<{ Params: TownParamsInput }>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const town = await townService.getTownById(id);
			if (!town) {
				return reply.code(404).send({ message: "Town not found" });
			}
			return reply.code(200).send(town);
		} catch (error: unknown) {
			if (error instanceof TownNotFoundError) {
				return reply.code(404).send({ message: error.message });
			}
			request.log.error(
				{ error: error, townId: request.params?.id },
				"Error fetching town",
			);
			return reply.code(500).send({ message: "Internal Server Error" });
		}
	}

	async getTowns(request: FastifyRequest, reply: FastifyReply) {
		try {
			const towns = await townService.getTowns();
			return reply.code(200).send(towns);
		} catch (error: unknown) {
			request.log.error({ error: error }, "Error fetching towns");
			return reply.code(500).send({ message: "Internal Server Error" });
		}
	}

	async createTown(
		request: FastifyRequest<{ Body: CreateTownInput }>,
		reply: FastifyReply,
	) {
		try {
			const newTown = await townService.create(request.body);
			return reply.code(201).send(newTown);
		} catch (error: unknown) {
			if (error instanceof TownAlreadyExistsError) {
				return reply.code(409).send({ message: error.message });
			}
			request.log.error({ error: error }, "Error creating town");
			return reply.code(500).send({ message: "Internal Server Error" });
		}
	}

	async updateTown(
		request: FastifyRequest<{ Params: TownParamsInput; Body: UpdateTownInput }>,
		reply: FastifyReply,
	) {
		try {
			const townParams = request.params;
			const updateData = request.body;

			const updatedTown = await townService.update(townParams, updateData);
			return reply.code(200).send(updatedTown);
		} catch (error: unknown) {
			if (error instanceof TownNotFoundError) {
				return reply.code(404).send({ message: error.message });
			}
			request.log.error({ error: error }, "Error updating town");
			return reply.code(500).send({ message: "Internal Server Error" });
		}
	}

	async deleteTown(
		request: FastifyRequest<{ Params: TownParamsInput }>,
		reply: FastifyReply,
	) {
		try {
			const townParams = request.params;
			await townService.delete(townParams);
			return reply.code(204).send();
		} catch (error: unknown) {
			if (error instanceof TownNotFoundError) {
				return reply.code(404).send({ message: error.message });
			}
			request.log.error(
				{ error: error, townId: request.params?.id },
				"Error deleting town",
			);
			return reply.code(500).send({ message: "Internal Server Error" });
		}
	}
}
