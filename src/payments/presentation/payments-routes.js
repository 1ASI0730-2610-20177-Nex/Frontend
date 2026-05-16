const currentPlan = () => import('./views/current-plan.vue');
const planCatalog = () => import('./views/plan-catalog.vue');
const checkout = () => import('./views/checkout.vue');

const paymentsRoutes = [
    { path: '', redirect: { name: 'payments-plan' } },
    { path: 'plan', name: 'payments-plan', component: currentPlan, meta: { title: 'My Plan' } },
    { path: 'plans', name: 'payments-plans', component: planCatalog, meta: { title: 'Choose Plan' } },
    { path: 'checkout/:planId', name: 'payments-checkout', component: checkout, meta: { title: 'Payment' } },
];

export default paymentsRoutes;
