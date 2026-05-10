// Lazy-loaded components
const homeList = () => import('./views/home/home-list.vue');
const deviceList = () => import('./views/device/device-list.vue');
const homeForm = () => import('./views/home/home-form.vue');
const deviceForm = () => import('./views/device/device-form.vue');

const managementRoutes = [
    {   path: 'homes',                  name: 'management-homes',               component: homeList,        meta: {title: 'Homes'}},
    {   path: 'homes/new',              name: 'management-home-new',            component: homeForm,        meta: {title: 'New Home'}},
    {   path: 'homes/:id/edit',         name: 'management-home-edit',           component: homeForm,        meta: {title: 'Edit Home'}},
    {   path: 'devices',                name: 'management-devices',             component: deviceList,      meta: {title: 'Devices'}},
    {   path: 'devices/new',              name: 'management-devices-new',       component: deviceForm,      meta: {title: 'New Device'}},
    {   path: 'devices/:id/edit',         name: 'management-devices-edit',      component: deviceForm,      meta: {title: 'Edit Device'}}
];

export default managementRoutes;