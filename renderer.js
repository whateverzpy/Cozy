document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("input");
	const sendButton = document.getElementById("send");
	const messages = document.getElementById("messages");
	const BOT_ID = window.env.BOT_ID;
	const PERSONAL_ACCESS_TOKEN = window.env.PERSONAL_ACCESS_TOKEN;
	let chatHistory = [];

	async function sendMessage(query) {
		if (query.trim().toLowerCase() === "/clear") {
			clearChat();
			return;
		}

		const userMessageElement = document.createElement("div");
		userMessageElement.innerHTML = `<strong>User:</strong> ${query}`;
		messages.appendChild(userMessageElement);

		chatHistory.push({
			role: "user",
			content: query,
			content_type: "text",
		});

		const response = await fetch("https://api.coze.com/open_api/v2/chat", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`,
				"Content-Type": "application/json",
				Accept: "*/*",
				Host: "api.coze.com",
				Connection: "keep-alive",
			},
			body: JSON.stringify({
				conversation_id: "123",
				bot_id: BOT_ID,
				user: "29032201862555",
				query: query,
				stream: true,
				chat_history: chatHistory,
			}),
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");

		let done = false;
		let fullMessage = "";
		let buffer = "";
		const botMessageElement = document.createElement("div");
		botMessageElement.innerHTML = `<strong>Bot:</strong> `;
		messages.appendChild(botMessageElement);

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunk = decoder.decode(value, { stream: true });

			buffer += chunk;

			let lines = buffer.split("\n");
			buffer = lines.pop();

			for (const line of lines) {
				if (line) {
					try {
						const data = JSON.parse(line.replace(/^data:/, "").trim());
						if (data.event === "message") {
							if (data.message.type === "follow_up") {
								const followUpQuestionElement = document.createElement("div");
								followUpQuestionElement.innerHTML = `${data.message.content}`;
								followUpQuestionElement.classList.add("related-question");
								followUpQuestionElement.addEventListener("click", () => {
									sendMessage(data.message.content);
								});
								messages.appendChild(followUpQuestionElement);
							} else if (data.message.type === "verbose") {
								continue;
							} else {
								fullMessage += data.message.content;
								botMessageElement.innerHTML = `<strong>Bot:</strong> ${fullMessage}`;
							}
						}
					} catch (e) {}
				}
			}
		}

		if (fullMessage) {
			botMessageElement.innerHTML = `<strong>Bot:</strong> ${fullMessage}`;
			chatHistory.push({
				role: "assistant",
				type: "answer",
				content: fullMessage,
				content_type: "text",
			});

			if (chatHistory.length > 20) {
				chatHistory = chatHistory.slice(chatHistory.length - 20);
			}
		}
	}

	function clearChat() {
		messages.innerHTML = "";
		chatHistory = [];
		const newChatMessageElement = document.createElement("div");
		newChatMessageElement.innerHTML = `<strong>System:</strong> 开始新的对话`;
		messages.appendChild(newChatMessageElement);
	}

	sendButton.addEventListener("click", () => {
		const query = input.value;
		if (query.trim() === "") return;
		input.value = "";
		sendMessage(query);
	});

	// 添加按下回车键发送消息的功能，并且按下Shift+Enter实现换行
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			if (event.shiftKey) {
				// 按下Shift+Enter时换行
				event.preventDefault();
				const start = input.selectionStart;
				const end = input.selectionEnd;
				input.value =
					input.value.substring(0, start) + "\n" + input.value.substring(end);
				input.selectionStart = input.selectionEnd = start + 1;
			} else {
				// 按下Enter时发送消息
				event.preventDefault(); // 防止默认的回车行为（换行）
				sendButton.click();
			}
		}
	});
});
