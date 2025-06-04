export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NullUnit",
  description:
    "NullUnit Cybersecurity Team - Bug Bounty, CTFs, Articles & Courses.",
  navItems: [
    {
      label: "Articles",
      href: "/articles",
    },
    {
      label: "Courses",
      href: "/courses",
    },
    {
      label: "Portfolio",
      href: "/portfolio",
    },
  ],
  navMenuItems: [
    { label: "Articles", href: "/articles" },
    { label: "Courses", href: "/courses" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  links: {
    github: "https://github.com/nullunit-org",
    discord: "https://discord.gg/your-invite",
    sponsor: "https://patreon.com/your-sponsor-link",
    portfolio: "https://github.com/orgs/nullunit-org/repositories",
  },
};
