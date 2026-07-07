import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {ApiEndpoints} from "../../shared/infrastructure/api-endpoints.js";

export class ProfilesApi extends BaseApi {

    createProfile(resource) {
        return this.http.post(ApiEndpoints.profiles, resource);
    }

    getProfiles(userId) {
        return this.http.get(ApiEndpoints.profiles, { params: { userId } });
    }

    getProfileById(profileId) {
        return this.http.get(`${ApiEndpoints.profiles}/${profileId}`);
    }

    updateProfile(profileId, resource) {
        return this.http.put(`${ApiEndpoints.profiles}/${profileId}`, resource);
    }

    updatePreferences(profileId, preferences) {
        return this.http.put(`${ApiEndpoints.profiles}/${profileId}/preferences`, preferences);
    }
}
