import { motion } from "framer-motion";

type ButtonPrimaryProps = {
    children: React.ReactNode;
    isLoading: boolean;
    onClick?: () => void;
    type: "submit" | "button";
};

export const ButtonPrimary = ({
    children,
    isLoading,
    type,
    onClick,
}: ButtonPrimaryProps) => {
    return (
        <button
            className="relative px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
            onClick={(e) => {
                // e.preventDefault();
                onClick!();
            }}
            disabled={isLoading}
            type={type}
        >
            <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{
                    duration: 0,
                }}
            >
                {children}
            </motion.span>
            <motion.div
                className="absolute top-0 left-0 flex items-center justify-center w-full h-full gap-2 pointer-events-none"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: isLoading ? 1 : 0,
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
    );
};
