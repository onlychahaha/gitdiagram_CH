[![Image](./docs/readme_img.png "GitDiagram 首页")](https://gitdiagram.com/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Kofi](https://img.shields.io/badge/Kofi-F16061.svg?logo=ko-fi&logoColor=white)](https://ko-fi.com/ahmedkhaleel2004)

# GitDiagram

将任何GitHub仓库转换为交互式系统设计/架构图，实现可视化，只需几秒钟。

您也可以在任何GitHub URL中将`hub`替换为`diagram`来访问其图表。

## 🚀 功能特点

- 👀 **即时可视化**：将任何GitHub仓库结构转换为系统设计/架构图
- 🎨 **交互性**：点击组件直接导航到源文件和相关目录
- ⚡ **快速生成**：由OpenAI o3-mini提供支持，快速准确地生成图表
- 🔄 **自定义功能**：通过自定义指令修改和重新生成图表
- 🌐 **API访问**：可用于集成的公共API（开发中）

## ⚙️ 技术栈

- **前端**：Next.js、TypeScript、Tailwind CSS、ShadCN
- **后端**：FastAPI、Python、Server Actions
- **数据库**：PostgreSQL（使用Drizzle ORM）
- **AI**：OpenAI o3-mini
- **部署**：Vercel（前端）、EC2（后端）
- **CI/CD**：GitHub Actions
- **分析**：PostHog、Api-Analytics

## 🤔 关于

我创建这个项目是因为我想为开源项目做贡献，但很快发现它们的代码库太庞大，无法手动深入研究，所以这有助于我开始——但它肯定有更多用途！

给定任何公共（或私有！）GitHub仓库，它都会使用OpenAI的o3-mini生成Mermaid.js图表！（之前使用Claude 3.5 Sonnet）

我从文件树和README中提取信息以获取详细信息和交互性（您可以点击组件跳转到相关文件和目录）

这个应用程序的大部分"处理"都是通过提示工程完成的——请参阅`/backend/app/prompts.py`。这基本上是提取和管道化数据和分析，用于更大的动作工作流，最终生成图表代码。

## 🔒 如何为私有仓库生成图表

您可以简单地点击页眉中的"Private Repos"并按照说明提供具有`repo`权限的GitHub个人访问令牌。

您也可以通过以下步骤在本地自行托管此应用程序（后端也是分离的！）。

## 🛠️ 自行托管/本地开发

1. 克隆仓库

```bash
git clone https://github.com/ahmedkhaleel2004/gitdiagram.git
cd gitdiagram
```

2. 安装依赖

```bash
pnpm i
```

3. 设置环境变量（创建.env）

```bash
cp .env.example .env
```

然后使用您的Anthropic API密钥和可选的GitHub个人访问令牌编辑`.env`文件。

4. 运行后端

```bash
docker-compose up --build -d
```

日志可在`docker-compose logs -f`查看
FastAPI服务器将在`localhost:8000`可用

5. 启动本地数据库

```bash
chmod +x start-database.sh
./start-database.sh
```

当提示生成随机密码时，输入yes。
Postgres数据库将在`localhost:5432`的容器中启动

6. 初始化数据库架构

```bash
pnpm db:push
```

您可以使用`pnpm db:studio`查看和与数据库交互

7. 运行前端

```bash
pnpm dev
```

现在您可以在`localhost:3000`访问网站，并编辑`backend/app/routers/generate.py`中的生成函数装饰器中定义的速率限制。

## 贡献

欢迎贡献！请随时提交Pull Request。

## 致谢

感谢[Romain Courtois](https://github.com/cyclotruc)的[Gitingest](https://gitingest.com/)提供灵感和样式

## 📈 速率限制

我目前免费托管它，没有速率限制，尽管这在未来可能会改变。

<!-- 如果您想绕过这些限制，提供了自行托管说明。我还计划添加您自己的Anthropic API密钥输入。

图表生成：

- 每分钟1个请求
- 每天5个请求 -->

## 🤔 未来计划

- 在图表中实现font-awesome图标
- 实现类似star-history.com的嵌入式功能，但用于图表。随着提交的进行，图表也可以逐步更新。
