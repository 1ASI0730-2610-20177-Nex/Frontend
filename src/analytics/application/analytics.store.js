
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import useIamStore from "../../iam/application/iam.store.js";

import {ConsumptionEntity} from "../domain/model/consumption.entity.js";
import {ConsumptionAssembler} from "../infrastructure/consumption.assembler.js";
import {AnalyticsApi} from "../infrastructure/analytics-api.js";

const analyticsApi = new AnalyticsApi();

const useAnalyticsStore = defineStore('analytics', () => {

    const consumptions = ref([]);
    const metrics = ref([]);
    const alerts = ref([]);
    const reports = ref([]);
    const errors = ref([]);
    const consumptionsLoaded = ref(false);
    const metricsLoaded = ref(false);
    const alertsLoaded = ref(false);
    const reportsLoaded = ref(false);

    const consumptionCount = computed(() => {
        return consumptionsLoaded.value ? consumptions.value.length : 0;
    });

    const consumptionsByDevice = computed(() => {
        const grouped = {};
        consumptions.value.forEach((consumption) => {
            const key = consumption.deviceId;
            if (!grouped[key]) {
                grouped[key] = {
                    deviceId: key,
                    records: [],
                    totalKwh: 0,
                };
            }
            grouped[key].records.push(consumption);
            grouped[key].totalKwh += consumption.kwh;
        });
        return Object.values(grouped);
    });

    function resolveUserId(userId) {
        if (userId) return userId;
        const iamStore = useIamStore();
        return iamStore.userId ?? import.meta.env.VITE_DEFAULT_USER_ID ?? null;
    }

    function fetchConsumptions() {
        analyticsApi.getConsumptions()
            .then(response => {
                consumptions.value = ConsumptionAssembler.toEntitiesFromResponse(response);
                consumptionsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchMetrics(propertyId) {
        return analyticsApi.getMetrics(propertyId)
            .then(response => {
                metrics.value = response.data instanceof Array
                    ? response.data
                    : response.data['metrics'] ?? [];
                metricsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchAlerts(userId) {
        const resolvedUserId = resolveUserId(userId);

        return analyticsApi.getAlerts(resolvedUserId)
            .then(response => {
                alerts.value = response.data instanceof Array
                    ? response.data
                    : response.data['alerts'] ?? [];
                alertsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function markAlertAsRead(alertId) {
        return analyticsApi.markAlertAsRead(alertId)
            .then(response => {
                const index = alerts.value.findIndex(a => a.id === alertId);

                if (index !== -1) {
                    alerts.value[index] = {
                        ...alerts.value[index],
                        read: true,
                        ...response.data,
                    };
                }
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchReports(propertyId) {
        return analyticsApi.getReports(propertyId)
            .then(response => {
                reports.value = response.data instanceof Array
                    ? response.data
                    : response.data['reports'] ?? [];
                reportsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchReportById(reportId) {
        return analyticsApi.getReportById(reportId)
            .then(response => response.data)
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function createReport(report) {
        return analyticsApi.createReport(report)
            .then(response => {
                const created = response.data;
                reports.value.push(created);
                return created;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function getConsumptionById(id) {
        const idNum = parseInt(id);
        return consumptions.value.find(c => c.id === idNum);
    }

    function getConsumptionsByDeviceId(deviceId) {
        const idNum = parseInt(deviceId);
        return consumptions.value.filter(c => c.deviceId === idNum);
    }

    function getTotalKwhByDeviceId(deviceId) {
        return getConsumptionsByDeviceId(deviceId)
            .reduce((sum, c) => sum + c.kwh, 0);
    }

    function addConsumption(consumption) {
        analyticsApi.createConsumption(consumption)
            .then(response => {
                const resource = response.data;
                const newConsumption = ConsumptionAssembler.toEntityFromResource(resource);
                consumptions.value.push(newConsumption);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateConsumption(consumption) {
        analyticsApi.updateConsumption(consumption)
            .then(response => {
                const resource = response.data;
                const updated = ConsumptionAssembler.toEntityFromResource(resource);
                const index = consumptions.value.findIndex(c => c.id === updated.id);

                if (index !== -1) {
                    consumptions.value[index] = updated;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function deleteConsumption(consumption) {
        analyticsApi.deleteConsumption(consumption.id)
            .then(() => {
                const index = consumptions.value.findIndex(c => c.id == consumption.id);

                if (index !== -1) {
                    consumptions.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    return {
        consumptions,
        metrics,
        alerts,
        reports,
        errors,
        consumptionsLoaded,
        metricsLoaded,
        alertsLoaded,
        reportsLoaded,
        consumptionCount,
        consumptionsByDevice,
        fetchConsumptions,
        fetchMetrics,
        fetchAlerts,
        markAlertAsRead,
        fetchReports,
        fetchReportById,
        createReport,
        getConsumptionById,
        getConsumptionsByDeviceId,
        getTotalKwhByDeviceId,
        addConsumption,
        updateConsumption,
        deleteConsumption,
    };
});

export default useAnalyticsStore;
