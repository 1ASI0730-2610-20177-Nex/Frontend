import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
import ManagementRoutes from "./management/presentation/management-routes.js";
import AnalyticsRoutes from "./analytics/presentation/analytics-routes.js";
import PaymentsRoutes from "./payments/presentation/payments-routes.js";

const routes = [
    {path: '/',                redirect: '/home' },
    {path: '/home',            name:'Home' ,       component: Home,            meta:{title:'Inicio'}},
    {path: '/management',      name: 'management', children: ManagementRoutes },
    {path: '/analytics',       name: 'analytics',  children: AnalyticsRoutes },
    {path: '/payments',        name: 'payments',   children: PaymentsRoutes },


]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'ElectroCorp';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    return next();
});

export default router;