import { ServerWebSocket, WebSocketHandler } from "bun";
import { saveMessage } from "./utils/saveMessage";
import { ServerData } from ".";
import { fetchMessagesBetweenUsers } from "./utils/fetchMessagesBetweenUsers";

export interface WebSocketData {
    userId: number;
    otherUserId: number;
}

export const connectedClients = new Map<
    string,
    ServerWebSocket<WebSocketData>
>();

export const websocket: WebSocketHandler<ServerData & WebSocketData> = {
    async open(ws) {
        ws.send(
            JSON.stringify({ message: "Websocket connection established 🚀" })
        );

        connectedClients.set(ws.data.userId.toString(), ws);

        try {
            const previousMessages = await fetchMessagesBetweenUsers(
                ws.data.userId,
                ws.data.otherUserId
            );
            ws.send(JSON.stringify(previousMessages));
        } catch (err) {
            ws.send("Error fetching previous messages 😔");
            console.error(`Error fetching previous messages: ${err} 😔`);
        }
    },
    async message(ws, message) {
        try {
            const { userId, otherUserId } = ws.data;
            const parsedMessage = JSON.parse(message as string);
            const { content } = parsedMessage as {
                content: string;
            };
            console.log(`${userId} send message to ${otherUserId}: ${content}`);

            await saveMessage(userId, otherUserId, content);

            const recipientSocket = connectedClients.get(
                otherUserId.toString()
            );

            if (recipientSocket) {
                recipientSocket.send(
                    JSON.stringify({
                        senderId: ws.data.userId,
                        content,
                    })
                );
            }
        } catch (err) {
            console.error(`Error saving message: ${err} 😔`);
        }
    },
    close(ws, code, message) {
        console.log(`User ${ws.data.userId} disconnected 😔`);
    },
};
