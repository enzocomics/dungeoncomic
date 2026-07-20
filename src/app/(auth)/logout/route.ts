/**----------------------------------- */
import { logout } from "./_action"
/** ------------------------------------------------ **
 * LOGOUT ROUTE
 */
export async function GET() {
	await logout()
}
