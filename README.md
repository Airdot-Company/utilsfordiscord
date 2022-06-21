<div align="center">
<img src="images/utilsfordiscord.svg" width="150px"/>

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
![Pages](images/95wDh6wLe6.gif)

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

### 6/20/2022
* Added Pages class
* Add tests
* Add base stuff
