import { useRef, useState } from "react";
import { ChatCard } from "./chat-card";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const ChatList = () => {
    const listRef = useRef(null);

    const [isShow, setIsShow] = useState(false);

    const toggle = () => setIsShow((prev) => !prev);

    return (
        <motion.div
            className="w-1/3 rounded-t-lg pointer-events-auto"
            initial={{
                translateY: 384,
            }}
            animate={{
                translateY: isShow ? 0 : 384,
                transition: {
                    ease: "circInOut",
                },
            }}
        >
            <button
                className={cn(
                    "flex w-full items-center justify-between px-4 py-2 rounded-t-lg hover:cursor-pointer",
                    isShow
                        ? "bg-blue-500 text-white border-none"
                        : "bg-white text-black border"
                )}
                onClick={toggle}
            >
                <h4>Friends</h4>
                <motion.div
                    initial={{
                        rotate: isShow ? 180 : 0,
                    }}
                    animate={{
                        rotate: isShow ? 180 : 0,
                    }}
                >
                    <ChevronDownIcon className="w-4" />
                </motion.div>
            </button>
            <div
                className="overflow-y-scroll bg-white border-l border-r h-96"
                ref={listRef}
            >
                <ul className="hover:cursor-pointer">
                    {[...Array(14)].map((_, i) => (
                        <ChatCard key={`chat-card-${i}`} />
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};
