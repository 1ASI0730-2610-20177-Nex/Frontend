
export class ConsumptionEntity {

    constructor({
                    id = null,
                    deviceId = null,
                    kwh = 0,
                    date = '',
                }) {
        this.id = id;
        this.deviceId = deviceId;
        this.kwh = kwh;
        this.date = date;
    }

}
