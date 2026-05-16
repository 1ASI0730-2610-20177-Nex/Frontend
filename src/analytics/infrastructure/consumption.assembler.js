import {ConsumptionEntity} from "../domain/model/consumption.entity.js";

export class ConsumptionAssembler {

    static toEntityFromResource(resource) {
        return new ConsumptionEntity({...resource})
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['consumptions'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
