import { PropsWithChildren } from "react"

export default async function Layout(props: PropsWithChildren) {
	return <>
		hi

		{props.children}
	</>
}