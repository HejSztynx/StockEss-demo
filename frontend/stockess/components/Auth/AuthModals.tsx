import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

export default function AuthModals() {
    const {
        showLoginModal,
        showRegisterModal,
        setIsLoggedIn,
        closeModals,
      } = useAuth();

    return (
        <>
            <AuthModal
                mode="login"
                isOpen={showLoginModal}
                onLogIn={() => setIsLoggedIn(true)}
                onClose={closeModals}
            />
            <AuthModal
                mode="register"
                isOpen={showRegisterModal}
                onLogIn={() => {}}
                onClose={closeModals}
            />
        </>
    )
}