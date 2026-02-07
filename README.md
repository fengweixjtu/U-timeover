# 91岁生日倒计时 Demo

此仓库实现一个从 1972-11-18 12:00 到 2063-11-18 12:00 的精确倒计时，包含登录、离线PWA、数据同步等功能的雏形。界面标注了用户：FENGWEI。

演示数据集与 Seed 方案
- 提供演示数据集示例，便于本地快速演示与开发；演示数据位于 `demos/demo-data.json`。
- 可以使用 Seed 脚本将演示数据写入 Firestore（需要拥有 Firebase 项目的服务帐号）。脚本位于 `scripts/seed-demo.js`，使用前请在同级目录放置服务账户密钥文件 `serviceAccountKey.json`，并通过 `node scripts/seed-demo.js` 执行。
- 也提供示例 JSON 结构，作为导入 Firestore 的参考。

当前为工作区草案版，后续实现将通过补丁提交落地。

部署与后端说明
- 前端部署：前端静态页面托管在 GitHub Pages，构建产物输出到 docs/，gh-pages 分支进行部署。
- 后端自定义部署：后端为自建 Node.js REST API，存储在仓库的 /backend 目录中，演示数据可通过后端脚本 seed-demo.js 写入本地数据文件或远端存储。
- 后端托管建议：可使用 Render、Railway、Vercel 等平台将后端应用部署为独立服务，并通过前端配置的 API_BASE_URL 指向后端端点。
- 安全性：后端需要配置 JWT_SECRET（环境变量），前端通过存储 token 的方式维护会话。
- 构建与部署脚本：GitHub Actions 已提供一个 UI 部署工作流，将自动将前端构建产物发布到 gh-pages；后端部署请参考各自托管平台的 CI/CD 指南。
