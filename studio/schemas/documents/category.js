export default {
  name: 'category',
  type: 'document',
  title: 'Category',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order'
    },
    {
      name: 'permalink',
      type: 'string',
      title: 'Permalink'
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured'
    }
  ]
}
