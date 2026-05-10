
import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {HomeEntity} from "../domain/model/home.entity.js";
import {HomeAssembler} from "../infrastructure/home.assembler.js";

import {DeviceEntity} from "../domain/model/device.entity.js";
import {DeviceAssembler} from "../infrastructure/device.assembler.js";

import {ManagementApi} from "../infrastructure/management-api.js";
const managementApi = new ManagementApi();

const useManagementStore = defineStore('management', () => {

    const homes = ref([]);
    const devices = ref([]);
    const errors = ref([]);

    const homesLoaded = ref(false);

    const devicesLoaded = ref(false);

    const homeCount = computed(() => {
        return homesLoaded ? homes.value.length : 0;
    });

    const devicesCount = computed(() => {
        return devicesLoaded ? devices.value.length : 0;
    });

    function fetchHomes() {
        managementApi.getHomes()
            .then(response => {
                homes.value = HomeAssembler.toEntitiesFromResponse(response);
                homesLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function fetchDevices() {
        managementApi.getDevices()
            .then(response => {
                devices.value = DeviceAssembler.toEntitiesFromResponse(response);
                devicesLoaded.value = true;
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
        managementApi.createHome(home)
            .then(response => {
                const resource = response.data;
                const newHome = HomeAssembler.toEntityFromResource(resource);
                homes.value.push(newHome);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateHome(home) {
        managementApi.updateHome(home)
            .then(response => {
                const resource = response.data;
                const updatedHome = HomeAssembler.toEntityFromResource(resource);
                const index = homes.value.findIndex(h => h.id === updatedHome.id);

                if (index !== -1) {
                    homes.value[index] = updatedHome;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function deleteHome(home) {
        managementApi.deleteHome(home.id)
            .then(() => {
                const index = homes.value.findIndex(h => h.id === home.id);

                if (index !== -1) {
                    homes.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function addDevice(device) {
        managementApi.createDevice(device)
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
        managementApi.updateDevice(device)
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
                const index = devices.value.findIndex(d => d.id === device.id);

                if (index !== -1) {
                    devices.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    return {
        homes,
        devices,
        errors,

        homesLoaded,
        devicesLoaded,

        homeCount,
        devicesCount,

        fetchHomes,
        fetchDevices,

        getHomeById,
        getDeviceById,

        addHome,
        updateHome,
        deleteHome,

        addDevice,
        updateDevice,
        deleteDevice
    };
});

export default useManagementStore;