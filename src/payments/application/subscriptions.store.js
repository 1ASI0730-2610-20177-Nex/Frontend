
import {defineStore} from "pinia";
import {ref} from "vue";

import {SubscriptionAssembler, PaymentAssembler} from "../infrastructure/subscription.assembler.js";
import {SubscriptionsApi} from "../infrastructure/subscriptions-api.js";

const subscriptionsApi = new SubscriptionsApi();

const useSubscriptionsStore = defineStore('subscriptions', () => {

    const subscriptions = ref([]);
    const payments = ref([]);
    const currentSubscription = ref(null);
    const errors = ref([]);
    const subscriptionsLoaded = ref(false);

    function fetchSubscriptions(userId) {
        return subscriptionsApi.getSubscriptions(userId)
            .then(response => {
                subscriptions.value = SubscriptionAssembler.toEntitiesFromResponse(response);
                subscriptionsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function createSubscription(subscription) {
        return subscriptionsApi.createSubscription(subscription)
            .then(response => {
                const created = SubscriptionAssembler.toEntityFromResource(response.data);
                subscriptions.value.push(created);
                currentSubscription.value = created;
                return created;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function renewSubscription(subscriptionId) {
        return subscriptionsApi.renewSubscription(subscriptionId)
            .then(response => {
                const updated = SubscriptionAssembler.toEntityFromResource(response.data);
                const index = subscriptions.value.findIndex(s => s.id === updated.id);

                if (index !== -1) {
                    subscriptions.value[index] = updated;
                }

                return updated;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function changePlan(subscriptionId, plan) {
        return subscriptionsApi.changePlan(subscriptionId, plan)
            .then(response => {
                const updated = SubscriptionAssembler.toEntityFromResource(response.data);
                const index = subscriptions.value.findIndex(s => s.id === updated.id);

                if (index !== -1) {
                    subscriptions.value[index] = updated;
                }

                return updated;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function cancelSubscription(subscriptionId) {
        return subscriptionsApi.cancelSubscription(subscriptionId)
            .then(response => {
                const updated = SubscriptionAssembler.toEntityFromResource(response.data);
                const index = subscriptions.value.findIndex(s => s.id === updated.id);

                if (index !== -1) {
                    subscriptions.value[index] = updated;
                }

                return updated;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchPayments(subscriptionId) {
        return subscriptionsApi.getPayments(subscriptionId)
            .then(response => {
                payments.value = PaymentAssembler.toEntitiesFromResponse(response);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    return {
        subscriptions,
        payments,
        currentSubscription,
        errors,
        subscriptionsLoaded,
        fetchSubscriptions,
        createSubscription,
        renewSubscription,
        changePlan,
        cancelSubscription,
        fetchPayments,
    };
});

export default useSubscriptionsStore;
