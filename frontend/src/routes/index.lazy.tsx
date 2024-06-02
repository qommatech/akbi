import { createLazyFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/home/sidebar";
import { Navbar } from "../components/home/navbar";
import { Posts } from "../components/home/posts";
import { Recommendations } from "../components/home/recommendations";
import { Chats } from "../components/chat/chats";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <>
            <Navbar />
            <div className="flex justify-center w-screen py-4">
                <div className="grid w-3/4 grid-cols-4 gap-x-4">
                    <div>
                        <Sidebar />
                    </div>
                    <div className="col-span-2">
                        <Posts />
                    </div>
                    <div className="">
                        <Recommendations />
                    </div>
                </div>
            </div>
            <Chats />
        </>
    );
}
