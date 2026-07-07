
export class PaymentEntity {

    constructor({
                    id = null,
                    subscriptionId = null,
                    amount = 0,
                    currency = '',
                    status = '',
                    paidAt = null,
                }) {
        this.id = id;
        this.subscriptionId = subscriptionId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.paidAt = paidAt;
    }

}
