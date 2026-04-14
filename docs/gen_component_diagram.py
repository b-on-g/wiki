#!/usr/bin/env python3
"""Generate UML Component Diagram for WikiLive editor + MWS Tables integration."""

import graphviz

g = graphviz.Digraph(
    'WikiLive_Components',
    format='png',
    engine='dot',
    graph_attr={
        'rankdir': 'TB',
        'fontname': 'Helvetica',
        'fontsize': '13',
        'label': 'WikiLive — UML Component Diagram\nEditor & MWS Tables API Integration',
        'labelloc': 't',
        'labeljust': 'c',
        'pad': '0.5',
        'nodesep': '0.6',
        'ranksep': '0.8',
        'bgcolor': 'white',
        'dpi': '150',
    },
    node_attr={
        'fontname': 'Helvetica',
        'fontsize': '11',
        'shape': 'component',
        'style': 'filled',
    },
    edge_attr={
        'fontname': 'Helvetica',
        'fontsize': '9',
    },
)

# ── Application Layer ──
with g.subgraph(name='cluster_app') as c:
    c.attr(label='Application Layer', style='dashed', color='#4a90d9', fontcolor='#4a90d9', fontsize='12')
    c.node('wiki_app', '$bog_wiki_app\n«$mol_view»', fillcolor='#dbeafe')
    c.node('wiki_editor', '$bog_wiki_editor\n«$bog_wysiwyg_app»', fillcolor='#dbeafe')

# ── WYSIWYG Editor Core ──
with g.subgraph(name='cluster_wysiwyg') as c:
    c.attr(label='WYSIWYG Editor Core (bog/wysiwyg)', style='dashed', color='#22c55e', fontcolor='#22c55e', fontsize='12')
    c.node('wysiwyg_app', '$bog_wysiwyg_app\n«$mol_page»', fillcolor='#dcfce7')
    c.node('wysiwyg', '$bog_wysiwyg\n«contenteditable»', fillcolor='#dcfce7')
    c.node('block', '$bog_wysiwyg_block\n«$mol_view»', fillcolor='#dcfce7')
    c.node('plugin_registry', 'Plugin Registry\n«$bog_wysiwyg_plugin_registry»', fillcolor='#dcfce7')

# ── Permissions ──
with g.subgraph(name='cluster_permissions') as c:
    c.attr(label='Permissions System', style='dashed', color='#a855f7', fontcolor='#a855f7', fontsize='12')
    c.node('permissions', 'Permissions Panel\n«role: owner/editor/viewer»', fillcolor='#f3e8ff')
    c.node('readonly', 'Readonly Mode\n«block.readonly, contentEditable»', fillcolor='#f3e8ff')

# ── MWS Integration ──
with g.subgraph(name='cluster_mws') as c:
    c.attr(label='MWS Tables Integration (bog/wiki/mws)', style='dashed', color='#f97316', fontcolor='#f97316', fontsize='12')
    c.node('mws_plugin', 'MWS Table Plugin\n«mws_table»', fillcolor='#ffedd5')
    c.node('table_live', '$bog_wiki_mws_table_live\n«$mol_view»', fillcolor='#ffedd5')
    c.node('mws_space', '$bog_wiki_mws_space\n«space browser»', fillcolor='#ffedd5')
    c.node('table_grid', 'Grid View\n«$bog_ui_table»', fillcolor='#ffedd5')
    c.node('table_gallery', 'Gallery View\n«$mol_list + Card*»', fillcolor='#ffedd5')

# ── Data Layer ──
with g.subgraph(name='cluster_data') as c:
    c.attr(label='Data Layer', style='dashed', color='#ef4444', fontcolor='#ef4444', fontsize='12')
    c.node('model', '$bog_wiki_model\n«API Client»', fillcolor='#fee2e2')
    c.node('baza_models', 'Baza Models\n«page, block, registry,\nuser_data»', fillcolor='#fee2e2')

# ── External Systems ──
with g.subgraph(name='cluster_external') as c:
    c.attr(label='External Systems', style='dashed', color='#6b7280', fontcolor='#6b7280', fontsize='12')
    c.node('cors_proxy', 'CORS Proxy\n«87.120.36.150:39281»', shape='component', fillcolor='#f3f4f6')
    c.node('mws_api', 'MWS Fusion API\n«tables.mws.ru/fusion/v1»', shape='component', fillcolor='#f3f4f6', style='filled,bold')
    c.node('giper_baza', 'Giper Baza\n«CRDT Sync»', shape='component', fillcolor='#f3f4f6', style='filled,bold')

# ── Edges ──

# App → Editor
g.edge('wiki_app', 'wiki_editor', label='sub')
g.edge('wiki_editor', 'wysiwyg_app', label='extends', style='dashed', arrowhead='empty')

# WYSIWYG App internals
g.edge('wysiwyg_app', 'wysiwyg', label='Editor')
g.edge('wysiwyg_app', 'permissions', label='Permissions_panel')
g.edge('wysiwyg', 'block', label='Block*')
g.edge('block', 'plugin_registry', label='render()')

# Permissions
g.edge('permissions', 'giper_baza', label='land.pass_rank()\nland._gift', style='dashed')
g.edge('permissions', 'readonly', label='editor_readonly')
g.edge('readonly', 'block', label='readonly=true', style='dotted')

# MWS Plugin → Table Live
g.edge('plugin_registry', 'mws_plugin', label='register')
g.edge('mws_plugin', 'table_live', label='render(block)')
g.edge('wiki_editor', 'mws_space', label='main_content')

# Table Live → Views
g.edge('table_live', 'table_grid', label='view_mode=grid')
g.edge('table_live', 'table_gallery', label='view_mode=gallery')

# Table Live → Model
g.edge('table_live', 'model', label='get_table()\nget_fields()\nget_views()\ncreate/update/delete')

# Model → External
g.edge('model', 'cors_proxy', label='$mol_fetch')
g.edge('cors_proxy', 'mws_api', label='proxy', style='bold')

# Baza connections
g.edge('wysiwyg_app', 'baza_models', label='page CRUD')
g.edge('baza_models', 'giper_baza', label='CRDT sync', style='dashed')
g.edge('block', 'baza_models', label='Content pawn', style='dashed')

# MWS API details (note)
g.node('api_note',
    'MWS Fusion API v1\n─────────────────\n'
    'GET  /spaces\n'
    'GET  /spaces/{id}/nodes\n'
    'GET  /datasheets/{id}/views\n'
    'GET  /datasheets/{id}/records\n'
    'GET  /datasheets/{id}/fields\n'
    'POST /datasheets/{id}/records\n'
    'PATCH /datasheets/{id}/records\n'
    'DELETE /datasheets/{id}/records',
    shape='note', fillcolor='#fffde7', fontsize='9',
)
g.edge('mws_api', 'api_note', style='dotted', arrowhead='none')

# Render
output = g.render('/Users/cmyser/code/mam/bog/wiki/docs/component_diagram', cleanup=True)
print(f'Generated: {output}')
