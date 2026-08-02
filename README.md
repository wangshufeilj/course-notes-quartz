# M-Link Tech Notebook

连接课程、概念与实践的 Quartz 电子教材网站。

## 本地使用

```powershell
npm ci
Copy-Item .publish.local.example.json .publish.local.json
# 在 .publish.local.json 中登记本机 Obsidian 原稿与课程元数据
npm run publish:notes
npm run preview
```

浏览 `http://localhost:8080` 检查 Manual / Editorial 和亮暗模式。原始 Obsidian 文件不会被修改；本机绝对路径清单 `.publish.local.json` 已被 Git 忽略。

## 日常发布

1. 在 Obsidian 更新私有原稿。
2. 在 `.publish.local.json` 登记或更新讲次信息。
3. 运行 `npm run publish:notes`，脚本会删除图片、规范时间戳链接并校验公式。
4. 运行 `npm run preview` 本地验收。
5. 运行 `npx quartz sync` 推送，GitHub Actions 会自动部署 Pages。

## 内容约定

- 课程页：`content/courses/<course-id>/index.md`
- 讲次页：`content/courses/<course-id>/lesson-XX.md`
- URL 使用稳定英文 slug，页面标题使用中文。
- 公式保留 LaTeX 源码并由 KaTeX 渲染。
- 视频定位链接仅保留 Bilibili BV 地址、`p` 和 `t` 参数。

网站基于 [Quartz v4](https://quartz.jzhao.xyz/) 构建。
