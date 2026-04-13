/// <reference path="./gen/gen.ts" />
namespace $ {
    export class $bog_wiki_model extends $mol_object {
        // request(model: string, key: string) {
        //     return Resp(
        //         this.$.$mol_fetch.json(`https://models.github.ai/inference/chat/completions`, {
        //             method: 'POST',
        //             headers: {
        //                 Authorization: 'Bearer ' + key,
        //                 'Content-Type': 'application/json',
        //             },
        //             body: this.request_body(model),
        //         }) as any,
        //     )
        // }

        base_url() {
            return 'http://87.120.36.150:39281/https://tables.mws.ru/fusion/v1'
        }

        bearer_token() {
            return 'uskurJvFb5GHRVAWGi1jMCP'
        }

        /** GET request */
        request<T>( url: string ) {
            return $mol_fetch.json( this.base_url() + url, {
                headers: {
                    Authorization: 'Bearer ' + this.bearer_token(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            } ) as T
        }

        /** POST / PATCH / DELETE request */
        request_mut<T>( url: string, method: string, body?: any ) {
            return $mol_fetch.json( this.base_url() + url, {
                method,
                headers: {
                    Authorization: 'Bearer ' + this.bearer_token(),
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: body ? JSON.stringify( body ) : undefined,
            } ) as T
        }

        @$mol_mem
        data_revision( next?: number ) {
            return next ?? 0
        }

        // ── Read ──

        @$mol_mem
        get_spaces(): $bog_wiki_model_gen_components['schemas']['ResponseGetSpaces'] {
            void this.data_revision()
            return this.request( '/spaces' )
        }

        @$mol_mem_key
        get_nodes( spaceId: string ) {
            void this.data_revision()
            return this.request<$bog_wiki_model_gen_components['schemas']['ResponseGetNodes']>(
                `/spaces/${ spaceId }/nodes`
            )
        }

        @$mol_mem_key
        get_views( dstId: string ) {
            void this.data_revision()
            return this.request<$bog_wiki_model_gen_components['schemas']['GetViewsResponse']>(
                `/datasheets/${ dstId }/views`
            )
        }

        @$mol_mem_key
        get_table( ids: readonly [string, string] ): $bog_wiki_model_gen_components['schemas']['GetRecordsData'] {
            void this.data_revision()
            const [ dstId, viewId ] = ids
            const qs = viewId ? `?viewId=${ viewId }` : ''
            return this.request( `/datasheets/${ dstId }/records${ qs }` )
        }

        @$mol_mem_key
        get_fields( ids: readonly [string, string] ): $bog_wiki_model_gen_components['schemas']['GetFieldsResponse'] {
            void this.data_revision()
            const [ dstId, viewId ] = ids
            const qs = viewId ? `?viewId=${ viewId }` : ''
            return this.request( `/datasheets/${ dstId }/fields${ qs }` )
        }

        // ── Create / Update / Delete ──

        create_records( dstId: string, records: { fields: Record<string, any> }[] ) {
            return this.request_mut(
                `/datasheets/${ dstId }/records`,
                'POST',
                { records, fieldKey: 'name' },
            )
        }

        update_records( dstId: string, records: { recordId: string, fields: Record<string, any> }[] ) {
            return this.request_mut(
                `/datasheets/${ dstId }/records`,
                'PATCH',
                { records, fieldKey: 'name' },
            )
        }

        delete_records( dstId: string, recordIds: string[] ) {
            const qs = recordIds.map( id => `recordIds=${ id }` ).join( '&' )
            return this.request_mut(
                `/datasheets/${ dstId }/records?${ qs }`,
                'DELETE',
            )
        }
    }
}
