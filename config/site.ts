export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NullUnit",
  description:
    "NullUnit Cybersecurity Team - Bug Bounty, CTFs, Articles & Courses.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Articles",
      href: "/articles",
    },
    {
      label: "Members",
      href: "/members",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "Members", href: "/members" },
    { label: "About", href: "/about" },
  ],
  links: {
    github: "https://github.com/nullunit-org",
    sponsor: "https://patreon.com/your-sponsor-link",
  },
};
