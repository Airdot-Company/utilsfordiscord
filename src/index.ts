import { Client } from "discord.js";
import { generateId, randomNumber } from "./utils/index";
const utils = {
    randomNumber,
    generateId
}

export {
    BasePageButtons,
    ButtonOptions,
    PageButtons,
    PageOptions,
    SendOptions,
    Pages,
    PageButtonType,
    PresetOptions,
    Presets,
    SortingOptions
} from "./classes/pages";
export {
    LogMessage,
    LogMessageType,
    Logger
} from "./plugins/logger";
export {
    utils
}
