
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

## 长期计划执行模式（2026-03-18 记录）

当用户要求执行长期计划时，采用以下模式：

### 1. 创建进度文档
- 位置：`~/.openclaw/workspace/<项目名>/LONGTERM_PLAN.md`
- 内容：包含计划阶段、检查清单、进度状态

### 2. 配置定时任务
- 使用 OpenClaw 内置 cron：`openclaw cron add`
- 频率：每 3 小时检查一次 (`0 */3 * * *`)
- 任务内容：
  1. 读取 LONGTERM_PLAN.md
  2. 检查进度状态
  3. 如有未完成阶段，继续执行
  4. 更新文档进度
  5. 汇报状态

### 3. Git 版本管理
- 每次重要更新都要 commit
- 保持清晰的提交历史

### 适用场景
- 多阶段框架搭建
- 复杂的系统集成任务
- 需要分步执行的项目

### 示例
- 多 Agent 协作框架长期计划（2026-03-18）

### 长期计划设计规范（2026-03-19）
- 长期计划放在 `~/.openclaw/workspace/LONGTERM_PLANS.md`
- 使用 ID 格式：`LONGTERM_YYYY_NN`（如 LONGTERM_2026_01）
- 例行公事（如每日佛法搜索、每日工作日志）不需要放入长期计划
- 每个长期计划有独立的 `LONGTERM_PLAN.md` 文件
- 设计新长期计划时要更新总列表

---


## Promoted From Short-Term Memory (2026-07-05)

<!-- openclaw-memory-promotion:memory:memory/2026-07-02.md:14:17 -->
- `C:\Users\pc\AppData\Local` 中较大项：Docker `7.6GB`、pip cache `3.6GB`、Feishu `1.6GB`、GitHubDesktop `1.6GB`、Programs `1.6GB`、Google `1.1GB`、OpenAI `559MB`、微信开发者工具 `519MB`。; 剪映 `JianyingPro` 约数 GB：Apps `2.2GB`、`5.9.0.11632` `1.3GB`、User Data Cache `479MB`；Downloads 中 `剪映5.9Windows.zip` `735MB`，Desktop `Assets.zip` `350MB`。; Program Files 较大项：Docker `2.2GB`、Autodesk `1.8GB`、SogouInput `1.4GB`、Microsoft/Common Files 约 `1.5GB` 级别。; `vssadmin` 和 `DISM /AnalyzeComponentStore` 需要管理员权限，普通权限无法查系统还原/组件存储占用。 [score=0.815 recalls=0 avg=0.620 source=memory/2026-07-02.md:14-17]
<!-- openclaw-memory-promotion:memory:memory/2026-07-02.md:7:8 -->
- `net use Z: /delete /y` 也卡住，改为清理保存凭据并重启 Explorer；最终 `net use` 列表为空，`cmdkey` 中不再有 `192.168.110.42` 凭据。; `LanmanWorkstation` 服务重启需要管理员权限，当前非管理员 PowerShell 无法重启。 [score=0.815 recalls=0 avg=0.620 source=memory/2026-07-02.md:7-8]

## Promoted From Short-Term Memory (2026-07-06)

<!-- openclaw-memory-promotion:memory:memory/2026-07-02.md:10:13 -->
- 只读排查 Windows host C 盘占用，未清理/删除 Windows 文件。; C 盘约 `237.54GB`，已用 `235.54GB`，剩余约 `2.00GB`（`0.8%`）。; `C:\hiberfil.sys` 约 `13.7GB`，可通过管理员命令 `powercfg /h off` 释放，但会关闭休眠/快速启动。; WSL 注册表显示 `Ubuntu-E` 在 `E:\HZspace\WSL\Ubuntu`，不在 C 盘；Docker WSL 数据在 C 盘，`C:\Users\pc\AppData\Local\Docker\wsl\data\ext4.vhdx` 约 `7.40GB`。 [score=0.866 recalls=0 avg=0.620 source=memory/2026-07-02.md:10-13]
<!-- openclaw-memory-promotion:memory:memory/2026-07-02.md:3:6 -->
- 排查 Windows 主机访问 `\\192.168.110.42` 在资源管理器中转圈的问题。; WSL 侧 ping 通，TCP `445/139` 均可连。; Windows 侧 `Test-NetConnection 192.168.110.42 -Port 445` 成功，源地址 `192.168.130.29`，接口为以太网。; 发现 Windows 上 `Z:` 映射到 `\\192.168.110.42\ZZC`，状态为 `Reconnecting`；`net view \\192.168.110.42` 和 `dir Z:\` 都会超时/卡住。 [score=0.837 recalls=0 avg=0.620 source=memory/2026-07-02.md:3-6]
<!-- openclaw-memory-promotion:memory:memory/2026-07-03.md:7:9 -->
- `~/.openclaw/workspace/projects/zzc/flappy_doudou`; `~/.openclaw/workspace/projects/zzc/hidong_2048`; 用户明确要求暂时不要处理 `zzc_2048`。 [score=0.815 recalls=0 avg=0.620 source=memory/2026-07-03.md:7-9]

## Promoted From Short-Term Memory (2026-07-07)

<!-- openclaw-memory-promotion:memory:memory/2026-07-03.md:11:14 -->
- 为用户新建 `~/.openclaw/workspace/projects/zzc/gem_merchant_web`，并产出 `PRODUCT_DEVELOPMENT.md`。; 需求：做网页版“宝石商人 / 璀璨宝石”基础版在线对战，原创美术 UI，机制和数值还原，房间码邀请，实时 2-5 真人玩家，无 AI，目标部署到 Cloudflare 类免费服务。; 文档中明确基础版官方支持 2-4 人，5 人作为同机制扩展模式，需要后续平衡测试。; 用户补充确认：UI 需要展示所有桌游公开信息，包括所有玩家预留卡和当前声望；5 人扩展模式普通宝石每色 8 个，贵族卡 6 个。 [score=0.888 recalls=0 avg=0.620 source=memory/2026-07-03.md:11-14]
<!-- openclaw-memory-promotion:memory:memory/2026-07-03.md:3:5 -->
- 参考 Windows host `C:\Users\pc\Downloads\0703` 中的项目立项报告模板，为两个小游戏生成了新的立项文件：; `C:\Users\pc\Downloads\0703\项目立项报告-嗨飞豆豆网页互动小游戏.docx`; `C:\Users\pc\Downloads\0703\项目立项报告-嗨咚2048网页互动小游戏.docx` [score=0.888 recalls=0 avg=0.620 source=memory/2026-07-03.md:3-5]

## Promoted From Short-Term Memory (2026-07-08)

<!-- openclaw-memory-promotion:memory:memory/2026-07-04.md:7:8 -->
- 用户更正 GitHub ID 是 `zzcreation`；已创建公开仓库并推送：`https://github.com/zzcreation/gem_merchant_web`，本地 `main` 跟踪 `origin/main`。; 用户要求“开始下一步”；已为 `gem_merchant_web` 初始化 React + TypeScript + Vite 脚手架，加入第一版桌面原型、`shared/game` 规则模型与 setup、协议类型、Worker 入口、wrangler 配置和 Vitest setup 测试。`npm run build`、`npm run test`、`npm run lint` 均通过；已提交并推送 `feat: scaffold gem merchant app`。 [score=0.861 recalls=0 avg=0.620 source=memory/2026-07-04.md:7-8]
<!-- openclaw-memory-promotion:memory:memory/2026-07-04.md:3:6 -->
- 用户要求把当前项目部署到 GitHub，GitHub ID 提供为 `zzcreation2022`。; 根据 2026-07-03 记录和当前项目目录判断，“当前项目”是 `projects/zzc/gem_merchant_web`。; 已在该目录初始化独立 Git 仓库，提交 `docs: initialize gem merchant project`，分支改为 `main`。; GitHub CLI 当前登录账号是 `zzcreation`；`zzcreation2022` 用户/组织查询和 `gh repo create zzcreation2022/gem_merchant_web` 均返回 404，暂未能创建远程仓库。 [score=0.830 recalls=0 avg=0.620 source=memory/2026-07-04.md:3-6]
