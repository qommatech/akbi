import { createLazyFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/home/sidebar";
import { Navbar } from "../components/home/navbar";
import { Posts } from "../components/home/posts";
import { Recommendations } from "../components/home/recommendations";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <>
            <Navbar />
            <div className="w-screen flex justify-center py-4">
                <div className="w-3/4 grid grid-cols-4 gap-x-4">
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
        </>
    );
}
