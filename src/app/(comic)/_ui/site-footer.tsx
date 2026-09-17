import Icon from "@/styles/icons"
import clsx from "clsx"

export default async function Footer() {

	return <footer className={clsx(
		"px-4",
		"py-6",
		"md:py-10",
		"text-xs/normal",
		"text-current/50",
		"font-comic-header",
		"block",
		"text-center"
	)}>
		<span className="block">&copy; 2026 Dungeon Construction Co.</span>
		<span className={clsx(
			"inline-block",
			"text-right",
		)}>This site was built with <span className="inline-block"><strong className="flex items-center">DungeonComic
			<a href=" https://github.com/enzocomics/dungeoncomic" target="_blank"
				title="Visit DungeonComic's Github Project Repository"
				aria-label="Visit DungeonComic's Github Project Repository"
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
					"size-5",
					"inline",
					"items-center",

				)} />
			</a>
		</strong>
			</span>
		</span>
	</footer>
}