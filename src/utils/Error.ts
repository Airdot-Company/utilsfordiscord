//ufd = utils for discord
export class ufdError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "[PFD_Error]";
    }

    public static throw(message: string) {
        throw new ufdError(message);
    }
}