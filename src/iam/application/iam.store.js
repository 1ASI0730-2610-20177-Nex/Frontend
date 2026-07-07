
import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {UserEntity} from "../domain/model/user.entity.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {IamApi} from "../infrastructure/iam-api.js";

const iamApi = new IamApi();

function persistAuth(token, user) {
    localStorage.setItem('token', token);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

function clearAuthStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

const useIamStore = defineStore('iam', () => {

    const currentUser = ref(null);
    const users = ref([]);
    const token = ref(localStorage.getItem('token') || null);
    const errors = ref([]);
    const usersLoaded = ref(false);
    const authReady = ref(false);
    const authenticated = ref(false);

    const userId = computed(() => currentUser.value?.id ?? null);

    const userInitials = computed(() => {
        const name = currentUser.value?.name ?? '';
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0]?.toUpperCase() ?? '')
            .join('') || '?';
    });

    function applyAuth(data) {
        const authToken = data.token ?? data.accessToken;

        if (authToken) {
            token.value = authToken;
            authenticated.value = true;
        }

        const userObj = data.user ?? (data.id ? {
            id: data.id,
            name: data.username ?? '',
            email: data.username ?? '',
            plan: data.plan ?? 'Free',
            createdAt: data.createdAt ?? null
        } : null);

        if (userObj) {
            currentUser.value = UserAssembler.toEntityFromResource(userObj);
            persistAuth(authToken, userObj);
        }
    }

    function signUp(credentials) {
        return iamApi.signUp(credentials)
            .then(response => {
                applyAuth(response.data);
                return response.data;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function signIn(credentials) {
        return iamApi.signIn(credentials)
            .then(response => {
                applyAuth(response.data);
                return response.data;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function signOut() {
        token.value = null;
        currentUser.value = null;
        authenticated.value = false;
        clearAuthStorage();
    }

    async function restoreSession() {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!savedToken) {
            authReady.value = true;
            return false;
        }

        token.value = savedToken;

        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                currentUser.value = UserAssembler.toEntityFromResource(userData);
                authenticated.value = true;
                authReady.value = true;
                return true;
            } catch (e) {
                console.error("Error restoring session:", e);
            }
        }

        signOut();
        authReady.value = true;
        return false;
    }

    function fetchUsers() {
        return iamApi.getUsers()
            .then(response => {
                users.value = UserAssembler.toEntitiesFromResponse(response);
                usersLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchUserById(id) {
        return iamApi.getUserById(id)
            .then(response => {
                const user = UserAssembler.toEntityFromResource(response.data);
                currentUser.value = user;
                return user;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function setCurrentUser(user) {
        currentUser.value = user instanceof UserEntity ? user : UserAssembler.toEntityFromResource(user);
    }

    return {
        currentUser,
        users,
        token,
        errors,
        usersLoaded,
        authReady,
        authenticated,
        userId,
        userInitials,
        signUp,
        signIn,
        signOut,
        restoreSession,
        fetchUsers,
        fetchUserById,
        setCurrentUser,
    };
});

export default useIamStore;
