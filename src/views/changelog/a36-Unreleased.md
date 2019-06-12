title: α36 : revelation
author: Aedaeum
date: 6/12/2019

# NEW LAYOUT
> - **Paginated Deliciousness** - The _Changelog_, _FAQ_, _Blog_, and _Home_ pages have been converted to a new layout. These pages have dynamic data which will be converted into a nice looking layout for you to peruse.
> - Accompanying the new look, is the ability to link to each of the dynamic pages. _Clicking_ a change log will now change the URL and you can share that URL with **anyone**!

> - **Invite page has dissappeared! -** Wait...___no___...it's _just been moved_, don't worry. The Signin page now allows you to do **all the things**. You can of course Signin, but you can also request an invite or Signup with an existing invite! _It's an all-in-one page_ now with fancy toggles for each action.
> - Of course this page is **only available** if you're not already Signed in...because well, that's the point right?


# CHAT OVERHAUL
> - **Did someone say ___SCALE___? -** The scaling system now actually scales the size of the text, not just your avatar. Because the avatar is the most visible object in chat, it will now stay at an adaquate **48x48** pixels. To scale the chat, simply type `/scale large`;.
> - Scale is only one of many other [commands] that have been added to this release. Go ahead and check out the [commands] FAQ to learn even more about **scale**, as well as all the other [commands].

> - **More message variety... -** Every message type has been modified to look a bit more unique. **Notices**, **Emotes**, and even **Normal Messages**, have their own special look now. Colors have also been updated to be more _vibrant and obvious_, yet **not** so bright that it smashes your eyes.

> - **More appendages... -** So back in the [Fate] release, I added message-appending support. This worked well, but it left out the time data. In this release, messages will only be allowed to append up to **45 seconds** after the first message. _No more infinitely long messages_...and **especially** no more reason to wonder how long ago someone sent a message within a block.

> - **Level Redux -** Okay, so...the _45 second_ delay between "accountable" messages was initially a good idea, until I realized that it's forcing users into an artificial XP cadence. I've increased the limitation to _60 seconds_ per "accountable" message, but instead of there being a delay after each message, this new implementation instantiates a **messages per hour** speed limit.
> - I know what you're thinking: _"So we can only type so many messages per hour?"_. No, you can type as many messages as you want, but ___only 60___ of those messages will add to your [XP] which directly contributes to your [Level].
> - Because of this change, you can capitalize on those first 60 messages at any point during every hour. _You are no longer limited by a time-delay_. Once you've hit the "speed limit" - **60 messages per hour** - you can obviously still send messages, you just won't gain [XP] for them, until the next hour rolls around.


# COMPROMISING
> - **Maybe blog later? -** The blog has been a part of the site for quite a while, but it's become more of an after-thought. I don't really know where it fits in with Noumenae right now, so it will be removed from this release.

> - **The Grammar Nazi has been pacified! -** Because I wanted to get this release out on time, I have decided to leave the _real-time spell-checker_ behind. Don't worry though, it will be back in the near future! The next iteration of it will be more efficient and accurate.

> - **Bible versing paused -** One of the first chat features was being able to create bible verse links by typing out the verse shorthand: `gen 1:1-3`. This feature was dropped due to potentially low usage and a poorly fleshed out API.


# BITS & BOBS
> - **Don't like your alias? -** Well, now you can change it! Just go into your [Settings] page and click the _edit icon_ next to your alias. A slick little box will appear, which will allow you to fiddle around. **Have at it!!**

> - **Chat ports anyone? -** I haven't forgotten about **Chat Ports**, but that feature requires a lot of creativity so as not to convolute the Chat interface. It **will** be revisited in a later release.


# UNDER THE HOOD
> - **Firefox Shananigans -** I've had nothing but issues trying to get Firefox to behave properly. Thankfully most of those issues **(Scrollbar colors, Font rendering, Editable Div's)** have been dealt with in this release. There may still be some quirks here and there, but overall, _Firefox usrs should have a solid experience_.

> - **The Greatest Overhaul -** This project began as my first foray into [MVC]. I was going to be a part of something new and quite possibly unique, called [Aurelia]. When the rose-colored glasses came off, all I saw was a hot mess. Because of this, I’ve converted the entire project to [Vue]. It’s extendable and flexible in ways that are most intuitive for perpetual development, which is exactly what I needed.
> - This has been almost a complete rewrite, as the components from [Aurelia] were not transferrable in their original state. While I was at it, I decided to rewrite the server as well, so the front-end and back-end barely even resemble what they were in the beginning. It's weird to think that if you look at the code from either side of the site, it's unrecognizeable from what it was when I began this project.
> - You might be wondering though, _what does this mean for you_? It simply means more performance and a faster update cycle. The codebase is significantly easier to navigate and the frameworks on both sides (front-end & back-end) have been designed with proper paradigms to allow quicker updates.



[commands]:/#/faq/commands
[fate]:/#/chg.log/fate
[settings]:/#/settings
[MVC]:https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
[Vue]:https://vuejs.org/
[Aurelia]:https://aurelia.io/
[xp]:/#/faq/xp
[level]:/#/faq/levels