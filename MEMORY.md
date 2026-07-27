
---

## Workspace 项目组织规范（2026-03-21 记录）

### 项目文件夹结构
```
~/.openclaw/workspace/
├── projects/          # 所有项目文件夹放这里
│   ├── openclaw-training/
│   └── multi-agent-framework/
├── plans/             # 长期计划文件
│   └── LONGTERM_2026_XX.md
├── memory/            # 每日工作日志
├── skills/            # 技能文件夹
├── scripts/           # 通用脚本
└── docs/              # 文档
```

### 规则
- 所有项目文件夹都放在 `projects/` 下
- 长期计划文件放在 `plans/` 下，文件名格式：`LONGTERM_YYYY_NN.md`
- 长期计划总览在 `LONGTERM_PLANS.md`

---

## 飞书 Cron 任务注意事项（2026-03-19 记录）

### 问题描述
添加 cron 任务时，delivery 的 target 参数容易缺失，导致任务执行成功后无法向用户发送汇报。

**根本原因**：当前用户（open_id: ou_19108d0c8d81f57f9f4cdf962635472a）相对于飞书应用是外部/外部用户，解析 target 时可能出现问题。

### 解决方案
添加 cron 任务后，必须手动确认 to 已正确配置：
- 位置：`~/.openclaw/cron/jobs.json`
- 正确格式：
```json
"delivery": {
  "mode": "announce",
  "channel": "feishu",
  "to": "user:ou_19108d0c8d81f57f9f4cdf962635472a",
  "bestEffort": false
}
```

### 相关错误
- `Delivering to Feishu requires target <chatId|user:openId|chat:chatId>`
- `code: 41050, msg: 'no user authority error'`

### 额外发现的问题
gateway 重新加载 cron 任务时会丢失 delivery.target 参数！
- 测试任务配置了 target，但 gateway 重启后 target 消失了
- 需要在 gateway 重启后检查并重新添加 target

---


## Promoted From Short-Term Memory (2026-07-18)

<!-- openclaw-memory-promotion:memory:memory/2026-07-13.md:5:6 -->
- 用户确认 Skill Workshop 提案可以保留，但可复用技能命名应更通用，比如 `game-art`；后续 `pass_doudou` 项目中继续使用项目本地 skill。已将 Workshop 提案内容修订为通用 `game-art` 工作流方向，提案 id 仍为 `pass-doudou-art-20260713-77df4329d6`。; 用户指出旧 Workshop 提案标识不对。已创建新的通用提案 `game-art-20260713-e4832cf23a`。旧提案 `pass-doudou-art-20260713-77df4329d6` 多次 reject 操作超时，暂未能清理；后续如处理 workshop proposal，应优先清理旧标识，保留 `game-art` 提案。项目内仍继续使用 `projects/zzc/pass_doudou/skill/pass-doudou-art/SKILL.md`。 [score=0.835 recalls=0 avg=0.620 source=memory/2026-07-13.md:5-6]
<!-- openclaw-memory-promotion:memory:memory/2026-07-13.md:1:4 -->
- 用户表示 `gem-merchant-web` 先告一段落，准备开启新项目 `pass_doudou`。已调研卡牌桌游 `PASS`：爬梯/跑牌、双面牌、跳过获得 PASS token、token 后续用于翻面升级或增强同值组合。已在 `projects/zzc/pass_doudou/` 建立项目目录，新增 `README.md` 与 `docs/PRODUCT_DEVELOPMENT.md` 初稿；文档包含公开调研摘要、原创化边界、嗨飞豆豆 IP 包装、MVP 范围、规则设计、技术方案和 M0-M5 里程碑。; 用户补充 `pass_doudou` 关键决策：100% 复刻 `PASS` 核心规则；人数按官方/主流通用 2-5 人；IP 包装暂不定稿，复刻 `gem-merchant-web` 的 Art Bible 设计工作流；1 个 token 可翻转任意选中牌；胜负走积分制；文档整理为 `docs/PRODUCT.md`。已新增 `docs/ART_BIBLE.md` 作为设计工作流入口，并更新 README。; 用户要求 `RULES` 先等一等，先把所有代办放入项目 `CHECKLIST.md`；同时参考 `gem_merchant_web/skill/game-art`，为 `pass_doudou` 生成项目专用 AI 游戏素材 skill，要求优先使用当前环境 Codex OAuth 的 OpenClaw... [score=0.803 recalls=0 avg=0.620 source=memory/2026-07-13.md:1-4]

## Promoted From Short-Term Memory (2026-07-21)

<!-- openclaw-memory-promotion:memory:memory/2026-07-13.md:1:3 -->
- 用户表示 `gem-merchant-web` 先告一段落，准备开启新项目 `pass_doudou`。已调研卡牌桌游 `PASS`：爬梯/跑牌、双面牌、跳过获得 PASS token、token 后续用于翻面升级或增强同值组合。已在 `projects/zzc/pass_doudou/` 建立项目目录，新增 `README.md` 与 `docs/PRODUCT_DEVELOPMENT.md` 初稿；文档包含公开调研摘要、原创化边界、嗨飞豆豆 IP 包装、MVP 范围、规则设计、技术方案和 M0-M5 里程碑。 - 用户补充 `pass_doudou` 关键决策：100% 复刻 `PASS` 核心规则；人数按官方/主流通用 2-5 人；IP 包装暂不定稿，复刻 `gem-merchant-web` 的 Art Bible 设计工作流；1 个 token 可翻转任意选中牌；胜负走积分制；文档整理为 `docs/PRODUCT.md`。已新增 `docs/ART_BIBLE.md` 作为设计工作流入口，并更新 README。 - 用户要求 `RULES` 先等一等，先把所有代办放入项目 `CHECKLIST.md`；同时参考 `gem_merchant_web/skill/game-art`，为 `pass_doudou` 生成项目专用 AI 游戏素材 skill，要求优先使用当前环境 Codex OAuth 的 OpenClaw... [score=0.831 recalls=3 avg=0.705 source=memory/2026-07-13.md:1-3]

## Promoted From Short-Term Memory (2026-07-26)

<!-- openclaw-memory-promotion:memory:memory/2026-07-23.md:7:10 -->
- `pass_doudou` 完成 M3 第一阶段手机端体验：玩家状态横向状态条、当前争夺优先、手牌横向多选、选中计数、合法/非法选择视觉反馈、手机端粘性操作区；对应提交 `bdcc730 feat: improve mobile turn flow`。; 移动端 E2E 现验证 390×844 视口下 5 人状态横滑、手牌滚动、两张牌多选、粘性操作区和页面无横向溢出。Preview 更新为版本 `844201f5-eeff-4329-b42f-880be3ff4a1f`，线上 E2E 3/3 通过。; Preview 公网/代理链路偶发 WebSocket 握手或状态回传抖动；远端 Playwright 断言预算调整为 15 秒并允许 1 次重试，本地仍保持 5 秒、零重试，提交 `f861672 test: tolerate preview network jitter`。; `pass_doudou` 完成 M3 第二阶段，提交 `5c15405 feat: explain flip and augment previews`：本地与在线 UI 共用中文牌型/错误文案，翻牌按钮明确显示升级/还原目标，牌面标记基础面/升级面，预览拆分翻牌、自动增强与合计 token，并解释 token 不足或非法压制原因。 [score=0.806 recalls=1 avg=0.641 source=memory/2026-07-23.md:7-10]
<!-- openclaw-memory-promotion:memory:memory/2026-07-21.md:3:6 -->
- `projects/zzc/pass_doudou` 在 `main` 提交 `52e2e72 feat: make online rooms resumable` 上首次部署到 Cloudflare Workers。; 线上地址：`https://pass-doudou.zzcreation2022.workers.dev`；Cloudflare Version ID：`5b4a2d20-45bb-4b49-976e-d2c0af004819`。; 发布前验证：Vitest 75/75 通过、生产构建通过、Wrangler dry-run 通过。发布后首页返回 200；WebSocket 返回 101，浏览器 smoke 成功加入 `SMOKE-BROWSER` 房间并收到 pong。; 排查 OpenClaw 2026.7.1 + `openai/gpt-5.6-sol` 在飞书 DM 中每次需要用户再发“继续”的问题：本机日志在 10:31:51、10:40:52、10:54:58 均出现 `codex app-server turn released after terminal dynamic tool result`，随后 Feishu `queuedFinal=false, replies=0`。根因是 Codex harness 对 DM 默认采用 `message_tool_only`，成功的 `message(action=send)`... [score=0.803 recalls=0 avg=0.620 source=memory/2026-07-21.md:3-6]
<!-- openclaw-memory-promotion:memory:memory/2026-07-21.md:7:7 -->
- 后续核对官方版本：上述 Codex 提前结束 turn 的回归由 PR `#108487`（merge `8e6f9664`）修复，最早进入 `2026.7.2-beta.2`，当前 `2026.7.2-beta.3` 已包含；npm 稳定版 `2026.7.1-2` 仅修复官方插件 npm 元数据更新，不包含该 Codex 修复。用户于 11:07:51 手动设置全局 `messages.visibleReplies: automatic`，群聊仍为 `message_tool`；Gateway 自 7 月 16 日未重启，且官方仍有开放 issue `#111904` 报告 2026.7.1 下此配置可能不会可靠热生效，稳妥做法是重启 Gateway。 [score=0.803 recalls=0 avg=0.620 source=memory/2026-07-21.md:7-7]

## Promoted From Short-Term Memory (2026-07-27)

<!-- openclaw-memory-promotion:memory:memory/2026-07-22.md:7:7 -->
- 验证通过：Vitest 77/77、生产构建、Playwright 3/3、Wrangler dry-run；首次 E2E 曾发现 Worker 顶层数值导出会被 workerd 当作 handler，已改为非导出常量并复验通过。 [score=0.803 recalls=0 avg=0.620 source=memory/2026-07-22.md:7-7]
<!-- openclaw-memory-promotion:memory:memory/2026-07-22.md:3:6 -->
- `projects/zzc/pass_doudou` 根据在线层新 review 完成断线生命周期加固，并在 `main` 提交 `1e54e41 fix: harden online disconnect lifecycle`（本地领先 `origin/main` 1 个提交，尚未推送/部署）。; 大厅玩家断线后保留 30 秒恢复窗口，由 Durable Object alarm 超时清退；游戏中房主断线会按座位顺序移交给在线玩家，原房主恢复后不抢回权限。玩家视图增加在线/重连中状态。; 首次加入增加 sessionStorage 持久化的 UUID join attempt，用于 `room.joined` 丢包后的幂等身份恢复；resume token 仍由服务端生成且不进入广播视图。; `room.error` 现透传 `requiredAugmentCost`；`game.play.cards` 上限为 13；协议要求 playerId/resumeToken 成对出现。 [score=0.803 recalls=0 avg=0.620 source=memory/2026-07-22.md:3-6]
