import { createRouter, createWebHashHistory } from "vue-router";

import NProgress from "nprogress/nprogress.js";

// Main layout variations
import LayoutSimple from "@/layouts/variations/Simple.vue";
import LayoutBackend from "@/layouts/variations/Backend.vue";

// Backend: Dashboard
const BackendDashboard = () => import("@/views/backend/DashboardView.vue");

// Backend: Elements
const UserView = () =>
  import("@/views/backend/users/UserView.vue");
const UserDetailView = () =>
    import("@/views/backend/users/UserDetailView.vue");

const FamilyView = () => import("@/views/backend/families/FamilyView.vue");
const FamilyDetailView = () => import("@/views/backend/families/FamilyDetailView.vue");

const SponsorView = () => import("@/views/backend/sponsors/SponsorView.vue");
const SeniorView = () => import("@/views/backend/seniors/SeniorsView.vue");
const GiftView = () => import("@/views/backend/gifts/GiftsView.vue");
const ReportView = () => import("@/views/backend/reports/ReportsView.vue");

const AuthSignIn3 = () => import("@/views/auth/SignIn3View.vue");
const AuthSignUp = () => import("@/views/auth/SignUpView.vue");
const AuthSignUp2 = () => import("@/views/auth/SignUp2View.vue");
const AuthSignUp3 = () => import("@/views/auth/SignUp3View.vue");
const AuthReminder = () => import("@/views/auth/ReminderView.vue");
const AuthReminder2 = () => import("@/views/auth/Reminder2View.vue");
const AuthReminder3 = () => import("@/views/auth/Reminder3View.vue");

// Errors
const Error400 = () => import("@/views/errors/400View.vue");
const Error401 = () => import("@/views/errors/401View.vue");
const Error403 = () => import("@/views/errors/403View.vue");
const Error404 = () => import("@/views/errors/404View.vue");
const Error500 = () => import("@/views/errors/500View.vue");
const Error503 = () => import("@/views/errors/503View.vue");

// Set all routes
const routes = [
  /*
  |
  |--------------------------------------------------------------------------
  | Landing Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/",
    component: LayoutSimple,
    children: [
      {
        path: "",
        name: "landing",
        component: AuthSignIn3,
      },
    ],
  },




  /*
  |
  |--------------------------------------------------------------------------
  | Backend Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/backend",
    redirect: "/backend/dashboard",
    component: LayoutBackend,
    children: [
      {
        path: "dashboard",
        name: "backend-dashboard",
        component: BackendDashboard,
        meta: { requiresAuth: true },
      },

      /*
      |--------------------------------------------------------------------------
      | Backend Blog Routes
      |--------------------------------------------------------------------------
      */
      {
        path: "families",
        name: "backend-families",
        component: FamilyView,
        meta: { requiresAuth: true },
      },

      {
        path: "families/detail/:id",
        name: "backend-families-details",
        component: FamilyDetailView,
        meta: { requiresAuth: true },
      },

      {
        path: "sponsors",
        name: "backend-sponsors",
        component: SponsorView,
        meta: { requiresAuth: true },
      },

      {
        path: "seniors",
        name: "backend-seniors",
        component: SeniorView,
        meta: { requiresAuth: true },
      },

      {
        path: "gifts",
        name: "backend-gifts",
        component: GiftView,
        meta: { requiresAuth: true },
      },

      {
        path: "users",
        name: "backend-users",
        component: UserView,
        meta: { requiresAuth: true },
      },

      {
        path: "users-detail/:id",
        name: "backend-users-detail",
        component: UserDetailView,
        meta: { requiresAuth: true },
      },

      {
        path: "reports",
        name: "backend-reports",
        component: ReportView,
        meta: { requiresAuth: true },
      },
  ]},


  /*
  |
  |--------------------------------------------------------------------------
  | Auth Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/auth",
    component: LayoutSimple,
    children: [
      {
        path: "signin3",
        name: "auth-signin3",
        component: AuthSignIn3,
      },
      {
        path: "signup",
        name: "auth-signup",
        component: AuthSignUp,
      },
      {
        path: "signup2",
        name: "auth-signup2",
        component: AuthSignUp2,
      },
      {
        path: "signup3",
        name: "auth-signup3",
        component: AuthSignUp3,
      },
      {
        path: "reminder",
        name: "auth-reminder",
        component: AuthReminder,
      },
      {
        path: "reminder2",
        name: "auth-reminder2",
        component: AuthReminder2,
      },
      {
        path: "reminder3",
        name: "auth-reminder3",
        component: AuthReminder3,
      },
    ],
  },

  /*
  |
  |--------------------------------------------------------------------------
  | Error Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/errors",
    component: LayoutSimple,
    children: [
      {
        path: "400",
        name: "error-400",
        component: Error400,
      },
      {
        path: "401",
        name: "error-401",
        component: Error401,
      },
      {
        path: "403",
        name: "error-403",
        component: Error403,
      },
      {
        path: "404",
        name: "error-404",
        component: Error404,
      },
      {
        path: "500",
        name: "error-500",
        component: Error500,
      },
      {
        path: "503",
        name: "error-503",
        component: Error503,
      },
    ],
  },
];

// Create Router
const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/');
  } else {
    next();
  }
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});
/*eslint-enable no-unused-vars*/

export default router;
