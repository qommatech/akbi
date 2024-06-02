import { useRef, useState } from "react";
import {
    ChevronDownIcon,
    PaperAirplaneIcon,
    XMarkIcon,
} from "@heroicons/react/16/solid";
import { motion } from "framer-motion";
import { ChatRoomCard, ChatRoomCardProps } from "./chat-room-card";
import { cn } from "../../utils/cn";

export type ChatRoomProps = {
    id: number;
    name: string;
    messages: ChatRoomCardProps[];
    onClose: (id: number) => void;
};

export const ChatRoom = ({ id, name, messages, onClose }: ChatRoomProps) => {
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
            <div
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
                        className={cn(
                            "rounded-full",
                            isShow ? "hover:bg-blue-800" : "hover:bg-gray-100"
                        )}
                        initial={{
                            rotate: isShow ? 180 : 0,
                        }}
                        animate={{
                            rotate: isShow ? 180 : 0,
                        }}
                    >
                        <ChevronDownIcon className="w-4" />
                    </motion.div>
                    <button
                        className={cn(
                            "rounded-full",
                            isShow ? "hover:bg-blue-800" : "hover:bg-gray-100"
                        )}
                    >
                        <XMarkIcon
                            className="w-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(id);
                            }}
                        />
                    </button>
                </div>
            </div>
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
