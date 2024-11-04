import path from 'path';
import { globbySync } from 'globby';
import isObject from 'lodash/isObject';

const useDocsPattern = (patterns) => {
  return globbySync(patterns, { cwd: path.resolve(__dirname, '../pages/') });
};

const navbarNav = [
  { text: 'Home', link: '/' },
  {
    text: 'Changelog',
    items: useDocsPattern('main/changelog.md'),
  },
];

const sidebarNav = [
  {
    text: 'FAQ',
    items: useDocsPattern('docs/faq/**/*.md'),
    collapsed: false,
  },
  {
    text: 'Changelog',
    items: useDocsPattern('main/changelog.md'),
    // collapsed: false,
  },
  {
    text: 'Architecture, Structures, Design, etc',
    items: useDocsPattern('docs/architecture-and-structures/**/*.md'),
    collapsed: true,
  },
  {
    text: 'How To',
    items: useDocsPattern('docs/how-to/**/*.md'),
    collapsed: true,
  },
  {
    text: 'Locale',
    items: useDocsPattern('main/locale/**/*.md'),
    collapsed: true,
  },
];

const linkify = (nav) => {
  if (Array.isArray(nav)) {
    return nav.map((item) => linkify(item));
  }

  if (isObject(nav)) {
    if (nav.link) return nav;

    return {
      ...nav,
      items: nav.items.map((item) => linkify(item)),
    };
  }

  if (typeof nav === 'string') {
    const getParentDirName = (nav) => nav.split('/').at(-2);
    const getFilename = (nav) => nav.split('/').pop().replace(/\.md$/, '');
    const getLink = (nav) => '/pages/'.concat(nav.replace('.md', '.html'));

    const text = nav.endsWith('Readme.md') ? getParentDirName(nav) : getFilename(nav);
    const link = getLink(nav);

    return { text, link };
  }

  console.error('tf is that sidebar nav item type', nav);

  return nav;
};

const generateSidebar = (sidebarNav) => {
  const sb = linkify(sidebarNav);
  // console.info(JSON.stringify(sb, null, 2));
  return sb;
};

const generateNav = (navbarNav) => {
  const nav = linkify(navbarNav);
  // console.info(JSON.stringify(sb, null, 2));
  return nav;
};

const sidebar = generateSidebar(sidebarNav);
const nav = generateNav(navbarNav);

export { sidebar, nav };
