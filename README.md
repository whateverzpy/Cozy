# Cozy
一个使用 Electron 构建的客户端，使得用户可以方便地与 Coze 机器人进行对话

## 发送请求
```shell
curl --location --request POST 'https://api.coze.com/open_api/v2/chat' --header 'Authorization: Bearer pat_Z8FMGcId52iiVtdn3UbcBIoC9uqoBms7m6g8UlJWzoBG4Gb6NxBbSaCVrbzCOKnk' --header 'Content-Type: application/json' --header 'Accept: */*' --header 'Host: api.coze.com' --header 'Connection: keep-alive' --data-raw '{"conversation_id": "123","bot_id": "7373205517625884680","user": "29032201862555","query": "你好","stream":true}'
```