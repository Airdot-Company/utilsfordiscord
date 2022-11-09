import "colors";

export type LogMessageType = "Info" | "Warn" | "Error" | "Debug";
export interface LogMessage {
    type: LogMessageType;
    message: string;
    date: Date;
}

/**
 * A powerful logger for built with typescript.
 */
export class Logger {
    public logs: LogMessage[] = [];

    private _formatMessage(message: string, args: any[]) {
        return `${message}${args == null ? "" : ` ${args.map(e => e.toString()).join(" ")}`}`
    }

    private log(message: string, type: LogMessageType){
        let loggedMessage = `[${type}] ${message}`;
        const colors = {
            Info: "blue",
            Warn: "yellow",
            Error: "red",
            Debug: "gray"
        }
        const logTypes = {
            Info: "log",
            Warn: "warn",
            Error: "error",
            Debug: "debug"
        }
        console[logTypes[type]](loggedMessage[colors[type]]);
    }

    public Info(message: string, ...args: any[]) {
        const msg = this._formatMessage(message, args);
        this.log(msg, "Info");
        this.logs.push({
            date: new Date(),
            message: msg,
            type: "Info"
        });
    }

    public Error(message: string, ...args: any[]) {
        const msg = this._formatMessage(message, args);
        this.log(msg, "Error");
        this.logs.push({
            date: new Date(),
            message: this._formatMessage(message, args),
            type: "Error"
        });
    }

    public Warn(message: string, ...args: any[]) {
        const msg = this._formatMessage(message, args);
        this.log(msg, "Warn");
        this.logs.push({
            date: new Date(),
            message: this._formatMessage(message, args),
            type: "Warn"
        });
    }

    public Debug(message: string, ...args: any[]) {
        const msg = this._formatMessage(message, args);
        this.log(msg, "Debug");
        this.logs.push({
            date: new Date(),
            message: this._formatMessage(message, args),
            type: "Debug"
        });
    }

    private async write(){
        //we use fs like this so then it doesn't get bundled with the rest of the code
        //for browser support
        const fs = await import("fs");
        const result = fs.readFileSync("./logs.json", "utf8");
        let logs = this.logs;
        if(result != null) logs = {
            ...this.logs,
            ...JSON.parse(result)
        };

        fs.writeFileSync("./logs.json", JSON.stringify(logs));
    }
}