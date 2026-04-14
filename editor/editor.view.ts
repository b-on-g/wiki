/// <reference path="../model/gen/gen.ts" />
namespace $.$$ {
	const wiki_table_ids = ['dstBumsSV6ng3k0nHd', 'viwklpg2YdqyQ'] as const

	export class $bog_wiki_editor extends $.$bog_wiki_editor {
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
