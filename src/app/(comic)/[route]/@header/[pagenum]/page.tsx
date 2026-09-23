import { ClientComicPageHeaderTitle } from "@/app/(comic)/_ui/page/client/comic-page-header-title";
import { getComicPage } from "@/lib/directus/get-comics";
import { notFound } from "next/navigation";

export default async function Page({
	params
}: {
	params: Promise<{ route: string, pagenum: number }>
}) {

	// GET THE ROUTE PARAMS
	const { route, pagenum } = await params
	const page = await getComicPage(route, pagenum)

	if (!page) notFound()
	return <>
		<ClientComicPageHeaderTitle page={page} />
	</>
}