---
name: framer-builder
description: Build and modify Framer pages programmatically via the Server API. Create pages, clone structures, update text, set styles, and publish.
---

# Framer Server API Builder

## Connection

```javascript
import { connect } from 'framer-api';
const session = await connect('https://framer.com/projects/<PROJECT_ID>', '<API_KEY>');
// API key is project-specific, generated in Site Settings > General > API Keys
```

## Key Discovery: Methods Are on a Proxy

The session object uses a JavaScript Proxy. Methods are NOT visible via `Object.getOwnPropertyNames()`. You must call them directly.

## Working Methods (Verified)

### Navigation & Reading
- `session.getProjectInfo()` - returns {id, name, apiVersion1Id}
- `session.getCanvasRoot()` - returns root WebPageNode
- `session.getNode(id)` - get any node by ID
- `session.getChildren(nodeId)` - get children of a node
- `session.getColorStyles()` / `session.getTextStyles()` / `session.getFonts()`
- `session.getCollections()` / `session.getCodeFiles()`

### Creating & Cloning
- `session.createWebPage(name)` - creates a new page (returns WebPageNode with Desktop frame child)
- `session.cloneNode(nodeId)` - deep clone any node (returns new node with new ID)
- `session.addText(parentId, { tag: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p' })` - add text node (returns undefined but creates)
- `session.addSVG(parentId, svg)` - add SVG content
- `session.addComponentInstance(...)` - add component instance

### Modifying
- **`session.setAttributes(nodeId, { name: 'new text' })`** - THE way to change text content on TextNodes. The `name` property IS the visible text.
- `session.setAttributes(nodeId, { backgroundColor: '#hex', visible: bool, ... })` - style any node
- `session.setParent(nodeId, newParentId)` - reparent/move nodes
- `session.setSelection([nodeId1, nodeId2])` - select nodes
- `session.setCustomCode(code)` - set custom code

### Publishing
- `session.publish()` - returns { deployment: { id } }
- `session.deploy(deploymentId)` - deploy to production
- `session.getChangedPaths()` - see what changed
- `session.getDeployments()` - list deployments

### AI Agent Methods
- `session.readProjectForAgent(queries)` - read project for AI agent (takes array of query objects)
- `session.applyAgentChanges(dslString)` - apply changes via DSL commands (string format, undocumented)

### Cleanup
- `session.disconnect()` - MUST call or script won't exit

## Critical Gotchas

1. **TextNode.name IS the text content** - `setAttributes(id, { name: 'new text' })` changes visible text
2. **setText() doesn't work on Server API** - returns "No text nodes are selected". Use setAttributes name instead.
3. **cloneNode keeps SAME child IDs** as original - the cloned structure shares text node IDs with the source
4. **API key is project-scoped** - one key per project, generated in Framer site settings
5. **addText returns undefined** but still creates the node
6. **ESM only** - must use `import` not `require`. Run with `--input-type=module` flag or `.mjs` extension

## Node Types
- `WebPageNode` - a page (has breakpoint frames as children)
- `FrameNode` - container/layout frame
- `TextNode` - text element (name = visible text)
- `ComponentInstanceNode` - instance of a component
- `SVGNode` - SVG element

## Build Pattern: Clone + Modify

The most reliable way to build pages:
1. Clone an existing section: `const clone = await session.cloneNode(sourceId)`
2. Reparent into target: `await session.setParent(clone.id, targetParentId)`
3. Find text nodes: recursively `getChildren()` looking for TextNode
4. Update text: `setAttributes(textNodeId, { name: 'new content' })`
5. Update styles: `setAttributes(frameId, { backgroundColor: '#hex' })`

## Framer + GHL Integration

### Form Webhook
- In Framer: form component > Send To > Webhook > enter GHL webhook URL
- GHL webhook URL format: `https://services.leadconnectorhq.com/hooks/<webhook_id>`
- Framer sends JSON POST with form field names as keys
- Add `Framer-Signature` header for security (SHA-256 hash)

### Attribution
- FormOrigin (formorigin.io) passes UTM/attribution data between Framer and GHL automatically

## Luke's Project Details
- **Project**: LUKES-VERSION (`XH1cG16a7HiNWL9qFVjT`)
- **API Key**: stored in `~/.claude/projects/-Users-luke/secrets/framer.env`
- **Workshop Page**: ID `CL78fjhRG`, Desktop frame `OLkH3S6mb`
- **Workshop Main container**: `g7Xj3CbjK`
