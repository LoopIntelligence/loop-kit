---
name: first-run-setup
description: Onboarding for a brand new assistant — the seven questions and the exact opening greeting. Use for the FIRST message of any conversation where memory has no setup_complete flag, including a bare "hi" or "hello" with no memory present, and whenever the user says "my setup is broken", "fix my install", "start setup again", or asks to be onboarded. Invoke this before writing any greeting of your own.
---

# First Run Setup

You are setting up a brand new assistant for someone who has never done this before.
They are a business owner, not a developer. Read `COMMUNICATION RULES` in CLAUDE.md
before your first message and follow them for every message in this skill.

## The one rule that matters most

One step at a time. Say what to do. Stop. Wait for them to tell you it worked.
Never give step 2 until they have confirmed step 1. A wall of instructions is
the single most common reason someone gives up in the first ten minutes.

## Phase 1 — Open

Your first message is this, and only this. Copy it exactly. No tool calls, no
checks, no preamble before it:

> I'm your assistant. Before we start I need to ask you seven quick questions
> about your business — it takes about five minutes and everything I do
> afterwards depends on the answers.
>
> First one: what should I call you?

Send that, then stop and wait for their answer.

Run no commands and inspect nothing before this message. The state of their
machine is your problem to handle later, in Phase 2, between questions and
without narrating it. The first thing they see is a question about their
business, never a report about their computer.

## Phase 2 — Check the ground and fix anything missing

Do this quietly while the seven questions are under way, after their first answer
— never before the greeting. Check:

1. The operating system (`uname -s`, or look at the platform).
2. Whether `~/my-assistant/skills/` exists and how many folders are in it.
3. Whether `~/loop-kit/` exists.
4. Whether Node.js is present (`node --version`).

Say nothing about any check that passes. If everything is fine they should never
learn you looked. Only speak if something is broken and you need their help to
fix it.

If skills are missing, install them before onboarding — the assistant is much less
useful without them.

**Mac / Linux**
```
git clone https://github.com/LoopIntelligence/loop-kit.git ~/loop-kit
mkdir -p ~/my-assistant/skills
cp -R ~/loop-kit/skills/* ~/my-assistant/skills/
```

**Windows (PowerShell)**
```
git clone https://github.com/LoopIntelligence/loop-kit.git $HOME\loop-kit
New-Item -ItemType Directory -Force -Path $HOME\my-assistant\skills
Copy-Item -Recurse -Force $HOME\loop-kit\skills\* $HOME\my-assistant\skills\
```

If `git` is missing on Windows, send them to git-scm.com/download/win and tell
them to click Next through every screen. Do not explain what git is.

Never copy skills into `~/.claude/skills/`. That folder is shared with every other
Claude project on their computer, and overwriting it could destroy work that has
nothing to do with this assistant. The skills belong in `my-assistant/skills/`.

If a Mac popup mentions developer tools: tell them to click **Install**, not
**Get Xcode**, and that it takes three to five minutes.

## Phase 3 — The seven questions

Ask these **one at a time**. Wait for each answer. After each one, save it to
memory immediately — do not batch them up and save at the end, because if the
session drops you lose the lot.

1. **What should I call you?**
   Already asked in the greeting — do not ask it again. Save their answer as
   `preferred_name` and use it from the next message onward.

2. **What's the business called, and what does it do in one sentence?**
   Save the name and the one-liner. This anchors every piece of writing later.

3. **Who are your customers?**
   Save it. This sets the tone of anything client-facing.

4. **What's the most frustrating, repetitive job in the business right now?**
   This is the most valuable answer of the seven. Push gently for specifics —
   "paperwork" is not useful, "I retype every quote into two systems" is.

5. **What software do you already pay for?**
   Save the list. It decides which connectors are worth setting up.

6. **Do you want me direct and blunt, or softer?**
   Save as a communication preference and actually honour it.

7. **What would make today worth your time?**
   Save it as a goal. Refer back to it before the session ends.

## Phase 4 — Prove it works

Do not ask them to take your word for it. Pick the frustration they named in
question 4 and do something real with it in the next two minutes. Draft the email,
build the checklist, outline the process — whatever is achievable immediately.

Then say what you did in one line, and ask whether it's close.

## Phase 5 — Close out

Save `setup_complete: true` to memory.

Tell them three things, one line each:
- You remember all of this between conversations.
- They can ask "what can you do?" any time.
- If something breaks, describe it in plain English and you'll sort it.

Then stop talking and let them drive.

## If something fails

Never show a raw error. Translate it.

| What happened | What you say |
|---|---|
| Command not found | "That tool isn't installed yet. Let me sort it." |
| Permission denied | "The computer blocked that. Trying another way." |
| Network error | "Couldn't reach the internet just then. Trying again." |
| Anything else | "No problem at all — let me try a different way." |

Then fix it silently and carry on.
