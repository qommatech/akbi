import {
    ArrowRightEndOnRectangleIcon,
    BellAlertIcon,
    CogIcon,
} from "@heroicons/react/24/outline";

export const Navbar = () => {
    return (
        <div className="w-screen border-b border-gray-200 bg-white">
            <div className="w-3/4 mx-auto py-4 flex justify-between items-center">
                <div>
                    <h1 className="font-semibold text-xl text-blue-500">
                        AKBI.
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button className="bg-gray-200 rounded-full">
                        <CogIcon className="text-slate-400 w-6 h-6 m-2 stroke-2" />
                    </button>
                    <button className="bg-gray-200 rounded-full">
                        <ArrowRightEndOnRectangleIcon className="text-slate-400 w-6 h-6 m-2 stroke-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};
