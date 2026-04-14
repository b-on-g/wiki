/// <reference path="../model/gen/gen.ts" />
namespace $.$$ {
	const wiki_table_ids = ['dstBumsSV6ng3k0nHd', 'viwklpg2YdqyQ'] as const

	export class $bog_wiki_editor extends $.$bog_wiki_editor {

		/** Wiki users can always edit their own pages — permissions are visual-only for now */
		override editor_readonly() {
			return false
		}

		/** Read registry link from URL arg */
		registry_link_arg( next?: string ) {
			if( next !== undefined ) {
				this.$.$mol_state_arg.value( 'registry', next || null )
				return next
			}
			return this.$.$mol_state_arg.value( 'registry' ) ?? ''
		}

		/** Read page link from URL arg */
		page_link_arg( next?: string ) {
			if( next !== undefined ) {
				this.$.$mol_state_arg.value( 'page', next || null )
				return next
			}
			return this.$.$mol_state_arg.value( 'page' ) ?? ''
		}

		/** User data from home land. Do NOT put @$mol_mem. */
		wiki_user_data() {
			const home = this.$.$giper_baza_glob.home()
			if( !home ) return null
			return home.land().Data( $bog_wysiwyg_model_user_data )
		}

		/** List of registry link strings from home land */
		@ $mol_mem
		wiki_user_registry_links(): readonly string[] {
			const data = this.wiki_user_data()
			if( !data ) return []
			const list = data.Registries()
			if( !list ) return []
			const items = list.items_vary() ?? []
			return items
				.map( v => $giper_baza_vary_cast_link( v ) )
				.filter( $mol_guard_defined )
				.map( link => link.str )
		}

		/** Registry data by link string. Do NOT put @$mol_mem. */
		wiki_registry_data( link?: string ) {
			const l = link ?? this.registry_link_arg()
			if( !l ) return null
			const land = this.$.$giper_baza_glob.Land( new $giper_baza_link( l ) )
			return land.Data( $bog_wysiwyg_model_registry )
		}

		/** All page land link strings from current registry */
		@ $mol_mem
		wiki_page_links(): readonly string[] {
			const data = this.wiki_registry_data()
			if( !data ) return []
			const list = data.Pages()
			if( !list ) return []
			const items = list.items_vary() ?? []
			return items
				.map( v => $giper_baza_vary_cast_link( v ) )
				.filter( $mol_guard_defined )
				.map( link => link.str )
		}

		/** Add a registry link to user's home land */
		@ $mol_action
		wiki_user_registries_add( link_str: string ) {
			const data = this.wiki_user_data()
			if( !data ) return
			const list = data.Registries( 'auto' )
			if( !list ) return
			const current = list.items_vary() ?? []
			list.items_vary([ ...current, new $giper_baza_link( link_str ) ])
		}

		/** Create registry land if none exists, return registry data */
		@ $mol_action
		wiki_registry_ensure() {
			let data = this.wiki_registry_data()
			if( data ) return data
			const land = this.$.$giper_baza_glob.land_grab(
				[[ null, $giper_baza_rank_post( 'just' ) ]]
			)
			const link_str = land.link().str
			this.registry_link_arg( link_str )
			this.wiki_user_registries_add( link_str )
			return land.Data( $bog_wysiwyg_model_registry )
		}

		/** Create new registry land, add to home, switch to it, create first page */
		@ $mol_action
		override registry_create( event?: Event ) {
			if( !event ) return null

			const land = this.$.$giper_baza_glob.land_grab(
				[[ null, $giper_baza_rank_post( 'just' ) ]]
			)

			const data = land.Data( $bog_wysiwyg_model_registry )
			data.Title( 'auto' )?.val( '' )

			const link_str = land.link().str

			this.wiki_user_registries_add( link_str )
			this.registry_link_arg( link_str )

			this.page_create( new Event( 'auto' ) )

			return event
		}

		/** Create new page land and add to current registry */
		@ $mol_action
		override page_create( event?: Event ) {
			if( !event ) return null

			const reg_link = this.registry_link_arg()
			const reg_data = this.wiki_registry_data( reg_link )

			const land = this.$.$giper_baza_glob.land_grab(
				[[ null, $giper_baza_rank_post( 'just' ) ]]
			)

			land.Data( $bog_wysiwyg_model_page ).Title( 'auto' )?.val( 'New page' )

			const pages = reg_data?.Pages( 'auto' )
			if( pages ) {
				const current = pages.items_vary() ?? []
				pages.items_vary([ ...current, land.link() ])
			}

			this.page_link_arg( land.link().str )

			return event
		}

		/** Auto-init: ensure registry + "Home" page on first visit */
		@ $mol_mem
		override auto() {
			const reg_link = this.$.$mol_state_arg.value( 'registry' ) ?? ''
			const page_link = this.$.$mol_state_arg.value( 'page' ) ?? ''

			// Both set — nothing to do
			if( reg_link && page_link ) return

			// Registry exists but no page — let parent auto-select first page.
			// Do NOT call ensure_wiki_init() here: registry_create() may be
			// in the middle of setting up the page, and re-entering init
			// causes an infinite loop.
			if( reg_link ) {
				const pages = this.wiki_page_links()
				if( pages.length > 0 ) {
					this.$.$mol_state_arg.value( 'page', pages[0] )
				}
				return
			}

			// No registry at all — first visit, full init
			this.ensure_wiki_init()
		}

		/** All init in one action so URL writes are atomic */
		@ $mol_action
		ensure_wiki_init() {
			let reg_link = this.$.$mol_state_arg.value( 'registry' ) ?? ''

			// Find or create registry
			if( !reg_link ) {
				const saved = this.wiki_user_registry_links()
				if( saved.length > 0 ) {
					reg_link = saved[0]
				} else {
					const land = this.$.$giper_baza_glob.land_grab(
						[[ null, $giper_baza_rank_post( 'just' ) ]]
					)
					reg_link = land.link().str
					land.Data( $bog_wysiwyg_model_registry ).Title( 'auto' )?.val( 'Wiki' )
					this.wiki_user_registries_add( reg_link )
				}
			}

			// Find or create page
			let page_link = this.$.$mol_state_arg.value( 'page' ) ?? ''
			if( !page_link ) {
				const reg_data = this.wiki_registry_data( reg_link )
				const pages_list = reg_data?.Pages()
				const items = pages_list?.items_vary() ?? []
				const links = items
					.map( v => $giper_baza_vary_cast_link( v ) )
					.filter( $mol_guard_defined )

				if( links.length > 0 ) {
					page_link = links[0].str
				} else {
					const land = this.$.$giper_baza_glob.land_grab(
						[[ null, $giper_baza_rank_post( 'just' ) ]]
					)
					land.Data( $bog_wysiwyg_model_page ).Title( 'auto' )?.val( 'Home' )
					const pages = reg_data?.Pages( 'auto' )
					if( pages ) {
						const current = pages.items_vary() ?? []
						pages.items_vary([ ...current, land.link() ])
					}
					page_link = land.link().str
				}
			}

			// Write URL args at the end — atomic in @$mol_action
			this.$.$mol_state_arg.value( 'registry', reg_link )
			this.$.$mol_state_arg.value( 'page', page_link )
		}

		@$mol_mem
		model() {
			return new this.$.$bog_wiki_model()
		}

		@$mol_action
		fetch_table() {
			const m = this.model()
			m.data_revision(m.data_revision() + 1)
		}

		@$mol_mem
		data_spaces(next?: $bog_wiki_model_gen_components['schemas']['ResponseGetSpaces']) {
			return next === undefined ? this.model().get_spaces() : next
		}

		@$mol_mem
		data_table(next?: $bog_wiki_model_gen_components['schemas']['GetRecordsData']) {
			return next === undefined ? this.model().get_table(wiki_table_ids) : next
		}

		@$mol_mem
		data_fields(next?: $bog_wiki_model_gen_components['schemas']['GetFieldsResponse']) {
			return next === undefined ? this.model().get_fields(wiki_table_ids) : next
		}

		@$mol_mem
		get_data_spaces_stringify() {
			return 'Spaces: \n' + JSON.stringify(this.data_spaces(), null, 2)
		}

		@$mol_mem
		get_data_table_stringify() {
			return 'Table: \n' + JSON.stringify(this.data_table(), null, 2)
		}

		@$mol_mem
		get_data_fields_stringify() {
			return 'Fields: \n' + JSON.stringify(this.data_fields(), null, 2)
		}

		// === Page Export ===

		@ $mol_mem
		override export_format( next?: string ) {
			if( next === 'html' ) this.export_html()
			if( next === 'markdown' ) this.export_markdown()
			if( next === 'pdf' ) this.export_pdf()
			return ''
		}

		collect_blocks_html(): string[] {
			const editor = this.Editor()
			const ids = editor.block_ids()
			return ids.map( id => {
				const type = editor.block_type( id )
				const html = editor.block_html( id )
				return { type, html }
			} ).filter( b => b.html ).map( b => {
				if( b.type === 'heading' ) return b.html
				if( b.type === 'code' ) return '<pre><code>' + b.html + '</code></pre>'
				if( b.type === 'quote' ) return '<blockquote>' + b.html + '</blockquote>'
				return '<p>' + b.html + '</p>'
			} )
		}

		page_title_text(): string {
			const editor = this.Editor()
			const ids = editor.block_ids()
			if( !ids.length ) return 'page'
			const first_html = editor.block_html( ids[ 0 ] )
			const tmp = this.$.$mol_dom_context.document.createElement( 'div' )
			tmp.innerHTML = first_html
			return tmp.textContent?.trim() || 'page'
		}

		download_file( filename: string, content: string, mime: string ) {
			const blob = new Blob( [ content ], { type: mime } )
			const url = URL.createObjectURL( blob )
			const a = this.$.$mol_dom_context.document.createElement( 'a' )
			a.href = url
			a.download = filename
			a.click()
			URL.revokeObjectURL( url )
		}

		export_html() {
			const blocks = this.collect_blocks_html()
			const title = this.page_title_text()
			const html = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>'
				+ title
				+ '</title>\n<style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6}pre{background:#f5f5f5;padding:1rem;overflow-x:auto}blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:1rem;color:#555}img{max-width:100%}</style>\n</head>\n<body>\n'
				+ blocks.join( '\n' )
				+ '\n</body>\n</html>'
			this.download_file( title + '.html', html, 'text/html' )
		}

		export_markdown() {
			const editor = this.Editor()
			const ids = editor.block_ids()
			const lines: string[] = []

			for( const id of ids ) {
				const type = editor.block_type( id )
				const html = editor.block_html( id )
				if( !html ) continue

				const tmp = this.$.$mol_dom_context.document.createElement( 'div' )
				tmp.innerHTML = html
				const text = tmp.textContent?.trim() || ''

				if( !text && !html.includes( '<img' ) ) continue

				const level = editor.block_level( id )

				if( type === 'heading' ) {
					lines.push( '#'.repeat( level || 1 ) + ' ' + text )
				} else if( type === 'quote' ) {
					lines.push( '> ' + text )
				} else if( type === 'code' ) {
					lines.push( '```\n' + text + '\n```' )
				} else if( type === 'list' ) {
					lines.push( '- ' + text )
				} else {
					let md = $bog_wysiwyg_html_to_md( html )
					if( md ) lines.push( md )
				}
				lines.push( '' )
			}

			const title = this.page_title_text()
			this.download_file( title + '.md', lines.join( '\n' ), 'text/markdown' )
		}

		export_pdf() {
			this.$.$mol_dom_context.print()
		}
	}
}
