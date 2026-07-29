"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// NEXT.JS
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
// AUTH + VALIDATION
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "@/lib/zod/schemas/pages"
import { register, verify } from "./_action"
// DATA
import { adminContactEmail } from "@/data/env"
// UI
import { useChangeStatus } from "@/components/status-message"

/** ------------------------------------------------ **
 * REGISTER FORM
 */
export default function RegisterPageUI() {
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("auth")
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")
	// NEXTJS
	const router = useRouter()
	// VALIDATION
	const [lastResult, action] = useActionState(register, null)

	// CONFORM
	const [form, fields] = useForm({
		// Sync the result with the last submission
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				// intent provided by `parseWithZod`
				schema: (intent) => registerSchema(t, intent)
			})
		}
	})

	// EFFECT: Run after form submission
	useEffect(() => {
		if (lastResult?.status === "success") {
			// STATUS MESSAGE
			setStatus("success", t("pages.register.verify-account"))
			// Redirect
			router.push("/login")
		}
	}, [lastResult])

	// Get the url search param
	const params = useSearchParams()

	// EFFECT: Verify user's account via urlParam
	const urlVerifyToken = params.get("verify")
	useEffect(() => {
		const verifyRegistration = async () => {
			if (urlVerifyToken) {
				// SERVER ACTION: Send token to CMS
				const response = await verify(urlVerifyToken)
				if (response?.status == "success") {
					// SUCCESS MESSAGE
					setStatus("success", s("account-verified"))
				} else {
					// ERROR MESSAGE
					setStatus(
						"error",
						`${s("types.error").toUpperCase()}: ${response?.reason}`,
						// Description Message with Rich Text & Link
						// Reference: `https://next-intl.dev/docs/usage/translations#rich-text`
						JSON.stringify( // stringify, because we're passing it as a parameter
							s.rich("account-verify-error.message", {
								// map custom Rich Text tag to React Components
								mailtoAdmin: (chunks) => <a href={
									// include custom attribute (that's just another translation)
									s("account-verify-error.mailto", {
										adminEmail: adminContactEmail
									})
								}>
									{chunks}
								</a>
							})
						)
					)
				}
			}
		}
		verifyRegistration()
	},
		[] // Run this effect only one time
	)

	// EXPORT
	return <>
		<h1 className="text-3xl">{t("pages.register.title")}</h1>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
		>
			<div>
				<label htmlFor="email">{t("fields.email")}</label>
				<input
					id={fields.email.name}
					name={fields.email.name}
					key={fields.email.key}
					type="email"
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.email as string}
				/>
				<div>{fields.email.errors}</div>
			</div>
			{/* <div>
				<label htmlFor="username">{t("fields.username")}</label>
				<input
					id={fields.username.name}
					name={fields.username.name}
					key={fields.username.key}
					type="username"
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.username as string}
				/>
				<div>{fields.username.errors}</div>
			</div> */}
			<div>
				<label htmlFor="password">{t("fields.password")}</label>
				<input
					id={fields.password.name}
					name={fields.password.name}
					key={fields.password.key}
					type="password"
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.password as string}
				/>
				<div>{fields.password.errors}</div>
			</div>

			<div>
				<label htmlFor="passwordConfirm">{t("fields.password-confirm")}</label>
				<input
					id={fields.passwordConfirm.name}
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
			>{t("pages.register.submit")}</button>
		</form>
	</>

}