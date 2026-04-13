/// <reference path="../../model/gen/gen.ts" />
namespace $.$$ {

	export class $bog_wiki_mws_table_live extends $.$bog_wiki_mws_table_live {

		@ $mol_mem
		model() {
			return new this.$.$bog_wiki_model()
		}

		@ $mol_mem
		table_data(): $bog_wiki_model_gen_components['schemas']['GetRecordsData'] {
			return this.model().get_table([ this.dst_id(), this.view_id() ])
		}

		@ $mol_mem
		fields_data(): $bog_wiki_model_gen_components['schemas']['GetFieldsResponse'] {
			return this.model().get_fields([ this.dst_id(), this.view_id() ])
		}

		bump_revision() {
			const m = this.model()
			m.data_revision( m.data_revision() + 1 )
		}

		@ $mol_mem
		override toolbar_title() {
			const dstId = this.dst_id()
			return dstId ? `MWS: ${ dstId }` : 'MWS Table'
		}

		@ $mol_mem
		override columns() {
			const fields = this.fields_data()?.data?.fields
			if( !fields ) return []
			return fields.map( ( field: any ) => ({
				id: field.name ?? field.id ?? '',
				title: field.name ?? field.id ?? '',
			}) )
		}

		@ $mol_mem
		records_raw() {
			return this.table_data()?.data?.records ?? []
		}

		@ $mol_mem
		override data() {
			return this.records_raw().map( ( r: any ) => r.fields ?? {} )
		}

		private save_timers = new Map< string, $mol_after_timeout >()

		@ $mol_mem_key
		override cell_value( id: { row: string[], col: string }, next?: string ) {
			if( next !== undefined ) {
				const key = id.row.join( '/' ) + '\t' + id.col
				this.save_timers.get( key )?.destructor()
				this.save_timers.set( key, new this.$.$mol_after_timeout( 1000, () => {
					this.save_timers.delete( key )
					const idx = Number( id.row[ id.row.length - 1 ] )
					const record = this.records_raw()[ idx ] as any
					if( record?.recordId ) {
						this.model().update_records(
							this.dst_id(),
							[{ recordId: record.recordId, fields: { [ id.col ]: next } }],
						)
						this.bump_revision()
					}
				} ) )
				return next
			}
			const idx = Number( id.row[ id.row.length - 1 ] )
			const val = this.records_raw()[ idx ]?.fields?.[ id.col ]
			return val == null ? '' : String( val )
		}

		@ $mol_action
		refresh( event?: Event ) {
			if( !event ) return null
			this.bump_revision()
			return event
		}

		@ $mol_action
		add_row( event?: Event ) {
			if( !event ) return null
			this.model().create_records( this.dst_id(), [{ fields: {} }] )
			this.bump_revision()
			return event
		}

		@ $mol_action
		delete_selected( event?: Event ) {
			if( !event ) return null
			const sel = this.selected() as string[]
			const recordIds = sel
				.map( idx => ( this.records_raw()[ Number( idx ) ] as any )?.recordId )
				.filter( Boolean ) as string[]
			if( !recordIds.length ) return event
			this.model().delete_records( this.dst_id(), recordIds )
			this.selected( [] )
			this.bump_revision()
			return event
		}

	}

}
