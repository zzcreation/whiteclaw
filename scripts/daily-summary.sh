#!/bin/bash
# 每日工作日志自动总结脚本
# 执行时间: 每天 23:30

DATE=$(date +%Y-%m-%d)
MEMORY_FILE="/home/zzc/.openclaw/workspace/memory/${DATE}.md"
DOC_TOKEN="X4h4dEWaVoZRWSxvsh4cW5EQnoh"

# 检查当天是否有记录
if [ ! -f "$MEMORY_FILE" ]; then
    echo "No memory file for $DATE, skipping summary."
    exit 0
fi

# 读取当天的工作内容
CONTENT=$(cat "$MEMORY_FILE")

# 提取今日完成部分 (简化处理)
SUMMARY=$(echo "$CONTENT" | grep -A 20 "##" | head -30)

# 获取当前文档内容
CURRENT=$(feishu_doc action=read doc_token="$DOC_TOKEN")

# 构建新内容 - 在最后添加当日总结
# 这里简化处理：直接追加到文档
feishu_doc action=append doc_token="$DOC_TOKEN" content="
## $DATE

$SUMMARY
"

echo "Daily summary for $DATE completed."