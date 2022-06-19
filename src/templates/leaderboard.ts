import Canvas from "canvas";
import { pfdError } from "../utils/Errors";
import { applyText, checkAll, isHex, isNull, isURL, leaderboardChecks, use, useUsername } from "../utils/util";

export interface LeaderboardMember {
    /**
     * The username of the user
     */
    username: string;
    /**
     * The nickname of the user. If the user has no nickname, the username is used.
     * 
     * **e.g. on Twitch**
     * 
     * The username would be "username" and the nickname would be "Username".
     * 
     * **e.g. on Discord**
     * 
     * The username would be "username" and the nickname would be "Random User"
     */
    nickname?: string;
    /**
     * The score or xp of the user.
     */
    score: number;
    /**
     * The avatar **URL** of this user.
     * Defaults to https://cdn.discordapp.com/embed/avatars/0.png
     */
    avatarURL?: string;
}

export interface LeaderboardOptions {
    /**
     * The text color of the users. **MUST** be a hex.
     */
    textColor?: string;
    /**
     * The background image of the leaderboard. **MUST** be a URL.
     */
    backgroundURL?: string;
}

export default async function Leaderboard(leaderboard: LeaderboardMember[], options: LeaderboardOptions = { }){
        //Error messages
        if(!leaderboard) throw new pfdError("No leaderboard provided");
        if(!leaderboard.length) throw new pfdError("No members in leaderboard");
        if(!isNull(options.textColor) && !isHex(options.textColor)) throw new pfdError("Invalid text color");
        if(!isNull(options.backgroundURL) && !isURL(options.backgroundURL)) throw new pfdError("Invalid background URL");
        const leaderboardCheck = checkAll<LeaderboardMember>(
            leaderboard,
            leaderboardChecks
        );
        if(!leaderboardCheck.valid) throw new pfdError(`Invalid leaderboard member: ${leaderboardCheck.reason}`);
    
        //Load all files
        const backgroundFile = use(options.backgroundURL, "./src/images/background.png");
        const backgroundFileAvatar = "./src/images/avatar_background.png";
        const backgroundAvatar = await Canvas.loadImage(backgroundFileAvatar);
        const background = await Canvas.loadImage(backgroundFile);
        
        //Create canvas
        const canvas = Canvas.createCanvas(700, 1250);
        const context = canvas.getContext('2d');
    
        //Draw background
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        //I have no idea what this is...
        // context.strokeStyle = '#0099ff';
        // context.strokeRect(0, 0, canvas.width, canvas.height);
        //...
    
        //These are the positions of where the avatars or names should go
        const poses = {
            0: { text: 91, avatar: 25.7 },
            1: { text: 341, avatar: 275.7 },
            2: { text: 591, avatar: 525.7 },
            3: { text: 841, avatar: 775.7 },
            4: { text: 1091, avatar: 1025.7 },
            "defualt": { avatar: { x: 24.2, w: 199.9, h: 198.7 }, text: { x: 260.6, w: 380.2, h: 68 } }
        }
        //This is the current position that its drawing on
        let pos = 0;
        //Run a for loop for all the users of the leaderboard
        for (const user of leaderboard) {    
            //Get the position that its drawing
            const posData = poses[pos];
    
            //Paint their nickname, username, or no name
            const availbleUsername = useUsername(user.username, user.nickname);
    
            //Add their username or nickname
            context.font = applyText(canvas, `${availbleUsername}`);
            //Select the text color
            context.fillStyle = use(options.textColor, '#ffffff');
            //Paint it on
            context.fillText(`${availbleUsername}`, poses.defualt.text.x, posData.text);
    
            //Load the avatar. If the user does not exist use a discord one
            const avatar = await Canvas.loadImage(user.avatarURL == null ? "https://cdn.discordapp.com/embed/avatars/0.png" : user.avatarURL);
    
            //Draw the avatar
            context.save()
            context.beginPath();
            context.arc(poses.defualt.avatar.x + 100, posData.avatar + 100, 100, 0, Math.PI * 2, true)
            context.closePath()
            context.clip()
            context.drawImage(backgroundAvatar, poses.defualt.avatar.x, posData.avatar, poses.defualt.avatar.w, poses.defualt.avatar.h);
            context.drawImage(avatar, poses.defualt.avatar.x, posData.avatar, poses.defualt.avatar.w, poses.defualt.avatar.h);
            context.restore()
            //...
    
            //Move to the next position
            pos++
        }
    
        //Return the image as a MessageAttachment
        return canvas.toBuffer();
}