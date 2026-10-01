import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
export const NotFoundUI = async () => {
	const t = await getTranslations("404Page")
	return <>
		<h1 className={clsx(
			"px-6",
			"lg:pt-6",
			"max-w-prose",
			"mx-auto",
			"font-platform-display",
			"text-center",
			"text-4xl",
		)}>{t("title")}</h1>
		<p className={clsx(
			"px-6",
			"lg:pt-6",
			"max-w-prose",
			"mx-auto",
		)}>
			<Image src="/img/404.webp"
				width="320"
				height="240"
				alt="A crazy-looking capybara."
			/>
		</p>
		<Link href="/" className={clsx(
			"px-6",
			"lg:pt-6",
			"max-w-prose",
			"mx-auto",
			"font-semibold",
			"font-platform-header",
			"text-red-700",
			"hover:duration-0",
			"hover:text-red-800",
			"dark:text-red-400",
			"dark:hover:text-600",
			"ease-in-out",
			"transition-all",
			"duration-300",
		)}
		>&laquo; {t("return-home")}</Link>
	</>
}