const LoginView = () => import('../../iam/presentation/views/login.vue');
const RegisterView = () => import('../../iam/presentation/views/register.vue');

const iamRoutes = [
    { path: 'login', name: 'login', component: LoginView, meta: { title: 'Iniciar sesión', guest: true } },
    { path: 'register', name: 'register', component: RegisterView, meta: { title: 'Crear cuenta', guest: true } },
];

export default iamRoutes;
