
import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {ConsumptionEntity} from "../domain/model/consumption.entity.js";
import {ConsumptionAssembler} from "../infrastructure/consumption.assembler.js";
import {AnalyticsApi} from "../infrastructure/analytics-api.js";

const analyticsApi = new AnalyticsApi();

const useAnalyticsStore = defineStore('analytics', () => {

    const consumptions = ref([]);
    const errors = ref([]);
    const consumptionsLoaded = ref(false);

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
        errors,
        consumptionsLoaded,
        consumptionCount,
        consumptionsByDevice,
        fetchConsumptions,
        getConsumptionById,
        getConsumptionsByDeviceId,
        getTotalKwhByDeviceId,
        addConsumption,
        updateConsumption,
        deleteConsumption,
    };
});

export default useAnalyticsStore;
