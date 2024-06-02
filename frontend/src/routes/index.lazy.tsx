import { createLazyFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/home/sidebar";
import { Navbar } from "../components/home/navbar";
import { Posts } from "../components/home/posts";
import { Recommendations } from "../components/home/recommendations";
import { Chats } from "../components/chat/chats";
import { SidebarLoader } from "../components/home/sidebar-loader";
import { useTimeout } from "usehooks-ts";
import { useState } from "react";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    const [isLoading, setIsLoading] = useState(true);
    useTimeout(() => setIsLoading(false), 2000);

    return (
        <>
            <Navbar />
            <div className="flex justify-center w-screen py-4">
                <div className="container grid w-full grid-cols-1 mx-auto md:grid-cols-3 lg:grid-cols-4 lg:w-3/4 gap-x-4">
                    <div className="flex-col hidden md:flex gap-y-4">
                        {isLoading ? <SidebarLoader /> : <Sidebar />}

                        <div className="block lg:hidden">
                            <Recommendations />
                        </div>
                    </div>
                    <div className="col-span-2 px-2 md:px-0">
                        <Posts />
                    </div>
                    <div className="hidden lg:block">
                        <Recommendations />
                    </div>
                </div>
            </div>
            <Chats />
        </>
    );
}
