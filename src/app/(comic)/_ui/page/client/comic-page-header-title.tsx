"use client"
/**----------------------------------- */
// LIBRARIES
import clsx from "clsx"
import Image from "next/image"
import { detailedDate, relativeDate } from "@/lib/dayjs"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
// DATA
import { directusURL } from "@/data/env"
import { getComicPage } from "@/lib/directus/get-comics"
// UI
import Icon from "@/styles/icons"

export function ClientComicPageHeaderTitle({
	page,
	comicDescription,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	comicDescription?: string
}) {
	// PRIMARY VARS
	const comic = page.comic
	const hasBanner = !!comic.banner
	const hasLogo = !!comic.logo
	const hasAuthors = !!comic.authors && comic.authors.length > 0
	return <>
		<div
			className={
				clsx(
					!hasLogo && "p-1.5",
					"flex",
					"justify-center",
					"h-full",
					"relative",
					hasBanner && hasLogo && [
						// "top-4",
						// "md:top-3",
					],
					!hasBanner && hasLogo && [
						// "-top-0.5",
						// "md:top-0",
						""
					],
				)
			}>
			<Popover as="div" className={
				clsx(
					"flex",
					"h-full",
					"justify-center",
					"items-center",
					"font-comic-header",
					!hasLogo && "overflow-hidden",
				)
			}>

				{!hasLogo &&
					<PopoverButton className={clsx(
						"group",
						// Structure
						"relative",
						"flex",
						"max-w-full",
						"justify-center",
						// Spacing
						"z-45",
						// "ml-5",
						"pl-3 pr-1.5",
						"py-2",
						// Functionality
						"cursor-pointer",
						// Appearance'
						"data-open:bg-comic-accent-600",
						"dark:data-open:bg-comic-accent-700",
						"rounded",
						// Hover
						"hover:duration-0",
						"hover:bg-comic-accent-700",
						"active:translate-px",
						"active:bg-comic-accent-900",
						// Transition
						"transition-all",
						"ease-in-out",
						"duration-300",
						// Outline
						"outline-transparent",
						"focus:outline-4",
						"focus:-outline-offset-4",
						"focus:outline-comic-accent-500",
						hasBanner ? [
							"bg-neutral-800/80",
							"dark:bg-neutral-900/80",
						] : [
							"bg-black/50",
						],
					)}>
						<div className={clsx(
							// Structure
							"inline-block",
							"overflow-hidden",
							"text-nowrap",
							"grow",
							// Text
							"text-sm",
							"text-ellipsis",

						)}>
							<span className={clsx(
								"inline",
								"font-semibold",
							)}>
								{comic.title}
							</span>

							{comic.authors && comic.authors.length > 0 &&
								<span className={clsx(
									"hidden",
									"md:inline-block",
									"px-1",
									"text-xs",
									"text-neutral-500",
									"group-hover:duration-0",
									"group-hover:text-white/40",
									"group-active:text-white/40",
									"group-data-open:text-white/40",
									"font-normal",
									"italic",
									// Transition
									"transition-all",
									"ease-in-out",
									"duration-300",
								)}>
									by&nbsp;
									{comic.authors.map((a, index) => {
										let join = comic.authors!.length > 1 ? ", " : ""
										join = index == comic.authors!.length - 2 ? " & " : join
										join = index == comic.authors!.length - 1 ? "" : join
										return <span key={index}>
											<span className={clsx(
												"font-semibold",
												"text-neutral-400",
												"group-hover:duration-0",
												"group-hover:text-white/70",
												"group-active:text-white/70",
												"group-data-open:text-white/70",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
											)}>
												{a.username}
											</span>
											{join}
										</span>
									}
									)}
								</span>
							}
						</div>

						<span className={clsx(
							"relative",
							"size-5",
							"ml-1",
						)}>
							<Icon name="caretDown" className={clsx(
								"size-5",
								"shrink-0",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								"group-hover:duration-0",
								// Diff
								"opacity-100",
								"text-comic-accent-500",
								"group-hover:text-white",

								"group-data-open:opacity-0",
								"group-data-open:rotate-45",
								// "group-data-open:hidden",
							)} />
							<Icon name="xmark" className={clsx(
								"text-white",
								"size-5",
								"p-0.5",
								"shrink-0",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								//
								"absolute",
								"left-0",
								"top-0",
								"opacity-0",
								"-rotate-45",
								"group-hover:duration-0",
								// Diff
								"group-data-open:group-hover:duration-100",
								"group-data-open:opacity-100",
								"group-data-open:rotate-0",
							)} />
						</span>

					</PopoverButton>
				}
				{comic.logo &&
					<PopoverButton className={clsx(
						"group",
						"relative",
						"cursor-pointer",
						"h-full",
						"outline-none",
						"focus:outline-none",
						"active:outline-none",
						!hasBanner && "md:-top-4",
					)}>
						<div className={clsx(
							// "flex",
							"h-full",
							"p-1",
							"group-hover:scale-105",
							"group-hover:duration-0",
							// Transition
							"transition-all",
							"ease-in-out",
							"duration-300",
							"rounded",
							"bg-transparent",
							"outline-transparent",
							"group-data-open:bg-comic-accent-700/80",
							"group-focus:outline-4",
							"group-focus:outline-comic-accent-500",
							"group-focus:outline-offset-2",
						)}>
							<Image
								src={`${directusURL}/assets/${comic.logo.filename_disk}`}
								alt={comic.logo.description || ""}
								width={comic.logo.width || "160"}
								height={comic.logo.height || "120"}
								className={clsx(
									"drop-shadow-black/50",
									"drop-shadow-sm",
									"w-auto",
									"object-contain",
									"h-16",
									// "md:max-h-20",
								)}
							/>
							<Icon name="xmark" className={clsx(
								"absolute",
								"text-white",
								"right-0",
								"top-0",
								"size-4",
								"bg-red-800",
								"p-0.5",
								"rounded",
								"opacity-0",
								"group-data-open:opacity-100",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
							)} />
						</div>
					</PopoverButton>
				}

				<PopoverPanel
					transition className={clsx(
						// Transitions
						"transition-all",
						"ease-in-out",
						"data-closed:opacity-0",
						"data-closed:duration-300",
						"data-closed:top-6",
						"data-closed:scale-90",
						"opacity-100",
						"data-open:duration-none",
						"scale-100",
						// Position
						"absolute",
						"z-50",
						hasLogo ? "top-18" : "top-10",
						// Size & Spacing
						"w-100",
						"max-w-lg",
						"p-2",
						// "rounded-sm",
						"drop-shadow-2xl",
						"drop-shadow-neutral-900/45",
					)}>
					<section className={clsx(
						// Functionality
						"pointer-events-auto",
						// Structure
						"relative",
						"flex",
						"flex-col",
						"gap-2",
						// Size
						"w-full",
						// Spacing
						"mx-auto",
						// Text
						"text-sm",
						"text-base-content",
						// Appearance
						// "rounded-sm",
						"rounded",
						// Colours
						"bg-base-1",
						"dark:bg-base-3",
						"dark:outline",
						"dark:-outline-offset-1",
						"dark:outline-base-5/50",
						// "border",
						// Arrow
						"before:absolute",
						"before:z-10",
						"before:-top-2.5",
						"before:left-1/2",
						"before:-translate-x-1/2",
						"before:h-0 before:w-0",
						"before:border-l-12 before:border-r-12",
						"before:border-t-12",
						"before:border-l-transparent before:border-r-transparent",
						"before:border-t-neutral-100 dark:before:border-t-neutral-800",
						"before:rotate-180"
					)}>
						{/* Comic Info Header */}
						<header className={clsx(
							"flex",
							"justify-center",
							"p-4",
							"gap-x-4",
							"bg-base-2/30",
							"dark:bg-base-2/50",
						)}>
							{page.comic.thumbnail &&
								<Image
									src={`${directusURL}/assets/${page.comic.thumbnail.filename_disk}`}
									alt={page.comic.thumbnail.description ?? ""}
									width={`${page.comic.thumbnail.width}`}
									height={`${page.comic.thumbnail.height}`}
									className={clsx(
										"self-center",
										"block",
										"max-w-20",
										"md:max-w-30",
										"rounded-sm",
										"mr-1",
									)}
								/>

							}
							<div className={clsx(
								// "grow",
								"place-content-center",
								"flex",
								"flex-col",
								page.comic.thumbnail ? "text-left"
									: "text-center",
								"font-comic-header",
							)}>
								<h2 className={clsx(
									"w-full",
									"font-semibold",
									"font-comic-display",
									"text-xl/normal",
									"lg:text-2xl/normal",
									"mb-2",
									// "text-center",
									"text-pretty"
								)}>
									{comic.title}
								</h2>
								<p>
									{hasAuthors &&
										<>
											<span className={clsx(
												"italic",
												"text-xs",
												"text-neutral-500",
												"mb-2",
											)}>
												by&nbsp;
												{comic.authors && comic.authors.map((a, index) => {
													let join = comic.authors!.length > 1 ? ", " : ""
													join = index == comic.authors!.length - 2 ? " and " : join
													join = index == comic.authors!.length - 1 ? "" : join
													return <span key={index}>
														<span className={clsx(
															"font-semibold",
															"text-comic-accent-500",
														)}>
															{a.username}
														</span>
														{join}
													</span>
												}
												)}

											</span>
										</>
									}
								</p>
							</div>
						</header>

						{/* Comic Info Body */}
						<div className={clsx(
							"p-4",
							"font-comic-copy",
							"landscape:max-h-[calc(80vh-200px)]",
							"portrait:max-h-[calc(70vh-200px)]",
							"overflow-auto",
						)}>
							{comic.description &&
								<span className={clsx(
									"text-sm/loose",
								)}
									dangerouslySetInnerHTML={{
										__html: comicDescription || "",

									}}
								/>
							}
						</div>

						<div className={
							clsx(
								"flex",
								"justify-center",
								"p-4",
								"gap-x-1",
								"bg-base-2/30",
								"dark:bg-base-2/50",
							)
						}>
							<span className={clsx(
								"italic",
								"text-xs",
								"text-neutral-500",
							)}>
								Created <time
									dateTime={new Date(comic.date_created).toISOString()}
									title={detailedDate(new Date(comic.date_created))}
									className={
										clsx(
											"font-semibold",
											"cursor-help"
										)
									}>
									{relativeDate(new Date(comic.date_created))}
								</time>
							</span>
							{/* TODO: This only gets the time the COMIC post type was updated. we need to get the date of the latest comic page to be created */}
							{comic.date_updated &&
								<>
									<span className={
										clsx(
											"italic",
											"text-xs",
											"text-neutral-500",
											"font-comic-copy",
										)
									}>
										∙
									</span>
									<span className={clsx(
										"italic",
										"text-xs",
										"text-neutral-500",
										"font-comic-copy",
									)}>
										Last updated <time
											dateTime={new Date(comic.date_updated).toISOString()}
											title={detailedDate(new Date(comic.date_updated))}
											className={
												clsx(
													"font-semibold",
													"cursor-help"
												)
											}>
											{relativeDate(new Date(comic.date_updated))}
										</time>
									</span>
								</>
							}
						</div>
					</section>
				</PopoverPanel>
			</Popover>
		</div >
	</>
}