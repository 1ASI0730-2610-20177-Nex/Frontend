import {createRouter, createWebHistory} from "vue-router";
import MainLayout from "./shared/presentation/layouts/main-layout.vue";
import Home from "./shared/presentation/views/home.vue";
import ManagementRoutes from "./management/presentation/management-routes.js";
import AnalyticsRoutes from "./analytics/presentation/analytics-routes.js";
import PaymentsRoutes from "./payments/presentation/payments-routes.js";

const LoginView = () => import("./iam/presentation/views/login.vue");
const RegisterView = () => import("./iam/presentation/views/register.vue");

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: 'Iniciar sesión', guest: true },
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { title: 'Crear cuenta', guest: true },
    },
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/home' },
            { path: 'home', name: 'Home', component: Home, meta: { title: 'Inicio' } },
            { path: 'management', name: 'management', children: ManagementRoutes },
            { path: 'analytics', name: 'analytics', children: AnalyticsRoutes },
            { path: 'payments', name: 'payments', children: PaymentsRoutes },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const { default: useIamStore } = await import('./iam/application/iam.store.js');
    const { default: pinia } = await import('./pinia.js');
    const iamStore = useIamStore(pinia);

    if (!iamStore.authReady) {
        await iamStore.restoreSession();
    }

    document.title = `ElectroCorp - ${to.meta.title ?? 'App'}`;

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuestRoute = to.matched.some(record => record.meta.guest);

    if (requiresAuth && !iamStore.authenticated) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    if (isGuestRoute && iamStore.authenticated) {
        return next({ name: 'Home' });
    }

    return next();
});

export default router;
