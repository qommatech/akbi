export const ChatCard = () => {
    return (
        <li className="flex gap-2 px-4 py-2 border-t hover:bg-gray-100/50">
            <img
                src="https://github.com/shadcn.png"
                alt="@gvstang"
                className="h-12 rounded-full"
            />
            <div className="flex flex-col w-full gap-2">
                <span className="text-sm font-semibold">
                    Riyandi Imran Nugraha
                </span>
                <span className="text-xs text-gray-600">Mal</span>
            </div>
        </li>
    );
};
