export const RecommendationCard = () => {
    return (
        <div className="p-4 border border-gray-200 rounded-xl bg-white mb-2">
            <div className="flex gap-2 items-center">
                <img
                    src="https://github.com/shadcn.png"
                    alt="@gvstang"
                    className="rounded-full h-12"
                />
                <div className="flex flex-col gap-2 w-full">
                    <span className="font-semibold text-sm">
                        Riyandi Imran Nugraha
                    </span>
                    <div className="flex text-xs text-gray-600 justify-between">
                        <span>@rayaakun</span>
                        <span className="text-blue-500 font-semibold">
                            Add Friend
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
