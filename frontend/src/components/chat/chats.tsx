import { useState } from "react";
import { ChatList } from "./chat-list";
import { ChatRoom } from "./chat-room";
import { useTimeout } from "usehooks-ts";

export const Chats = () => (
    <>
        <ChatsDesktop />
    </>
);

const ChatsDesktop = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [chats, setChats] = useState([
        {
            id: 1,
            name: "Riyandi Imran Nugraha",
            messages: [
                {
                    id: 1,
                    content: "Mal",
                    type: 2,
                },
                {
                    id: 2,
                    content: "Kenapa ganteng?",
                    type: 1,
                },
            ],
        },
        {
            id: 2,
            name: "Abi Al-Qhafari",
            messages: [
                {
                    id: 1,
                    content: "Bi",
                    type: 1,
                },
                {
                    id: 2,
                    content: "Oit",
                    type: 2,
                },
                {
                    id: 2,
                    content: "Samndut",
                    type: 1,
                },
            ],
        },
    ]);

    const handleCloseChatRoom = (id: number) => {
        setChats((prev) => prev.filter((chat) => chat.id != id));
    };

    useTimeout(() => setIsLoading(false), 2000);

    return (
        !isLoading && (
            <div className="fixed bottom-0 z-10 hidden w-screen mx-auto pointer-events-none lg:block">
                <div className="flex flex-row-reverse items-end w-3/4 mx-auto">
                    <ChatList />
                    {chats.map((chat, i) => (
                        <ChatRoom
                            key={`chat-room-${i}`}
                            {...chat}
                            onClose={handleCloseChatRoom}
                        />
                    ))}
                </div>
            </div>
        )
    );
};
