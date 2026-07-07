import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {ApiEndpoints} from "../../shared/infrastructure/api-endpoints.js";

export class SubscriptionsApi extends BaseApi {

    createSubscription(resource) {
        return this.http.post(ApiEndpoints.subscriptions, resource);
    }

    getSubscriptions(userId) {
        return this.http.get(ApiEndpoints.subscriptions, { params: { userId } });
    }

    renewSubscription(subscriptionId) {
        return this.http.put(`${ApiEndpoints.subscriptions}/${subscriptionId}/renew`);
    }

    changePlan(subscriptionId, plan) {
        return this.http.put(`${ApiEndpoints.subscriptions}/${subscriptionId}/plan`, { plan });
    }

    cancelSubscription(subscriptionId) {
        return this.http.put(`${ApiEndpoints.subscriptions}/${subscriptionId}/cancel`);
    }

    getPayments(subscriptionId) {
        return this.http.get(`${ApiEndpoints.subscriptions}/${subscriptionId}/payments`);
    }
}
