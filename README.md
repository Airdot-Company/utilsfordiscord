<div align="center">
<img src="https://raw.githubusercontent.com/turtlepaws-workshop/utilsfordiscord/main/images/utilsfordiscord.svg" width="150px"/>

<h3 style="font-size: 25.5px;">Utils for Discord</h2>

🛠️ Handy utilities for Discord bots.

---

</div>

<details>
    <summary>📃 Table of Contents</summary>

- [Features](#features)
- [Installation](#installation)
- [Examples](#examples)
  - [Pages](#pages)
- [Roadmap](#roadmap)
- [Changelog](#changelog)
  - [6/24/2022](#6242022)
  - [6/20/2022](#6202022)
</details>

## Features
- 📦 No third-party libraries
- 📥 Easy to install & use
- 🛠️ Utilities that make sense
## Installation

```bash
npm install utilsfordiscord
```
or
```bash
yarn add utilsfordiscord
```

## Examples

### Pages
![Pages][pages]
![You can also have custom buttons][pages-buttons]

> **Note**
> This codeblock has been shortened.
```js
new Utils.Pages()
    .setEmbeds([
        new Discord.EmbedBuilder()
        .setTitle("Embed 1")
        .setDescription("This is an embed page you can put anything you want on it!"),
        new Discord.EmbedBuilder()
        .setTitle("Embed 2")
        .setDescription("Pages also supports Discord.js v14!")
    ])
    .setComponents([
        new Discord.ButtonBuilder()
        .setLabel("Custom Button")
        .setStyle(ButtonStyle.Success)
        .setCustomId("custom-button"),
        new Discord.ButtonBuilder()
        .setLabel("Learn More")
        .setStyle(ButtonStyle.Link)
        .setURL("https://npm.im/utilsfordiscordjs")
    ])
    .setEventListener(i => i.reply("You clicked a custom button!"))
    .send(i, {
        disableCustomButtons: false
    });
```

## Roadmap

- 📦 In progress - Add more utilities

## Changelog
> **Note**
> Format: Fixes -> Additions -> Updates -> Removals

### 11/11/2022
* Fix bug `data.components[1].components[BASE_TYPE_REQUIRED]: This field is required`
* Remove all `//@ts-expect-error`
### 6/24/2022
* Add support for custom components
* Add custom component events listeners
### 6/20/2022
* Added Pages class
* Add tests
* Add base stuff

[pages-buttons]: https://turtlepaw.is-from.space/r/Discord_PMHu5ymEsQ.png
[pages]: https://turtlepaw.is-from.space/r/MpiYO9YQH6.gif