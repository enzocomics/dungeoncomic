import clsx from "clsx"

export default async function ComicLayoutUI({
	children,
	comic_slug
}: {
	children: React.ReactNode
	comic_slug?: string
}) {
	return <div className={clsx(
		// Temporary CSS
		"p-4",
		"border",
		"border-orange-500",
		"border-dashed",
	)}>
		<h3 className={clsx(
			// Temporary CSS
			"font-display",
			"text-2xl",
		)}>Comic Layout</h3>
		<strong>get the `comic_slug` in layout</strong>: {comic_slug} <br />
		{children}
	</div>
}