export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-eleventy-blog'
      }
    },
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
                  buildHookId: '6166c6ec02adb7cac3427717',
                  title: 'Sanity Studio',
                  name: 'online-shop-studio',
                  apiId: 'aa098e07-f528-4483-b362-4aeee4393649'
                },
                {
                  buildHookId: '6166c6ed39d9cff441c5becc',
                  title: 'Blog Website',
                  name: 'online-shop-web',
                  apiId: 'ced071b0-0b91-4e43-8793-dd92b2712d61'
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
          {title: 'Frontend', value: 'https://online-shop-web.netlify.app', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Newly added products', order: '_createdAt desc', types: ['product']},
      layout: {width: 'medium'}
    }
  ]
}
