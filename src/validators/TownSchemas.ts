import { z } from "zod";

const townBaseSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { message: "Town name must be at least 2 characters long" })
		.max(100, { message: "Town name cannot exceed 100 characters" }),
	zipCode: z
		.string()
		.trim()
		.min(3, { message: "Zip code must be at least 3 characters long" })
		.max(10, { message: "Zip code cannot exceed 10 characters" }),
	state: z
		.string()
		.trim()
		.min(4, { message: "State must be at least 2 characters long" })
		.max(50, { message: "State cannot exceed 50 characters" })
		.optional()
		.nullish(),
	country: z
		.string()
		.trim()
		.min(4, { message: "Country must be at least 4 characters long" })
		.max(50, { message: "Country cannot exceed 50 characters" })
		.optional()
		.nullish(),
	population: z
		.number()
		.int({ message: "Population must be an integer" })
		.nonnegative({ message: "Population cannot be negative" })
		.optional()
		.nullish(),
	description: z
		.string()
		.trim()
		.max(1000, { message: "Description cannot exceed 1000 characters" })
		.optional()
		.nullish(),
	website: z
		.string()
		.trim()
		.url({ message: "Invelid website URL format" })
		.optional()
		.nullish(),
});

export const createTownSchema = townBaseSchema;

export const updateTownSchema = townBaseSchema.partial();

// ROUTE PARAMS SCHEMA

export const townParamsSchema = z.object({
	id: z.coerce
		.number({ message: "Town ID must be a number" })
		.int({ message: "Town ID must be an integer" })
		.positive({ message: "Town ID must be a positive number" }),
});

// INFER TYPES

export type CreateTownInput = z.infer<typeof createTownSchema>;
export type UpdateTownInput = z.infer<typeof updateTownSchema>;
export type TownParamsInput = z.infer<typeof townParamsSchema>;

// OPTIONAL OUTPUT SCHEMA

export const townOutputSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	zipCode: z.string(),
	state: z.string(),
	country: z.string(),
	population: z.number(),
	description: z.string(),
	website: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullable(),
});

export type TownOutput = z.infer<typeof townOutputSchema>;
