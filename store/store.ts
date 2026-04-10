namespace $ {

	/** Data registry in home land */
	export class $bog_wiki_registry extends $giper_baza_entity.with({
		Items: $giper_baza_list_link,
	}) {}

	/** Data store */
	export class $bog_wiki_store extends $mol_object {

		glob() {
			return this.$.$giper_baza_glob
		}

		home_land() {
			return this.glob().home().land()
		}

		registry() {
			return this.home_land().Data( $bog_wiki_registry ) as $bog_wiki_registry
		}

	}

}
