
document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("input");
	const sendButton = document.getElementById("send");
	const messages = document.getElementById("messages");
  const BOT_ID = window.env.BOT_ID;
  const PERSONAL_ACCESS_TOKEN = window.env.PERSONAL_ACCESS_TOKEN;
	let chatHistory = [];

	// 发送消息的函数
	async function sendMessage(query) {
		// 显示用户消息
		const userMessageElement = document.createElement("div");
		userMessageElement.innerHTML = `<strong>User:</strong> ${query}`;
		messages.appendChild(userMessageElement);

		// 更新 chatHistory
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
		let fullMessage = ""; // 用于拼接完整的消息
		let buffer = ""; // 用于存储未处理的部分数据
		const botMessageElement = document.createElement("div");
		botMessageElement.innerHTML = `<strong>Bot:</strong> `; // 先初始化消息元素
		messages.appendChild(botMessageElement);

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunk = decoder.decode(value, { stream: true });

			buffer += chunk; // 将当前块添加到缓冲区

			// 处理缓冲区中的流数据
			let lines = buffer.split("\n");
			buffer = lines.pop(); // 将最后一个部分保留在缓冲区中，防止不完整

			for (const line of lines) {
				if (line) {
					try {
						const data = JSON.parse(line.replace(/^data:/, "").trim());
						if (data.event === "message") {
							if (data.message.type === "follow_up") {
								// 创建可点击的相关问题
								const followUpQuestionElement = document.createElement("div");
								followUpQuestionElement.innerHTML = `<strong>Related Question:</strong> ${data.message.content}`;
								followUpQuestionElement.style.cursor = "pointer";
								followUpQuestionElement.style.color = "blue";
								followUpQuestionElement.addEventListener("click", () => {
									sendMessage(data.message.content);
								});
								messages.appendChild(followUpQuestionElement);
							} else if (data.message.type === "verbose") {
								// 忽略 verbose 类型的消息
								continue;
							} else {
								fullMessage += data.message.content; // 拼接消息内容
								botMessageElement.innerHTML = `<strong>Bot:</strong> ${fullMessage}`; // 实时更新消息元素的内容
							}
						}
					} catch (e) {
						// 忽略解析错误，继续处理剩余数据
					}
				}
			}
		}

		// 确保在流结束后，完整地显示消息
		if (fullMessage) {
			botMessageElement.innerHTML = `<strong>Bot:</strong> ${fullMessage}`;
			// 更新 chatHistory
			chatHistory.push({
				role: "assistant",
				type: "answer",
				content: fullMessage,
				content_type: "text",
			});

			// 保证 chatHistory 只保留最近的 10 轮对话
			if (chatHistory.length > 20) {
				chatHistory = chatHistory.slice(chatHistory.length - 20);
			}
		}
	}

	sendButton.addEventListener("click", () => {
		const query = input.value;
		if (query.trim() === "") return; // 防止发送空消息
		input.value = "";
		sendMessage(query);
	});
});
