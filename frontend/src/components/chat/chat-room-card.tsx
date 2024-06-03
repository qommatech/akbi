import { cn } from "../../utils/cn";

export type ChatRoomCardProps = {
    type: number;
    content: string;
    name?: string;
};

export const ChatRoomCard = ({ type, content, name }: ChatRoomCardProps) => {
    return (
        <li
            className={cn(
                "flex gap-2 px-4 py-2",
                type == 1 ? "flex-row-reverse" : "flex-row"
            )}
        >
            <img
                src="https://github.com/shadcn.png"
                alt="@gvstang"
                className="h-12 rounded-full"
            />
            <div className="flex flex-col w-full gap-2">
                <span
                    className={cn(
                        "text-sm font-semibold",
                        type == 1 ? "text-right" : "text-left"
                    )}
                >
                    {type == 1 ? "You" : name}
                </span>
                <span className="p-2 text-xs text-gray-600 bg-white rounded-lg">
                    {content}
                </span>
            </div>
        </li>
    );
};
