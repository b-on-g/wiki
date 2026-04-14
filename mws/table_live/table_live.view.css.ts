namespace $ {

	$mol_style_define( $bog_wiki_mws_table_live, {
		flex: {
			direction: 'column',
			grow: 1,
		},
		gap: '0.5rem',

		Toolbar: {
			flex: {
				wrap: 'wrap',
			},
			gap: '0.5rem',
			align: { items: 'center' },
		},

		Content: {
			flex: {
				direction: 'column',
				grow: 1,
			},
			overflow: { y: 'auto' },
		},

		Gallery: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
			gap: '0.75rem',
			padding: {
				top: '0.5rem',
				bottom: '0.5rem',
				left: '0.5rem',
				right: '0.5rem',
			},
		},

		Card: {
			flex: {
				direction: 'column',
			},
			padding: {
				top: '0.75rem',
				bottom: '0.75rem',
				left: '1rem',
				right: '1rem',
			},
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			gap: '0.25rem',
			box: {
				shadow: [{ x: 0, y: '2px', blur: '6px', spread: 0, color: '#0000001a' }],
			},
		},

		Card_field: {
			gap: '0.5rem',
			font: {
				size: '0.875rem',
			},
			lineHeight: '1.4',
		},

	} )

}
