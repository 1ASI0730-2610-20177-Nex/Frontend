import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {ApiEndpoints} from "../../shared/infrastructure/api-endpoints.js";

export class AnalyticsApi extends BaseApi {

    #consumptionsEndpoint;

    constructor() {
        super();
        this.#consumptionsEndpoint = new BaseEndpoint(this, ApiEndpoints.consumptions);
    }

    // --- Metrics ---

    getMetrics(propertyId) {
        return this.http.get(ApiEndpoints.metrics, { params: { propertyId } });
    }

    // --- Alerts ---

    getAlerts(userId) {
        return this.http.get(ApiEndpoints.alerts, { params: { userId } });
    }

    markAlertAsRead(alertId) {
        return this.http.put(`${ApiEndpoints.alerts}/${alertId}/read`);
    }

    // --- Reports ---

    createReport(resource) {
        return this.http.post(ApiEndpoints.reports, resource);
    }

    getReports(propertyId) {
        return this.http.get(ApiEndpoints.reports, { params: { propertyId } });
    }

    getReportById(reportId) {
        return this.http.get(`${ApiEndpoints.reports}/${reportId}`);
    }

    // --- Consumptions ---

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
