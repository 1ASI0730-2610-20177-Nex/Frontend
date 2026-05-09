// Lazy-loaded components
const homeList = () => import('./views/home-list.vue');
const deviceList = () => import('./views/device-list.vue');

const managementRoutes = [
    {   path: 'homes',             name: 'management-categories',      component: homeList(), meta: {title: 'Homes'}},
    {   path: 'devices',              name: 'management-tutorials',       component: deviceList(), meta: {title: 'Devices'}},
];

export default managementRoutes;