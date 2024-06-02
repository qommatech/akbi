import { createLazyFileRoute } from "@tanstack/react-router";
import { RegisterBanner } from "../components/register/banner";
import { RegisterForm } from "../components/register/form";

export const Route = createLazyFileRoute("/register")({
    component: Register,
});

function Register() {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="grid w-3/4 mx-auto overflow-hidden bg-white md:grid-cols-2 h-3/4 rounded-3xl">
                <RegisterBanner />
                <RegisterForm />
            </div>
        </div>
    );
}
