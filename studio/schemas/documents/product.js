export default {
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    {
      name: 'id',
      type: 'string',
      title: 'id'
    },
    {
      name: 'price',
      type: 'number',
      title: 'Price'
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description'
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured'
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order'
    },
    {
      name: 'category',
      type: 'reference',
      to: {
        type: 'category'
      },
      title: 'Category'
    },
    {
      name: 'default_thumbnail_image',
      type: 'mainImage',
      title: ' Default_thumbnail_image'
    },
    {
      name: 'default_original_image',
      type: 'mainImage',
      title: 'Default_original_image'
    }]}
