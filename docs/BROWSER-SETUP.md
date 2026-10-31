---
title: Browser Automation Setup Guide
version: 1.0
date: 2026-10-26
---

# Browser Automation — Setup Guide

This guide connects a web browser to your assistant. Once it is connected, your
assistant can open websites, log in to portals, fill in forms, click buttons, and
read what is on the screen — the same things you do with a mouse, done for you.

This is the single most useful connection in the kit. Most business software has no
other way in. If you can do it in a browser, your assistant can do it here.

---

## What You Need Before Starting

- Claude Code installed and working
- Node.js installed (your assistant installs this during first-time setup)

To check Node.js is there, open the terminal in VS Code (click **Terminal** in the
top menu → **New Terminal**) and run:

```
node --version
```

You should see a version number such as `v24.14.1`. If you instead see
"command not found", tell your assistant:

> "Node isn't installed. Please install it for me."

---

## Part A — Connect the Browser

**Step 1 — Open the terminal**

In VS Code, click **Terminal** in the top menu, then **New Terminal**.

**Step 2 — Add the browser**

Run this one command:

```
claude mcp add playwright --scope user -- npx @playwright/mcp@latest
```

This tells Claude Code that a browser is available to it. `--scope user` means it
works in every project on your computer, not just this one.

**Step 3 — Restart**

Close your Claude Code session completely and start a new one. The browser is not
available until you do.

---

## Part B — Download the Browser Itself

The first time your assistant opens a page, it downloads a private copy of Chrome
to use. This takes a minute or two and only happens once.

To get it over with now, run:

```
npx playwright install chromium
```

---

## Part C — Test It

In the Claude chat, type:

> "Open google.com and tell me what you see."

A browser window will open on your screen. Your assistant should describe the page
back to you in plain English. That is the whole test — if it can describe the page,
it can work it.

---

## What Your Assistant Can Do Once Connected

| Task | What to Ask |
|---|---|
| **Log in to a portal** | "Log in to my supplier portal and download this month's invoices" |
| **Fill in a form** | "Submit this permit application on the council website" |
| **Check a price** | "Check what my three competitors charge for this" |
| **Pull a report** | "Log in to my bank and export last month's transactions" |
| **Watch for a change** | "Check that tender site every morning and tell me about new listings" |
| **Upload a document** | "Upload these certificates to the contractor portal" |

> Your assistant describes what it sees before it acts, so you can stop it if it is
> about to do the wrong thing on a live system.

---

## About Your Passwords

Your assistant will need to log in to things. Two rules make this safe.

**Never paste a password into the chat.** Anything typed in the chat is part of the
conversation and gets stored with it.

**Log in yourself the first time.** When a site asks for a password, ask your
assistant to stop and hand the browser to you. Type the password in yourself and
tick "remember me". The browser keeps you logged in from then on, and your
assistant never needs to see the password at all.

Say this:

> "Open the login page and let me type the password myself."

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Assistant says it has no browser | You did not restart after Part A. Close the session completely and start a new one. |
| "command not found: npx" | Node.js is not installed, or not on your path. Ask your assistant: "Node isn't working, please fix it." |
| First page load hangs for a minute | It is downloading Chrome. Normal, once only. Run `npx playwright install chromium` to get it done up front. |
| Browser opens but the page is blank | The site was slow. Ask your assistant to reload the page. |
| Assistant gets logged out between sessions | The site's login expired. Log in yourself again and tick "remember me". |
| A window is already open and it gets stuck | Close every browser window your assistant opened, then ask it to start again. |
| Assistant clicks the wrong thing | Ask it to take a screenshot and describe the page before each step. |

---

## Still Having Trouble?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md), or ask your assistant:

> "Browser automation isn't working. Help me fix it."

---
