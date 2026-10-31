---
name: google-stitch
description: Generate UI designs and export production-ready HTML/CSS using Google Stitch. Use when the user wants to design a web page, landing page, app screen or UI mockup, or asks to turn a design into HTML.
---

# Google Stitch - AI UI Design Skill

Generate professional UI designs and export production-ready HTML/CSS using Google Stitch.

## Setup
- MCP server: `stitch-mcp` (npx stitch-mcp)
- Auth: Uses Google Application Default Credentials at `~/.config/gcloud/application_default_credentials.json`
- If auth fails: Run `gcloud auth application-default login` or recreate ADC from gws credentials

## Available Tools

### Project Management
- `create_project` - Create a new Stitch project (container for screens)
- `get_project` - Get project details by name
- `list_projects` - List all projects
- `list_screens` - List screens in a project

### Design Generation
- `generate_screen_from_text` - Generate a new screen from a text prompt (THE MAIN TOOL)
- `edit_screens` - Edit existing screens with a text prompt
- `generate_variants` - Generate variations of existing screens

### Design System
- `create_design_system` - Create a design system (colours, fonts, spacing)
- `update_design_system` - Update an existing design system
- `list_design_systems` - List design systems
- `apply_design_system` - Apply a design system to screens

### Export
- `fetch_screen_code` - Get the HTML/CSS code of a screen
- `fetch_screen_image` - Get a screenshot/preview of a screen
- `get_screen` - Get screen details

## Workflow

1. **Create project**: `create_project` with a name
2. **Set design system**: `create_design_system` with brand colours, fonts
3. **Generate screens**: `generate_screen_from_text` with detailed prompts
4. **Review**: `fetch_screen_image` to preview, `fetch_screen_code` to get HTML
5. **Iterate**: `edit_screens` to refine
6. **Export**: `fetch_screen_code` to get production HTML/CSS
7. **Deploy**: Merge into landing page HTML, deploy to Vercel

## Loop Intelligence Brand Specs (for prompts)

- Primary: #1E1B4B (Loop Indigo) — headings, logo tile, dark backgrounds
- Accent on indigo: #34D399 (Loop Mint)
- Accent on light: #10B981 (Loop Emerald)
- Background: #FFFFFF, soft panels #F3F3F8 (Mist)
- Text: #1E1B4B on light, #FFFFFF on indigo, #555468 (Slate) for captions
- Headlines: Poppins, weight 700
- Body: Poppins, weight 400
- Style: Clean and light, generous whitespace, thin borders on cards, no gradient glows
- No em dashes, no AI slop words

**Contrast rule:** mint on white is 1.9:1 and fails accessibility — use mint only on
indigo, and Emerald for accents on light backgrounds.

## Integration with a landing page

The generated HTML/CSS from Stitch can be merged into any existing landing-page file.
Typical deploy pipeline: edit HTML → push to your host (Vercel, Netlify, GHL, etc.) → verify.
