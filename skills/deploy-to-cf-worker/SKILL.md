# deploy-to-cf-worker

将本地项目部署到 Cloudflare Workers。

## 环境要求

在 `~/.openclaw/.env` 中配置：
```bash
export CLOUDFLARE_API_TOKEN="你的token"
export CLOUDFLARE_ACCOUNT_ID="你的账户ID"
```

Gateway 重启后会自动加载环境变量。

## 部署步骤

### 1. 删除已部署的 Worker（如需重建）
```bash
curl -X DELETE -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/项目名"
```

### 2. 部署
```bash
cd /path/to/项目目录
npx wrangler deploy --assets=. --name 项目名 --compatibility-date 2026-03-31
```

### 3. 验证
访问 `https://项目名.你的用户名.workers.dev`

## 注意事项

- 代理问题：环境变量设置好 token 和 ID 后通常不会卡住
- 静态网站用 `--assets=.`
- 需要指定 `--name` 和 `--compatibility-date`