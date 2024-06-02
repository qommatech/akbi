import { useState } from "react";

type PostCardProps = {
    name: string;
    username: string;
    time: string;
    content: string;
};

export const PostCard = ({ name, username, time, content }: PostCardProps) => {
    const [isTruncated, setIsTruncated] = useState(true);

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2">
                <img
                    src="https://github.com/shadcn.png"
                    alt="@gvstang"
                    className="h-12 rounded-full"
                />
                <div className="flex flex-col">
                    <span className="font-semibold">{name}</span>
                    <div className="flex text-sm text-gray-600 gap-x-2">
                        <span>@{username}</span>
                        <span>|</span>
                        <span>{time}</span>
                    </div>
                </div>
            </div>
            <div className="mt-2 text-sm max-h-52 overflow-clip">
                <div className="flex">
                    <div className={isTruncated ? "truncate" : ""}>
                        {content}
                    </div>
                    {isTruncated && (
                        <button
                            className="block text-blue-500 text-nowrap hover:underline"
                            onClick={() => {
                                setIsTruncated(false);
                            }}
                        >
                            Read more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
