# Stariver · 个人作品展示网站

网络工程 2026 届毕业生。用个人网站代替传统简历——4 个核心项目可在线体验，AI 蒸馏体可实时对话。

**线上地址：** https://private-portfolio-ngyl.vercel.app/#projects（替换为你的实际域名）

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 + React 19 + TypeScript |
| 样式 | Tailwind CSS + 自定义 CSS 变量 |
| 动画 | GSAP + ScrollTrigger（3D 翻转 / 扑克牌扇形散开） |
| AI 接口 | DeepSeek API（流式 SSE） |
| 部署 | Vercel（自动 CI/CD） |

---

## 页面模块

### Hero 首屏
全屏科技感标题 + 打字机副标题 + 核心身份关键词。

### 技能卡片
- **硬核认证**：MIIT(工信部)网络信息安全工程师 + 人工智能综合能力认定 + CET-4
- **前后端与交付**：微信小程序、React/Next.js、React Native/Expo、Node.js
- **实战经验**：企业实习 + 库存系统维护 + 小程序迭代
- **兴趣方向**：全栈工程化 + IT 技术支持 + 网络安全防御

### 时间线
4 个节点按时间轴展示成长轨迹：
1. **2022-2024** — MIIT 认证 + 底层内功积累
2. **2025-2026** — 全栈项目交付（热火锅系统 + 心相近优化）
3. **2026** — 企业实习（库存 / 运维 / 小程序迭代）
4. **未来 / 当下** — 进军全栈开发与 IT 技术支持

### 项目画廊（核心展示）

4 张扑克牌式卡片，支持点击散开 → 翻转展开：

| 项目 | 技术栈 | 亮点 |
|---|---|---|
| 热火锅全栈系统 | Node.js / Express / MySQL / 小程序 | 点餐库存行级锁、后台管理 |
| 心相近 · 校园论坛 | 微信小程序 / WebP / 敏感词过滤 | 资源缩减 40%+、多级权限 |
| Stariver 蒸馏体 | Next.js / DeepSeek / GSAP | AI 面试助手 + 邀请码鉴权 |
| AI 日程助手 APP | React Native / Expo / Jest | 跨端 APP、41 测试用例通过 |

- 卡片背面：项目名 + 标签 + **GitHub 链接按钮**
- 卡片正面（翻转后）：左右分栏详情 + AI 蒸馏体对话面板

---

## 本地运行

```powershell
npm install
npm run dev        # http://localhost:3000
```

## 部署

推送到 GitHub 后 Vercel 自动部署。需在 Vercel 后台配置环境变量：

| Key | Value |
|---|---|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key |

---

## 项目结构

```
├── app/
│   ├── api/agent/route.ts    # DeepSeek SSE 流式接口
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── global/site-header.tsx
│   └── sections/
│       ├── hero-section.tsx           # 首屏
│       ├── skills-grid.tsx            # 技能卡片
│       ├── experience-timeline.tsx    # 时间线
│       ├── project-gallery.tsx        # 项目画廊（核心）
│       └── site-footer.tsx            # 页脚
├── lib/
│   └── persona.ts          # AI 蒸馏体系统提示词
└── package.json
```

---

## 设计理念

- **代替简历**：HR 不需要下载 PDF，打开链接就能看到项目、技能和 AI 互动。
- **展示交付力**：不是死板的列表，每个项目都能翻转展开看详情，有链接的直接跳转 GitHub。
- **AI 蒸馏体**：把真实履历蒸馏成可对话的智能体，HR 可以问任何关于技术能力和项目经验的问题，蒸馏体会如实作答并主动规避隐私。
- **隐私安全**：蒸馏体严格遵循安全边界——不透露身份信息、凭证、服务器 IP，被诱导时以终端阻断话术拒绝。
