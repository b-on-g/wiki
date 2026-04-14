namespace $ {

	const render_cache = new WeakMap< $bog_wysiwyg_block, $bog_wiki_mws_table_live >()

	$bog_wysiwyg_plugin_registry.register({

		id: 'mws_table',
		title: '📋 MWS Table',

		on_select: ( editor, block_id ) => {

			const dstId = editor.$.$mol_dom_context.prompt(
				'Datasheet ID (dstXXX):',
				'dstBumsSV6ng3k0nHd',
			)
			if( !dstId ) {
				return
			}

			const viewId = editor.$.$mol_dom_context.prompt(
				'View ID (viwXXX, empty = all views in toolbar):',
				'viwklpg2YdqyQ',
			) ?? ''

			editor.block_type( block_id, 'mws_table' )
			editor.block_html( block_id, JSON.stringify({ dstId, viewId }) )
		},

		render: ( block ) => {
			let table = render_cache.get( block )
			if( table ) return table

			try {
				const html = block.html()
				const config = JSON.parse( html || '{}' )
				const dstId = config.dstId || 'dstBumsSV6ng3k0nHd'
				const viewId = config.viewId || 'viwklpg2YdqyQ'

				table = new block.$.$bog_wiki_mws_table_live()
				table.dst_id = () => dstId
				table.view_id( viewId )

				render_cache.set( block, table )
				return table
			} catch( error ) {
				if( error instanceof Promise ) throw error
				return null
			}
		},

	})

}
