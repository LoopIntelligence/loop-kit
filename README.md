# Loop Intelligence — AI Business Assistant Kit

**Learning Operations for Optimised Performance**

Set up an AI assistant on your own laptop that remembers your business, works
inside the software you already pay for, and does the admin you hate. It lives on
your computer, not in a browser tab. You own it. There's nothing to cancel.

---

## What this is

Most people meet AI as a chat window that forgets them the moment they close it.
This is different. It keeps a memory of your business between conversations, it
reads and writes real files on your machine, it can drive a web browser, and it
carries a library of specialist methods it loads when a job calls for one.

- **Remembers your business** — your trade, your customers, your rules
- **Runs locally** — on your computer, not someone else's server
- **Drives your browser** — any portal, any login, any form
- **129 specialist skills** — research, writing, accounting, automation, debugging
- **Gets better as you use it** — correct it once and it stays corrected

Built on [Claude Code](https://claude.ai/claude-code) by Anthropic.

---

## Before you start

| What | Where | Cost |
|---|---|---|
| A Claude subscription that includes Claude Code | [claude.ai](https://claude.ai) → Settings → Billing | ~A$155/month |
| Visual Studio Code | [code.visualstudio.com](https://code.visualstudio.com) | Free |
| A laptop you can install software on | — | — |

**Windows only:** install [Git](https://git-scm.com/download/win) first. Click Next
through every screen. Mac handles this itself.

The subscription is paid to Anthropic, not to us, and it's the only ongoing cost.

---

## Setup

Open Visual Studio Code, click the Claude icon in the left sidebar, and paste this
into the chat:

```
I am setting up my AI Business Assistant.

Work through these steps one at a time and tell me what you are doing
in plain English. Detect whether I am on Mac or Windows and use the
right commands for my system.

1. Download the kit:
   git clone https://github.com/LoopIntelligence/loop-kit.git ~/loop-kit
   On Mac, if a popup asks to install developer tools, tell me to
   click Install and wait.

2. Create a folder called my-assistant in my home folder.

3. Copy loop-kit/assistant/CLAUDE.md into my-assistant/CLAUDE.md

4. Copy every folder from loop-kit/skills/ into
   my-assistant/skills/
   Create that folder if it does not exist. Do not copy anything
   into ~/.claude/skills/ — that folder is shared with any other
   Claude work on this computer and we must not touch it.

5. Tell me to open the my-assistant folder in Visual Studio Code
   when you are done.

Talk to me as though I am not technical. Plain English.
One step at a time.
```

Then open the `my-assistant` folder (Cmd+Shift+P on Mac, Ctrl+Shift+P on Windows →
"open folder"), click the Claude icon, and type hello. It'll take you through seven
questions about your business and you're running.

---

## What's in here

```
loop-kit/
├── assistant/
│   └── CLAUDE.md        the assistant's instructions — how it talks to you
├── skills/              129 specialist skills
└── docs/                connector setup guides
```

**Where the skills live:** the setup copies them into `my-assistant/skills/`, inside
your own assistant folder. Nothing is written to Claude's shared skills folder, so
if you already use Claude for other work, none of it is touched. Removing the
assistant later is just deleting that one folder.

**Precedence:** a skill in your own project folder overrides one in the kit. That's
how you customise anything without forking.

---

## First five things to ask it

1. What can you do that would help a business like mine most?
2. Research my top three competitors and tell me where they beat us.
3. Summarise my unread email and flag what needs a reply today.
4. Every Monday I pull the same report by hand — can you take it over?
5. What did I ask you to do more than once this week?

That last one is the whole method. Whatever it names is your next automation.

---

## When something breaks

Describe what happened in plain English. The assistant is a capable troubleshooter
of its own setup and will usually diagnose it. If it can't, the connector guides in
`docs/` have troubleshooting sections.

---

## Credits and licence

The majority of skills in this kit come from Anthropic's published skill library and
the open Claude Code community, and remain under their original licences. The
assistant instructions, the setup flow, the `first-run-setup` and `skills-discovery`
skills, and the handbook are original work by Loop Intelligence.

Released under the MIT Licence — see [LICENSE](LICENSE).

---

**Loop Intelligence** — Adelaide, South Australia · loopintelligence.com.au
