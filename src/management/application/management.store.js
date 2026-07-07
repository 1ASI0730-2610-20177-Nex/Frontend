
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import useIamStore from "../../iam/application/iam.store.js";

import {HomeEntity} from "../domain/model/home.entity.js";
import {HomeAssembler} from "../infrastructure/home.assembler.js";

import {DeviceEntity} from "../domain/model/device.entity.js";
import {DeviceAssembler} from "../infrastructure/device.assembler.js";

import {SimulationSessionAssembler} from "../infrastructure/simulation-session.assembler.js";
import {ManagementApi} from "../infrastructure/management-api.js";

const managementApi = new ManagementApi();

const useManagementStore = defineStore('management', () => {

    const homes = ref([]);
    const devices = ref([]);
    const simulationSessions = ref([]);
    const activeSimulationSessions = ref([]);
    const errors = ref([]);

    const homesLoaded = ref(false);
    const devicesLoaded = ref(false);
    const simulationSessionsLoaded = ref(false);

    const homeCount = computed(() => {
        return homesLoaded.value ? homes.value.length : 0;
    });

    const devicesCount = computed(() => {
        return devicesLoaded.value ? devices.value.length : 0;
    });

    function resolveUserId(userId) {
        if (userId) return userId;
        const iamStore = useIamStore();
        return iamStore.userId ?? import.meta.env.VITE_DEFAULT_USER_ID ?? null;
    }

    function fetchHomes(userId) {
        const resolvedUserId = resolveUserId(userId);

        return managementApi.getHomes(resolvedUserId)
            .then(response => {
                homes.value = HomeAssembler.toEntitiesFromResponse(response);
                homesLoaded.value = true;
                return homes.value;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchDevices(spaceId) {
        managementApi.getDevices(spaceId)
            .then(response => {
                devices.value = DeviceAssembler.toEntitiesFromResponse(response);
                devicesLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchSimulationSession(sessionId) {
        return managementApi.getSimulationSession(sessionId)
            .then(response => {
                return SimulationSessionAssembler.toEntityFromResource(response.data);
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchActiveSimulationSessions(userId) {
        const resolvedUserId = resolveUserId(userId);

        return managementApi.getActiveSimulationSessions(resolvedUserId)
            .then(response => {
                activeSimulationSessions.value = SimulationSessionAssembler.toEntitiesFromResponse(response);
                simulationSessionsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function getHomeById(id) {
        const idNum = parseInt(id);
        return homes.value.find(home => home.id === idNum);
    }

    function getDeviceById(id) {
        const idNum = parseInt(id);
        return devices.value.find(device => device.id === idNum);
    }

    function addHome(home) {
        const payload = {
            ...home,
            userId: resolveUserId(home.userId),
        };

        managementApi.createHome(payload)
            .then(response => {
                const resource = response.data;
                const newHome = HomeAssembler.toEntityFromResource(resource);
                homes.value.push(newHome);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function createSpace(propertyId, space) {
        return managementApi.createSpace(propertyId, space)
            .then(response => response.data)
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function addDevice(device) {
        const payload = {
            ...device,
            spaceId: device.spaceId ?? device.homeId,
        };

        managementApi.createDevice(payload)
            .then(response => {
                const resource = response.data;
                const newDevice = DeviceAssembler.toEntityFromResource(resource);
                devices.value.push(newDevice);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateDevice(device) {
        const payload = {
            ...device,
            spaceId: device.spaceId ?? device.homeId,
        };

        managementApi.updateDevice(payload)
            .then(response => {
                const resource = response.data;
                const updatedDevice = DeviceAssembler.toEntityFromResource(resource);
                const index = devices.value.findIndex(d => d.id === updatedDevice.id);

                if (index !== -1) {
                    devices.value[index] = updatedDevice;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function deleteDevice(device) {
        managementApi.deleteDevice(device.id)
            .then(() => {
                const index = devices.value.findIndex(d => d.id == device.id);

                if (index !== -1) {
                    devices.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function startSimulationSession(session) {
        return managementApi.createSimulationSession(session)
            .then(response => {
                const created = SimulationSessionAssembler.toEntityFromResource(response.data);
                simulationSessions.value.push(created);
                return created;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function addSimulationAction(sessionId, action) {
        return managementApi.addSimulationAction(sessionId, action)
            .then(response => response.data)
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function endSimulationSession(sessionId) {
        return managementApi.endSimulationSession(sessionId)
            .then(response => {
                const ended = SimulationSessionAssembler.toEntityFromResource(response.data);
                const index = simulationSessions.value.findIndex(s => s.id === ended.id);

                if (index !== -1) {
                    simulationSessions.value[index] = ended;
                }

                return ended;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    return {
        homes,
        devices,
        simulationSessions,
        activeSimulationSessions,
        errors,

        homesLoaded,
        devicesLoaded,
        simulationSessionsLoaded,

        homeCount,
        devicesCount,

        fetchHomes,
        fetchDevices,
        fetchSimulationSession,
        fetchActiveSimulationSessions,

        getHomeById,
        getDeviceById,

        addHome,
        createSpace,

        addDevice,
        updateDevice,
        deleteDevice,

        startSimulationSession,
        addSimulationAction,
        endSimulationSession,
    };
});

export default useManagementStore;
