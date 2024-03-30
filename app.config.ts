export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'cool',
  },
  winduxt: {
    host: 'Winduxt',
    layout: {
      header: {
        navbar: {
          menus: [
            { type: 'link', title: 'home', to: { name: 'index', path: '/' } },
            {
              type: 'link',
              title: 'about',
              to: { name: 'about', path: '/about' },
            },
            {
              type: 'link',
              title: 'install',
              to: { name: 'install', path: '/install' },
            },
          ],
        },
      },
    },
  },
})
