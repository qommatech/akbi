import { Player } from "@lottiefiles/react-lottie-player";

export const LoginBanner = () => {
    return (
        <div className="flex items-center justify-center w-full h-full bg-white border-r-2 border-dashed">
            <Player
                src="https://lottie.host/6ed4948e-32bd-4b91-a5e1-f81c2f07051e/obXIfYz6gt.json"
                autoplay
                loop
                className="w-3/4"
            />
        </div>
    );
};
