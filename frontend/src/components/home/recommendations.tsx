import { RecommendationCard } from "./recommendation-card";

export const Recommendations = () => {
    return (
        <>
            <div className="mb-2">
                <h1 className="font-semibold text-lg text-gray-700">
                    Recommended for you
                </h1>
            </div>

            {[...Array(3)].map((_, i) => (
                <RecommendationCard key={`recommendation-${i}`} />
            ))}

            <div className="text-center text-xs text-blue-500 font-semibold">
                <a href="#">See more</a>
            </div>
        </>
    );
};
