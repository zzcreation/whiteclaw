# 长期计划

**Trigger:**: 由cron job 发起，每三小时一次

#### 规则
- 所有项目文件夹都放在 `projects/` 下
- 长期计划文件放在 `plans/` 下，文件名格式：`LONGTERM_YYYY_NN.md`
- 长期计划总览在 `LONGTERM_PLANS.md`

#### 执行步骤
1. 读取 ~/.openclaw/workspace/LONGTERM\_PLANS.md 获取所有长期计划列表
2. 遍历每个计划，读取对应的计划文件(plans/xxx.md)
3. 根据该计划文件的"推进步骤"执行
4. 汇报执行结果



# 长期计划总列表

> 最后更新：2026-03-25

## 计划列表

| ID | 名称 | 状态 | 创建时间 | 计划文件 |
|----|------|------|----------|--------|
| LONGTERM_2026_01 | 多 Agent 协作框架 | ✅ 已完成 | 2026-03-18 | plans/LONGTERM_2026_01.md |
| LONGTERM_2026_02 | OpenClaw Multi-Agent Framework 开源开发 | 🔄 进行中 (GitHub Issues) | 2026-03-21 | plans/LONGTERM_2026_02.md |

---

> 详细进度请查看各计划文件或 GitHub: https://github.com/zzcreation/multi-agent-framework/milestones



# 长期计划执行模式（2026-03-18 记录）

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