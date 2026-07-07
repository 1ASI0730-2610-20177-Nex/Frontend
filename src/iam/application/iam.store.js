
import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {UserEntity} from "../domain/model/user.entity.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {IamApi} from "../infrastructure/iam-api.js";

const iamApi = new IamApi();

const useIamStore = defineStore('iam', () => {

    const currentUser = ref(null);
    const users = ref([]);
    const token = ref(localStorage.getItem('token') || null);
    const errors = ref([]);
    const usersLoaded = ref(false);
    const authenticated = ref(!!token.value);

    const userId = computed(() => currentUser.value?.id ?? null);

    function signUp(credentials) {
        return iamApi.signUp(credentials)
            .then(response => response.data)
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function signIn(credentials) {
        return iamApi.signIn(credentials)
            .then(response => {
                const data = response.data;
                const authToken = data.token ?? data.accessToken;

                if (authToken) {
                    token.value = authToken;
                    localStorage.setItem('token', authToken);
                    authenticated.value = true;
                }

                if (data.user) {
                    currentUser.value = UserAssembler.toEntityFromResource(data.user);
                }

                return data;
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
        localStorage.removeItem('token');
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
        authenticated,
        userId,
        signUp,
        signIn,
        signOut,
        fetchUsers,
        fetchUserById,
        setCurrentUser,
    };
});

export default useIamStore;
