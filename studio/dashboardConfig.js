export default {
  widgets: [
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '61859a33321f9b0084c7469e',
                  title: 'Likörbar',
                  name: 'likorbar',
                  apiId: '7ce67371-3731-4fc7-9227-cef96c0c82b5'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/pegahsafaie/online-shop',
            category: 'Code'
          },
          {
            title: 'Frontend', value: 'https://likorbar.netlify.app', category: 'apps'
          }
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Newly added about posts', types: ['about']},
      layout: {width: 'medium'}
    }
  ]
}
