import {HomeEntity} from "../domain/model/home.entity.js";

export class HomeAssembler {

    static toEntityFromResource(resource) {
        return new HomeEntity({...resource})
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['homes'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}