import {SubscriptionEntity} from "../domain/model/subscription.entity.js";
import {PaymentEntity} from "../domain/model/payment.entity.js";

export class SubscriptionAssembler {

    static toEntityFromResource(resource) {
        return new SubscriptionEntity({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['subscriptions'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}

export class PaymentAssembler {

    static toEntityFromResource(resource) {
        return new PaymentEntity({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['payments'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
