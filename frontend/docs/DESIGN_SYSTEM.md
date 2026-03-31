# DESIGN_SYSTEM.md

## 1. Purpose

This file defines the visual system and styling rules for the frontend of the PFE IT Support / Ticket Management Platform.

All frontend code generation must follow this file strictly.
Do not invent new visual styles page by page.
Do not mix unrelated inspirations.
The goal is one consistent SaaS interface across the whole application.

---

## 2. Design Philosophy

The UI must feel:
- professional
- clean
- modern
- calm
- spacious
- efficient

It must NOT feel:
- AI-generated
- flashy
- crowded
- childish
- overly animated
- bootstrap-like
- inconsistent

This is a light SaaS admin interface for an IT support platform.

---

## 3. Product Visual Identity

Hybrid inspiration:
- Sidebar feeling: Zendesk
- Dashboard clarity: Freshdesk
- Table cleanliness: Notion / Zendesk
- Detail page structure: Zoho Desk
- Motion philosophy: Linear

Important:
Do not copy these products literally.
Use them only as inspiration to build one unified design language.

---

## 4. Theme

Mode: Light only

Main feeling:
- soft gray app background
- white cards
- clean borders
- restrained primary color
- strong readability

---

## 5. Color Palette

Background:
- app background: #f5f7fb
- surface/card: #ffffff

Borders:
- default border: #e5e7eb

Text:
- primary text: #111827
- secondary text: #6b7280
- muted text: #9ca3af

Primary brand:
- primary: #2563eb
- primary hover: #1d4ed8
- primary soft background: #dbeafe

Feedback:
- success: #16a34a
- warning: #d97706
- danger: #dc2626
- info: #0ea5e9

Never use too many accent colors on one screen.

---

## 6. Typography

Style:
- clean sans-serif
- modern SaaS hierarchy
- clear contrast between headings and body text

Hierarchy:
- Page title: large, bold
- Section title: medium-large, semibold
- Card title: medium, semibold
- Body text: regular
- Secondary text: smaller, muted

Rules:
- avoid oversized text everywhere
- avoid too many font weights
- keep text hierarchy consistent on all pages

---

## 7. Spacing System

Use generous spacing.
The UI must breathe.

Preferred rhythm:
- page padding: large
- card padding: medium-large
- section gap: medium-large
- element gap: medium

Never create cramped layouts.

---

## 8. Border Radius and Shadows

Radius:
- cards: medium to large
- buttons: medium
- inputs: medium
- modals: large

Shadows:
- use very soft shadows only
- shadows must support depth, not dominate the UI

Avoid:
- heavy shadows
- glowing effects
- exaggerated glassmorphism

---

## 9. Layout Rules

Overall layout:
- fixed or stable sidebar on the left
- top header area when needed
- main content area with clean spacing
- max readability over decorative complexity

Rules:
- align page titles consistently
- action buttons should appear in predictable places
- page sections should follow a stable rhythm
- use cards to structure content, not to decorate everything

---

## 10. Sidebar Rules

Sidebar must feel:
- clean
- structured
- premium
- easy to scan

Rules:
- simple icons
- clear active state
- muted inactive items
- no visual overload
- spacing between items must be balanced

Avoid:
- too many colors
- oversized icons
- random badges everywhere

---

## 11. Buttons

Primary button:
- solid primary color
- clear hover state
- used only for the main action

Secondary button:
- neutral surface
- border visible
- softer emphasis

Danger button:
- reserved for delete/destructive actions only

Rules:
- button styles must be reused globally
- do not create ad-hoc button styles per page
- size and radius must stay consistent

---

## 12. Inputs and Forms

Forms must feel:
- simple
- professional
- easy to scan
- trustworthy

Rules:
- labels always visible
- inputs use white background or very light background
- borders are subtle but visible
- focus state uses primary color cleanly
- errors must be readable and calm

Avoid:
- too many decorations
- floating labels if not used consistently
- inconsistent field heights

---

## 13. Cards

Cards are the main content containers.

Rules:
- white background
- subtle border
- soft shadow only if needed
- clear internal spacing
- titles and actions aligned consistently

Use cards for:
- KPI blocks
- forms
- dashboard sections
- detail sections

Do not over-nest cards inside cards unnecessarily.

---

## 14. Tables

Tables must feel:
- clean
- professional
- easy to read
- operational

Rules:
- soft row separators
- clear hover state
- compact but not crowded
- actions aligned cleanly
- badges for statuses must be readable and restrained

Avoid:
- too much color
- overly dense rows
- random icons in every cell

---

## 15. Status Badges

Statuses must be visually distinct but subtle.

Examples:
- open
- in progress
- pending
- resolved
- closed

Rules:
- use soft tinted backgrounds
- matching readable text color
- avoid saturated badge colors

---

## 16. Modals and Drawers

Use for focused tasks only.

Rules:
- clean header
- clear title
- enough internal spacing
- footer actions aligned consistently

Avoid giant cluttered modals.

---

## 17. Animations and Motion

Motion inspiration: Linear

Rules:
- subtle and fast
- hover transitions
- fade/slide for small UI changes
- no exaggerated bouncing
- no unnecessary animation on every component

Animations must support clarity, not show off.

---

## 18. Icons

Rules:
- simple line icons
- consistent icon family
- small to medium size
- never let icons dominate text

---

## 19. Page Consistency Rules

Every page must contain:
- clear title
- short supporting text when useful
- predictable action area
- structured main content
- consistent spacing and card system

The app should feel like one product, not separate screens made on different days.

---

## 20. What to Avoid

Do not use:
- random gradients everywhere
- colorful backgrounds
- inconsistent border radius
- giant shadows
- too many animations
- centered layouts for admin pages unless intentionally required
- different button/input/table styles on each page
- generic AI dashboard look

---

## 21. Implementation Rule for AI Coding

Before generating any frontend code:
1. Read FRONT_PLAN.md for scope
2. Read DESIGN_SYSTEM.md for UI/styling rules
3. Build only the requested phase
4. Reuse the same visual language and component patterns
5. Do not invent extra features
6. Do not introduce a new design style without updating this file first