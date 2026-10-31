---
name: server-port
description: Port the user's entire local Claude Code setup to a fresh cloud server as-is. Discovers whatever they have (skills, agents, commands, CLAUDE.md, MCP config, memory), provisions a Linux server, installs Claude Code and dependencies, rsyncs everything across (filtering secrets), sets up auth, and verifies. Use when the user says "put my Claude setup on a server", "port my assistant to the cloud", "run my agents 24/7", or "mirror my laptop Claude Code to a VM".
---

# Server Port — Mirror local Claude Code to a cloud server

**Purpose:** Take the user's EXISTING local Claude Code setup — whatever they have — and replicate it on a fresh Linux server so it can run 24/7. Nothing is rebuilt from templates. Whatever's on the laptop becomes what's on the server.

**Audience:** Non-technical users at Claude Code workshops. They watch and approve; they don't type commands.

**Not the same as building an agent system from scratch.** If the user wants a fresh agent framework, use a server-setup skill instead. This skill assumes they already have something local they're happy with and just want it hosted.

---

## How this skill runs

Walk through the phases below in order, conversationally, announcing each one in plain English. Do not batch steps silently. If a phase fails, stop and explain — don't continue through errors.

At every phase: **ask before destructive operations** (launching a paid cloud instance, writing to a non-empty remote directory, overwriting existing files).

---

## Phase 0 — Discover what's local

Before touching anything, find out what the user actually has. Report the count to them before proceeding.

### 0.1 Enumerate the local Claude Code footprint

Check these locations and build an inventory. Missing folders are fine — just skip them.

```bash
# Skills
ls ~/.claude/skills/ 2>/dev/null | grep -v '^SKILL' | wc -l

# Custom agents
ls ~/.claude/agents/ 2>/dev/null | wc -l

# Custom commands
ls ~/.claude/commands/ 2>/dev/null | wc -l

# Project memory
find ~/.claude/projects -name 'memory' -type d 2>/dev/null | wc -l

# Root CLAUDE.md
ls ~/CLAUDE.md 2>/dev/null

# Root MCP config
ls ~/.mcp.json 2>/dev/null

# Claude Code settings
ls ~/.claude/settings.json ~/.claude/settings.local.json 2>/dev/null
```

### 0.2 Report to the user

Show something like:

> Here's what I found on your laptop:
> - **42 skills** in `~/.claude/skills/`
> - **3 custom agents** in `~/.claude/agents/`
> - **5 custom commands** in `~/.claude/commands/`
> - **1 root `CLAUDE.md`**
> - **1 root `.mcp.json`**
> - **2 project memory folders**
>
> I'll copy all of this to your new server. Sound good?

Wait for confirmation.

### 0.3 Detect the operating system

```bash
uname -s   # Darwin = Mac, Linux = Linux, anything with MINGW/CYGWIN = Windows
```

Branch the instructions based on this. Mac and Linux use the same commands; Windows needs WSL or a PowerShell equivalent.

---

## Phase 1 — Provision the server

Offer three options. Let the user pick.

### Option A — AWS CLI (preferred if configured)

```bash
# Verify AWS CLI is installed and authenticated
aws sts get-caller-identity
```

If that works, provision:

```bash
# SSH key
aws ec2 create-key-pair \
  --key-name claude-port-key \
  --query 'KeyMaterial' --output text > ~/.ssh/claude-port-key.pem
chmod 400 ~/.ssh/claude-port-key.pem

# Security group
aws ec2 create-security-group \
  --group-name claude-port-sg \
  --description "Claude Code ported server"

SG_ID=$(aws ec2 describe-security-groups \
  --group-names claude-port-sg \
  --query 'SecurityGroups[0].GroupId' --output text)

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0

# Launch Ubuntu 24.04 LTS — t3.medium is a good starting point
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0f5d1713c9af4fe30 \
  --instance-type t3.medium \
  --key-name claude-port-key \
  --security-group-ids $SG_ID \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":30,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=claude-code-ported}]' \
  --query 'Instances[0].InstanceId' --output text)

aws ec2 wait instance-running --instance-ids $INSTANCE_ID

SERVER_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "Server ready: $SERVER_IP"
```

**Check the AMI ID matches the user's AWS region.** The one above is for `ap-southeast-2`. If they're in a different region, look up the current Ubuntu 24.04 AMI for that region first.

**Warn the user about cost.** `t3.medium` is roughly US$30/month if left running. Ask them to confirm before launching.

### Option B — Browser automation (if no AWS CLI)

Use Playwright MCP:
1. Open `aws.amazon.com` → Sign in.
2. Navigate to EC2 → Launch instance.
3. Select Ubuntu 24.04 LTS, t3.medium, create a new key pair named `claude-port-key`, download the `.pem` file to `~/.ssh/`.
4. Open SSH port 22 to everywhere (or to the user's IP if they want tighter).
5. Launch and wait.
6. Note the public IP address.
7. Move the key file: `chmod 400 ~/.ssh/claude-port-key.pem`

### Option C — User provides an existing server

Ask for: **IP address**, **SSH key path**, **username** (usually `ubuntu` on Ubuntu AMIs or `root` on minimal installs).

Verify connectivity:

```bash
ssh -o ConnectTimeout=10 -i <KEY_PATH> <USER>@<IP> 'echo "Connected"'
```

If that fails, stop and troubleshoot — don't proceed.

### Alternatives worth offering

For users who don't have AWS: mention that this same skill can target any Ubuntu/Debian box over SSH — **DigitalOcean**, **Lightsail**, **Hetzner**, **Linode**, a **Raspberry Pi**, a spare laptop on Tailscale. The porting logic (Phases 3–6) is identical once you have an SSH target.

---

## Phase 2 — Install Claude Code + system dependencies on the server

Once you have `SERVER_IP` and a key path, SSH in and install the base stack.

```bash
SSH_CMD="ssh -i ~/.ssh/claude-port-key.pem ubuntu@$SERVER_IP"

# Update
$SSH_CMD 'sudo apt update && sudo apt upgrade -y'

# Essentials
$SSH_CMD 'sudo apt install -y \
  curl git jq python3 python3-pip python3-venv \
  build-essential unzip wget tmux htop rsync'

# Node.js 20 LTS (required for Claude Code)
$SSH_CMD 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs'

# Claude Code
$SSH_CMD 'sudo npm install -g @anthropic-ai/claude-code'

# Verify
$SSH_CMD 'claude --version'
```

**Optional — only if the local setup includes browser-using skills (Playwright-based):**

```bash
$SSH_CMD 'sudo apt install -y chromium-browser fonts-liberation libnss3 libatk-bridge2.0-0 libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2t64'
$SSH_CMD 'npx playwright install chromium --with-deps'
```

**Optional — Tailscale for a secure private network:**

```bash
$SSH_CMD 'curl -fsSL https://tailscale.com/install.sh | sh'
$SSH_CMD 'sudo tailscale up'
# This prints a URL — the user clicks it to authenticate in their Tailscale account.
$SSH_CMD 'tailscale ip -4'
```

Ask the user if they want Tailscale before doing this. It's not required, but it beats managing SSH keys and firewall rules.

### 2.1 Configure `tmux` as the default session wrapper — MANDATORY

**Why this matters:** if the user runs `claude` in a plain SSH session and closes their laptop lid, the SSH connection drops and the `claude` process **dies with it**. Every Claude session on this server must run inside `tmux` so it survives disconnects. Do not skip this step.

```bash
# Pre-create a default tmux session the user will always use
$SSH_CMD 'tmux new-session -d -s claude 2>/dev/null || true'

# Drop a minimal ~/.tmux.conf with a readable status bar
$SSH_CMD 'cat > ~/.tmux.conf << "TMUXCONF"
set -g mouse on
set -g history-limit 50000
set -g status-bg colour236
set -g status-fg white
set -g status-left "#[fg=green] [#S] "
set -g status-right "#[fg=yellow]%H:%M #[fg=cyan]%d-%b"
TMUXCONF'

# Add a friendly login banner so the user knows how to attach
$SSH_CMD 'cat > ~/.ssh-motd << "MOTD"

=== Claude Code server ===

To start or resume your Claude session:
    tmux attach -t claude
    (or if it does not exist yet: tmux new -s claude)

Inside tmux:
    Detach without stopping Claude:   Ctrl+B then D
    Scroll back in history:           Ctrl+B then [
    Exit scroll mode:                 q

Everything you do inside tmux keeps running after you close your laptop.

MOTD'
$SSH_CMD 'echo "cat ~/.ssh-motd" >> ~/.bashrc'
```

Tell the user plainly: **"Whenever you SSH in, the first thing you do is `tmux attach -t claude`. That way closing your laptop never loses your work."**

---

## Phase 3 — Bundle the local setup (with secrets filtered)

This is the core job. Build a tarball of the user's `~/.claude/` folder minus anything sensitive.

### 3.1 Build the filter list

Secrets never cross the wire. Grep-filter anything that looks like one:

```bash
BUNDLE_DIR=$(mktemp -d)
cd ~/

# Rsync to a staging folder first, with secret patterns excluded.
rsync -av \
  --exclude='.claude/projects/*/memory/secrets*' \
  --exclude='.claude/**/*.env' \
  --exclude='.claude/**/.env.*' \
  --exclude='.claude/**/secrets.env' \
  --exclude='.claude/**/credentials*' \
  --exclude='.claude/**/.aws/credentials' \
  --exclude='.claude/**/token*.json' \
  --exclude='.claude/**/oauth*.json' \
  --exclude='.claude/**/*.pem' \
  --exclude='.claude/**/*.key' \
  --exclude='.claude/projects/*/shell-snapshots/*' \
  --exclude='.claude/**/node_modules/' \
  --exclude='.claude/**/.venv/' \
  --exclude='.claude/**/__pycache__/' \
  --exclude='.claude/projects/*/ide/*' \
  ~/.claude/ "$BUNDLE_DIR/.claude/"

# Pull the root CLAUDE.md and .mcp.json separately if they exist
[ -f ~/CLAUDE.md ] && cp ~/CLAUDE.md "$BUNDLE_DIR/CLAUDE.md"
[ -f ~/.mcp.json ] && cp ~/.mcp.json "$BUNDLE_DIR/.mcp.json"
```

### 3.2 Strip keys from MCP config

`.mcp.json` often contains API keys in env blocks. Never ship them. Redact first, ask the user to re-enter server-side.

```bash
if [ -f "$BUNDLE_DIR/.mcp.json" ]; then
  python3 -c '
import json, sys
p = "'$BUNDLE_DIR'/.mcp.json"
with open(p) as f: cfg = json.load(f)
for name, server in (cfg.get("mcpServers") or {}).items():
    if "env" in server:
        server["env"] = {k: "REPLACE_ME" for k in server["env"]}
with open(p, "w") as f: json.dump(cfg, f, indent=2)
print("Redacted MCP keys. User will re-enter server-side.")
'
fi
```

### 3.3 Grep-sweep for anything missed

Before upload, quickly scan the bundle for strings that look like API keys and abort if any are found:

```bash
if grep -r -E '(sk-[a-zA-Z0-9]{20,}|AIza[a-zA-Z0-9_-]{30,}|xoxb-[a-zA-Z0-9-]+|ghp_[a-zA-Z0-9]{30,}|AKIA[0-9A-Z]{16})' "$BUNDLE_DIR" 2>/dev/null; then
  echo "ABORT: possible secret detected in bundle. Stop and investigate."
  exit 1
fi
```

If the grep finds something, tell the user exactly which file triggered the alert and ask them to clean it before retrying.

### 3.4 Report what's in the bundle

Before upload, print a summary:

```bash
echo "Bundle contents:"
find "$BUNDLE_DIR" -type f | wc -l
du -sh "$BUNDLE_DIR"
```

Show the user the file count and size. Ask for approval before the upload.

---

## Phase 4 — Transfer the bundle to the server

Use rsync so it's resumable and preserves permissions. **Do not use scp for this** — rsync handles large trees better.

```bash
rsync -avz -e "ssh -i ~/.ssh/claude-port-key.pem" \
  "$BUNDLE_DIR/" \
  ubuntu@$SERVER_IP:/home/ubuntu/
```

Verify on the server:

```bash
$SSH_CMD 'ls ~/.claude/skills/ | wc -l'
$SSH_CMD '[ -f ~/CLAUDE.md ] && echo "CLAUDE.md: yes"'
$SSH_CMD '[ -f ~/.mcp.json ] && echo ".mcp.json: yes"'
```

Counts should match what you reported in Phase 0.

---

## Phase 5 — Reinstall per-skill dependencies

Some skills ship Python or Node scripts that need their deps installed. Walk every skill directory and install what's missing.

```bash
$SSH_CMD 'bash -s' << 'INSTALL_DEPS'
set -e
cd ~/.claude/skills
for dir in */; do
  skill="${dir%/}"

  # Python requirements
  if [ -f "$skill/requirements.txt" ]; then
    python3 -m venv "$skill/.venv" 2>/dev/null || true
    "$skill/.venv/bin/pip" install -q -r "$skill/requirements.txt" 2>/dev/null && echo "py deps: $skill"
  fi

  # Node packages
  if [ -f "$skill/package.json" ] && [ ! -d "$skill/node_modules" ]; then
    (cd "$skill" && npm install --silent 2>/dev/null) && echo "npm deps: $skill"
  fi

  # Shell scripts — make them executable
  if [ -d "$skill/scripts" ]; then
    chmod +x "$skill/scripts/"*.sh "$skill/scripts/"*.py 2>/dev/null || true
  fi
done
INSTALL_DEPS
```

Report which skills had deps installed vs which were already set up.

---

## Phase 6 — Authenticate Claude Code on the server

Claude Code needs an account. **Run every Claude command inside the `claude` tmux session from Phase 2.1** so nothing dies on SSH disconnect.

```bash
# Attach to (or create) the default tmux session, then log in
$SSH_CMD -t 'tmux new -A -s claude "claude login; exec bash"'
```

The `-t` flag gives you a TTY, `tmux new -A -s claude` attaches if the session exists or creates it if not, and the `exec bash` at the end keeps the pane open after login finishes.

`claude login` opens a device-code flow. The user copies the code, authorises it in their laptop browser, and the server is signed in.

**Important:** use **full Claude.ai login**, not a setup-token-only flow. Features like `claude remote-control` require a full account, not just a developer token.

### Detaching and reconnecting

Once logged in, the user detaches from tmux with `Ctrl+B` then `D`. They can close their laptop, go have lunch, SSH back in tomorrow, run `tmux attach -t claude`, and the session is exactly where they left it.

---

## Phase 7 — Restore MCP config on the server

The `.mcp.json` was redacted in Phase 3.2. Now the user needs to re-enter API keys on the server. Prompt them through it:

```bash
$SSH_CMD 'nano ~/.mcp.json'
```

Or, better, walk them through each MCP server in the file and ask for the key interactively, then write it back. For each `env` block that has `REPLACE_ME` values, stop and ask the user for the real key.

**Hold these keys in the user's active chat only.** Never log them, never save them to the bundle, never echo them.

---

## Phase 8 — Smoke test

Run one end-to-end verification that proves the ported setup works. The smoke test uses `claude -p` (a one-shot non-interactive run) which doesn't need tmux, but we'll also verify the tmux workflow itself.

```bash
# Basic version + skill count
$SSH_CMD 'claude --version'
$SSH_CMD 'ls ~/.claude/skills/ | wc -l'

# One-shot prompt (non-interactive, proves auth + skills work)
$SSH_CMD 'claude -p "List the first 3 skills installed and say hello." --output-format text'

# Verify the tmux session still exists and is attachable
$SSH_CMD 'tmux list-sessions'
```

If `tmux list-sessions` shows a `claude` session and the one-shot prompt returns a sensible answer, the port worked end to end.

**Report to the user:**

- Server IP / Tailscale IP
- Exact SSH command to bookmark
- **The attach command they will use every time**: `tmux attach -t claude`
- Skills installed count (matches Phase 0 minus any that failed)
- Any skills that had dep install errors (list them so the user can fix manually)
- Three things they can now do:
    1. **Run `claude` interactively** — SSH in, `tmux attach -t claude`, work as normal, detach with `Ctrl+B D`, close the laptop.
    2. **Run `claude remote-control --name "<something>"`** — inside the tmux session. Lets them connect from a phone or another laptop via the Claude UI. Survives disconnects because tmux holds it.
    3. **Run a Telegram bot** as a systemd service (see Phase 9b below) — completely independent of tmux, runs 24/7.
- Next steps: cron for scheduled agents (Phase 9), Telegram daemon (Phase 9b), or just start using it.

---

## Phase 9 (optional) — Schedule agents with cron

If the user has agents they want running on a schedule, offer to set up cron:

```bash
$SSH_CMD 'crontab -l 2>/dev/null > /tmp/current-cron; cat /tmp/current-cron'
```

Show them the current crontab, then interactively build new entries. A typical pattern:

```cron
# Run an agent every morning at 8am local
0 8 * * * cd $HOME && claude -p "Run the morning-briefing agent" --output-format text >> ~/logs/morning.log 2>&1
```

Install:

```bash
$SSH_CMD 'cat /tmp/current-cron /tmp/new-entries | crontab -'
```

Only do this step if the user actually wants scheduled agents. Otherwise skip.

---

## Phase 9b (optional) — Run long-lived bots as systemd services

For anything that should run **forever** regardless of tmux or SSH — a Telegram bot, a webhook listener, a polling daemon — use `systemd --user`. It survives reboots, auto-restarts on crash, and runs completely independently of the `claude` tmux session.

This is the correct pattern for things like:

- A Telegram bot that forwards messages to `claude -p` on the server
- A WhatsApp / Slack / Discord bridge
- A webhook listener for GitHub, Stripe, or any SaaS callback
- A polling daemon that runs every minute

### Generic systemd user service template

```bash
# Create a user-level systemd directory (first time only)
$SSH_CMD 'mkdir -p ~/.config/systemd/user'

# Drop a service unit — replace ExecStart with whatever the bot is
$SSH_CMD 'cat > ~/.config/systemd/user/example-bot.service << "UNIT"
[Unit]
Description=Example long-running bot
After=network.target

[Service]
Type=simple
WorkingDirectory=%h/bots/example-bot
ExecStart=/usr/bin/python3 %h/bots/example-bot/bot.py
Restart=always
RestartSec=5
StandardOutput=append:%h/logs/example-bot.log
StandardError=append:%h/logs/example-bot.log

[Install]
WantedBy=default.target
UNIT'

# Enable linger so user services run even when the user is not logged in
$SSH_CMD 'loginctl enable-linger $USER'

# Reload, enable, start
$SSH_CMD 'mkdir -p ~/logs && systemctl --user daemon-reload && systemctl --user enable example-bot && systemctl --user start example-bot'

# Check it's running
$SSH_CMD 'systemctl --user status example-bot'
```

### For a Telegram bot specifically

The user will need:

1. A bot token from `@BotFather` on Telegram — they create it on their phone in ~60 seconds
2. Their own Telegram user ID as an allowlist (so randoms can't hit the bot and burn their tokens)
3. A ~50-line Python script that polls Telegram and calls `claude -p` with each incoming message

Claude can generate the script on request after the port is finished. Point the user at this phase and say: **"Once the port is done, say 'set up a telegram bot that routes to Claude Code' and I'll build you the script and install it as a systemd service."**

Do not build the Telegram bot as part of the port itself — it's a separate concern and belongs in its own step. But the **server is already capable** of running it because `systemd --user`, `loginctl enable-linger`, Python, and Node are all installed in Phase 2.

---

## What this skill does NOT do

Be explicit with the user so expectations are right:

- **Does not copy API keys or secrets.** Every key must be re-entered server-side.
- **Does not reproduce your local OS tweaks.** If a skill depends on `brew install foo` locally, that dependency won't survive the port — flag it if you detect it.
- **Does not migrate running processes.** Anything the user has running (`ollama serve`, custom daemons) is not ported. Skill files and configs are.
- **Does not handle databases.** If a skill reads from a local SQLite DB, that DB is not copied. The user must handle data separately.
- **Does not work for Windows hosts.** The server target can be Ubuntu/Debian only. The client laptop can be Mac, Linux, or Windows (via WSL).

---

## Error escalation

| Error | What to do |
|---|---|
| SSH connect fails | Stop. Show the exact command and error. Ask user to check key path, IP, firewall. |
| Secrets detected in bundle | Stop immediately. Name the file. Ask user to clean it manually before retry. |
| AWS CLI not configured | Offer Option B (browser) or Option C (existing server). Don't try to configure AWS yourself. |
| Claude Code fails to install on server | Check Node version — requires 20+. Upgrade if older. |
| Per-skill deps fail | Log the failure, continue with the rest, report at the end. Individual skill failures should not abort the whole port. |
| Smoke test returns garbage | Run `claude` interactively and look at stderr. If it's an auth problem, re-run Phase 6. |

---

## Related skills

- **aws-connector** — install and authenticate the AWS CLI locally (prereq for Option A).
- **server-setup** — builds a fresh agent system from templates, not a port of existing state.
- **systematic-debugging** — use it when the smoke test fails.
- **verification-before-completion** — don't declare the port finished until the smoke test actually runs and returns a real answer.
