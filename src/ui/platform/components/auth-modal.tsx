import { AuthFooter } from "@/ui/auth/layout";
import AuthModalEffects from "./client/auth-modal";

export default function AuthModal() {
	return <>
		<AuthModalEffects>

			<AuthFooter />
		</AuthModalEffects>
	</>
}