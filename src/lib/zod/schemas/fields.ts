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
// SCHEMA - PASSWORD FORMAT
export const zCheckPassword = (
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
