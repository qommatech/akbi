export const RecommendationCard = () => {
    return (
        <div className="p-4 mb-2 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2">
                <img
                    src="https://github.com/shadcn.png"
                    alt="@gvstang"
                    className="h-12 rounded-full"
                />
                <div className="flex flex-col w-full gap-2">
                    <span className="text-sm font-semibold">
                        Riyandi Imran Nugraha
                    </span>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>@rayaakun</span>
                        <button className="font-semibold text-blue-500">
                            Add Friend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
