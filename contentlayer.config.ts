import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Article = defineDocumentType(() => ({
    name: 'Article',
    filePathPattern: `articles/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: true },
        date: { type: 'date', required: true },
        tags: { type: 'list', of: { type: 'string' } },
    },
    computedFields: {
        url: {
        type: 'string',
        // Ensure the URL path uses the English name 'articles'
        resolve: (doc) => `/articles/${doc._raw.flattenedPath.replace(/^articles\/?/, '')}`,
        },
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Article],
    mdx: {
    },
})
