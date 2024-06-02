import { PlusIcon } from "@heroicons/react/16/solid";
import { PostCard } from "./post-card";
import { PostCardLoader } from "./post-card-loader";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";

export const Posts = () => {
    const [isLoading, setIsLoading] = useState(true);

    useTimeout(() => {
        setIsLoading(false);
    }, 2000);

    return (
        <div className="flex flex-col gap-2 pb-12">
            <div className="relative flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl">
                <textarea
                    placeholder="Type your ideas!"
                    className="px-4 py-2 border border-gray-100 rounded-lg min-h-36 max-h-96"
                />
                <button className="absolute bottom-0 right-0 flex items-center gap-2 px-4 py-2 m-8 text-sm text-white bg-blue-500 rounded-full">
                    <PlusIcon className="w-4" />
                    Post
                </button>
            </div>
            <hr className="my-2" />
            {isLoading
                ? [...Array(3)].map((_, i) => (
                      <PostCardLoader key={`post-loader-${i}`} />
                  ))
                : [...Array(10)].map((_, i) =>
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
            <PostCardLoader />
        </div>
    );
};
