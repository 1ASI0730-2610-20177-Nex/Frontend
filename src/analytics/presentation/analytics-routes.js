const consumptionList = () => import('./views/consumption/consumption-list.vue');
const consumptionForm = () => import('./views/consumption/consumption-form.vue');
const deviceAnalytics = () => import('./views/consumption/device-analytics.vue');

const analyticsRoutes = [
    {   path: 'consumptions',              name: 'analytics-consumptions',           component: consumptionList,    meta: {title: 'Consumptions'}},
    {   path: 'consumptions/new',          name: 'analytics-consumption-new',        component: consumptionForm,    meta: {title: 'New Consumption'}},
    {   path: 'consumptions/:id/edit',     name: 'analytics-consumption-edit',       component: consumptionForm,    meta: {title: 'Edit Consumption'}},
    {   path: 'devices',                   name: 'analytics-devices',                component: deviceAnalytics,    meta: {title: 'Device Analytics'}},
];

export default analyticsRoutes;
