import { useState } from "react";
import { RecommendationCard } from "./recommendation-card";
import { RecommendationCardLoader } from "./recommendation-card-loader";
import { useTimeout } from "usehooks-ts";

export const Recommendations = () => {
    const [isLoading, setIsLoading] = useState(true);
    useTimeout(() => setIsLoading(false), 2000);

    return (
        <>
            <div className="mb-2">
                <h1 className="text-lg font-semibold text-gray-700">
                    Recommended for you
                </h1>
            </div>
            {isLoading ? (
                <RecommendationCardLoader />
            ) : (
                [...Array(3)].map((_, i) => (
                    <RecommendationCard key={`recommendation-${i}`} />
                ))
            )}

            <div className="text-xs font-semibold text-center text-blue-500">
                <a href="#">See more</a>
            </div>
        </>
    );
};
