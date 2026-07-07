
export class SubscriptionEntity {

    constructor({
                    id = null,
                    userId = null,
                    plan = '',
                    status = '',
                    startedAt = null,
                    expiresAt = null,
                }) {
        this.id = id;
        this.userId = userId;
        this.plan = plan;
        this.status = status;
        this.startedAt = startedAt;
        this.expiresAt = expiresAt;
    }

}
