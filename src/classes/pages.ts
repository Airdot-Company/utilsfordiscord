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
    CommandInteraction,
    AnyComponentBuilder,
    APIActionRowComponent,
    APIMessageActionRowComponent,
    ChatInputCommandInteraction,
    SelectMenuInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    ContextMenuCommandInteraction,
    SelectMenuBuilder
} from "discord.js";
import { ufdError } from "../utils/Error";
import { generateId } from "../utils";

export interface ButtonOptions {
    label?: string;
    emoji?: EmojiIdentifierResolvable;
    style?: ButtonStyle;
    visable?: boolean;
}

export interface BasePageButtons {
    nextButton?: ButtonOptions;
    previousButton?: ButtonOptions;
    cancelButton?: ButtonOptions;
    pageNumberButton?: ButtonOptions;
}

export interface PageButtons extends BasePageButtons {
    sorting?: {
        nextButton?: number;
        previousButton?: number;
        cancelButton?: number;
        pageNumberButton?: number;
    }
}

export interface SendOptions {
    forceButtonsDisabled?: boolean;
    ephemeral?: boolean;
    messageOptions?: InteractionReplyOptions;
    disableCustomButtons?: boolean;
}

export interface PageOptions {

}

export type AnyInteraction = CommandInteraction | ChatInputCommandInteraction | SelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction | ContextMenuCommandInteraction;
export class Pages {
    public embeds: EmbedBuilder[] = [];
    /**
     * This will be on the next row.
     */
    public components: ActionRowBuilder[] = [];
    private defaultButtons: BasePageButtons = {
        cancelButton: {
            label: "✕",
            style: ButtonStyle.Danger,
            visable: true
        },
        nextButton: {
            label: "▶",
            style: ButtonStyle.Primary,
            visable: true
        },
        previousButton: {
            label: "◀",
            style: ButtonStyle.Primary,
            visable: true
        },
        pageNumberButton: {
            label: "{number}/{number}", //btw {number} does not get replaced
            style: ButtonStyle.Secondary,
            visable: true
        }
    }
    public buttons: PageButtons = {
        ...this.defaultButtons,
        sorting: {
            previousButton: 0,
            pageNumberButton: 1,
            cancelButton: 2,
            nextButton: 3
        }
    }

    setEmbeds(embeds: EmbedBuilder[]) {
        this.embeds = embeds;
        return this;
    }

    setComponents(components: ActionRowBuilder[]) {
        this.components = components;
        return this;
    }

    setButtons(buttons: PageButtons) {
        this.buttons = {
            ...buttons,
            ...this.buttons
        };
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

    private renderButtons(sortedButtons: ButtonOptions[], Ids: any, pageIndex: number){
        const { buttons, embeds } = this;
        return sortedButtons.map((e, i, a) => {
            //get the key of the button
            const key = Object.keys(buttons.sorting).find(k => buttons.sorting[k] === i);
            const defaultButton = this.defaultButtons[key];
            const button = new ButtonBuilder()
                .setCustomId(Ids[key])
                .setLabel(key == "pageNumberButton" ? `${pageIndex + 1} of ${embeds.length}` : (e?.label || defaultButton.label))
                .setStyle(e?.style || defaultButton.style)
                .setDisabled(this.isDisabled(key));

            if(e?.emoji != null){
                button.setEmoji(e?.emoji)
            }

            return button;
        })
    }

    private getComponents(disabled: boolean = false): APIActionRowComponent<APIMessageActionRowComponent> {
        const row = this.components.map(e => {
            //set the buttons in the component disabled
            //don't use renderButtons

            const buttons = e.components.map(b => {
                if (b.data.type == ComponentType.Button){
                    const button = ButtonBuilder.from(b as ButtonBuilder)
                    .setDisabled(disabled);
                    return button;
                } else if(b.data.type == ComponentType.SelectMenu){
                    const button = SelectMenuBuilder.from(b as SelectMenuBuilder)
                    .setDisabled(disabled);
                    return button;
                }
            });

            e.setComponents(buttons);
        });

        //@ts-expect-error
        return new ActionRowBuilder()
        .setComponents(
            //@ts-expect-error
            disabled ? row : this.components
        ).toJSON();
    }

    async send(interaction: AnyInteraction | Interaction | CommandInteraction | any, options?: SendOptions) {
        const { buttons, embeds } = this;
        let pageIndex = 0;

        //sort the buttons using buttons.sorted
        const sortedButtons: ButtonOptions[] = Object.keys(buttons.sorting).map(key => {
            const button = buttons[key];
            return {
                ...button,
                ...buttons.sorting[key]
            }
        }).sort((a, b) => a.sorting - b.sorting).filter(e => e?.visable || true);

        const Ids = {
            cancelButton: generateId(),
            nextButton: generateId(),
            previousButton: generateId(),
            pageNumberButton: generateId()
        }

        const row = new ActionRowBuilder()
            .setComponents(
                this.renderButtons(sortedButtons, Ids, pageIndex)
            )

        const payload: InteractionReplyOptions = {
            embeds: [
                embeds[0]
            ],
            components: [
                //@ts-expect-error
                row,
                this.getComponents()
            ],
            ...options?.messageOptions
        }

        let message: Message;

        if (interaction.type == InteractionType.ApplicationCommand || interaction.type == InteractionType.MessageComponent) {
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
            } else if(i.customId == Ids.cancelButton){
                i.update({
                    components: [
                        //@ts-expect-error
                        row.setComponents(
                            this.renderButtons(sortedButtons, Ids, pageIndex).map(e => e.setDisabled())
                        ),
                        this.getComponents(options?.disableCustomButtons == null ? true : options?.disableCustomButtons)
                    ]
                })
                return collect.stop();
            }

            row.setComponents(
                this.renderButtons(sortedButtons, Ids, pageIndex)
            )

            i.update({
                embeds: [
                    embeds[pageIndex]
                ],
                components: [
                    //@ts-expect-error
                    row,
                    this.getComponents()
                ]
            }).catch(console.log);
        });
    }
}