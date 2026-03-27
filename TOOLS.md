# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### SSH

- xiaoqi-remote → 192.168.130.33:2222 (WSL2 Ubuntu)
  - 位置: Windows 主机上的 WSL2 Ubuntu
  - Node.js: v22.22.1 (通过 nvm 安装)
  - OpenClaw: 2026.3.13
  - Gateway: lan 模式，端口 18789
  - 端口转发: 2222 (SSH), 18789 (Gateway)

### 远程 Agent 调用

调用 xiaoqi-remote agent 的正确方式：
```bash
ssh -p 2222 zzc@192.168.130.33 "export NVM_DIR=/home/zzc/.nvm && export PATH=/home/zzc/.nvm/versions/node/v22.22.1/bin:\$PATH && openclaw agent --agent xiaoqi-remote --message '任务描述' --timeout 300"
```

**重要提示**：
- 必须使用 `--agent xiaoqi-remote` 而不是 `--agent main`（main 连接了飞书会有其他用途）
- 需要告诉 xiaoqi-remote 使用 exec 工具调用 agent-reach 工具
- agent-reach skill 需要软链接到 xiaoqi-remote agent 的 skills 目录

**Agent Reach 工具**（xiaoqi-remote 上已安装）：
- `curl + jina.ai` - 读取任意网页
- `xreach` - 搜索 Twitter
- `mcporter exa` - 全网语义搜索
- `yt-dlp` - YouTube/B站 视频字幕
- `gh CLI` - GitHub

### Excel 转 PDF（横向+适应一页）

**之前失败的原因：**
1. 用 `libreoffice --headless --convert-to pdf` 而不是 `libreoffice --headless --calc --convert-to pdf`
2. 缺少 `ws.sheet_properties.pageSetUpPr.fitToPage = True`
3. scale 没有设置为 None

**正确步骤：**

```bash
# 1. 用 openpyxl 调整页面设置
python3 << 'EOF'
import openpyxl
from openpyxl.worksheet.page import PageMargins

wb = openpyxl.load_workbook('input.xlsx')
ws = wb.active

# 横向 + A4 + 适应一页
ws.page_setup.orientation = 'landscape'
ws.page_setup.paperSize = 9  # A4
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 1
ws.page_setup.scale = None

# 缩小页边距
ws.page_margins = PageMargins(left=0.3, right=0.3, top=0.5, bottom=0.5)
ws.sheet_properties.pageSetUpPr.fitToPage = True

wb.save('input_adjusted.xlsx')
EOF

# 2. 用 libreoffice-calc 转换（关键：用 calc 而不是 generic libreoffice）
libreoffice --headless --calc --convert-to pdf --outdir /tmp input_adjusted.xlsx
```

**关键点：**
- 必须用 `--calc` 参数指定用 Calc 打开
- `fitToPage = True` 是关键设置
- `scale = None` 让 fitToWidth/Height 生效

