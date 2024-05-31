import { useEffect, useState } from "react";
import { hc } from "hono/client";
import { RouteType } from "@akbi/backend/src";

const client = hc<RouteType>("http://localhost:3000");

function App() {
    const [message, setMessage] = useState<string | undefined>();

    useEffect(() => {
        const test = async () => {
            const res = await client.index.$get();
            const data = await res.json();

            setMessage(data.message);
        };

        test();
    }, []);

    return message ? <div>{message}</div> : <div>Loading...</div>;
}

export default App;
