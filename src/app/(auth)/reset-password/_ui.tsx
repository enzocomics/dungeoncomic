"use client"
/**----------------------------------- */
// NEXT
import { useSearchParams } from "next/navigation"
// I18N
import { useTranslations } from "next-intl"
// AUTH + VALIDATION
import { useActionState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { resetPasswordRequestSchema, resetPasswordSubmitSchema } from "@/lib/zod/schemas/pages"
import { requestReset, submitReset } from "./_action"

/** ------------------------------------------------ **
 * RESET PASSWORD PAGE
 */

export default function ResetPasswordPageUI() {
	// TOKEN
	const resetTokenParam = useSearchParams()
	const resetToken = resetTokenParam.get("token")
	// OUTPUT
	return resetToken ? <ResetPasswordForm /> : <RequestResetForm />
}

function RequestResetForm() {
	// I18N
	const t = useTranslations("auth")

	// VALIDATION
	const [lastResult, action] = useActionState(requestReset, undefined)
	const [form, fields] = useForm({
		// Sync the result with the last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: resetPasswordRequestSchema(t) })
		},

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	// OUTPUT
	return <>
		<h1 className="text-3xl">{t("pages.reset-password.title")}</h1>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
		>
			<div>
				<label htmlFor="email">{t("fields.email")}</label>
				<input
					id="email"
					type="email"
					key={fields.email.key}
					name={fields.email.name}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.email as string}
				/>
				<div>{fields.email.errors}</div>
			</div>
			<button
				type="submit"
			>{t("pages.reset-password.request")}</button>
		</form>
	</>
}

function ResetPasswordForm() {
	// I18N
	const t = useTranslations("auth")

	// VALIDATION
	const [lastResult, action] = useActionState(submitReset, undefined)
	const [form, fields] = useForm({
		// Sync the result with the last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: resetPasswordSubmitSchema(t) })
		},

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})
	return <>
		<h1 className="text-3xl">{t("pages.reset-password.title")}</h1>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
		>
			<div>
				<label htmlFor="password">{t("fields.new-password")}</label>
				<input
					id="password"
					type="password"
					key={fields.password.key}
					name={fields.password.name}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.password as string}
				/>
				<div>{fields.password.errors}</div>
			</div>

			<div>
				<label htmlFor="passwordConfirm">{t("fields.new-password-confirm")}</label>
				<input
					id="passwordConfirm"
					type="password"
					key={fields.passwordConfirm.key}
					name={fields.passwordConfirm.name}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.passwordConfirm as string}
				/>
				<div>{fields.passwordConfirm.errors}</div>
			</div>
			<button
				type="submit"
			>{t("pages.reset-password.submit")}</button>
		</form>
	</>
}