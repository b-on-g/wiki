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
            // const cors = 'http://cors.hyoo.ru/'
            const cors = 'https://cors-anywhere.herokuapp.com/'
            // const cors = 'https://proxy.kinsle.ru/proxy'
            return cors + 'https://tables.mws.ru/fusion/v1'
        }

        bearer_token() {
            return 'uskurJvFb5GHRVAWGi1jMCP'
        }

        /** Ответы Fusion описаны в {@link $bog_wiki_model_gen_components} (ген. `gen/gen.ts`). */
        request<T>(url: string) {
            return $mol_fetch.json(this.base_url() + url, {
                headers: {
                    Authorization: 'Bearer ' + this.bearer_token(),
                    'Content-Type': 'application/json',
                },
            }) as T
        }

        @$mol_mem
        data_revision(next?: number) {
            return next ?? 0
        }

        @$mol_mem
        get_spaces(): $bog_wiki_model_gen_components['schemas']['ResponseGetSpaces'] {
            void this.data_revision()
            return this.request('/spaces')
        }

        @$mol_mem_key
        get_table(ids: readonly [string, string]): $bog_wiki_model_gen_components['schemas']['GetRecordsData'] {
            void this.data_revision()
            const [dstId, viewId] = ids
            return this.request(`/datasheets/${dstId}/records?viewId=${viewId}`)
        }

        @$mol_mem_key
        get_fields(ids: readonly [string, string]): $bog_wiki_model_gen_components['schemas']['GetFieldsResponse'] {
            void this.data_revision()
            const [dstId, viewId] = ids
            return this.request(`/datasheets/${dstId}/fields?viewId=${viewId}`)
        }
    }
}
