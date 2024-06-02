export const PostCardLoader = () => {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
                <div className="w-12 rounded-full aspect-square bg-slate-200" />
                <div className="flex flex-col w-full">
                    <div className="w-1/2 h-3 mb-2 rounded-full bg-slate-200"></div>
                    <div className="w-1/3 h-2 rounded-full bg-slate-200"></div>
                </div>
            </div>
            <div className="text-sm max-h-52 overflow-clip">
                <div className="w-full h-3 mt-4 mb-2 rounded-full bg-slate-200"></div>
            </div>
        </div>
    );
};
