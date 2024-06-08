import {
    Navigate,
    createLazyFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import { LogoutBanner } from "../components/logout/banner";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";

export const Route = createLazyFileRoute("/logout")({
    component: Logout,
});

function Logout() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useTimeout(() => {
        window.localStorage.clear();
        navigate({ to: "/login" });
        setIsLoading(false);
    }, 5000);

    return isLoading ? (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col text-center gap-y-4">
                <LogoutBanner />
                <span className="text-4xl">Good Bye.</span>
                <span>You'll be redirected, please wait.</span>
            </div>
        </div>
    ) : (
        <Navigate to="/login" />
    );
}
