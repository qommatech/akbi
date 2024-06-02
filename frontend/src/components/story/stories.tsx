import { useState } from "react";
import { StoriesLoader } from "./stories-loader";
import { useTimeout } from "usehooks-ts";

export const Stories = () => {
    const [isLoading, setIsLoading] = useState(true);

    useTimeout(() => setIsLoading(false), 2000);

    return (
        <div className="overflow-x-scroll rounded-xl">
            <div className="flex gap-4 mb-4">
                {isLoading ? (
                    <StoriesLoader />
                ) : (
                    [...Array(15)].map((_, i) => (
                        <img
                            key={`story-${i}`}
                            src="https://github.com/shadcn.png"
                            className="inline-block bg-gray-200 rounded-full min-w-16 aspect-square"
                        />
                    ))
                )}
            </div>
        </div>
    );
};
