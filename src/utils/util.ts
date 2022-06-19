import { Canvas } from "canvas";

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
