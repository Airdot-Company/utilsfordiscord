export class pfdError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "[PFD_Error]";
    }

    public static throw(message: string) {
        throw new pfdError(message);
    }
}