import customInstance from '~/api/generated/vueQuery'

export const getImage = (): Promise<{ objectIDs: any[] }> => {
  return customInstance({
    url: 'https://collectionapi.metmuseum.org/public/collection/v1/objects',
    params: { departmentIds: 12 },
  })
}
