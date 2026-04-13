namespace $ {

	const render_cache = new WeakMap< $bog_wysiwyg_block, $bog_wiki_mws_table_live >()

	$bog_wysiwyg_plugin_registry.register({

		id: 'mws_table',
		title: '📋 MWS Table',

		on_select: ( editor, block_id ) => {

			const dstId = editor.$.$mol_dom_context.prompt( 'Datasheet ID (dstXXX):' )
			if( !dstId ) {
				editor.focus_block( block_id )
				return
			}

			const viewId = editor.$.$mol_dom_context.prompt( 'View ID (viwXXX, or leave empty):' ) ?? ''

			editor.block_type( block_id, 'mws_table' )
			editor.block_html( block_id, JSON.stringify({ dstId, viewId }) )
		},

		render: ( block ) => {
			let table = render_cache.get( block )
			if( table ) return table

			try {
				const config = JSON.parse( block.html() || '{}' )
				if( !config.dstId ) return null

				table = new block.$.$bog_wiki_mws_table_live()
				table.dst_id = () => config.dstId
				table.view_id = () => config.viewId || ''

				render_cache.set( block, table )
				return table
			} catch {
				return null
			}
		},

	})

}
