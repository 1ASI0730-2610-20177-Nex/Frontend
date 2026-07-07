import {ProfileEntity} from "../domain/model/profile.entity.js";

export class ProfileAssembler {

    static toEntityFromResource(resource) {
        return new ProfileEntity({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['profiles'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
