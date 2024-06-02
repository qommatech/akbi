import { Player } from "@lottiefiles/react-lottie-player";

export const RegisterBanner = () => {
    return (
        <div className="items-center justify-center hidden w-full h-full bg-white border-r-2 border-dashed md:flex">
            <Player
                src="https://lottie.host/f03ecbc7-a1c3-4646-9b07-c65bde218696/Gvhw2jPTwp.json"
                autoplay
                loop
                className="w-1/2 md:w-3/4"
            />
        </div>
    );
};
