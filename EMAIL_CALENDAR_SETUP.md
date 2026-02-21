# 📧📅 邮箱和日历配置指南

## ✅ 已完成
- ✅ Himalaya CLI 已安装 (邮件客户端)
- ✅ gcalcli 已安装 (Google Calendar CLI)
- ✅ 邮箱地址已保存：openzackzhu@gmail.com

## 🔧 Gmail 配置步骤

### 第一步：生成 Gmail 应用密码

⚠️ **重要**：不能使用普通 Gmail 密码，必须生成专用的"应用密码"

1. **访问 Google 账号**：
   - 打开浏览器访问：https://myaccount.google.com/
   - 登录 openzackzhu@gmail.com

2. **启用两步验证**（如未启用）：
   - 点击 "安全性" (Security)
   - 找到 "两步验证" (2-Step Verification)
   - 按步骤启用

3. **生成应用密码**：
   - 在 "安全性" 页面
   - 搜索 "应用密码" (App Passwords)
   - 点击 "应用密码"
   - 选择 "邮件" (Mail) 和 "其他" (Other)
   - 输入名称：OpenClaw
   - 点击生成
   - **复制 16 位密码**（格式：xxxx xxxx xxxx xxxx）

### 第二步：配置 Himalaya

运行配置命令：
```bash
himalaya account configure
```

按提示输入信息：
```
Account name: personal
Your full name: Zhengqi Zhu
Your email address: openzackzhu@gmail.com

IMAP hostname: imap.gmail.com
IMAP port [993]: 993
IMAP encryption [tls]: tls
IMAP login: openzackzhu@gmail.com
IMAP password authentication: [粘贴应用密码]

SMTP hostname: smtp.gmail.com
SMTP port [465]: 465
SMTP encryption [tls]: tls
SMTP login: openzackzhu@gmail.com
SMTP password authentication: [粘贴应用密码]

Set as default account? [Y/n]: Y
```

### 第三步：测试邮件

```bash
# 列出邮件夹
himalaya folder list

# 查看最近邮件
himalaya envelope list --max-width 80

# 读取邮件
himalaya message read <邮件ID>
```

---

## 📅 Google Calendar 配置步骤

### 第一步：OAuth 认证

运行初始化命令：
```bash
gcalcli init
```

这会：
1. 打开浏览器
2. 要求登录 Google 账号（openzackzhu@gmail.com）
3. 授权 gcalcli 访问日历
4. 保存凭据到 `~/.gcalcli_oauth`

### 第二步：测试日历

```bash
# 查看今天的日程
gcalcli agenda

# 查看本周日程
gcalcli calw

# 查看本月日程
gcalcli calm

# 添加事件
gcalcli add "体检预约" 2/25/2026 10:00am 1hr
```

---

## 🤖 OpenClaw 集成

配置完成后，我可以：

### 邮件功能
- ✉️ 检查新邮件
- 📬 读取邮件内容
- 📤 发送邮件
- 📂 管理邮件夹

### 日历功能
- 📅 查看今日/本周/本月日程
- ➕ 添加新事件
- 🔔 提醒即将到来的事件
- 🗓️ 搜索和管理日程

### Heartbeat 自动检查
配置后，每天的 heartbeat 会自动：
- 检查未读邮件
- 提醒今日日程
- 提醒即将到来的事件

---

## 🚀 快速配置命令

如果想立即配置，在终端运行：

```bash
# 1. 配置邮件
himalaya account configure

# 2. 配置日历
gcalcli init

# 3. 测试
himalaya envelope list --max-width 80
gcalcli agenda
```

---

## ⚠️ 故障排除

### Gmail 应用密码找不到？
- 确保已启用两步验证
- 在 Google 账号搜索 "App Passwords" 或 "应用密码"

### Himalaya 连接失败？
- 检查应用密码是否正确（16位，无空格）
- 确认 IMAP/SMTP 地址正确
- 检查网络连接

### gcalcli 认证失败？
- 确保浏览器允许弹窗
- 检查是否登录正确的 Google 账号
- 删除 `~/.gcalcli_oauth` 重新认证

---

## 📝 配置完成后告诉我

配置完成后，发送消息"邮箱和日历已配置"，我会：
1. 测试连接
2. 更新 HEARTBEAT.md 启用每日检查
3. 演示如何使用邮件和日历功能
