export const SidebarLoader = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl animate-pulse">
            <div className="p-8 text-center">
                <div className="w-16 mx-auto mb-4 rounded-full aspect-square bg-slate-200" />
                <div className="w-full h-3 mx-auto mb-2 rounded-full bg-slate-200" />
                <div className="w-1/2 h-2 mx-auto mb-2 rounded-full bg-slate-200" />
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="flex flex-col">
                        <div className="w-1/2 h-2 mx-auto mb-2 rounded-full bg-slate-200" />
                        <div className="w-full h-3 mx-auto mb-2 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex flex-col">
                        <div className="w-1/2 h-2 mx-auto mb-2 rounded-full bg-slate-200" />
                        <div className="w-full h-3 mx-auto mb-2 rounded-full bg-slate-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};
