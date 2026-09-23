"use client"
import { LandingPageH1, LandingPageHeader } from "@/app/_ui/page-landing"
import { directusURL } from "@/data/env"
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import clsx from "clsx"
// import { LandingPageLogoImage } from "@/app/_ui/page-landing"

import Image from "next/image"
import { usePathname } from "next/navigation"
import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, forwardRef, PropsWithChildren, RefObject, useEffect, useRef, useState } from "react"

export default function ClientLandingPageHeader({
	comic,
	settings,
	children
}: {
	comic?: Awaited<ReturnType<typeof getComic>>
	settings: Awaited<ReturnType<typeof getSettings>>
	children?: React.ReactNode
}) {
	const logo = comic ? (comic?.logo || null) : settings?.project_logo
	const banner = comic?.banner || settings?.project_banner
	const title = comic?.title || settings?.project_name

	const wrapperRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLImageElement>(null)
	const frameRef = useRef<number | null>(null)

	// EFFECT: Scale down the size of the sticky landing page logo after the user scrolls up
	useEffect(() => {
		// Different breakpoints have different values
		const getResponsiveValues = () => {
			if (window.matchMedia("(min-width: 640px)").matches) {
				// sm
				return {
					maxScroll: 200,
					maxTranslateY: -73,
					scaleDown: 0.47,
				}
			}

			if (window.matchMedia("(min-width: 320px)").matches) {
				// xs
				return {
					maxScroll: 200,
					maxTranslateY: -34,
					scaleDown: 0.47,
				}
			}
			// Mobile
			return {
				maxScroll: 200,
				maxTranslateY: -57,
				scaleDown: 0.31,
			}
		}

		// Initial State of the image or title Runs one time
		const loadImage = () => {
			// Set the opacity to 1. CSS will transition from 0 
			if (imageRef.current && wrapperRef.current) {
				imageRef.current.style.opacity = "1"
			}
		}

		// Update logo position & scale on scroll
		const updateImage = () => {
			const {
				maxScroll,
				maxTranslateY,
				scaleDown
			} = getResponsiveValues()
			const scrollY = window.scrollY
			// const maxScroll = 200

			const progress = Math.min(scrollY / maxScroll, 1)

			// Scale from 1 to 0.5
			const scale = 1 - progress * scaleDown

			// Move up to -70px
			const translateY = progress * maxTranslateY

			if (wrapperRef.current) {
				if (scrollY > 50) {
					wrapperRef.current.classList.remove("duration-400")
					wrapperRef.current.classList.remove("transition-[transform]")
					wrapperRef.current.classList.add("duration-none")
				}

				wrapperRef.current.style.transform = `
          translateY(${translateY}px)
          scale(${scale})
        `

			}

			frameRef.current = null
		}

		const handleScroll = () => {
			// Prevent multiple queued animation frames
			if (frameRef.current === null) {
				frameRef.current = requestAnimationFrame(updateImage)
			}
		}

		window.addEventListener("scroll", handleScroll, { passive: true })

		// Set the initial position
		loadImage()
		updateImage()

		return () => {
			window.removeEventListener("scroll", handleScroll)

			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current)
			}
		}
	}, [])

	return <>
		<div className={clsx(
			"absolute",
			"top-0",
		)}
			id="thing"
		/>
		<LandingPageHeader className={clsx(
		)}>
			{logo &&
				<div
					ref={wrapperRef}
					className={clsx(
						"origin-top",
						"transition-[transform]",
						"duration-400",
						"ease-in-out",
						"w-full",
						"h-full",
						"flex",
						"items-center",
					)}>
					<LandingPageLogo
						ref={imageRef}
						src={`${directusURL}/assets/${logo.filename_disk}`}
						alt={logo.description || ""}
						width={logo.width || "320"}
						height={logo.height || "240"}
						className={clsx(
							"w-auto",
							"object-contain",
							"h-16",
							"transition-opacity",
							"opacity-0",
							"duration-400",
							"ease-in-out",
						)}
					/>
				</div>
			}
			{!logo &&
				<LandingPageH1
					ref={wrapperRef}
					className={clsx(
						// comic?.banner && [
						"text-white",
						"[text-stroke:16px_black",
						"[-webkit-text-stroke:16px_black]",
						"[paint-order:stroke_fill]",
						"drop-shadow-black/50",
						"drop-shadow-md",
						// ],
					)}>
					<span ref={imageRef}>{title}</span>
				</LandingPageH1>
			}
		</LandingPageHeader>
	</>
}

const LandingPageLogo = ({
	ref,
	...props
}: {
	ref: React.Ref<HTMLImageElement>
} & ComponentPropsWithRef<typeof Image>
) => {
	return <Image
		ref={ref}
		{...props}
		className={clsx(
			props.className,
			"drop-shadow-black/50",
			"drop-shadow-lg",
			"block",
			"w-auto",
			"h-full",
			"box-content",
			"object-contain",
			"max-h-30	",
			"md:max-h-none",
		)}
	/>
}