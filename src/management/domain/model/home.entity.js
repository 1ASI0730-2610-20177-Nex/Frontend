
export class HomeEntity {

    constructor({
                    id = null,
                    name = '',
                    type = '',
                    userId=null,
                    defaultSpaceId = null,}) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.userId = userId;
        this.defaultSpaceId = defaultSpaceId;
    }

}