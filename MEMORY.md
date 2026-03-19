
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

