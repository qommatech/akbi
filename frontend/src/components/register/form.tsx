import { Link } from "@tanstack/react-router";

export const RegisterForm = () => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div className="mb-4">
                <h1 className="text-2xl">Welcome!</h1>
            </div>
            <form className="flex flex-col w-3/4 gap-y-2">
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    className="px-4 py-2 border border-gray-300 rounded-full"
                    required
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="px-4 py-2 border border-gray-300 rounded-full"
                    required
                />
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    className="px-4 py-2 border border-gray-300 rounded-full"
                    required
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="px-4 py-2 border border-gray-300 rounded-full"
                    required
                />
                <input
                    type="password"
                    name="confirmation_password"
                    id="confirmation_password"
                    placeholder="Confirmation Password"
                    className="px-4 py-2 border border-gray-300 rounded-full"
                    required
                />
                <button className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600">
                    Register
                </button>
            </form>
            <hr className="w-3/4 my-4" />
            <p className="text-sm">Have an account?</p>

            <Link
                to="/login"
                className="block w-3/4 px-4 py-2 mt-2 text-center text-blue-500 border border-gray-300 rounded-full hover:bg-gray-100"
            >
                Login
            </Link>
        </div>
    );
};
