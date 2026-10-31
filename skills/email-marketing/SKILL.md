---
name: email-marketing
description: "Create high-converting email templates with professional HTML design and sharp copywriting for GHL. Covers visual design (HTML/CSS), copy frameworks, sequence strategy, and GHL-specific implementation. Use when building email templates, writing email campaigns, designing email sequences, or creating HTML emails."
---

# Email Marketing Skill

Build professional, high-converting emails that look like they came from Klaviyo or Flodesk, not a default GHL template. Covers both visual design (HTML) and copywriting.

## When to Activate

- Building email templates (marketing or transactional)
- Writing email sequences or campaigns
- Creating HTML emails for GHL
- Designing email layouts or components
- Writing subject lines, CTAs, or email copy
- Setting up welcome, nurture, sales, or event sequences

---

## Part 1: HTML Email Architecture

### Base Container (use for every email)

```html
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>{{email_title}}</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .stack-column, .stack-column-cell { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-full-width { width: 100% !important; }
      .mobile-hide { display: none !important; }
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      .bg-white { background-color: #1a1a2e !important; }
      .bg-light { background-color: #16213e !important; }
      .text-dark { color: #e5e7eb !important; }
      .text-muted { color: #9ca3af !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7;">
  <center style="width: 100%; background-color: #f4f4f7;">
    <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td><![endif]-->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px;" class="container">
      <!-- EMAIL CONTENT GOES HERE -->
    </table>
    <!--[if mso]></td></tr></table><![endif]-->
  </center>
</body>
</html>
```

### Font Stack

```css
font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Import Poppins in `<style>` block (progressive enhancement):**
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
```

### Typography Scale

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| H1 | 28px | 700 | 36px | #111827 |
| H2 | 22px | 600 | 30px | #111827 |
| H3 | 18px | 600 | 26px | #374151 |
| Body | 16px | 400 | 26px | #374151 |
| Small | 14px | 400 | 22px | #6b7280 |
| Caption | 12px | 400 | 18px | #9ca3af |

---

## Part 2: Modular Components

### Hero Section

```html
<tr>
  <td align="center" style="padding: 40px 24px 24px 24px; background-color: #ffffff;" class="bg-white mobile-padding">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Logo -->
      <tr>
        <td align="center" style="padding-bottom: 24px;">
          <img src="{{logo_url}}" width="140" alt="{{brand_name}}" style="display: block; width: 140px; height: auto;">
        </td>
      </tr>
      <!-- Headline -->
      <tr>
        <td align="center" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 28px; line-height: 36px; font-weight: 700; color: #111827; padding-bottom: 12px;" class="text-dark">
          {{headline}}
        </td>
      </tr>
      <!-- Subheadline -->
      <tr>
        <td align="center" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; line-height: 26px; color: #6b7280; padding-bottom: 24px;" class="text-muted">
          {{subheadline}}
        </td>
      </tr>
      <!-- CTA Button -->
      <tr>
        <td align="center">
          <!-- BULLETPROOF BUTTON -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" bgcolor="{{brand_color}}" style="border-radius: 8px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{cta_url}}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="17%" strokecolor="{{brand_color}}" fillcolor="{{brand_color}}">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:Helvetica,sans-serif;font-size:16px;font-weight:600;">{{cta_text}}</center>
                </v:roundrect>
                <![endif]-->
                <a href="{{cta_url}}" style="display: inline-block; mso-hide: all; background-color: {{brand_color}}; color: #ffffff; border-radius: 8px; padding: 14px 32px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center;">
                  {{cta_text}}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Hero Image

```html
<tr>
  <td style="padding: 0;">
    <img src="{{hero_image_url}}" width="600" alt="{{hero_image_alt}}" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0;" class="mobile-full-width">
  </td>
</tr>
```

### Text Content Block

```html
<tr>
  <td style="padding: 24px; background-color: #ffffff;" class="bg-white mobile-padding">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; line-height: 26px; color: #374151;" class="text-dark">
          {{body_text}}
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Social Proof / Testimonial Block

```html
<tr>
  <td style="padding: 24px; background-color: #f9fafb;" class="bg-light mobile-padding">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Quote -->
      <tr>
        <td style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; line-height: 26px; color: #374151; font-style: italic; padding: 16px 20px; border-left: 4px solid {{brand_color}};" class="text-dark">
          "{{testimonial_quote}}"
        </td>
      </tr>
      <!-- Attribution -->
      <tr>
        <td style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 22px; color: #6b7280; padding-top: 12px; padding-left: 20px;" class="text-muted">
          {{testimonial_name}}, {{testimonial_role}}
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Two-Column Feature Block

```html
<tr>
  <td style="padding: 24px; background-color: #ffffff;" class="bg-white mobile-padding">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="stack-column-cell" width="50%" valign="top" style="padding-right: 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 18px; font-weight: 600; color: #111827; padding-bottom: 8px;" class="text-dark">
                {{feature_1_title}}
              </td>
            </tr>
            <tr>
              <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 22px; color: #6b7280;" class="text-muted">
                {{feature_1_description}}
              </td>
            </tr>
          </table>
        </td>
        <td class="stack-column-cell" width="50%" valign="top" style="padding-left: 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 18px; font-weight: 600; color: #111827; padding-bottom: 8px;" class="text-dark">
                {{feature_2_title}}
              </td>
            </tr>
            <tr>
              <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 22px; color: #6b7280;" class="text-muted">
                {{feature_2_description}}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Spacer / Divider

```html
<!-- Spacer -->
<tr><td height="24" style="line-height: 24px; font-size: 24px;">&nbsp;</td></tr>

<!-- Divider -->
<tr>
  <td style="padding: 0 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border-top: 1px solid #e5e7eb; height: 1px; line-height: 1px;">&nbsp;</td></tr>
    </table>
  </td>
</tr>
```

### Footer (Standard, use on every email)

```html
<tr>
  <td style="padding: 28px 40px 16px 40px; background-color: #ffffff;" class="bg-white mobile-padding">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

      <!-- Social Icons -->
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
                            <td style="padding: 0 8px;"><a href="https://www.linkedin.com/company/loopintelligence/"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="24" height="24" alt="LinkedIn" style="display: block; border-radius: 4px;"></a></td>
              <td style="padding: 0 8px;"><a href="https://www.instagram.com/loop.intelligence/"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="24" height="24" alt="TikTok" style="display: block; border-radius: 4px;"></a></td>
              <td style="padding: 0 8px;"><a href="https://loopintelligence.com.au"><img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width="24" height="24" alt="Facebook" style="display: block; border-radius: 4px;"></a></td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding-bottom: 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="border-top: 1px solid #f0f0f2; height: 1px; line-height: 1px;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>

      <!-- Company Info -->
      <tr>
        <td align="center" style="font-family: 'Poppins', system-ui, sans-serif; font-size: 13px; line-height: 20px; color: #9ca3af; padding-bottom: 4px;">
          <strong style="color: #6b7280;">Loop Intelligence</strong> &middot; AI Automation Agency
        </td>
      </tr>
      <tr>
        <td align="center" style="font-family: 'Poppins', system-ui, sans-serif; font-size: 12px; line-height: 18px; color: #9ca3af; padding-bottom: 4px;">
          Adelaide, South Australia
        </td>
      </tr>

      <!-- Contact Links -->
      <tr>
        <td align="center" style="font-family: 'Poppins', system-ui, sans-serif; font-size: 12px; line-height: 18px; color: #9ca3af; padding-bottom: 12px;">
          &middot;
        </td>
      </tr>

      <!-- Manage / Unsubscribe -->
      <tr>
        <td align="center" style="font-family: 'Poppins', system-ui, sans-serif; font-size: 11px; line-height: 16px; color: #c4c4c4; padding-bottom: 4px;">
          <a href="{{unsubscribe_url}}" style="color: #c4c4c4; text-decoration: underline;">Unsubscribe</a>
          &middot;
          <a href="{{preferences_url}}" style="color: #c4c4c4; text-decoration: underline;">Manage preferences</a>
          &middot;
          <a href="{{view_in_browser_url}}" style="color: #c4c4c4; text-decoration: underline;">View in browser</a>
        </td>
      </tr>

      <!-- Legal -->
      <tr>
        <td align="center" style="font-family: 'Poppins', system-ui, sans-serif; font-size: 10px; line-height: 14px; color: #d4d4d4; padding-top: 8px;">
          &copy; 2026 Loop Intelligence. All rights reserved.
        </td>
      </tr>

    </table>
  </td>
</tr>
```

---

## Part 3: Loop Intelligence Brand Defaults

When building emails for Loop Intelligence, use these defaults:

| Property | Value |
|----------|-------|
| Brand color (primary) | #1E1B4B (Loop Indigo) |
| Brand color (accent) | #10B981 (Loop Emerald — on light backgrounds) |
| Background (email body) | #f4f4f7 |
| Card background | #ffffff |
| Dark background (premium feel) | #000000 |
| Text (primary) | #111827 (dark) or #FFFFFF on dark backgrounds |
| Text (reduced emphasis) | rgba(255,255,255,0.7) on dark, #6b7280 on light |
| Primary font | Poppins (400 body, 700 headings). Fallback: system-ui, -apple-system, 'Segoe UI', sans-serif |
| Headline font (special) | Poppins Bold Italic (cover/hero headlines only) |
| Logo URL | (use from GHL media library) |
| Company name | Loop Intelligence |
| Footer address | Adelaide, South Australia |

**Brand rules for emails:**
- Indigo is always #1E1B4B, never lightened or darkened
- White is always #FFFFFF. Reduced emphasis = 70% opacity, not grey
- CTA buttons: Loop Indigo (#1E1B4B) background, white text
- No logo on carousel-style content slides (applies to social, not email)
- Poppins is non-negotiable for body text. Use Google Fonts import as progressive enhancement (works in Apple Mail, Gmail web, fails gracefully in Outlook)

---

## Part 4: Email Templates by Type

### Template 1: Clean Marketing Email

**Structure:** Logo > Headline > Subheadline > Hero Image > Body Copy (2-3 short paragraphs) > CTA Button > Footer

**When to use:** Announcements, newsletters, product updates, event invitations

### Template 2: Text-Heavy Email (Hormozi/Welsh Style)

**Structure:** Short greeting > Story hook (2-3 lines) > Insight/lesson > Bridge to offer > Single CTA link (not button) > PS line > Footer

**Styling rules:**
- No images (or just one small one)
- Left-aligned, 16px body text
- Short paragraphs (1-2 sentences max)
- Lots of whitespace between paragraphs
- CTA is a simple text link, not a button
- Feels like a personal email, not a marketing blast

### Template 3: Event Invitation

**Structure:** Logo > Event name (H1) > Date/time/location block > 2-3 bullet value props > CTA "Register Now" button > Social proof (past attendee quote) > Footer

### Template 4: Case Study / Results Email

**Structure:** Logo > Headline ("How {{client}} achieved {{result}}") > Before state (2 lines) > After state (2 lines) > Key metrics (bold numbers) > CTA "See how we did it" > Footer

### Template 5: Follow-Up / Nurture

**Structure:** First name greeting > Reference previous interaction > One value-add insight > Soft CTA ("Reply to this email" or "Book a quick chat") > Signature block > PS line

---

## Part 5: Copywriting Frameworks

### Subject Lines

**Winning patterns (28-50 characters, 6-10 words):**
- **Curiosity gap:** "The 3-word phrase that closed our biggest deal"
- **Specific number:** "5 automations that saved 23 hrs/week"
- **Question:** "Still doing {{pain_point}} manually?"
- **Direct + name:** "{{first_name}}, quick question about {{topic}}"
- **Result tease:** "How {{company}} cut {{metric}} by {{percentage}}"

**Rules:**
- Sentence case, never Title Case or ALL CAPS
- No exclamation marks
- No spam words (free, guarantee, act now, limited time)
- Personalization (first name, company) lifts opens 20-26%
- Preview text is as important as subject line, write both together

### Email Body Frameworks

**PAS (Problem-Agitate-Solve)** - default for agency emails:
1. Name the pain (1 sentence)
2. Twist the knife on cost of inaction (2-3 sentences)
3. Present your solution as the bridge (2-3 sentences)
4. Single CTA

**Story-Lesson-Offer** - for nurture and authority building:
1. Real anecdote (2-3 lines)
2. Extract one insight
3. Bridge to offer or CTA

**BAB (Before-After-Bridge)** - for case study emails:
1. Paint the client's "before" state
2. Show the "after" result with specific numbers
3. Bridge with how you made it happen

### Writing Rules (non-negotiable)

- **One idea per email, one CTA per email** (increases clicks 371%)
- **Short paragraphs:** 1-2 sentences max, never more than 3 lines
- **Conversational tone:** Write like a smart friend explaining something
- **No em dashes** (Loop Intelligence house rule, use commas or full stops)
- **PS line on every sales email** (most-read part after the subject line)
- **Every sentence must pass the "so what?" test** from the reader's perspective
- **Write about the reader's problem**, never about yourself ("We're excited to announce..." is banned)
- **Cut ruthlessly:** Write the email, cut it in half, cut it in half again

---

## Part 6: Sequence Blueprints

### Welcome Sequence (5 emails, 10 days)

| # | Timing | Subject Pattern | Purpose | CTA |
|---|--------|----------------|---------|-----|
| 1 | Immediate | "Welcome, {{name}}. Here's what's next" | Deliver lead magnet, set expectations | Download/access |
| 2 | Day 2 | Story/origin hook | Build trust, share "why" | Read/watch |
| 3 | Day 4 | Specific result/case study | Prove credibility with numbers | See case study |
| 4 | Day 7 | Address top objection | Overcome hesitation | Reply with questions |
| 5 | Day 10 | Clear offer + urgency | Convert | Book a call |

### Event Sequence (workshop invitations)

| # | Timing | Purpose |
|---|--------|---------|
| 1 | 2 weeks before | Announce event, create curiosity |
| 2 | 1 week before | Social proof from past events, details |
| 3 | 3 days before | Urgency, limited spots |
| 4 | Day before | Final reminder, what to expect |
| 5 | Day after | Thank you, recording access, next steps |

### Re-engagement Sequence (3 emails)

| # | Subject Pattern | Approach |
|---|----------------|----------|
| 1 | "Did we lose you?" | Acknowledge absence, offer value |
| 2 | "Last chance: {{compelling offer}}" | Clear incentive to re-engage |
| 3 | "Cleaning up our list" | Final notice, removes if no engagement |

---

## Part 7: GHL Implementation

### Creating Templates via API

```
mcp__ghl-official__emails_create-template
  body_locationId: "{{YOUR_GHL_LOCATION_ID}}"
  body_title: "Template Name"
  body_type: "html"
  body_html: "<full HTML here>"
  body_builderVersion: "2"
```

### Fetching Existing Templates

```
mcp__ghl-official__emails_fetch-template
  locationId: "{{YOUR_GHL_LOCATION_ID}}"
  originId: "{{template_id}}"
```

### Sending an Email with Custom HTML

```
mcp__ghl-official__conversations_send-a-new-message
  body_type: "Email"
  body_contactId: "{{contact_id}}"
  body_subject: "{{subject}}"
  body_html: "<full HTML>"
```

### GHL Merge Fields (use inside HTML)

- `{{contact.first_name}}` - first name
- `{{contact.last_name}}` - last name
- `{{contact.email}}` - email
- `{{contact.company_name}}` - company
- `{{location.name}}` - your business name
- Custom fields: `{{contact.custom_field_name}}`

### GHL Quirks to Know

- **HTML rewriting:** GHL wraps your HTML in nested divs/tables with forced inline styles. Keep your HTML simple and over-specify inline styles
- **No JavaScript or iframes** in emails (blocked by all email clients anyway)
- **No `<style>` blocks for critical styles** (Gmail strips them). Use inline CSS for everything critical, keep `<style>` only for responsive/dark mode
- **Builder v2 only** for all new templates
- **Test before sending:** Always use "Send Test Email" in GHL builder
- **Import supported:** Can import from Mailchimp, ActiveCampaign via URL or forwarded email

---

## Part 8: QA Checklist

Before sending any email, verify:

- [ ] Single CTA (one primary action)
- [ ] Subject line under 50 characters
- [ ] Preview text written (not auto-generated)
- [ ] Alt text on all images
- [ ] CTA button visible without scrolling on mobile
- [ ] Body text 16px minimum
- [ ] No em dashes
- [ ] Unsubscribe link present
- [ ] Tested on mobile preview
- [ ] Merge fields verified (no broken {{tags}})
- [ ] Links all working
- [ ] Dark mode readable

---

## Part 9: Design Principles

### Default Style: White / Light

**All Loop Intelligence emails default to a white/light theme.** Clean, minimal, professional.
- **Background:** #f7f7f8 (page), #ffffff (card/content areas)
- **Text:** #111827 (headlines), #374151 (body), #6b7280 (secondary), #9ca3af (captions)
- **Accent:** #10B981 (Loop Emerald) for CTAs, labels, number badges, accent lines
- **Soft mist tint:** #F3F3F8 for badge backgrounds, label pills, light accent areas
- **No dark/black hero sections** unless specifically requested
- **Rounded card containers** (border-radius: 12px on outer wrapper)
- **Subtle dividers** (1px solid #f0f0f2) between sections, never heavy borders

### Visual Hierarchy Rules

- **White space is a feature.** Generous padding (40px horizontal, 28-32px vertical between sections)
- **One accent color only** (Loop Emerald). No gradients, no multi-color sections
- **Numbered items** use soft mist badge backgrounds (#F3F3F8) with indigo text (#1E1B4B)
- **Testimonial blocks** use a thin left border (3px solid #10B981), not background color changes
- **CTAs are Loop Indigo buttons** with white text, 8px border-radius, generous padding (14px 36px)

### Conversion Patterns (from Klaviyo, Flodesk, ConvertKit, Beehiiv)

- 600px width, single-column is the universal standard
- 60-70% of opens are mobile, so mobile-first is mandatory
- Social proof near CTA lifts conversions 15-30%
- Above-the-fold hero + CTA visible without scrolling
- Poppins as primary font, system fonts as fallback
- 15-16px body text minimum, clean line heights
- Inline CSS only for cross-client rendering
- Content-first design. The words do the work. Let the writing shine

### Every Email Must Include

1. **Logo** at the top (from GHL media library)
2. **Preheader text** (hidden preview text for inbox)
3. **Single primary CTA** (repeated at bottom if email is long)
4. **Standard footer** with social icons, contact details, website, email, unsubscribe, manage preferences, view in browser, and copyright

---

## Related Skills

- `/email-sequence` - detailed sequence strategy and timing
- `/direct-response-copy` - deep copywriting frameworks (Schwartz, Hopkins, Ogilvy)
- `/copywriting` - general marketing copy
- `/ghl-landing-pages` - HTML pages in GHL (same principles, different channel)
- `/content-creator` - brand voice and content frameworks
