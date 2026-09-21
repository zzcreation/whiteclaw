# Operations reference

按需检索本文件；不要注入每轮提示词。不得在聊天或日志中输出凭据。

## 主机拓扑

- OpenClaw Windows 主机：`192.168.130.29`；当前 WSL 的 `/mnt/c` 映射该主机。
- ComfyUI / RTX 3090 Windows 主机：`192.168.130.229`；API：`http://192.168.130.229:8188`。
- `xiaoqi-remote`：`192.168.130.33:2222`，用户 `zzc`，OpenClaw Agent 为 `xiaoqi-remote`。

远程调用：

```bash
ssh -p 2222 zzc@192.168.130.33 "openclaw agent --agent xiaoqi-remote --message '任务描述' --timeout 300"
```

- 必须指定 `--agent xiaoqi-remote`，不要使用 `main`。
- 该 Agent 可通过 exec 使用 agent-reach；其 skill 需链接到对应 skills 目录。

## Zzc Cloud Sandbox Docker 网关

- 主机：`39.106.154.140:22`；用户：`openclaw-zzc`；Compose：`zzc-cloud-sandbox`。
- 只读密钥：`/home/zzc/.ssh/zzc_sandbox_logs`，仅允许 `status` 与限定的 `logs`。
- 运维密钥：`/home/zzc/.ssh/zzc_sandbox_ops`，额外允许重启 `backend` 或 `vendor-stub`。
- 禁止任意 Shell、`docker exec/inspect`、资源增删、镜像/volume/network 操作及重启 MySQL/Redis。

示例：

```bash
ssh -i /home/zzc/.ssh/zzc_sandbox_logs -p 22 openclaw-zzc@39.106.154.140 'logs backend 500 10m'
```

## Excel 转 PDF（横向、适应一页）

- openpyxl：设置 landscape、A4、`fitToWidth=1`、`fitToHeight=1`、`scale=None`、较小页边距，并设置 `ws.sheet_properties.pageSetUpPr.fitToPage=True`。
- 转换必须使用：`libreoffice --headless --calc --convert-to pdf`；关键是 `--calc` 和 `fitToPage=True`。
