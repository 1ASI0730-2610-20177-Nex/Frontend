import {SimulationSessionEntity} from "../domain/model/simulation-session.entity.js";

export class SimulationSessionAssembler {

    static toEntityFromResource(resource) {
        return new SimulationSessionEntity({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['simulationSessions'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
