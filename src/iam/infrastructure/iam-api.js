import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {ApiEndpoints} from "../../shared/infrastructure/api-endpoints.js";

export class IamApi extends BaseApi {

    signUp(payload) {
        return this.http.post(ApiEndpoints.authentication.signUp, payload);
    }

    signIn(payload) {
        return this.http.post(ApiEndpoints.authentication.signIn, payload);
    }

    getMe() {
        return this.http.get(ApiEndpoints.authentication.me);
    }

    getUsers() {
        return this.http.get(ApiEndpoints.users);
    }

    getUserById(userId) {
        return this.http.get(`${ApiEndpoints.users}/${userId}`);
    }
}
