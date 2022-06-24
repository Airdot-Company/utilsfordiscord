<div align="center">
<img src="https://raw.githubusercontent.com/turtlepaws-workshop/utilsfordiscord/main/images/utilsfordiscord.svg" width="150px"/>

## Utils for Discord
🛠️ Handy utilities for Discord bots.

---

</div>

<details>
    <summary>📃 Table of Contents</summary>

* [Features](#features)
* [Installation](#installation)
* [Examples](#examples)
* [Changelog](#changelog)
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
    .send(interaction);
```

## Roadmap

- 📦 In progress - Add more utilities

## Changelog
> **Note**
> Format: Fixes -> Additions -> Updates -> Removals

### 6/24/2022
* Add support for custom components
### 6/20/2022
* Added Pages class
* Add tests
* Add base stuff

[pages-buttons]: https://turtlepaw.is-from.space/r/Discord_PMHu5ymEsQ.png
[pages]: https://turtlepaw.is-from.space/r/95wDh6wLe6.gif