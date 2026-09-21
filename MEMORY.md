
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


## Promoted From Short-Term Memory (2026-08-21)

<!-- openclaw-memory-promotion:memory:memory/2026-07-21.md:1:6 -->
- # 2026-07-21 - `projects/zzc/pass_doudou` 在 `main` 提交 `52e2e72 feat: make online rooms resumable` 上首次部署到 Cloudflare Workers。 - 线上地址：`https://pass-doudou.zzcreation2022.workers.dev`；Cloudflare Version ID：`5b4a2d20-45bb-4b49-976e-d2c0af004819`。 - 发布前验证：Vitest 75/75 通过、生产构建通过、Wrangler dry-run 通过。发布后首页返回 200；WebSocket 返回 101，浏览器 smoke 成功加入 `SMOKE-BROWSER` 房间并收到 pong。 - 排查 OpenClaw 2026.7.1 + `openai/gpt-5.6-sol` 在飞书 DM 中每次需要用户再发“继续”的问题：本机日志在 10:31:51、10:40:52、10:54:58 均出现 `codex app-server turn released after terminal dynamic tool result`，随后 Feishu `queuedFinal=false, replies=0`。根因是 Codex harness 对 DM 默认采用 `message_tool_only`，成功的... [score=0.860 recalls=4 avg=0.513 source=memory/2026-07-21.md:1-6]

## Promoted From Short-Term Memory (2026-08-22)

<!-- openclaw-memory-promotion:memory:memory/2026-08-17.md:3:6 -->
- `zzc-cloud-server` 在 Sandbox 完成一次真实 DI20 读卡器 + 实体卡 Golden 全流程。读卡器 `DI20260803000002` 读取原始 UID `20B30E14`，业务十进制 UID `0336507680`；真实 TCP 地址仍为 `39.106.154.140:3205`。未激活卡、未注册设备和 CLOSED 卡都返回 `-1`；成功响应精确为 `DI20_Y_V21_SUC`。现场与 DI20 手册一致：成功为一声短鸣，通用失败为两声并亮红灯，超时为三声。; Golden 正向链路通过：实体卡激活后，真实读卡器触发 vendor-stub `ACCEPTED` 并创建 ACTIVE game session；V2 成绩回调首次 `200 PROCESSED`，相同 payload 重放 `200 ALREADY_PROCESSED`，同 session 不同成绩 `409 ERROR`。最终玩家游戏次数 2、总分 4、评级 A。; Checkout/出片链路通过：两个并发 checkout 收敛到同一 `jobId/resultUrl`，手环进入 `CLOSED`，覆盖率快照 1/1、成绩 4、评级 A；FFmpeg 成功合成 `manual_game_A.mp4`，稳定结果地址正确返回 HTTP 303。Sandbox 当前关闭七牛上传，目标仍为... [score=0.835 recalls=0 avg=0.620 source=memory/2026-08-17.md:3-6]
<!-- openclaw-memory-promotion:memory:memory/2026-08-17.md:7:10 -->
- 前后端回顾后已更新文档：前端 `README.md` 与 `docs/backend-api-plan.md`；后端新增 `docs/physical-reader-golden-2026-08-17.md`，并更新 `docs/backlog.md`、`docs/current-task-checklist.md` 与 Golden README。前端 `npm run verify` 通过（6 个测试文件、11 个测试、构建成功）；statement coverage 48.97%，主 bundle 约 1.66 MB，仍有 Vite 拆包警告。; 回顾确认三个后续事项：①真实设备原实现先查手环、后查 SN，未知设备会被“未激活”掩盖且一次失败最多重复记录三条日志；②DI20 当前协议只能表达成功/通用失败/超时，细分失败码需产品接受现状或协调厂商；③云上传关闭时仍标记 `COMPLETED` 并 303 到不可访问的 `sandbox.invalid`，应提供本地可访问地址或区分 `LOCAL_COMPLETED/PUBLISHED`。; 已在开发机用户目录安装 Eclipse Temurin JDK 17.0.20+8 到 `~/.local/jdks/temurin-17`，并将 `JAVA_HOME/PATH` 持久化到 `~/.bashrc`。仓库 Maven Wrapper 3.9.11 能正确使用 Java 17；安装后后端基线... [score=0.803 recalls=0 avg=0.620 source=memory/2026-08-17.md:7-10]

## Promoted From Short-Term Memory (2026-08-23)

<!-- openclaw-memory-promotion:memory:memory/2026-08-18.md:7:10 -->
- Golden 新增 P0 核心部署断言：未激活 UID 搭配未注册 SN 时先返回 `DEVICE_NOT_REGISTERED`，并且只出现一条结构化拒绝日志。提交 `a53c84f`。; GitLab Pipeline 705 全绿（verify、build-image、deploy-sandbox、sandbox-golden、cleanup）；Golden 全链路成功，`DEVICE_NOT_REGISTERED` 日志恰好 1 条，清理外键错误 0、Redis 结构错误 0。backend、vendor-stub、MySQL、Redis 均 healthy。空素材失败路径仍按设计产生 2 条 `No video snippets to combine` ERROR。; BUG-19 已完成并提交 `2a565b3`：云上传关闭时，本机 FFmpeg 成片改为 `/api/video/{jobId}/media` 可访问地址；接口只按合法 jobId 读取固定输出文件，要求任务为本地 `COMPLETED`，支持 `video/mp4` 和 Range/206。云上传开启时既有七牛逻辑不变。; 后端全量 113 tests 通过。GitLab Pipeline 707 全绿；新版 Sandbox Golden 已实际读取本地 MP4 的字节范围并验证 `ftyp`，不再只检查 303。部署后... [score=0.835 recalls=0 avg=0.620 source=memory/2026-08-18.md:7-10]
<!-- openclaw-memory-promotion:memory:memory/2026-08-18.md:3:6 -->
- 继续处理后端 P0 部署后的 Sandbox Golden。决定不清理 2026-08-17 实体读卡器手测数据：这些数据仍有复盘和下一轮实体卡复验价值；Golden 应适应共享 Sandbox，而不是依赖空库。; Golden 改为按 `vendorBaseUrl=http://vendor-stub:8080` 复用已保留的供应商主机，仅删除自己创建的主机，避免误删手测主机。提交 `9e2c300`。; 日志审计发现 Golden 原先先通过 API 删除点位、后删会话，会触发外键 `DataIntegrityViolation` ERROR，尽管 SQL 兜底后任务仍成功。已调整为先清会话/夹具再走 API 回收，清理外键错误归零。提交 `5638591`。; 日志审计还发现 Lua `cjson` 删除 Redis 视频任务会把共享 JSON 中空数组 `[]` 重编码成 `{}`，导致 `Expected BEGIN_ARRAY but was BEGIN_OBJECT`。已改为 Python JSON 读改写，保留数组/对象类型，缓存结构错误归零。提交 `8b4e541`。 [score=0.803 recalls=0 avg=0.620 source=memory/2026-08-18.md:3-6]
<!-- openclaw-memory-promotion:memory:memory/2026-08-18.md:11:14 -->
- MySQL 权威数据第一批已完成，提交 `3f20035`：Flyway 9.22.3 接管数据库，V1 固化现有 baseline，V2 新建 `player_profiles`、`player_point_records`、`player_selections` 及影片配置/生效配置表，并补会话过期和影片恢复索引；旧 `schema.sql` / 忽略错误的 `schema-upgrade.sql` / 失效旧 V2 已移除。业务读写暂未切换，Redis 仍是玩家和影片配置来源。; 本地 MySQL 8 已分别验证空库执行 V1+V2、已有非空库 baseline 到 V1 后执行 V2、重复启动无迁移，后端 113 tests 全绿。Pipeline 708 全绿；Sandbox 现有非空库日志明确显示 baseline version 1、成功执行 V2 到 version 2，Golden 全链路通过，四个服务 healthy。; MySQL 权威数据第二批已完成，提交 `1f63373`：手环档案、激活状态、状态查询、ACTIVE 校验和关闭切到 `player_profiles`，带乐观版本；Redis 仅同步兼容旧 `GameManager` 的档案镜像。按测试环境数据可重建的决策，不制作历史 Redis 玩家迁移/双写兼容层，现有测试玩家可重新激活。; 本地真实 MySQL 验证首次激活、状态查询、重复激活和数据库记录正常；后端全量 114... [score=0.803 recalls=0 avg=0.620 source=memory/2026-08-18.md:11-14]
<!-- openclaw-memory-promotion:memory:memory/2026-08-18.md:15:18 -->
- MySQL 权威数据第三批已完成并推送，提交 `49e4c0c`：新增 `PlayerProgressService`，将游玩计次/最高分、选择结果及玩家详情、统计、覆盖率、checkout、影片输入统一切到 MySQL 的 `player_point_records` / `player_selections`；Redis 仅保留可丢弃的玩家档案兼容镜像。; 成绩回传的最高分更新与 `game_sessions` 从 `PROCESSING` 条件更新为 `PROCESSED` 已纳入同一 R2DBC 事务；故障注入测试确认会话条件更新失败时成绩同步回滚，避免会话与成绩半成功。; Sandbox Golden 已加入选择展项 fixture、MySQL 次数/最高分/会话断言，并在删除 Redis 玩家镜像后重新查询，验证玩家进度仍可从 MySQL 完整恢复。本地后端全量 118 tests 通过。; GitLab Pipeline 710 已由 `49e4c0c` 触发；截至本次记忆刷新时最终状态尚未可靠确认，下一轮应先检查 verify、build、deploy、Golden、cleanup 及 Sandbox 四服务健康状态后再宣称收口。 [score=0.803 recalls=0 avg=0.620 source=memory/2026-08-18.md:15-18]
<!-- openclaw-memory-promotion:memory:memory/2026-08-18.md:19:19 -->
- MySQL 下一批优先迁移影片序列配置与 active 配置，移除 `SL_CommonData` 的旧全局单键权威状态；随后补关键写失败传播、并发成绩回传/事务回滚、清空 Redis 后成就不变及 Golden Redis 副本丢失恢复测试。 [score=0.803 recalls=0 avg=0.620 source=memory/2026-08-18.md:19-19]

## Promoted From Short-Term Memory (2026-09-05)

<!-- openclaw-memory-promotion:memory:memory/2026-09-04.md:68:71 -->
- Production storage provider is Qiniu. Config: bucket `zzc-mini`, base path `zzc-comfy-cloud/prod`, private CDN `https://cdn.zzcreation.com`, upload endpoint `https://up-z1.qiniup.com` (South China). Qiniu AK/SK are Worker secrets and must never be echoed. Input assets and generated outputs have passed the end-to-end Qiniu flow. R2 remains available for historical assets and Workflow JSON. - MiniMax H3 is integrated as preset v2. Its aspect ratio values now exactly match the ComfyUI `ResolutionSelector` enum, including `16:9 (Widescreen)`. A real MiniMax task succeeded with input PNG and output MP4 stored in Qiniu.... [score=0.855 signals=6 recalls=6 avg=0.769 source=memory/2026-09-04.md:68-71] <!-- trigger: zzc-mini, zzc-comfy-cloud/prod, cdn.zzcreation.com --> <!-- importance: 9 -->
<!-- openclaw-memory-promotion:memory:memory/2026-09-04.md:1:10 -->
- # 2026-09-04 ## zzc-comfy-cloud durable project state - Canonical project path after OpenClaw 2026.8.2 workspace migration: `/home/zzc/.openclaw/workspace/main/projects/zzc/zzc-comfy-cloud`. - The former root workspace was migrated into `workspace/main/`, including `projects/`, memory, skills, artifacts, hidden directories, and the original workspace `.git`. The project and workspace Git history were preserved. A backup of the 8.2-generated empty/default `main` workspace is under `~/.openclaw/backups/workspace-main-migration-20260903-1308/preexisting-main/`.... [score=0.834 signals=6 recalls=6 avg=0.699 source=memory/2026-09-04.md:1-10] <!-- trigger: backup, backups, zzc-comfy-cloud --> <!-- importance: 8 -->
<!-- openclaw-memory-promotion:memory:memory/2026-09-04.md:51:65 -->
- Notable pushed commits in order: `d6f2e29` (MiniMax ratio v2), `62c6b9d` (Qiniu non-secret config), `48d1868` (Qiniu provider switch), `64dc9d2` (Qiniu Base64 padding), `a30edb1` (z1 upload endpoint), `1b73fe1` (connector nested Qiniu upload protocol), `60b57b3` (Qiniu E2E acceptance/backlog), `fa92258` (ordinary accounts), `3c974a4` (task cancel/retry/error UX and polling optimization). - Latest task-operation build passed TypeScript, Web production build, API Vitest 25/25, Go tests, and Windows amd64 cross-compilation. - Latest known Worker version after task operations: `7a9903b1-b7a4-4094-ab31-b4ffd23dc518`.... [score=0.833 signals=6 recalls=6 avg=0.696 source=memory/2026-09-04.md:51-65] <!-- trigger: non-secret, acceptance/backlog, cancel/retry/error --> <!-- importance: 8 -->
