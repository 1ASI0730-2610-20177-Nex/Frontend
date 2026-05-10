import {DeviceEntity} from "../domain/model/device.entity.js";

export class DeviceAssembler {

    static toEntityFromResource(resource) {
        return new DeviceEntity({...resource})
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['devices'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}