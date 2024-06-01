export const Sidebar = () => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="text-center p-8">
                <div className="rounded-full overflow-hidden w-16 mx-auto mb-4">
                    <img src="https://github.com/shadcn.png" alt="@gvstang" />
                </div>
                <h3 className="font-semibold">Farih Akmal Haqiqi</h3>
                <h4 className="text-gray-500 text-sm">@gvstang</h4>
                <div className="grid grid-cols-2 mt-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-blue-500">10</span>
                        <span className="text-sm">Friends</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-blue-500">89</span>
                        <span className="text-sm">Posts</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
