export class DeviceEntity {


    constructor({
                    id = null,
                    name = '',
                    type = '',
                    powerWatts = 0,
                    status = '',
                    homeId = null,
                    spaceId = null,
                }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.powerWatts = powerWatts;
        this.status = status;
        this.spaceId = spaceId ?? homeId;
        this.homeId = homeId ?? spaceId;
    }

}