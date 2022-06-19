import { Canvas } from "canvas";
import { LeaderboardMember } from "../templates/leaderboard";
import en from "../lang/en.json";
import { lang } from "../index";

export function applyText(canvas: Canvas, text: string){
    const context = canvas.getContext('2d');
    let fontSize = 70;

    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
}

export function useUsername(username: string, nickname: string | null | undefined){
    return username == null ? "Unknown User" : (nickname != null ? nickname : username);
}

export function use(value: any | null | undefined, or: any){
    return value == null ? or : value;
}

export function isNull(value: any){
    return value == null;
}

export function isHex(value: string){
    return /^#[0-9A-F]{6}$/i.test(value);
}

export function isURL(value: string){
    return /^https?:\/\/\S+$/.test(value);
}

export function checkAll<T>(values: T[], check: (value: T) => { reason?: string, valid: boolean }) {
    for (const value of values) {
        const checked = check(value);
        if (!checked.valid) {
            return {
                reason: checked.reason,
                valid: checked.valid
            };
        }
    }

    return {
        reason: null,
        valid: true
    };
}

export function leaderboardChecks(v: LeaderboardMember): { reason?: string, valid: boolean } {
    if(isNull(v.username) || typeof v.username !== "string" || v.username.length < 1) return {
        valid: false,
        reason: "Invalid username"
    };
    if(isNull(v.score) || typeof v.score !== "number" || v.score < 1) return {
        valid: false,
        reason: "Invalid score"
    };
    if(!isNull(v.avatarURL) && !isURL(v.avatarURL)) return {
        valid: false,
        reason: "Invalid avatar URL"
    };
    if(!isNull(v.nickname) && (typeof v.nickname !== "string" || v.nickname.length < 1)) return {
        valid: false,
        reason: "Invalid nickname"
    };
    return {
        valid: true
    };
}

export function useText(text: keyof typeof en){
    const languages = {
        en: en
    };

    return languages[lang][text];
}
