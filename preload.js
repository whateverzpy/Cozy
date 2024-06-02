// preload.js
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("env", {
	BOT_ID: process.env.BOT_ID,
	PERSONAL_ACCESS_TOKEN: process.env.PERSONAL_ACCESS_TOKEN,
});
