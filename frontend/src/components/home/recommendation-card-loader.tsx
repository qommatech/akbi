export const RecommendationCardLoader = () => {
    return (
        <div className="p-4 mb-2 bg-white border border-gray-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
                <div className="w-16 rounded-full aspect-square bg-slate-200" />
                <div className="flex flex-col w-full gap-2 mt-2">
                    <div className="w-full h-3 mx-auto mb-2 rounded-full bg-slate-200" />
                    <div className="flex justify-between gap-12 text-xs text-gray-600">
                        <div className="w-full h-2 mx-auto mb-2 rounded-full bg-slate-200" />
                        <div className="w-full h-2 mx-auto mb-2 rounded-full bg-slate-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};
