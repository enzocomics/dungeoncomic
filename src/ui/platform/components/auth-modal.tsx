import { AuthFooter } from "@/ui/auth/layout";
import AuthModalEffects from "./client/auth-modal";

export default function AuthModal({
	public_registration = false
}: {
	public_registration?: Boolean
}
) {
	return <>
		<AuthModalEffects public_registration={public_registration}>
			<AuthFooter />
		</AuthModalEffects>
	</>
}