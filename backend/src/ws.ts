import { ServerWebSocket, WebSocketHandler } from "bun";
import { saveMessage } from "./utils/saveMessage";
import { ServerData } from ".";

export interface WebSocketData {
    userId: number;
    otherUserId: number;
}

export const connectedClients = new Map<
    string,
    ServerWebSocket<WebSocketData>
>();

export const websocket: WebSocketHandler<ServerData & WebSocketData> = {
    open(ws) {
        ws.send(
            JSON.stringify({ message: "Websocket connection established" })
        );

        connectedClients.set(ws.data.userId.toString(), ws);
    },
    async message(ws, message) {
        try {
            const parsedMessage = JSON.parse(message as string);
            const { senderId, receiverId, content } = parsedMessage as {
                senderId: number;
                receiverId: number;
                content: string;
            };

            await saveMessage(senderId, receiverId, content);

            const recipientSocket = connectedClients.get(receiverId.toString());

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
