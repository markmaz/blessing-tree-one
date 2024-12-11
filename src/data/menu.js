/*
 * Main and demo navigation arrays
 *
 * 'to' attribute points to the route name, not the path url
 */

export default {
  main: [
    {
      name: "Dashboard",
      to: "backend-dashboard",
      icon: "si si-speedometer",
    },
    // You can also set an external link to your main navigation and it will render as a link
    // {
    //   name: "Link Name",
    //   to: "https://example.com",
    //   icon: "si si-link",
    //   target: "_blank", // You can also set its target property
    // },
    {
      name: "Families",
      icon: "fa fa-baby",
      to: "backend-families",
    },
    {
      name: "Sponsors",
      icon: "fa fa-medal",
      to: "backend-sponsors-volunteer",
    },
    {
      name: "Gifts",
      icon: "fa fa-gift",
      to: "backend-gifts"
    },
    {
      name: "Administration",
      heading: true,
    },
    {
      name: "Users",
      to: "backend-users",
      icon: "fa fa-users-gear",
    },
    {
      name: "Reports",
      icon: "fa fa-magnifying-glass-chart",
      subActivePaths: "/backend/reports",
      sub: [
        {
          name: "Un-Sponsored Children",
          to: "backend-reports-unsponsored",
        },
        {
          name: "Sponsor Responsibility",
          to: "backend-reports-sponsor",
        },
        {
          name: "Gift Tags",
          to: "backend-reports-giftTags",
        },
      ],
    },
    {
      name: "Sponsor Admin",
      icon: "fa fa-medal",
      to: "backend-sponsors",
    },
  ],
};
