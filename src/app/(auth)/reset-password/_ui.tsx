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
import { AuthBody, AuthHeader, AuthHeaderDescription, AuthHeaderTitle, AuthLayout, AuthNav } from "@/app/(auth)/_ui"
import { Fieldset, Label } from "@/components/fieldset"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Link } from "@/components/link"

/** ------------------------------------------------ **
 * RESET PASSWORD PAGE
 */
export default function ResetPasswordPageUI() {
	// TOKEN
	const params = useSearchParams()
	const resetToken = params.get("token")
	// OUTPUT
	return <>
		{!resetToken ? <RequestResetForm /> : <ResetPasswordForm token={resetToken} />}
	</>
}

/** ------------------------------------------------ **
 * FORM 1 - REQUEST A RESET LINK
 */
function RequestResetForm() {
	// I18N
	const t = useTranslations("auth")
	const n = useTranslations("navigation")
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

		<AuthBody>
			<AuthHeader>
				<AuthHeaderTitle>{t("pages.reset-password.title-verbose")}</AuthHeaderTitle>
				<AuthHeaderDescription>
					<p>{t("pages.reset-password.request-description")}</p>
				</AuthHeaderDescription>
			</AuthHeader>
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
						<Label htmlFor={fields.email.name}>{t("fields.email")}</Label>
						<Input
							id={fields.email.name}
							type="email"
							key={fields.email.key}
							name={fields.email.name}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.email as string}
							errors={fields.email.errors}
						/>
					</div>
					<Button
						type="submit"
						color="primary"
						className={clsx(
							"w-full",
						)}
					>{t("pages.reset-password.request")}</Button>
				</Fieldset>
			</form>
			<AuthNav>
				<Link className="mx-auto text-primary-500" href="/login">&laquo; {n("go-back")}</Link>
			</AuthNav>
		</AuthBody >
	</>
}

/** ------------------------------------------------ **
 * FORM 2 - NEW PASSWORD CREATION
 */
function ResetPasswordForm({ token }: { token: string }) {
	// I18N
	const t = useTranslations("auth")
	const n = useTranslations("navigation")
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
		<AuthBody>
			<AuthHeader>
				<AuthHeaderTitle>{t("pages.reset-password.title-verbose")}</AuthHeaderTitle>
				<AuthHeaderDescription>
					<p>{t("pages.reset-password.reset-description")}</p>
				</AuthHeaderDescription>
			</AuthHeader>
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
							errors={fields.password.errors}
						/>
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
							errors={fields.passwordConfirm.errors}
						/>
					</div>
					<Button
						type="submit"
						color="primary"
						className={clsx(
							"w-full",

						)}
					>{t("pages.reset-password.submit")}</Button>

				</Fieldset>
				{/* Password Reset Token */}
				<input name="token" type="hidden" value={token} />
			</form>
		</AuthBody>
	</>
}