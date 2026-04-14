#!/usr/bin/env python3
"""Generate WikiLive presentation PDF — 15 slides max."""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

W, H = landscape(A4)
OUT = "/Users/cmyser/code/mam/bog/wiki/docs/WikiLive_presentation.pdf"
DIAGRAM = "/Users/cmyser/code/mam/bog/wiki/docs/component_diagram.png"

# Colors
BG = HexColor('#FAFBFC')
ACCENT = HexColor('#1a56db')
ACCENT2 = HexColor('#e74c3c')
DARK = HexColor('#1f2937')
GRAY = HexColor('#6b7280')
LIGHT_BG = HexColor('#f0f4ff')
GREEN = HexColor('#059669')
ORANGE = HexColor('#ea580c')

# Try to register a nice font, fallback to Helvetica
FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'

# Check for system fonts with Cyrillic
for font_path in [
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
    '/System/Library/Fonts/Helvetica.ttc',
    '/Library/Fonts/Arial Unicode.ttf',
]:
    if os.path.exists(font_path):
        try:
            pdfmetrics.registerFont(TTFont('ArialUni', font_path))
            FONT = 'ArialUni'
            FONT_BOLD = 'ArialUni'
            break
        except:
            pass


def draw_bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def draw_accent_bar(c, y=H - 8*mm, h=4*mm, color=ACCENT):
    c.setFillColor(color)
    c.rect(0, y, W, h, fill=1, stroke=0)


def draw_title(c, text, y=H - 45*mm, size=32, color=DARK):
    c.setFont(FONT_BOLD, size)
    c.setFillColor(color)
    c.drawString(30*mm, y, text)


def draw_subtitle(c, text, y=H - 60*mm, size=16, color=GRAY):
    c.setFont(FONT, size)
    c.setFillColor(color)
    c.drawString(30*mm, y, text)


def draw_body(c, lines, x=30*mm, y=H - 80*mm, size=13, leading=22, color=DARK):
    c.setFont(FONT, size)
    c.setFillColor(color)
    for line in lines:
        if line.startswith('**'):
            c.setFont(FONT_BOLD, size)
            line = line.strip('*')
        elif line.startswith('  '):
            c.setFont(FONT, size - 1)
            c.setFillColor(GRAY)
        else:
            c.setFont(FONT, size)
            c.setFillColor(color)
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullet(c, items, x=35*mm, y=H - 85*mm, size=12, leading=20):
    c.setFont(FONT, size)
    c.setFillColor(DARK)
    for item in items:
        if item.startswith('!'):  # highlight
            c.setFillColor(ACCENT)
            c.setFont(FONT_BOLD, size)
            item = item[1:]
        else:
            c.setFillColor(DARK)
            c.setFont(FONT, size)
        c.drawString(x, y, f"• {item}")
        y -= leading
    return y


def draw_two_col(c, left_items, right_items, y_start=H - 85*mm):
    y = y_start
    c.setFont(FONT, 11)
    for item in left_items:
        c.setFillColor(DARK)
        c.drawString(35*mm, y, f"• {item}")
        y -= 18
    y = y_start
    for item in right_items:
        c.setFillColor(DARK)
        c.drawString(W/2 + 10*mm, y, f"• {item}")
        y -= 18


def draw_badge(c, text, x, y, color=GREEN):
    c.setFillColor(color)
    tw = c.stringWidth(text, FONT_BOLD, 11) + 12
    c.roundRect(x, y - 4, tw, 20, 4, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 11)
    c.drawString(x + 6, y + 2, text)
    return tw + 8


def draw_page_number(c, num, total=14):
    c.setFont(FONT, 8)
    c.setFillColor(GRAY)
    c.drawRightString(W - 15*mm, 8*mm, f"{num}/{total}")


# ============================================================
c = canvas.Canvas(OUT, pagesize=landscape(A4))

# === SLIDE 1: Title ===
draw_bg(c)
draw_accent_bar(c, y=H - 6*mm, h=6*mm)
c.setFont(FONT_BOLD, 48)
c.setFillColor(ACCENT)
c.drawString(30*mm, H - 70*mm, "WikiLive")
c.setFont(FONT, 22)
c.setFillColor(DARK)
c.drawString(30*mm, H - 90*mm, "Wiki-editor with live MWS Tables integration")
c.setFont(FONT, 14)
c.setFillColor(GRAY)
c.drawString(30*mm, H - 115*mm, "WYSIWYG  |  Real-time CRDT sync  |  Inline table editing  |  Zero backend")
c.drawString(30*mm, H - 135*mm, "Open-source (MIT)  |  $mol framework  |  Giper Baza")

c.setFont(FONT, 11)
c.setFillColor(GRAY)
c.drawString(30*mm, 20*mm, "True Tech Hack 2026  |  Team 10-10")
draw_page_number(c, 1)
c.showPage()

# === SLIDE 2: Problem & Solution ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Problem & Solution")
y = H - 75*mm
c.setFont(FONT_BOLD, 14)
c.setFillColor(ACCENT2)
c.drawString(30*mm, y, "Problem:")
y -= 22
draw_body(c, [
    "MWS Tables data is isolated from documentation",
    "Wiki pages and tables live in different tools",
    "No way to edit table data inline in a wiki page",
], y=y, size=12)

y -= 90
c.setFont(FONT_BOLD, 14)
c.setFillColor(GREEN)
c.drawString(30*mm, y, "Solution: WikiLive")
y -= 22
draw_body(c, [
    "WYSIWYG wiki-editor with live MWS Tables as first-class blocks",
    "Inline cell editing syncs to MWS API in real-time (PATCH, debounce 1s)",
    "Grid & Gallery views, slash-menu, backlinks, CRDT collaboration",
    "0 lines of backend code — everything runs on the client",
], y=y, size=12)
draw_page_number(c, 2)
c.showPage()

# === SLIDE 3: Architecture ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Architecture", size=28)
draw_subtitle(c, "UML Component Diagram", y=H - 55*mm, size=13)
if os.path.exists(DIAGRAM):
    img = ImageReader(DIAGRAM)
    iw, ih = img.getSize()
    max_h = H - 75*mm
    max_w = W - 60*mm
    scale = min(max_w / iw, max_h / ih)
    c.drawImage(DIAGRAM, 30*mm, 15*mm, width=iw * scale, height=ih * scale)
draw_page_number(c, 3)
c.showPage()

# === SLIDE 4: MWS Tables Integration ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "MWS Tables Integration", size=28)
draw_subtitle(c, "Full CRUD via Fusion API v1", size=14)

y = draw_bullet(c, [
    "!$bog_wiki_model — API client, 8 endpoints",
    "GET: spaces, nodes, views, records, fields",
    "POST/PATCH/DELETE: records (create, update, delete)",
    "Bearer token auth through CORS proxy",
    "!Reactive cache with @$mol_mem_key + data revisions",
    "Inline cell editing: type -> debounce 1s -> PATCH to API",
    "Add Row (POST), Delete selected (DELETE), Refresh",
    "!View switching: fetch views from API, switch in toolbar",
    "Display modes: Grid (table) / Gallery (cards)",
], y=H - 80*mm, size=12, leading=19)
draw_page_number(c, 4)
c.showPage()

# === SLIDE 5: Live Table as Block ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Live Table Inside Wiki Page", size=28)
draw_subtitle(c, "Table is a living object, not a static embed", size=14)

draw_bullet(c, [
    "Slash-menu: / -> MWS Table -> enter dstId",
    "!Table renders inline as $mol component in the page body",
    "contentEditable=false for the table block",
    "Plugin Registry with render() callback + WeakMap cache",
    "Cell editing -> real-time PATCH to MWS Fusion API",
    "!Two-way sync: edit in WikiLive <-> MWS Tables",
    "Toolbar: view switcher, mode toggle, refresh, add/delete",
    "Persists after page reload (config stored in Giper Baza)",
], y=H - 80*mm, size=12, leading=19)
draw_page_number(c, 5)
c.showPage()

# === SLIDE 6: Editor Features ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "WYSIWYG Editor", size=28)
draw_subtitle(c, "Block-based, contenteditable, open-source MIT", size=14)

draw_two_col(c,
    [
        "Block types: paragraph, H1-H6,",
        "  lists, quotes, code, images",
        "Slash-menu ( / ) with all plugins",
        "Markdown shortcuts: #, ##, >, ```, -",
        "Enter = new block",
        "Backspace = delete empty block",
        "Tab / Shift+Tab = change level",
        "Drag & drop blocks",
    ],
    [
        "Image upload: drag & drop, paste",
        "Embed: YouTube, Vimeo, iframes",
        "AI block: LLM content generation",
        "Wikilinks: [[page name]]",
        "Auto backlinks across all pages",
        "Comments per block",
        "History / versioning (snapshots)",
        "Plugin system: extensible",
    ],
    y_start=H - 80*mm,
)
draw_page_number(c, 6)
c.showPage()

# === SLIDE 7: Slash-menu & Hotkeys ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Slash-menu & Hotkeys", size=28)
draw_subtitle(c, "Fast block insertion and keyboard navigation", size=14)

y = H - 82*mm
c.setFont(FONT_BOLD, 13)
c.setFillColor(ACCENT)
c.drawString(30*mm, y, "Slash-menu plugins:")
y -= 20
draw_bullet(c, [
    "Paragraph, Heading H1-H6, List, Quote, Code",
    "Image, Embed (YouTube, Vimeo), MWS Table, AI",
    "Extensible: any plugin registers via $bog_wysiwyg_plugin_registry",
], x=35*mm, y=y, size=12, leading=19)

y -= 80
c.setFont(FONT_BOLD, 13)
c.setFillColor(ACCENT)
c.drawString(30*mm, y, "Keyboard shortcuts:")
y -= 20
draw_bullet(c, [
    "# + Space = H1  |  ## + Space = H2  |  ### = H3 ...",
    "> + Space = Blockquote  |  ``` + Space = Code block",
    "- + Space = List item  |  Enter = New block",
    "Backspace (empty) = Remove block  |  Tab = Indent",
], x=35*mm, y=y, size=12, leading=19)
draw_page_number(c, 7)
c.showPage()

# === SLIDE 8: Backlinks & Graph ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Backlinks & Page Graph", size=28)
draw_subtitle(c, "Knowledge graph navigation", size=14)

draw_bullet(c, [
    "!Wikilinks: type [[page name]] to link between pages",
    "Automatic backlink detection across all pages",
    "all_pages_info() scans HTML content of every block",
    "",
    "!Interactive page graph visualization",
    "Click on graph node = navigate to page",
    "Graph panel toggle in toolbar",
    "",
    "!Sidebar with page list + rename + create",
    "Multiple registries (notebooks)",
], y=H - 80*mm, size=12, leading=19)
draw_page_number(c, 8)
c.showPage()

# === SLIDE 9: Real-time Collaboration ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Real-time Collaboration", size=28)
draw_subtitle(c, "Giper Baza CRDT — conflict-free sync", size=14)

draw_bullet(c, [
    "!Each page = separate Giper Baza Land",
    "!Each block = typed Pawn inside the Land",
    "CRDT data types: conflicts are impossible by design",
    "Delta-based sync between all connected clients",
    "Multiple users edit the same page simultaneously",
    "",
    "!No server logic needed — sync is peer-to-peer via relays",
    "Works through any number of relay nodes",
    "Automatic merge of concurrent edits",
    "Real-time cursor/change propagation",
], y=H - 80*mm, size=12, leading=19)
draw_page_number(c, 9)
c.showPage()

# === SLIDE 10: UX & Interface ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "User Experience", size=28)
draw_subtitle(c, "Clean, fast, accessible", size=14)

draw_two_col(c,
    [
        "Clean block-based layout",
        "Sidebar with page navigation",
        "Toolbar: registry, history, graph,",
        "  permissions, profile, theme",
        "Dark / Light theme (one click)",
        "Adaptive: desktop, tablet, mobile",
        "Russian + English localization",
    ],
    [
        "Instant autosave (CRDT)",
        "No loading spinners for local data",
        "Inline table editing without popups",
        "Drag handles for block reordering",
        "MWS Table: Grid & Gallery modes",
        "View switcher in table toolbar",
        "0-click registration (auto crypto key)",
    ],
    y_start=H - 80*mm,
)
draw_page_number(c, 10)
c.showPage()

# === SLIDE 11: Additional Features ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Additional Features", size=28)
draw_subtitle(c, "Beyond requirements", size=14)

draw_two_col(c,
    [
        "Comments per block",
        "Version history (snapshots)",
        "AI content generation (LLM)",
        "Interactive page graph",
        "Plugin system (extensible)",
        "Embed widgets (YouTube, etc)",
        "Permissions UI (owner/editor/viewer)",
    ],
    [
        "Web Component embedding",
        "Desktop builds (Tauri)",
        "Pull-reactivity (no Virtual DOM)",
        "Offline First ($mol_offline)",
        "Graceful network degradation",
        "Proof of Work (anti-flood)",
        "E2E encryption by default",
    ],
    y_start=H - 80*mm,
)
draw_page_number(c, 11)
c.showPage()

# === SLIDE 12: Zero Backend ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Zero Backend Architecture", size=28)
draw_subtitle(c, "0 lines of server code written", size=14)

draw_bullet(c, [
    "!0 lines of backend code — no server, no API, no database",
    "Giper Baza handles: storage, sync, auth, encryption",
    "Hosting = static file server (any CDN)",
    "",
    "!E2E encryption by default — data breach = encrypted blob",
    "!Proof of Work anti-flood — no WAF, rate limiting, captcha needed",
    "!Auto-registration: crypto key on first visit, 0 clicks",
    "",
    "Client-side only: IndexedDB + CRDT + relay sync",
    "MWS Tables API: only external integration (CORS proxy)",
], y=H - 80*mm, size=12, leading=19)
draw_page_number(c, 12)
c.showPage()

# === SLIDE 13: Tech Stack ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Technology Stack", size=28)

y = H - 75*mm
items = [
    ("$mol", "Reactive UI framework, pull-reactivity, no Virtual DOM, 3x less code"),
    ("MAM", "Zero-config build system, auto-dependency resolution, tree shaking"),
    ("Giper Baza", "CRDT database, E2E encryption, offline-first, real-time sync"),
    ("TypeScript", "Full type safety: components, styles (CSS-in-TS), bindings"),
    ("view.tree", "Declarative UI DSL, two-way bindings, component composition"),
    ("MWS Fusion API", "REST API v1 for tables CRUD, views, fields, spaces"),
    ("CORS Proxy", "HTTP proxy for cross-origin MWS API requests"),
    ("MIT License", "Open-source editor: github.com/b-on-g/wysiwyg"),
]
for name, desc in items:
    c.setFont(FONT_BOLD, 13)
    c.setFillColor(ACCENT)
    c.drawString(35*mm, y, name)
    c.setFont(FONT, 11)
    c.setFillColor(DARK)
    c.drawString(80*mm, y, f"— {desc}")
    y -= 20

draw_page_number(c, 13)
c.showPage()

# === SLIDE 14: Roadmap ===
draw_bg(c)
draw_accent_bar(c)
draw_title(c, "Development Roadmap", size=28)
draw_subtitle(c, "What's next", size=14)

draw_two_col(c,
    [
        "Enforce permissions (CRDT-level)",
        "MWS Tables: Kanban view",
        "MWS Tables: create new tables",
        "Design Kit integration",
        "Full-text search across pages",
        "Export: PDF, Markdown, HTML",
    ],
    [
        "Mobile-native app (Tauri Mobile)",
        "Collaborative cursors (presence)",
        "Table formulas & computed fields",
        "Custom block plugin SDK",
        "Public sharing links",
        "Template pages library",
    ],
    y_start=H - 80*mm,
)
draw_page_number(c, 14)
c.showPage()

# === SLIDE 15: Summary ===
draw_bg(c)
draw_accent_bar(c, color=GREEN)
draw_title(c, "Summary", size=36, color=GREEN)

y = H - 80*mm
items = [
    "Full MWS Tables CRUD integration (8 API endpoints)",
    "Live inline table editing with real-time API sync",
    "WYSIWYG block editor: slash-menu, hotkeys, drag & drop",
    "Wikilinks + automatic backlinks + page graph",
    "Real-time collaboration via CRDT (Giper Baza)",
    "Open-source editor, MIT license",
    "0 lines of backend | E2E encryption | Offline First",
    "14 additional features beyond requirements",
]
c.setFont(FONT, 14)
for item in items:
    c.setFillColor(DARK)
    c.drawString(35*mm, y, f"✓  {item}")
    y -= 22

y -= 15
c.setFont(FONT_BOLD, 16)
c.setFillColor(ACCENT)
c.drawString(35*mm, y, "github.com/b-on-g/wiki  |  github.com/b-on-g/wysiwyg")

draw_page_number(c, 15)
c.showPage()

c.save()
print(f"Generated: {OUT}")
print(f"Size: {os.path.getsize(OUT) / 1024:.0f} KB")
