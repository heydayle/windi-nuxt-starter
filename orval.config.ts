module.exports = {
  output: {
    target: './src/api',
    schemas: true,
    client: {
      vueQuery: './src/api/generated/vueQuery.ts',
    },
  },
  files: [
    {
      source: 'https://collectionapi.metmuseum.org/swagger/v1/swagger.json', // Replace with your API specification URL
      operations: {
        mock: false,
        generate: true,
      },
    },
  ],
}
