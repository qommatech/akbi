import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

export const LoginForm = () => {
    const [isSubmit, setIssubmit] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div className="absolute bottom-0 py-12 pointer-events-none">
                <Link
                    to="/"
                    className="text-xl font-semibold text-blue-500 pointer-events-auto"
                >
                    AKBI.
                </Link>
            </div>
            <div className="mb-4">
                <h1 className="text-2xl">Hallo!</h1>
            </div>
            <form
                className="flex flex-col w-3/4 gap-y-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    setIssubmit(true);
                }}
                method="POST"
            >
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
                <button
                    className="relative px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                    type="submit"
                >
                    <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isSubmit ? 0 : 1 }}
                        transition={{
                            duration: 0,
                        }}
                    >
                        Login
                    </motion.span>
                    <motion.div
                        className="absolute top-0 left-0 flex items-center justify-center w-full h-full gap-2 pointer-events-none"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: isSubmit ? 1 : 0,
                        }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <motion.svg
                                key={`loading-${i}`}
                                className="w-3 h-3 text-white"
                                viewBox="0 0 24 24"
                                initial={{
                                    scale: 0.5,
                                }}
                                animate={{
                                    scale: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear",
                                    delay: i * 0.1,
                                }}
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="white"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </motion.svg>
                        ))}
                    </motion.div>
                </button>
            </form>
            <hr className="w-3/4 my-4" />
            <p className="text-sm">Don't have an account?</p>
            <Link
                to="/register"
                className="block w-3/4 px-4 py-2 mt-2 text-center text-blue-500 border border-gray-300 rounded-full hover:bg-gray-100"
            >
                Register
            </Link>
        </div>
    );
};
