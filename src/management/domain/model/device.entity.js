import {HomeEntity} from "./home.entity.js";

export class DeviceEntity {


    constructor({
                    id = null,
                    name = '',
                    type = '',
                    powerWatts = 0,
                    status = '',
                    homeId = null,
    }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.powerWatts = powerWatts;
        this.status = status;
        this.homeId = homeId instanceof HomeEntity? homeId : null;
    }

}