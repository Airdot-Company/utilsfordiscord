import generateLeaderboard from "./templates/leaderboard";

enum Languages {
    English = "en",
}
/**
 * @readonly use `setLanguage` to change the language.
 */
let lang: Languages = Languages.English;
function setLanguage(language: Languages) {
    lang = language;
}

export {
    generateLeaderboard,
    setLanguage,
    lang,
    Languages
}
