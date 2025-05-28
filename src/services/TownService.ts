import type { Town } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type {
	CreateTownInput,
	TownParamsInput,
	UpdateTownInput,
} from "../validators/TownSchemas";

const prisma = new PrismaClient();

export class TownNotFoundError extends Error {
	constructor(name: string) {
		super(`Town not found: ${name}`);
		this.name = "TownNotFoundError";
	}
}

export class TownAlreadyExistsError extends Error {
	constructor(name: string) {
		super(`Town already exists: ${name}`);
		this.name = "TownAlreadyExistsError";
	}
}

export class TownService {
	async getTownById(id: number): Promise<Town> {
		const town = await prisma.town.findFirstOrThrow({
			where: { id },
		});
		return town;
	}

	async getTowns(): Promise<Town[]> {
		return await prisma.town.findMany();
	}

	async create(data: CreateTownInput): Promise<Town> {
		const town = await prisma.town.findFirst({
			where: { name: data.name, zipCode: data.zipCode },
		});
		if (town) {
			throw new TownAlreadyExistsError(data.name);
		}
		const newTown = await prisma.town.create({ data });
		return newTown;
	}

	async update(id: TownParamsInput, data: UpdateTownInput): Promise<Town> {
		const existingTown = await prisma.town.findFirst({
			where: { id: id.id },
		});

		if (!existingTown) {
			throw new TownNotFoundError(id.id.toString());
		}

		const updatedTown = await prisma.town.update({
			where: { id: id.id },
			data,
		});

		return updatedTown;
	}

	async delete(id: TownParamsInput): Promise<void> {
		const existingTown = await prisma.town.findFirst({
			where: { id: id.id },
		});

		if (!existingTown) {
			throw new TownNotFoundError(id.id.toString());
		}

		await prisma.town.delete({
			where: { id: id.id },
		});
	}
}
