import Icon from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { PropsWithChildren } from "react"

export default function DashboardComicLayout(props: PropsWithChildren) {
	return <>
		<nav>
			<ul className={clsx(
				"flex",
				"items-center",
				"space-x-2",
				"font-bold",
				"text-base-content/50",
				"mb-6",
			)}>
				<li>
					<Link href="/dashboard" className={clsx(
						"flex",
						"items-center",
					)}>
						<Icon name="house" className={clsx("size-5")} />
						<span className="sr-only">Dashboard Home</span>
					</Link>
				</li>
				<li className={clsx(
					"flex",
					"items-center",
				)}>
					<Icon name="chevronRight" className={clsx(
						"size-4",
						"mr-2",
					)} />
					<span>
						Adventures
					</span>
				</li>
			</ul>
		</nav>
		{props.children}
	</>
}