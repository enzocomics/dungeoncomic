// DayJS Libraries
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import advancedFormat from "dayjs/plugin/advancedFormat"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import updateLocale from "dayjs/plugin/updateLocale"
import timezone from "dayjs/plugin/timezone"

// Extend the dayjs function with the plugins we use
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(updateLocale)

/** ------------------------------------------------ **
 * Reusable Date Display Functions
 ** ------------------------------------------------ **/
export function detailedDate(timestamp: Date) {
	return dayjs(timestamp).format("MMMM D, YYYY @ h:mma z")
}

export function relativeDate(timestamp: Date, fromNow: boolean = false) {
	// return dayjs().to(dayjs(timestamp))
	return dayjs(timestamp).fromNow(fromNow)
}

export function dateNow(timestamp?: Date) {
	const time = !timestamp ? dayjs() : timestamp
	return dayjs(time).format("x")
}
