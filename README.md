# Cozy
![Static Badge](https://img.shields.io/badge/-Electron-green?logo=electron&labelColor=%23555&color=%2347848F)

一个使用 [Electron](https://github.com/electron/electron) 构建的客户端，使得用户可以方便地与 [Coze](https://www.coze.com/) 机器人进行对话
## 使用方法
将本项目克隆到本地，进入项目文件夹中，将 `.env.example` 改为 `.env` ，填入你要使用的 `BOT_ID` 和你的 `PERSONAL_ACCESS_TOKEN`。

在终端中进入该项目，输入
```shell
npm install
npm start
```
即可开启对话。

若要打包为可分发文件，可参考 [Electron 官方文档](https://www.electronjs.org/zh/docs/latest/tutorial/%E6%89%93%E5%8C%85%E6%95%99%E7%A8%8B)，本项目提供了基本的打包方法。
```shell
npx electron-forge import
npm run make
```

## 待优化
- [x] 支持 markdown 渲染
- [ ] 支持调整多轮对话数
- [ ] 解决上下滑动时页面溢出的问题（不影响正常使用）
- [ ] 增加一键复制功能
- [x] 支持黑暗模式