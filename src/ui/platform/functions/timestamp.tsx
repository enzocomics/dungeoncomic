"use server"
export async function getFullYear(date: string | Date) {
	"use cache"
	return new Date(date).getFullYear()
}