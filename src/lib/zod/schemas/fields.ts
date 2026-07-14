import { z } from "zod"

/**----------------------------------- */
// SCHEMA - EMAIL FORMAT
export const zCheckEmail = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	// Preprocess: transform data before validation
	z.preprocess(
		// if the field is blank, treat it as undefined
		(value) => (value === "" ? undefined : value),
		z
			.string({ error: t("errors.input-blank") })
			.email({ error: t("errors.email-invalid") }),
	)

/**----------------------------------- */
// SCHEMA - PASSWORD VALIDATION ON LOGIN
export const zCheckPassword = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	// Preprocess: transform data before validation
	z.preprocess(
		// if the field is blank, treat it as undefined
		(value) => (value === "" ? undefined : value),
		z.string({ error: t("errors.password-invalid") }),
	)

/**----------------------------------- */
// SCHEMA - PASSWORD VALIDATION ON CREATION
export const zCheckPasswordCreation = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	// Preprocess: transform data before validation
	z.preprocess(
		// if the field is blank, treat it as undefined
		(value) => (value === "" ? undefined : value),
		z
			.string({ error: t("errors.password-invalid") })
			// password requirements:
			// - at least 7 characters
			// - at least 1 lowercase and 1 uppercase letter
			// - at least 1 number and 1 special character
			.min(7, t("errors.password-too-short"))
			.regex(/[a-z]/, t("errors.password-minimum-lowercase"))
			.regex(/[A-Z]/, t("errors.password-minimum-uppercase"))
			.regex(/\d/, t("errors.password-minimum-numbers"))
			.regex(/[^A-Za-z0-9]/, t("errors.password-minimum-special")),
	)

/**----------------------------------- */
// SCHEMA - CONFIRM PASSWORD FORMAT
export const zConfirmPassword = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	// Preprocess: transform data before validation
	z.preprocess(
		// if the field is blank, treat it as undefined
		(value) => (value === "" ? undefined : value),
		z
			.string({ error: t("errors.password-invalid") })
			.min(7, t("errors.password-too-short")),
	)
