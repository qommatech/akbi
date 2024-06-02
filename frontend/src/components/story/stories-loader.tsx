export const StoriesLoader = () => (
    <div className="flex gap-4 animate-pulse">
        {[...Array(15)].map((_, i) => (
            <div
                key={`story-${i}`}
                className="inline-block bg-gray-200 rounded-full min-w-16 aspect-square"
            />
        ))}
    </div>
);
