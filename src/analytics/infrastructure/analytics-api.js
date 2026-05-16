import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const consumptionsEndpointPath = import.meta.env.VITE_CONSUMPTION_ENDPOINT_PATH;

export class AnalyticsApi extends BaseApi {

    #consumptionsEndpoint;

    constructor() {
        super();
        this.#consumptionsEndpoint = new BaseEndpoint(this, consumptionsEndpointPath);
    }

    getConsumptions() {
        return this.#consumptionsEndpoint.getAll();
    }

    getConsumptionById(id) {
        return this.#consumptionsEndpoint.getById(id);
    }

    createConsumption(resource) {
        return this.#consumptionsEndpoint.create(resource);
    }

    updateConsumption(resource) {
        return this.#consumptionsEndpoint.update(resource.id, resource);
    }

    deleteConsumption(id) {
        return this.#consumptionsEndpoint.delete(id);
    }
}
