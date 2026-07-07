import {createRouter, createWebHistory} from "vue-router";
import Login from "./iam/presentation/views/login.vue";
import MainLayout from "./shared/presentation/layouts/main-layout.vue";
import Home from "./shared/presentation/views/home.vue";
import ManagementRoutes from "./management/presentation/management-routes.js";
import AnalyticsRoutes from "./analytics/presentation/analytics-routes.js";
import PaymentsRoutes from "./payments/presentation/payments-routes.js";

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'Login', component: Login, meta: {title: 'Login', public: true}},
    {
        path: '/',
        component: MainLayout,
        meta: {requiresAuth: true},
        children: [
            {path: 'home', name:'Home', component: Home, meta:{title:'Home', requiresAuth: true}},
            {path: 'management', children: ManagementRoutes, meta: {requiresAuth: true}},
            {path: 'analytics', children: AnalyticsRoutes, meta: {requiresAuth: true}},
            {path: 'payments', children: PaymentsRoutes, meta: {requiresAuth: true}},
        ],
    },
    {path: '/:pathMatch(.*)*', redirect: '/login'},
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

const isAuthenticated = () => Boolean(localStorage.getItem('electrocorp-auth'));

router.beforeEach((to, from, next) => {
    const baseTitle = 'ElectroCorp';
    document.title = `${baseTitle} - ${to.meta?.title ?? 'Smart Control'}`;

    if (to.meta?.public && isAuthenticated()) {
        return next({ name: 'Home' });
    }

    if (to.matched.some((record) => record.meta?.requiresAuth) && !isAuthenticated()) {
        return next({ name: 'Login' });
    }

    return next();
});

export default router;
