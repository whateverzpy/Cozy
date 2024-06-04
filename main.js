// main.js
require("dotenv").config();

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1600,
		height: 1000,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"), // 预加载脚本
			contextIsolation: true, // 重要
			enableRemoteModule: false, // 禁用远程模块
			nodeIntegration: false, // 禁用 Node.js 集成
			webSecurity: false, // 禁用 Web 安全策略
		},
	});

	mainWindow.loadFile("index.html");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
