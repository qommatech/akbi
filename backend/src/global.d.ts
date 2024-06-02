import type { Server, ServerWebSocket } from "bun";

declare global {
  var serverInstance: Server;
  var connectedClients: Map<string, ServerWebSocket<any>>;
}

export {};
