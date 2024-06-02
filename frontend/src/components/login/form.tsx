export const LoginForm = () => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div className="absolute bottom-0 py-12">
                <h1 className="text-xl font-semibold text-blue-500">AKBI.</h1>
            </div>
            <div className="mb-4">
                <h1 className="text-2xl">Welcome!</h1>
            </div>
            <form className="flex flex-col w-3/4 gap-y-2">
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
                <button className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
};
