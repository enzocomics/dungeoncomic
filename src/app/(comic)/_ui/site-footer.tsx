import { getSettings } from "@/lib/directus/get-settings"
import { sanitize } from "@/lib/sanitize"
import Icon from "@/styles/icons"
import clsx from "clsx"
import { marked } from "marked"
import { getTranslations } from "next-intl/server"

export default async function Footer() {
	const t = await getTranslations("footer")
	const settings = await getSettings()

	// Variable: Copyright Year
	const platformEstYear = 2026
	const projectEstYear = settings.date_established
		? new Date(settings.date_established).getFullYear()
		: platformEstYear

	const years = projectEstYear > platformEstYear
		// If the platform year is younger than the project year, show a range. Fallback to platform year
		? `${platformEstYear}—${projectEstYear}`
		: platformEstYear

	// Variable: Copyright Message
	// Force markdown links to open in a new window
	marked.use({
		renderer: {
			link({ href, title, tokens }) {
				const text = this.parser.parseInline(tokens);
				const titleAttribute = title
					? ` title="${title}"`
					: "";
				return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttribute}>${text}</a>`;
			},
		},
	})

	const getCopyright = await marked.parse(settings.copyright_message || "")

	// Sanitize AFTER markdown and only allow certain things
	const copyright = sanitize(
		getCopyright,
		{
			ALLOWED_TAGS: ["strong", "b", "em", "i", "del", "s", "u", "br", "img", "a"],
			ALLOWED_ATTR: ["src", "alt", "href", "target", "rel", "title"],
		}
	)

	// Variable: Platform Name
	const platformName = settings.project_name || "Dungeon Construction Co."

	return <footer className={clsx(
		"px-4",
		"py-6",
		"text-xs/normal",
		"text-current/50",
		"font-comic-header",
		"text-center",
		"flex",
		"flex-col",
		"md:flex-row",
		"md:px-8",
		"md:py-6",
		"max-w-6xl",
		"mx-auto",
	)}>
		<span className={clsx(
			"block",
			"max-w-10/12",
			"text-pretty",
			"mx-auto",
			"md:text-left",
			"md:max-w-1/2",
			"md:mx-0"
		)}>
			<span className="inline-block">
				&copy; {years} {platformName}
			</span>
			&nbsp;
			<span id="copyright-text" className={clsx(
				"text-pretty",
			)} dangerouslySetInnerHTML={{ __html: copyright }}>
			</span>
		</span>
		<span className={clsx(
			"flex",
			"place-content-center",
			"items-center",
			"md:ml-auto",
		)}>
			{t("site-built-with")}&nbsp;
			<span className="inline-block">
				<strong className="flex items-center">DungeonComic
					<a href=" https://github.com/enzocomics/dungeoncomic" target="_blank"
						title={t("visit-github")}
						aria-label={t("visit-github")}
						className={clsx(
							"ml-1",
							"active:text-comic-accent-500",
							"transition-all",
							"duration-300",
							"hover:transition-none",
							"hover:text-comic-accent-500",
							"hover:scale-120",
						)}
					>
						<Icon name="github" className={clsx(
							"size-6",
							"inline",
							"items-center",
						)} />
					</a>
				</strong>
			</span>
		</span>
	</footer>
}