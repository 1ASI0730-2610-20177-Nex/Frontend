import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {ApiEndpoints} from "../../shared/infrastructure/api-endpoints.js";

export class ManagementApi extends BaseApi {

    // --- Properties ---

    createProperty(resource) {
        return this.http.post(ApiEndpoints.properties, resource);
    }

    getProperties(userId) {
        return this.http.get(ApiEndpoints.properties, { params: { userId } });
    }

    getPropertyById(propertyId) {
        return this.http.get(`${ApiEndpoints.properties}/${propertyId}`);
    }

    createSpace(propertyId, space) {
        return this.http.post(`${ApiEndpoints.properties}/${propertyId}/spaces`, space);
    }

    // --- Devices ---

    createDevice(resource) {
        return this.http.post(ApiEndpoints.devices, resource);
    }

    getDevices(spaceId) {
        return this.http.get(ApiEndpoints.devices, { params: { spaceId } });
    }

    getDeviceById(deviceId) {
        return this.http.get(`${ApiEndpoints.devices}/${deviceId}`);
    }

    updateDevice(resource) {
        return this.http.put(`${ApiEndpoints.devices}/${resource.id}`, resource);
    }

    deleteDevice(deviceId) {
        return this.http.delete(`${ApiEndpoints.devices}/${deviceId}`);
    }

    // --- Simulation Sessions ---

    createSimulationSession(resource) {
        return this.http.post(ApiEndpoints.simulationSessions, resource);
    }

    addSimulationAction(sessionId, action) {
        return this.http.post(`${ApiEndpoints.simulationSessions}/${sessionId}/actions`, action);
    }

    endSimulationSession(sessionId) {
        return this.http.post(`${ApiEndpoints.simulationSessions}/${sessionId}/end`);
    }

    getSimulationSession(sessionId) {
        return this.http.get(`${ApiEndpoints.simulationSessions}/${sessionId}`);
    }

    getActiveSimulationSessions(userId) {
        return this.http.get(`${ApiEndpoints.simulationSessions}/active`, { params: { userId } });
    }

    // --- Legacy aliases (properties mapped as "homes" in UI) ---

    getHomes(userId) {
        return this.getProperties(userId);
    }

    getHomeById(id) {
        return this.getPropertyById(id);
    }

    createHome(resource) {
        return this.createProperty(resource);
    }
}
