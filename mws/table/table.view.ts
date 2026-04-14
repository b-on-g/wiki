namespace $.$$ {
	export class $bog_wiki_mws_table extends $.$bog_wiki_mws_table {
		columns() {
			const fields = this.fields_data()?.data?.fields
			return fields?.map( ( field ) => ( {
				...field,
				id: field.name,
				title: field.name,
				// sortable: field.sortable,
			})) ?? []
            // return [
            //     { id: 'name', title: 'Name', sortable: true },
            //     { id: 'email', title: 'Email', sortable: true },
            //     { id: 'department', title: 'Department', sortable: true },
            //     { id: 'role', title: 'Role', sortable: true },
            //     { id: 'salary', title: 'Salary', sortable: true },
            // ]
        }

		data() {
			
			console.log( this.columns() )
			
			const records = this.table_data()?.data?.records


			const dataFormatted = records?.map( ( record ) => {
				return record.fields
				// return {'Название': 'Один'}
			} ) ?? []

			console.log('records', records)
            console.log('columns', this.columns())
			console.log( 'dataFormatted', dataFormatted )
			
			return dataFormatted;

			// [
            //     {
            //         'Время начала': 1775937300000,
            //         Процент: 3.24,
            //         Вложения: [
            //             {
            //                 id: 'atc7bJd2tTsvT',
            //                 name: '11_Template.pdf',
            //                 size: 5727721,
            //                 mimeType: 'application/pdf',
            //                 token: '2026/04/11/e77cb19cb1d644038204dda98e36f6ed/11_Template.pdf',
            //                 width: 0,
            //                 height: 0,
            //                 preview:
            //                     '/attachment/preview/rs:fit/spacespculwl1olra4/2026/04/11/3104a0c2e58d47e4a7880a39c59d0bcd/11_Template.jpeg',
            //                 url: '/attachment/spacespculwl1olra4/2026/04/11/e77cb19cb1d644038204dda98e36f6ed/11_Template.pdf',
            //             },
            //         ],
            //         Опции: ['да', 'нет'],
            //         Название: 'Один',
            //         'Номер телефона': '88005553535',
            //     },
            //     {
            //         Опции: ['возможно'],
            //         Название: 'Тор',
            //     },
            //     {
            //         'Время начала': 1775998020000,
            //         Название: 'два',
            //     },
            // ]

            // return [
            //     {
            //         name: 'Alice Johnson',
            //         email: 'alice@example.com',
            //         department: 'Engineering',
            //         role: 'Senior Developer',
            //         salary: 120000,
            //     },
            //     {
            //         name: 'Bob Smith',
            //         email: 'bob@example.com',
            //         department: 'Design',
            //         role: 'UI Designer',
            //         salary: 95000,
            //     },
            //     {
            //         name: 'Carol Williams',
            //         email: 'carol@example.com',
            //         department: 'Engineering',
            //         role: 'Tech Lead',
            //         salary: 145000,
            //     },
            // ]
        }
    }
}
