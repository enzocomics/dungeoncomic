"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// NEXT
import { redirect, useSearchParams } from "next/navigation"
// I18N
import { useTranslations } from "next-intl"
// AUTH + VALIDATION
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { resetPasswordRequestSchema, resetPasswordSubmitSchema } from "@/lib/zod/schemas/pages"
import { requestReset, submitReset } from "./_action"
// UI
import { useChangeStatus } from "@/components/status-message"
import { AuthBody, AuthHeader, AuthLayout } from "@/components/auth-layout"
import { Fieldset, Label } from "@/components/fieldset"
import { Button } from "@/components/button"
import { Input } from "@/components/input"

/** ------------------------------------------------ **
 * RESET PASSWORD PAGE
 */
export default function ResetPasswordPageUI() {
	// TOKEN
	const params = useSearchParams()
	const resetToken = params.get("token")
	// OUTPUT
	return <>
		<AuthLayout>
			{resetToken ? <ResetPasswordForm token={resetToken} /> : <RequestResetForm />}
		</AuthLayout>
	</>
}

/** ------------------------------------------------ **
 * FORM 1 - REQUEST A RESET LINK
 */
function RequestResetForm() {
	// I18N
	const t = useTranslations("auth")
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")
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

	// ON SUCCESSFUL SUBMIT
	useEffect(() => {
		if (lastResult?.status === "success") {
			// STATUS MESSAGE
			setStatus("success", t("pages.reset-password.request-successful"))
		}
	}, [lastResult])

	// OUTPUT
	return <>
		<AuthHeader>
			{t("pages.reset-password.title")}
		</AuthHeader>
		<AuthBody>
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate
			>
				<Fieldset
					className={clsx(
						"space-y-6"
					)}>
					<div>
						<label htmlFor={fields.email.name}>{t("fields.email")}</label>
						<Input
							id={fields.email.name}
							type="email"
							key={fields.email.key}
							name={fields.email.name}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.email as string}
						/>
						<Label htmlFor={fields.email.name} className="font-normal text-red-500">{fields.email.errors}</Label>
					</div>
					<Button
						type="submit"
						color="sky"
						className={clsx(
							"w-full",
						)}
					>{t("pages.reset-password.request")}</Button>
				</Fieldset>
			</form>
		</AuthBody>
	</>
}

/** ------------------------------------------------ **
 * FORM 2 - NEW PASSWORD CREATION
 */
function ResetPasswordForm({ token }: { token: string }) {
	// I18N
	const t = useTranslations("auth")
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")
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

	// ON SUCCESSFUL SUBMIT
	useEffect(() => {
		if (lastResult?.status === "success") {
			// STATUS MESSAGE & REDIRECT
			setStatus("success", t("pages.reset-password.reset-successful"))
			redirect("/login")
		}
	}, [lastResult])

	// OUTPUT
	return <>
		<AuthHeader>{t("pages.reset-password.title")}</AuthHeader>
		<AuthBody>
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate
			>
				<Fieldset
					className={clsx(
						"space-y-6"
					)}>
					<div>
						<Label htmlFor={fields.password.name}>{t("fields.new-password")}</Label>
						<Input
							id={fields.password.name}
							type="password"
							key={fields.password.key}
							name={fields.password.name}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.password as string}
						/>
						<Label htmlFor={fields.password.name} className="font-normal text-red-500">{fields.password.errors}</Label>
					</div>

					<div>
						<Label htmlFor={fields.passwordConfirm.name}>{t("fields.new-password-confirm")}</Label>
						<Input
							id={fields.passwordConfirm.name}
							type="password"
							key={fields.passwordConfirm.key}
							name={fields.passwordConfirm.name}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.passwordConfirm as string}
						/>
						<Label htmlFor={fields.passwordConfirm.name} className="font-normal text-red-500">{fields.passwordConfirm.errors}</Label>
					</div>
					<Button
						type="submit"
						color="sky"
						className={clsx(
							"w-full",
						)}
					>{t("pages.reset-password.submit")}</Button>
					{/* Password Reset Token */}
					<input name="token" type="hidden" value={token} />
				</Fieldset>
			</form>
		</AuthBody>
	</>
}