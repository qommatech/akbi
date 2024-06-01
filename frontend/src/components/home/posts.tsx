import { PlusIcon } from "@heroicons/react/16/solid";
import { PostCard } from "./post-card";

export const Posts = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="p-4 border border-gray-200 rounded-xl bg-white flex flex-col gap-2 relative">
                <textarea
                    placeholder="Type your ideas!"
                    className="border border-gray-100 rounded-lg py-2 px-4 min-h-36 max-h-96"
                />
                <button className="flex absolute bottom-0 right-0 m-8 bg-blue-500 rounded-full text-white px-4 py-2 text-sm items-center gap-2">
                    <PlusIcon className="w-4" />
                    Post
                </button>
            </div>
            <hr className="my-2" />
            {[...Array(10)].map((_, i) =>
                i === 0 ? (
                    <PostCard
                        key={`post-${i}`}
                        name="You"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Exercitationem consectetur natus labore autem ipsa
                dolores veniam aut, beatae at distinctio ea animi
                ratione maxime delectus atque? Recusandae atque velit
                deserunt."
                        username="gvstang"
                        time="2hrs ago"
                    />
                ) : (
                    <PostCard
                        key={`post-${i}`}
                        name="Abi Al-Qhafari"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quam eveniet temporibus asperiores delectus quis animi ipsa est modi fugiat, tempora officia aspernatur! Eaque tenetur repudiandae laboriosam illum illo velit?"
                        username="alqhafari"
                        time="2hrs ago"
                    />
                )
            )}
        </div>
    );
};
