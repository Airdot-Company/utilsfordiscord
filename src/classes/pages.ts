import {
    EmbedBuilder,
    ButtonBuilder,
    EmojiIdentifierResolvable,
    Interaction,
    InteractionReplyOptions,
    ActionRowBuilder,
    InteractionType,
    Message,
    ComponentType,
    ButtonStyle,
    AnyInteraction,
    CommandInteraction,
    InteractionResponse,
    Collection,
    APIActionRowComponent,
    APIMessageActionRowComponent
} from "discord.js";
import { ufdError } from "../utils/Error";
import { generateId, isApplicableInteraction } from "../utils";

export interface ButtonOptions {
    label?: string;
    emoji?: EmojiIdentifierResolvable;
    style?: ButtonStyle;
    visable?: boolean;
    /**
     * @readonly
     * @private
     */
    Id?: keyof BasePageButtons;
}

export interface BasePageButtons {
    nextButton?: ButtonOptions;
    previousButton?: ButtonOptions;
    cancelButton?: ButtonOptions;
    pageNumberButton?: ButtonOptions;
    fastBackwardButton?: ButtonOptions;
    fastForwardButton?: ButtonOptions;
}

export type PageButtonType = number;
export interface SortingOptions {
    nextButton?: PageButtonType;
    previousButton?: PageButtonType;
    cancelButton?: PageButtonType;
    pageNumberButton?: PageButtonType;
    fastForwardButton?: PageButtonType;
    fastBackwardButton?: PageButtonType;
}

export interface PageButtons extends BasePageButtons {
    sorting?: SortingOptions;
}

export interface SendOptions {
    forceButtonsDisabled?: boolean;
    ephemeral?: boolean;
    messageOptions?: InteractionReplyOptions;
}

export interface PageOptions {

}

export interface PresetOptions {
    ShowAll: BasePageButtons;
}

export const Presets: PresetOptions | object = {
    ShowAll: {
        cancelButton: {
            visable: true
        },
        fastBackwardButton: {
            visable: true
        },
        fastForwardButton: {
            visable: true
        },
        nextButton: {
            visable: true
        },
        pageNumberButton: {
            visable: true
        },
        previousButton: {
            visable: true
        }
    }
}

export class Pages {
    public embeds: EmbedBuilder[] = [];
    private defaultButtons: BasePageButtons = {
        cancelButton: {
            label: "✕",
            style: ButtonStyle.Danger,
            visable: true,
            Id: "cancelButton"
        },
        nextButton: {
            label: "▶",
            style: ButtonStyle.Primary,
            visable: true,
            Id: "nextButton"
        },
        previousButton: {
            label: "◀",
            style: ButtonStyle.Primary,
            visable: true,
            Id: "previousButton"
        },
        pageNumberButton: {
            label: "{number}/{number}", //btw {number} does not get replaced
            style: ButtonStyle.Secondary,
            visable: true,
            Id: "pageNumberButton"
        },
        fastForwardButton: {
            label: "forward>>",
            style: ButtonStyle.Primary,
            visable: false,
            Id: "fastForwardButton"
        },
        fastBackwardButton: {
            label: "<<back",
            style: ButtonStyle.Primary,
            visable: false,
            Id: "fastBackwardButton"
        }
    }
    public buttons: PageButtons = {
        ...this.defaultButtons,
        sorting: {
            fastForwardButton: 0,
            previousButton: 1,
            pageNumberButton: 2,
            //6 puts it on the next action row
            cancelButton: 6,
            nextButton: 4,
            fastBackwardButton: 5
        }
    }

    setEmbeds(embeds: EmbedBuilder[]) {
        this.embeds = embeds;
        return this;
    }

    setButtons(buttons: PageButtons) {
        this.buttons = {
            ...buttons,
            ...this.buttons
        };
        return this;
    }

    setPreset(preset: keyof PresetOptions){
        this.buttons = {
            ...Presets[preset],
            ...this.buttons
        }
        return this;
    }

    private isDisabled(buttonId: string) {
        if (buttonId == "cancelButton") {
            return false;
        }
        if (buttonId == "pageNumberButton") {
            return true;
        }
        if (this.embeds.length <= 1) {
            return true;
        }

        return false;
    }

    private renderButtons(sortedButtons: ButtonOptions[], Ids: any, pageIndex: number) {
        const { buttons, embeds } = this;
        return sortedButtons.map((e, i, a) => {
            //get the key of the button
            const key = e.Id;
            /*const key = Object.keys(buttons.sorting).find(k => {
                const value = buttons.sorting[k];
                console.log(i, value, k, value == e.Id)
                if(value == "next"){
                    return value == e.Id;
                } else return value == i
            });*/
            const defaultButton = this.defaultButtons[key];
            const button = new ButtonBuilder()
                .setCustomId(Ids[key])
                .setLabel(key == "pageNumberButton" ? `${pageIndex + 1} of ${embeds.length}` : (e?.label || defaultButton.label))
                .setStyle(e?.style || defaultButton.style)
                .setDisabled(this.isDisabled(key));

            if (e?.emoji != null) {
                button.setEmoji(e?.emoji)
            }

            return button;
        })
    }

    private getButtons(...buttons: ActionRowBuilder[]): (APIActionRowComponent<APIMessageActionRowComponent>)[] {
        //@ts-expect-error
        return buttons;
    }

    async send(interaction: AnyInteraction | Interaction | CommandInteraction | any, options?: SendOptions) {
        const { buttons, embeds } = this;
        let pageIndex = 0;

        const Ids = {
            cancelButton: generateId(),
            nextButton: generateId(),
            previousButton: generateId(),
            pageNumberButton: generateId(),
            fastForwardButton: generateId(),
            fastBackwardButton: generateId()
        }

        let button2: ButtonBuilder;
        const buttonRow2 = new ActionRowBuilder()
        //sort the buttons using buttons.sorted
        const sortedButtons: ButtonOptions[] = Object.keys(buttons.sorting).map(key => {
            const button: ButtonOptions = buttons[key];
            const buttonId = buttons.sorting[key];
            if (buttonId == 6) {
                const defaultButton = this.defaultButtons[key];
                const Buttonbuild = new ButtonBuilder()
                .setCustomId(Ids[key])
                .setLabel(key == "pageNumberButton" ? `${pageIndex + 1} of ${embeds.length}` : (button?.label || defaultButton.label))
                .setStyle(button?.style || defaultButton.style)
                .setDisabled(this.isDisabled(key));
                if(button.emoji != null) Buttonbuild.setEmoji(button.emoji);
                buttonRow2.addComponents(
                    Buttonbuild
                );
                button2 = Buttonbuild;
                return null;
            }
            return {
                ...button,
                ...buttons.sorting[key]
            }
        }).filter(e => e != null).sort((a, b) => a.sorting - b.sorting).filter(e => e?.visable || true);

        const row = new ActionRowBuilder()
            .setComponents(
                this.renderButtons(sortedButtons, Ids, pageIndex)
            )

        const payload: InteractionReplyOptions = {
            embeds: [
                embeds[0]
            ],
            components: this.getButtons(row, buttonRow2),
            ...options?.messageOptions
        }

        let message: InteractionResponse;

        if (isApplicableInteraction(interaction)) {
            message = await interaction.reply({
                fetchReply: true,
                ...payload
            });
        } else {
            throw new ufdError("Pages can only be sent to commands or message components");
        }

        const collect = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: i => i.user.id == interaction.user.id
        });

        collect.on("collect", async i => {
            if (i.customId === Ids.previousButton) {
                if (pageIndex === 0) {
                    pageIndex = embeds.length - 1
                } else {
                    pageIndex--
                }
            } else if (i.customId === Ids.nextButton) {
                if (pageIndex + 1 === embeds.length) {
                    pageIndex = 0
                } else {
                    pageIndex++
                }
            } else if (i.customId == Ids.cancelButton) {
                row.setComponents(
                    this.renderButtons(sortedButtons, Ids, pageIndex).map(e => e.setDisabled(true))
                )

                i.update({
                    components: [
                        //@ts-expect-error
                        this.getButtons(row, new ActionRowBuilder().setComponents(button2.setDisabled(true)))
                    ]
                })
                return collect.stop();
            } else if (i.customId == Ids.fastBackwardButton) {
                pageIndex = 0;
            } else if (i.customId == Ids.fastForwardButton) {
                pageIndex = embeds.length - 1;
            }

            row.setComponents(
                this.renderButtons(sortedButtons, Ids, pageIndex)
            )

            i.update({
                embeds: [
                    embeds[pageIndex]
                ],
                components: this.getButtons(row, buttonRow2)
            }).catch(console.log);
        });
    }
}