
export class SimulationSessionEntity {

    constructor({
                    id = null,
                    userId = null,
                    propertyId = null,
                    status = '',
                    startedAt = null,
                    endedAt = null,
                    actions = [],
                }) {
        this.id = id;
        this.userId = userId;
        this.propertyId = propertyId;
        this.status = status;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.actions = actions;
    }

}
