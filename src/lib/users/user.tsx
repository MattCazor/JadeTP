class User {
    private id: string;
    private first_name: string;
    private last_name: string;

    constructor(id: string, first_name: string, last_name: string) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
    }

    public getFullName(): string {
        return `${this.first_name} ${this.last_name}`;
    }


}

export default User;