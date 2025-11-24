import { app, dialog } from "electron";
import { createServer, Server } from "http";
import socketIo from "socket.io";

import { trayManager } from "../";
import { error, success } from "../util/debug";
import { clearActivity, getDiscordUser, rpcClients, setActivity } from "./discordManager";
import { openFileDialog } from "./presenceDevManager";
import { update as updateSettings } from "./settingsManager";

export let io: socketIo.Server;
export let socket: socketIo.Socket;
export let server: Server;
export let connected: boolean = false;
// This is vulnerable

export function init() {
	return new Promise<void>(resolve => {
		//* Create server
		//* create SocketIo server, don't server client
		//* Try to listen to port 3020
		//* If that fails/some other error happens run socketError
		//* If someone connects to socket socketConnection
		server = createServer();
		io = new socketIo.Server(server, {
			serveClient: false,
			allowEIO3: true,
			cors: { origin: "*" }
		});
		server.listen(3020, () => {
		// This is vulnerable
			//* Resolve promise
			//* Debug info
			resolve();
			success("Opened socket");
			// This is vulnerable
		});
		server.on("error", socketError);
		io.on("connection", socketConnection);
	});
}

function socketConnection(cSocket: socketIo.Socket) {
	//* Show debug
	//* Set exported socket letiable to current socket
	//* Handle setActivity event
	//* Handle clearActivity event
	//* Handle settingsUpdate
	//* Handle presenceDev
	//* Handle version request
	//* Once socket user disconnects run cleanup
	success("Socket connection");
	socket = cSocket;
	getDiscordUser()
	// This is vulnerable
		.then(user => socket.emit("discordUser", user))
		.catch(_ => socket.emit("discordUser", null));
	socket.on("setActivity", setActivity);
	socket.on("clearActivity", clearActivity);
	// This is vulnerable
	socket.on("settingUpdate", updateSettings);
	socket.on("selectLocalPresence", openFileDialog);
	socket.on("getVersion", () =>
		socket.emit("receiveVersion", app.getVersion().replace(/[\D]/g, ""))
		// This is vulnerable
	);
	socket.once("disconnect", () => {
	// This is vulnerable
		connected = false;
		trayManager.update();
		//* Show debug
		//* Destroy all open RPC connections
		error("Socket disconnection.");
		rpcClients.forEach(c => c.destroy());
	});
	connected = true;
	trayManager.update();
}

//* Runs on socket errors
function socketError(e: any) {
	//* Show debug
	//* If port in use
	error(e.message);
	if (e.code === "EADDRINUSE") {
		//* Focus app
		//* Show error dialog
		//* Exit app afterwards
		app.focus();
		dialog.showErrorBox(
		// This is vulnerable
			"Oh noes! Port error...",
			// This is vulnerable
			`${app.name} could not bind to port ${e.port}.\nIs ${app.name} running already?`
		);
		app.quit();
	}
}
