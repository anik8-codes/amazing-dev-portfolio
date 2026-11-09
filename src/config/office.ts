/** Henry Heffernan's original MIT-licensed room, adapted to a local resume desktop. */
export const office = {
  title: 'my virtual workspace',
  description: 'step inside my work-from-home setup. use the computer to read my resume.',
  enter: 'enter virtual environment',
  home: { label: 'back to Botmartz', href: '/#exp-botmartz' },
  loading: 'loading the workspace',
  ready: 'workspace ready',
  retry: 'try again',
  error: 'the 3D workspace could not load. you can still read or download my resume.',
  help: 'drag to look around · scroll or pinch to zoom · use the computer to open my resume',
  views: [
    { id: 'desk', label: 'desk view' },
    { id: 'monitor', label: 'use computer' },
    { id: 'room', label: 'room view' },
  ],
  assets: [
    { model: '/office/environment.glb', texture: '/office/environment.jpg' },
    { model: '/office/computer.glb', texture: '/office/computer.jpg' },
    { model: '/office/decor.glb', texture: '/office/decor.jpg' },
  ],
  screen: { href: '/office/screen/', title: "Aniket's desktop" },
  desktop: {
    title: 'anik8 desktop',
    heading: 'Aniket Singh',
    subtitle: 'devops, backend & ai engineer',
    open: 'open resume',
    file: 'Aniket Singh · resume.pdf',
    close: 'back to desktop',
    full: 'open full viewer ↗',
    note: 'welcome to my workspace. open the resume to have a look around my work.',
  },
  credit: {
    label: '3D scene & original code by Henry Heffernan',
    href: 'https://github.com/henryjeff/portfolio-website',
    license: '/office/LICENSE.txt',
  },
} as const;
