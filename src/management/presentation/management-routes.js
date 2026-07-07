// Lazy-loaded components
const homeList = () => import('./views/home/home-list.vue');
const deviceList = () => import('./views/device/device-list.vue');
const homeForm = () => import('./views/home/home-form.vue');
const deviceForm = () => import('./views/device/device-form.vue');

const managementRoutes = [
    {   path: 'homes',                  name: 'management-homes',               component: homeList,        meta: {title: 'Properties'}},
    {   path: 'homes/new',              name: 'management-home-new',            component: homeForm,        meta: {title: 'New Property'}},
    {   path: 'devices',                name: 'management-devices',             component: deviceList,      meta: {title: 'Dispositivos'}},
    {   path: 'devices/new',              name: 'management-devices-new',       component: deviceForm,      meta: {title: 'Nuevo dispositivo'}},
    {   path: 'devices/:id/edit',         name: 'management-devices-edit',      component: deviceForm,      meta: {title: 'Editar dispositivo'}}
];

export default managementRoutes;