const currentPlan = () => import('./views/current-plan.vue');
const planCatalog = () => import('./views/plan-catalog.vue');
const checkout = () => import('./views/checkout.vue');

const paymentsRoutes = [
    { path: '', redirect: { name: 'payments-plan' } },
    { path: 'plan', name: 'payments-plan', component: currentPlan, meta: { title: 'Mi plan' } },
    { path: 'plans', name: 'payments-plans', component: planCatalog, meta: { title: 'Elegir plan' } },
    { path: 'checkout/:planId', name: 'payments-checkout', component: checkout, meta: { title: 'Pago' } },
];

export default paymentsRoutes;
