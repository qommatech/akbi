import { createLazyFileRoute } from "@tanstack/react-router";
import { LoginBanner } from "../components/login/banner";
import { LoginForm } from "../components/login/form";

export const Route = createLazyFileRoute("/login")({
    component: Login,
});

function Login() {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="grid w-3/4 mx-auto overflow-hidden bg-white md:grid-cols-2 h-3/4 rounded-3xl">
                <LoginBanner />
                <LoginForm />
            </div>
        </div>
    );
}
