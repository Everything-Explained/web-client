title: commands
author: Jaeiya

# WHAT ARE COMMANDS
When you type a `/` character in the text box on the chat page **(the command box)**, that's the beginning of a command entry. If you **begin** to type `/hello` into the **chat box**, you'll notice that it trys to predict what command you're trying to type. When it's guessed correctly you can hit the `TAB` key on your keyboard to auto-complete that command. From there, all you have to do is hit `ENTER` to execute the command.

The prediction feature is called **auto-completion**. Whenever you type the `/` character into the command box, it knows you're going to type a command. Based on the first letter you type **after** the `/` character, it will start _suggesting_ possible commands. This is convenient if you've forgotten the name of a command but know it starts with **S**, or for discovering new commands you didn't know about.

Commands are helpful for executing various functions that have no interface for you to interact with, such as `/ping` to see what your latency is from the server. Below, is a detailed breakdown of all the commands and how to use them.

## PING
`/ping` is used for testing the latency between you and the server. The higher the number - **which is in milliseconds** - the longer it takes you to receive messages in chat. Let's say your latency is `100ms`, this means that it takes _100 milliseconds_ for you to receive a message or confirm a sent message, from the server. For those that don't know the comparison of **milliseconds to seconds**, 1 millisecond is a `1,000th` of a second, so _100 milliseconds is a 10th of a second_.

> In most cases, you aren't going to notice much delay, but if your location is quite far from the server, you may experience some lag between when you send a message, and when you see that message displayed in chat.

This command also has what's called an **optional argument**, which means you can pass a modifier to the command. In this case, the modifier is called `avg` or `average`; either one will work. If you type `/ping avg` or `/ping average`, your cumulative average ping will be displayed. Now, this value will get more accurate the more ping values it records.

The necessity of an **average** ping vs. your actual ping, is because networks are very rarely stable. There can be large connection fluxuations between your computer and the server. The average ping is a way to weed out unimportant fluxuations. If for `10ms` your connection decides to take `200ms` to send a message to the server, that isn't very important, however if that `10ms` turns into _10's of seconds_, then there might be something wrong. Those 10s of seconds will be reflected in the average ping.

## SCALE
`/scale <size>` is what we call a command that **requires** an argument. Unlike `/ping` which has an **optional argument**, `/scale` must _always be executed with an argument_. Because we're talking about scale, we're talking about the **size** of something, and in this case, we're talking about the size or scale of messages within the chat display.

For instance, if you type `/scale large` that will increase the font size for all messages. The following, is a list of all applicable values for `<size>`.

- small
- normal
- large
- larger
- largest

I doubt too many people will be using `small`, but it's there just in case you have really young eyes and feel like you need more space. I would recommend `large` for most people, since most people have fairly high resolution monitors.

##### WIP : This command does not persist as a setting. Once you leave the chat or close the window, the scale is reset to normal. Eventually this setting will persist across sessions.

## HELLO
`/hello` has hopefully already been introduced to you at the top of this page. It's a simple command that requires no arguments. It displays a cute little client message to help you understand how commands work.

## STYLE
The `/style <type>` command requires a _type_ argument. Currently there are two types of messages, `/style inline` and `/style normal`. Normal messages are designed to emphasize blocks of discussion, as well as minor personalization in the form of an Avatar. Inline messages are designed to give the bare minimum of information, to maximize display space.

If you like being able to discern each persons messages at a glance within a conversation block, then normal messages are what you want. If however, you prefer function over form, try out inline message style.

##### WIP : Inline messages are an experimental feature and may not work as intended in all circumstances.

## EMOTE
`/emote` or `/me` commands require an argument, but this time the argument is not a modifier, it's a message. In most chat applications these days, we have what are known as **Emoji's**. These are modern Pictograph's of what came before them, which were text **emotes** - _the original emoji_. You would simply type `/me <action>`, where `<action>` is replaced by what you're doing in 3rd person.

Here's an example of an emote: `/me waves to everyone`.
This is what it will display to the channel: `bob waves to everyone`, where _bob would be replaced by your name_.

Before Pictographs, this is how the tech world communicated its actions. If we wanted to smile, we would express it like `/me smiles`. If we wanted to laugh, we would type `/me is laughing out loud`. There's a lot more flexibility when using words than Pictographs, which is why this command exists.

## CLEAR
`/clear` is used to clear the chat display of all messages. It requires no arguments. _Really, that simple!_

## NOTICE
The `/notice <alias> <message>` command is a unique one, because it requires **2** arguments. The first argument `<alias>`, is the name of the user you want to **Notice** and the second argument `<message>`, is the message to send to that user.

> Double clicking a user in the user list will automatically paste part of the command in for you, so after that, all you have to type is the message.

Notices are messages that can only be read by the recipient. What makes them different than private messages, is that _they are not stored anywhere_. When you send a notice, the user receiving that notice must be in the channel you're sending it to. Not only that, but unless they're looking at chat, it's possible that they could miss it entirely if there's another discussion going on in that channel.

Notices are really just a way for users to send comments that they don't want the whole channel to see. In my experience, it's been used to talk to a friend covertly about an ongoing discussion in the channel. This allows us to have an inside discussion within the main public discussion going on.

## CONNECT
`/connect` requires no arguments and is only useful if you lose connection to the server.

## DISCONNECT
`/disconnect` requires no arguments and is likely never useful, since there's no reason in which you'd want to manually disconnect from the server.

