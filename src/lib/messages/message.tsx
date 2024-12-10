import User from "../users/user";

enum MESSAGE_TYPE {
    TEXT = "text",
    GIF = "gif"
}

class Message {

    private id: string;
    private sender: User;
    private receiver: User;
    private message: string;
    private read: boolean;
    private timestamp: string;
    private msg_type: MESSAGE_TYPE;
    private gif_url: string;
    constructor(id: string, sender: User, receiver: User, message: string, read: boolean, timestamp: string, msg_type: MESSAGE_TYPE, gif_url: string) {
        this.id = id;
        this.message = message;
        this.read = read;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
        this.msg_type = msg_type;
        this.gif_url = gif_url;

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

    public getCreatedAt(): string {
        return this.timestamp;
    }

    public getType(): MESSAGE_TYPE {
        return this.msg_type;
    }

    public getGifUrl(): string {
        return this.gif_url;
    }
}

const parse_msg_type = (msg_type: string): MESSAGE_TYPE => {
    switch (msg_type) {
        case "text":
            return MESSAGE_TYPE.TEXT;
        case "gif":
            return MESSAGE_TYPE.GIF;
        default:
            return MESSAGE_TYPE.TEXT;
    }
}

export default Message;
export { MESSAGE_TYPE, parse_msg_type };