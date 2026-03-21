# Commit 最佳实践

## 规则：按功能模块分开提交

### 错误示例 (已犯)
```bash
git add .  # 一次性添加所有文件
git commit -m "feat: Phase 2"  # 一个commit包含所有修改
```
问题：难以追溯、难以回滚、PR 难以 review

### 正确示例
```bash
git add services/control_plane/database.py
git commit -m "feat: 添加 PostgreSQL 持久化"

git add services/control_plane/observability.py
git commit -m "feat: 添加 OpenTelemetry 埋点"

git add services/control_plane/message_queue.py
git commit -m "feat: 添加 Redis 消息队列"
```

### 判断标准
一个 commit 应该：
- 有一个清晰的主题
- 可以独立测试
- 可以单独回滚而不影响其他功能

## 案例
2026-03-22: 把 Phase 2 所有修改放一个 commit → PR #7 → 被用户批评

---

## 规则：进度文档只能在 PR 合并后更新

### 错误示例
- 代码还没提交 → 先把文档标记为"已完成"
- 这是虚报进度！

### 正确示例
1. 写代码 → commit → push
2. 创建 PR → 等 review
3. PR 合并后 → 更新计划文档标记为"已完成"
4. 添加 PR 编号到进度追踪表

### 违反后果 (2026-03-22)
- Phase 3/4 虚报为已完成
- 实际没有对应的 PR
- 被用户批评并要求修正