import User from "../users/user";

class Message {

    private id: string;
    private sender: User;
    private receiver: User;
    private message: string;
    private read: boolean;
    private timestamp: string;
    constructor(id: string, sender: User, receiver: User, message: string, read: boolean, timestamp: string) {
        this.id = id;
        this.message = message;
        this.read = read;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
    }

    public getId(): string {
        return this.id;
    }

    public getReciever(): User {
        return this.receiver;
    }

    public getSender(): User {
        return this.sender;
    }

    public getMessage(): string {
        return this.message;
    }

    public getHasBeenRead(): boolean {
        return this.read;
    }
}

export default Message;