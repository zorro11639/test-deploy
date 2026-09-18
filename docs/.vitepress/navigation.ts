/**
 * Nav and sidebar structure for the docs.
 *
 * Kept out of config.mts and free of any VitePress import so the link integrity test can
 * load it directly: tests/unit/docs-navigation.test.ts walks every entry and asserts the
 * target markdown file exists, which is the failure mode a docs site actually has.
 */

/** The TVMJS library repository — the source these docs describe. */
export const REPO_URL = 'https://github.com/tronweb3/tvmjs-monorepo';

/** This website repository — where the markdown on each page lives. */
export const HOME_REPO_URL = 'https://github.com/tronweb3/tvmjs-home';

export const NPM_ORG_URL = 'https://www.npmjs.com/org/tvmjs';

/**
 * Markdown under `docs/` that is repository documentation, not a published page.
 *
 * VitePress would otherwise route README.md as a page and fail the build on its
 * relative links out of the docs root. Consumed by config.mts (`srcExclude`) and by the
 * orphan-page test, so the two can never disagree about what is content.
 */
export const SRC_EXCLUDE = ['README.md'];

export type NavLink = { text: string; link: string; activeMatch?: string };
export type NavDropdown = { text: string; items: NavLink[] };
export type NavExternalComponent = { component: string; props: { title: string; href: string } };
export type NavEntry = NavLink | NavDropdown | NavExternalComponent;

export type SidebarGroup = { text: string; items: NavLink[] };

/**
 * `basePath` is where the *site* is mounted, not the docs — the Home entry has to escape
 * the docs base, which is why it renders through the ExternalNavLink component.
 */
export function buildNav(basePath: string, _version: string): NavEntry[] {
  return [{ component: 'ExternalNavLink', props: { title: 'Home', href: basePath ? `${basePath}/` : '/' } }];
}

export const SIDEBAR: SidebarGroup[] = [];

/** Release notes, newest first. Each entry must have a matching `releases/vX.Y.Z.md`. */
export const RELEASES: NavLink[] = [];

/** The sidebar as VitePress consumes it: the static groups plus the release list. */
export const SIDEBAR_WITH_RELEASES: SidebarGroup[] = [...SIDEBAR];
