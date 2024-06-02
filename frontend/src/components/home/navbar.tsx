import {
    ArrowRightEndOnRectangleIcon,
    CogIcon,
} from "@heroicons/react/24/outline";

export const Navbar = () => {
    return (
        <div className="w-screen bg-white border-b border-gray-200">
            <div className="container flex items-center justify-between px-4 py-4 mx-auto lg:w-3/4 md:px-0">
                <div>
                    <h1 className="text-xl font-semibold text-blue-500">
                        AKBI.
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button className="bg-gray-200 rounded-full">
                        <CogIcon className="w-6 h-6 m-2 stroke-2 text-slate-400" />
                    </button>
                    <button className="bg-gray-200 rounded-full">
                        <ArrowRightEndOnRectangleIcon className="w-6 h-6 m-2 stroke-2 text-slate-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};
