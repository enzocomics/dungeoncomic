/**----------------------------------- */
// CONFORM & ZOD LIBRARIES
import { z, ZodObject } from "zod"
import { Intent } from "@conform-to/react"

// ZOD SCHEMAS
import { zCheckUniqueEmail, zCheckUniqueUsername } from "./async"
import {
	zCheckEmail,
	zCheckPassword,
	zCheckPasswordCreation,
	zConfirmPassword,
} from "./fields"

/**----------------------------------- */
// SCHEMA - USER SUGGESTION FORM
export const userSuggestionSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t?: (arg: string) => string,
) =>
	z.object({
		userSuggestion: z.string(),
		pageId: z.string(),
		userId: z.string(),
		slug: z.string(),
	})

/**----------------------------------- */
// SCHEMA - COMMENT FORM

export const userCommentSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t?: (arg: string) => string,
) =>
	z.object({
		content: z.string(),
		pageId: z.string(),
		userId: z.string(),
		// parentCommentId: z.string(),
	})
