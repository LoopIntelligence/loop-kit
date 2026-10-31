---
name: ai-agents-architect
description: How to design autonomous AI agents that stay controllable. Covers the ReAct loop, Plan-and-Execute, tool registries, iteration limits, tracing, durable execution, and multi-agent orchestration. Use when designing a new agent or debugging why an existing one misbehaves.
---

# AI Agents Architect

Agents are LLMs in a loop with tools. That sounds simple. It is not.

**Core insight:** Agents fail in unexpected ways. Great agent architecture is about designing for graceful degradation, explicit failure modes, and clear human-in-the-loop checkpoints — not about building the cleverest autonomous system you can imagine.

---

## The three core loops

Every agent uses one of these (or a hybrid). Pick deliberately.

### 1. ReAct (Reason → Act → Observe)
The default loop. On each turn, the model reasons about what to do next, picks a tool, observes the result, then reasons again.

```
Thought: The user wants to ship a PR. I need to check the tests first.
Action: run_tests()
Observation: 3/3 passed
Thought: Tests pass. Now I can merge.
Action: merge_pr(id=42)
Observation: merged successfully
Thought: Done.
```

**Strengths:** Simple, transparent, easy to debug.
**Weaknesses:** No global plan — can wander. Must enforce iteration limits.
**When to use:** Most tasks. Default here.

### 2. Plan-and-Execute
A planner LLM produces a complete step-by-step plan. An executor LLM (often smaller / cheaper) runs each step. A replanner triggers if a step fails.

```
Plan:
  1. Find the PR by title
  2. Check CI status
  3. If green, merge; if red, report failure
Executor runs step 1 → step 2 → step 3
Replanner activates only on failure
```

**Strengths:** Cheaper (the big model only plans). Auditable plans. Good for long tasks.
**Weaknesses:** Rigid. Plans go stale mid-execution. Replanning is hard to get right.
**When to use:** Tasks with 5+ clear steps where each step has predictable outputs.

### 3. Tree-of-Thoughts / Search
The agent explores multiple candidate actions and backtracks. Rarely worth the cost outside specific domains (puzzles, code synthesis).

---

## Non-negotiable guardrails

Every production agent MUST have all of these. No exceptions.

### Iteration limits
```python
MAX_STEPS = 20
for step in range(MAX_STEPS):
    action = agent.think()
    if action.is_final: break
    observation = tools.run(action)
    agent.observe(observation)
else:
    raise StepLimitExceeded()
```
Without this, one confused agent burns $500 in an hour.

### Token budget
Track cumulative input + output tokens per run. Hard-kill at the budget.

### Tool call budget
Total tool calls per run, and per-tool caps ("no more than 3 `send_email` calls per session").

### Wall-clock timeout
An agent stuck in a retry loop is silent. A timeout makes it loud.

### Traceability
Every step must be logged: thought, action, observation, tokens used, wall time. Store as structured JSON, not prose. You will need this when debugging in production.

### Graceful abort
The agent must be killable mid-run without corrupting state. All tool calls should be idempotent or journalled.

---

## Tool registry design

Tools are the agent's vocabulary. Curate them like a product.

### Rules
- **No more than ~15 tools per agent.** Beyond that, selection accuracy collapses.
- **Group related tools behind dispatchers** if you need more. `database.query(table, ...)` beats 30 `query_users`, `query_orders` tools.
- **Tag tools by cost and side effects.** The planner can prefer cheap/read-only tools.
- **Lazy-load expensive tools.** Don't load the "send money" tool into every agent by default.

### Dynamic tool selection
For larger toolkits, use a two-step approach:
1. A lightweight tool-selection prompt picks the 5–10 relevant tools for *this* task.
2. The agent runs with only those in its schema.

This scales to hundreds of tools without degrading quality.

---

## Memory in agents

The memory layer and the agent loop are not separate concerns. See the **agent-memory-systems** skill for the full architecture. The relevant rule here:

> Memory reads and writes are tools. They follow the same rules as every other tool: typed, described, tested, logged.

Never let the agent "just have access to the database". Wrap it in a tool with a clear description.

---

## Multi-agent orchestration

Use multi-agent designs when — and only when — single-agent designs fail. Most "multi-agent" systems are really one agent with distinct prompts.

### When multi-agent genuinely helps
- **Different tool scopes.** A "research" agent with web tools + a "write" agent with file tools prevents prompt bloat.
- **Different models.** Cheap model for bulk work, expensive model for planning.
- **Parallelism.** Independent subtasks run concurrently.
- **Isolation.** A compromised tool in one agent shouldn't leak state to another.

### When it hurts
- **Sequential handoffs** are slower and lossier than one agent doing both jobs.
- **Shared state** between agents creates race conditions and consistency bugs.
- **Debugging** a 5-agent system is 5x harder than debugging a 1-agent system.

### Patterns that work
- **Orchestrator + workers.** One planner delegates to specialised workers.
- **Pipeline.** Agent A's output is Agent B's input. Strictly one direction.
- **Fan-out/fan-in.** One planner spawns N workers in parallel, one aggregator collects.

### Patterns that don't
- **Free-form chat between agents.** They drift and loop.
- **Mutual critique without a referee.** Two agents arguing forever.

---

## Durable execution

For any agent that takes longer than a minute, assume the process will crash.

**Requirements:**
- **Journal every step** to durable storage (DB, file) *before* executing.
- **On restart**, replay from the last committed step.
- **Idempotent tools.** If a step is replayed, the side effect happens at most once.

Libraries: Temporal, Inngest, DBOS, Restate. Pick one. Don't roll your own — you will get it wrong.

---

## Anti-patterns

### Unlimited autonomy
No iteration limits, no budget, no timeout. Only safe in a throwaway script. Never in production.

### Tool overload
40 tools in one agent's schema. Selection collapses. Curate.

### Memory hoarding
Stuffing everything into the context window "just in case". Leads to degraded reasoning and huge bills.

### Silent loops
An agent that retries the same failing action without escalating. Add a "same action 3 times in a row → escalate" rule.

### Fragile output parsing
Depending on the model to "always return JSON" without tool use. Use structured outputs (tool calls, JSON mode) instead.

### No tracing
"Why did the agent do that?" → "I don't know, it's all inside the LLM." Every decision must be logged.

### Multi-agent as first resort
Reaching for multi-agent when a single better-prompted agent would do the job.

---

## Evaluation

You cannot ship an agent you haven't evaluated.

### Minimum eval suite
- **20+ realistic tasks** covering the happy path.
- **10+ adversarial tasks** designed to trip the agent up.
- **10+ edge cases** — empty inputs, malformed data, tool failures.

### Metrics to track
- **Task success rate** — did it achieve the goal?
- **Step count** — fewer is better, but watch for tasks it's skipping.
- **Tool call count** — spikes indicate confusion.
- **Token cost per task** — watch for runaway prompts.
- **Wall time** — latency matters to users.

Run the eval suite on every prompt change. Regressions are silent otherwise.

---

## Starting checklist

Before writing any agent code:

1. Which loop? (ReAct / Plan-and-Execute / hybrid)
2. Iteration limit, token budget, wall-clock timeout — all set?
3. Tool list — under 15? Each one has a complete description?
4. Memory policy — what gets stored, for how long, scoped to whom?
5. Failure modes — what happens when a tool errors, when the LLM stalls, when the process crashes?
6. Observability — is every step logged in structured form?
7. Eval suite — do you have at least 40 test tasks?
8. Human-in-the-loop — for which actions must the agent stop and ask?

If any answer is "we'll figure it out later", you're not ready to build — you're ready to design.

---

## Related skills

- **agent-memory-systems** — memory architecture.
- **agent-tool-builder** — how to design individual tools well.
- **autonomous-agent-patterns** — concrete implementation patterns.
- **subagent-driven-development** / **dispatching-parallel-agents** — for multi-agent work.
- **systematic-debugging** — when an agent misbehaves in production.
- **claude-api** — the API-level plumbing (prompt caching, streaming, tool use).
