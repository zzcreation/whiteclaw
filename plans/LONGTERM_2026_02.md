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

### Phase 0：基线与治理 ⏳ 等待PR approve合并
- [ ] 冻结当前接口（TaskEnvelope, ControlPlane API）
- [ ] 补齐开源治理文档（CONTRIBUTING.md, GOVERNANCE.md, SECURITY.md）
- [ ] 定义 SLO、错误预算
- [ ] 输出 v0.2 技术规范

**关联 PR**: [#4](https://github.com/zzcreation/multi-agent-framework/pull/4) 已合并

---

### Phase 1：控制平面重构 🔄 开发中
- [x] TaskEnvelope 协议定义
- [x] WorkerRegistry 心跳注册
- [x] Scheduler 调度器
- [ ] 接入消息队列（NAT JetStream / Kafka）
- [ ] 改造执行路径为异步事件驱动
- [ ] 完成幂等 + 重试 + DLQ

**当前状态**: 基础架构已通过 PR #4 合并到 develop

**开发分支**: `pr/refactor` (本地已有)

---

### Phase 2：数据与可观测性 ⏳ 待开始
- [ ] 上 PostgreSQL + Redis
- [ ] 状态机持久化
- [ ] 全链路 OTel 埋点
- [ ] Grafana SLO 看板上线
- [ ] 建立告警策略

---

### Phase 3：测试与性能 ⏳ 待开始
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
| Phase 0 | ⏳ 等待PR approve合并 | 等待上一个阶段 PR 合并后开始 |
| Phase 1 | 🔄 开发中 | PR #4 已合并，基础功能就绪 |
| Phase 2 | ⏳ 待开始 | 依赖 Phase 1 完成 |
| Phase 3-5 | ⏳ 待开始 | 后续阶段 |

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