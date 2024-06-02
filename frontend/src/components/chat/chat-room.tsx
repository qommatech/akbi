import { useRef, useState } from "react";
import {
    ChevronDownIcon,
    PaperAirplaneIcon,
    XMarkIcon,
} from "@heroicons/react/16/solid";
import { motion } from "framer-motion";
import { ChatRoomCard } from "./chat-room-card";
import { cn } from "../../utils/cn";

export const ChatRoom = ({ id, name, messages, onClose }) => {
    const listRef = useRef(null);

    const [isShow, setIsShow] = useState(false);

    const toggle = () => setIsShow((prev) => !prev);

    return (
        <motion.div
            className="w-1/3 pr-4 rounded-t-lg pointer-events-auto"
            initial={{
                translateY: 384 + 64,
            }}
            animate={{
                translateY: isShow ? 0 : 384 + 64,
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
                <h4>{name}</h4>
                <div className="flex gap-2">
                    <motion.div
                        initial={{
                            rotate: isShow ? 180 : 0,
                        }}
                        animate={{
                            rotate: isShow ? 180 : 0,
                        }}
                        whileHover={{
                            rotate: 180,
                        }}
                    >
                        <ChevronDownIcon className="w-4" />
                    </motion.div>
                    <button className="rounded-full hover:bg-blue-100">
                        <XMarkIcon
                            className="w-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(id);
                            }}
                        />
                    </button>
                </div>
            </button>
            <div
                className="overflow-y-scroll bg-gray-100 border-l border-r h-96"
                ref={listRef}
            >
                <ul>
                    {messages.map(({ content, type }, i) => {
                        return (
                            <ChatRoomCard
                                key={`chat-card-${i}`}
                                type={type}
                                content={content}
                                name={name}
                            />
                        );
                    })}
                </ul>
            </div>
            <div className="flex items-center h-16 gap-2 p-2 bg-white">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full"
                />
                <button>
                    <PaperAirplaneIcon className="w-12 text-blue-500" />
                </button>
            </div>
        </motion.div>
    );
};
