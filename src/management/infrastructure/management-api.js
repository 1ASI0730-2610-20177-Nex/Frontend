import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const homesEndpointPath    = import.meta.env.VITE_HOMES_ENDPOINT_PATH;
const devicesEndpointPath     = import.meta.env.VITE_DEVICES_ENDPOINT_PATH;

export class ManagementApi extends BaseApi {

    #homeEndpoint;
    #devicesEndpoint;


    constructor() {
        super();
        this.#homeEndpoint = new BaseEndpoint(this, homesEndpointPath);
        this.#devicesEndpoint = new BaseEndpoint(this, devicesEndpointPath);
    }

    getHomes() {
        return this.#homeEndpoint.getAll();
    }


    getHomeById(id) {
        return this.#homeEndpoint.getById(id);
    }

    createHome(resource) {
        return this.#homeEndpoint.create(resource);
    }


    updateHome(resource) {
        return this.#homeEndpoint.update(resource.id, resource);
    }


    deleteHome(id) {
        return this.#homeEndpoint.delete(id);
    }


    getDevices() {
        return this.#devicesEndpoint.getAll();
    }

    getDevicesById(id) {
        return this.#devicesEndpoint.getById(id);
    }

    createDevices(resource) {
        return this.#devicesEndpoint.create(resource);
    }

    updateDevices(resource) {
        return this.#devicesEndpoint.update(resource.id, resource);
    }


    deleteDevices(id) {
        return this.#devicesEndpoint.delete(id);
    }
}
