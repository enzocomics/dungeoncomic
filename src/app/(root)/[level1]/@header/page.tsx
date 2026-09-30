import ParallelHeaderUI from "../../_ui/@header/page"

export default async function Level1ParallelHeader({
	params
}: {
	params: Promise<{ level1: string }>
}) {
	const { level1 } = await params
	return <ParallelHeaderUI slug={level1} />
}