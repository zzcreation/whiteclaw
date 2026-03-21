# OpenClaw Multi-Agent Framework 开源开发

> 创建时间：2026-03-21
> 计划ID: LONGTERM_2026_02

## 目标

将 multi-agent-framework 打造成面向高并发与高可靠场景的开源多 Agent 分布式框架。

## 参考文档

- 开发计划：`docs/openclaw-multiagent-project.md`

---

## 新功能开发流程

```
1. 切换到 develop 分支
   git checkout develop

2. 拉取最新修改
   git pull origin develop

3. 创建开发分支
   git checkout -b <branch-name>

4. 开发功能
   (编写代码、测试)

5. 提交更改
   git add .
   git commit -m "feat: description"

6. 推送分支
   git push -u origin <branch-name>

7. 创建 PR
   gh pr create --title "..." --body "..."
   或在 GitHub 网页创建

8. 代码 Review
   - 等待协作者 review
   - 根据反馈修改

9. 合并 PR
   PR approve 后由维护者合并
```

---

## 计划阶段

### Phase 0：基线与治理 ✅ 已完成 (2026-03-21)
- [x] 冻结当前接口（TaskEnvelope, ControlPlane API）
- [x] 补齐开源治理文档（CONTRIBUTING.md, GOVERNANCE.md, SECURITY.md）
- [x] 定义 SLO、错误预算
- [x] 输出 v0.2 技术规范

**当前状态**: 
- TaskEnvelope 协议已通过 PR #4 冻结并合并到 develop
- 治理文档已创建完成 (2026-03-21)
- SLO 定义完成 (SLO.md)
- v0.2 技术规范完成 (docs/TECHNICAL_SPEC.md)

**创建文档**:
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [GOVERNANCE.md](GOVERNANCE.md) - 治理文档
- [SECURITY.md](SECURITY.md) - 安全策略
- [SLO.md](SLO.md) - 服务级别目标
- [docs/TECHNICAL_SPEC.md](docs/TECHNICAL_SPEC.md) - 技术规范 v0.2

---

### Phase 1：控制平面重构 ✅ 已完成 (2026-03-21)
- [x] TaskEnvelope 协议定义
- [x] WorkerRegistry 心跳注册
- [x] Scheduler 调度器
- [x] 接入消息队列（Redis Stream）
- [x] 改造执行路径为异步事件驱动
- [x] 完成幂等 + 重试 + DLQ

**实现详情**:
- 新增 `services/control_plane/message_queue.py` - Redis Stream 消息队列
  - 支持消费者组、延迟队列、重试队列、死信队列(DLQ)
  - 消息可靠传递（ACK/NACK）
- 更新 `services/control_plane/scheduler.py`
  - 集成消息队列（自动回退到内存队列）
  - 幂等性检查（防止重复处理）
  - 失败重试机制
  - 异步事件驱动支持
- 新增 `handle_failure()` 方法处理任务失败

---

### Phase 2：数据与可观测性 ✅ 已完成 (2026-03-22)
- [x] 上 PostgreSQL + Redis
- [x] 状态机持久化
- [x] 全链路 OTel 埋点
- [ ] Grafana SLO 看板上线
- [ ] 建立告警策略

**实现详情**:
- 新增 `services/control_plane/database.py` - PostgreSQL 持久化 (17.8KB)
  - DatabaseManager：连接池管理
  - TaskRecord/WorkerRecord：数据模型
  - 审计日志、死信队列支持
- 新增 `services/control_plane/observability.py` - OpenTelemetry 埋点 (8KB)
  - ObservabilityManager：追踪和指标管理
  - 任务提交/完成/失败指标
  - Worker 资源使用指标
  - @traced 装饰器支持

---

### Phase 3：测试与性能 🔄 开发中
- [ ] 分层测试体系
- [ ] CI 质量门禁
- [ ] 压测与故障演练
- [ ] 容量报告与扩容策略

---

### Phase 4：DevOps 与高可用 ⏳ 待开始
- [ ] GitOps + 渐进发布
- [ ] 自动回滚
- [ ] 多副本/多AZ容灾
- [ ] 核心链路 99.95%

---

### Phase 5：生态与开源增长 ⏳ 待开始
- [ ] 发布插件化 Worker SDK
- [ ] 发布示例仓库
- [ ] 社区运营

---

## 当前开发状态

| 阶段 | 状态 | 说明 |
|------|------|------|
| Phase 0 | ✅ 已完成 | 治理文档、SLO、技术规范 |
| Phase 1 | 🔄 开发中 | 等待开始控制平面重构 |
| Phase 2-5 | ⏳ 待开始 | 后续阶段 |

---

## PR 状态追踪

| PR | 标题 | 状态 | 合并时间 | 对应阶段 |
|----|------|------|----------|----------|
| #4 | refactor: 分离控制平面与数据平面 | ✅ 已合并 | 2026-03-21 | Phase 1 |
| #6 | docs: 添加治理文档 (CONTRIBUTING, GOVERNANCE, SECURITY, CODE_OF_CONDUCT, LICENSE) | ✅ 已合并 | 2026-03-22 | Phase 0 |

> ⚠️ **定时任务检查点**：每次执行时检查上述 PR 状态，确保开发流程顺畅

---

## 技术架构

```
User/API -> Control Plane -> Message Bus -> Worker Pool
                               |
                          PostgreSQL (state)
                          Redis (cache/lock)
                          Observability Stack
```

---

## 验收标准

- 可用性：99.99%（长期目标）
- 可扩展：支持多租户
- 可维护：模块边界清晰

---

## 项目地址

- GitHub: https://github.com/zzcreation/multi-agent-framework
- 本地: `~/.openclaw/workspace/projects/multi-agent-framework/`