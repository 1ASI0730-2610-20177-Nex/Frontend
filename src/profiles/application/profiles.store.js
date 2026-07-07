
import {defineStore} from "pinia";
import {ref} from "vue";

import {ProfileAssembler} from "../infrastructure/profile.assembler.js";
import {ProfilesApi} from "../infrastructure/profiles-api.js";

const profilesApi = new ProfilesApi();

const useProfilesStore = defineStore('profiles', () => {

    const profiles = ref([]);
    const currentProfile = ref(null);
    const errors = ref([]);
    const profilesLoaded = ref(false);

    function fetchProfiles(userId) {
        return profilesApi.getProfiles(userId)
            .then(response => {
                profiles.value = ProfileAssembler.toEntitiesFromResponse(response);
                profilesLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchProfileById(profileId) {
        return profilesApi.getProfileById(profileId)
            .then(response => {
                currentProfile.value = ProfileAssembler.toEntityFromResource(response.data);
                return currentProfile.value;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function createProfile(profile) {
        return profilesApi.createProfile(profile)
            .then(response => {
                const created = ProfileAssembler.toEntityFromResource(response.data);
                profiles.value.push(created);
                return created;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function updateProfile(profile) {
        return profilesApi.updateProfile(profile.id, profile)
            .then(response => {
                const updated = ProfileAssembler.toEntityFromResource(response.data);
                const index = profiles.value.findIndex(p => p.id === updated.id);

                if (index !== -1) {
                    profiles.value[index] = updated;
                }

                return updated;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function updatePreferences(profileId, preferences) {
        return profilesApi.updatePreferences(profileId, preferences)
            .then(response => {
                const updated = ProfileAssembler.toEntityFromResource(response.data);

                if (currentProfile.value?.id === profileId) {
                    currentProfile.value = updated;
                }

                const index = profiles.value.findIndex(p => p.id === profileId);

                if (index !== -1) {
                    profiles.value[index] = updated;
                }

                return updated;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    return {
        profiles,
        currentProfile,
        errors,
        profilesLoaded,
        fetchProfiles,
        fetchProfileById,
        createProfile,
        updateProfile,
        updatePreferences,
    };
});

export default useProfilesStore;
