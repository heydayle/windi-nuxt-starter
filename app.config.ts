export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'cool',
    icons: {
      dynamic: true,
    },
  },
  winduxt: {
    host: 'Winuxt',
    project: {
      github: 'https://github.com/heydayle/windi-nuxt-starter',
    },
    author: {
      name: 'Heyday Lê',
      links: {
        github: 'https://github.com/heydayle',
        website: 'https://thinh.io.vn',
        linkedin: 'https://www.linkedin.com/in/thinhle99',
      },
    },
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
            {
              type: 'link',
              title: 'Editor V2',
              to: { name: 'Moving V2', path: '/moving-v2' },
            },
            {
              type: 'link',
              title: 'Images',
              to: { name: 'Images', path: '/list' },
            },
          ],
        },
      },
      footer: {
        author: 'Heyday Lê',
        years: '2024',
      },
    },
    page: {
      welcome: {
        title: 'Windy Nuxt Starter',
        description: 'A template starter using NUXT 3',
      },
    },
  },
})
