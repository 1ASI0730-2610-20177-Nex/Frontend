
export class ProfileEntity {

    constructor({
                    id = null,
                    userId = null,
                    displayName = '',
                    avatarUrl = '',
                    preferences = {},
                }) {
        this.id = id;
        this.userId = userId;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.preferences = preferences;
    }

}
