
export class UserEntity {

    constructor({
                    id = null,
                    name = '',
                    email = '',
                    plan = '',
                    createdAt = null,
                }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.plan = plan;
        this.createdAt = createdAt;
    }

}
