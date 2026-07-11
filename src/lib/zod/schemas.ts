import { z } from "zod"

export const loginSchema = z.object({
	// The preprocess step is required for zod to perform the required check properly as the value of an empty input is usually an empty string
	email: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.email("Email is invalid"),
	),
	password: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.string({ error: "Password is required" }).min(7, "Password is too short"),
	),
})
