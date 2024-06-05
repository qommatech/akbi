import { saveMessage } from "./utils/saveMessage";
import { fetchMessagesBetweenUsers } from "./utils/fetchMessagesBetweenUsers";
import { decode } from "hono/jwt";
import type { ServerWebSocket } from "bun";

export const connectedClients = new Map<string, ServerWebSocket<any>>();

export const websocketHandler = () => {
  return {
    fetch(req: any, server: any) {
      const url = new URL(req.url);
      if (url.pathname === "/") {
        const token = req.headers.get("token"); // Implement this function based on your logic
        const { payload } = decode(token);
        const userId = payload.id;
        const otherUserId = parseInt(req.headers.get("otherUserId"));
        const success = server.upgrade(req, { data: { userId, otherUserId } });
        if (success) return undefined;
      }

      return new Response("WebSocket upgrade error", { status: 400 });
    },
    websocket: {
      async open(ws: any) {
        console.log(`User ${ws.data.userId} connected`);
        ws.send("Websocket connection established");
        connectedClients.set(ws.data.userId, ws); // Add the client to the map

        try {
          // Fetch and send previous messages between users when a new connection is established
          const previousMessages = await fetchMessagesBetweenUsers(
            ws.data.userId,
            ws.data.otherUserId
          ); // Implement this function based on your database schema
          ws.send(JSON.stringify(previousMessages));
        } catch (error) {
          console.error("Error fetching previous messages:", error);
          ws.send("Error fetching previous messages");
        }
      },
      async message(ws: any, message: any) {
        console.log("Received message:", message);

        try {
          const parsedMessage = JSON.parse(message);
          const { senderId, receiverId, content } = parsedMessage;

          const savedMessage = await saveMessage(senderId, receiverId, content);

          const recipientSocket = connectedClients.get(receiverId);

          if (recipientSocket) {
            recipientSocket.send(
              JSON.stringify({
                senderId: ws.data.userId,
                content,
              })
            );
          }

          ws.send(`Server received and saved: ${content}`);
        } catch (err) {
          console.error("Error saving message:", err);
          ws.send("Error saving message");
        }
      },
      close(ws: any, code: number, reason: string) {
        console.log("WebSocket connection closed", code, reason);
      },
    },
    port: 4000,
  };
};
