eyJ0aW1lIjoiMjAxOC0wNC0yMFQwODowMDowMC4wMDBaIiwidGl0bGUiOiLOsTQ4IDogY2hyb21lLWkifQ==
# qol features

>- **More Readability** - Default text color was hiding too much into the background. It should be **much** easier to read now.

>- **Spacious Rules** - The rules page has a lot of good information, but it was all slammed together; each rules *"personal space"* has been increased.

>- **Consistency Abounds** - The whole site has undergone a consistency check to make sure that all margins, all text alignments, and colors are consistent with each page and action.

>- **FAQ 2.0** - Although the FAQ page was already pretty snazzy, I decided to make it not only _easier to read_, but also easier for me to update!! This also includes URL support, so you can link to your favorite questions! Well, maybe that's more for me than it is for you...but what is for you, are the **new highlight blocks**, purple for _work-in-progress_ information and gold for _**the-most-important**_ information.

>- **Are you Idle or Active?** - That is the question! And now that question can be answered because the server and client share that information. Your new idle/active stats will be updated when you toggle from idle to active.

>- **What level are you?** - Is a question you can now ask yourself. Unfortunately you won't be able to answer that question, because as of right now there is no way to actually view your level. That will come in the next update.
>- Levels are gained by simply chatting on the site, but to prevent spam, you only gain [XP] every 45 seconds.
>- If you want to get a sneak peek at what stats will be available in the future, check out this issue [here](https://github.com/Noumenae/server/issues/25). You might not know what some of those stats are, but they will be revealed in time.

# chat commander redux

>- **Yes, New** - The chat commander (input box on chat page) has undergone an impressive rewrite, which leaves it almost unrecognizeable to its former self. That being said, it behaves almost identically to its previous version, however, with precision.
>- Each feature that existed before this update is still present, but now works on _all supported browsers_ flawlessly. It's not only bug-free but also easier to update with new features.

>- **Play it again Sam** - After sending a message or command, it will be saved in a temporary history so that when you hit the `UP arrow` on your keyboard, the previous message or command will be immediately put back into the chat box.
>- Repeatedly hitting the `UP arrow` will cycle **up** through the history of messages or commands that you've sent. Likewise, hitting the `DOWN arrow`, will cycle **down** through the history.
>- The history only saves up to 30 items and will disappear once you navigate to another page or exit the site.

>- **Grammar Nazi Ahead!** - This feature now works across browsers. As you type, commonly misspelled words will be corrected. For instance: `teh` will be corrected to `the`. Also when typing `i` by itself, it will be capitalized to `I`.
>- At some point, this feature will be optional, but for testing purposes it will be left on until full release.

>- **Need a Hint?** - As you type a command, a hint will appear so you can quickly complete the command by hitting the `TAB` or `ENTER` key on your keyboard. This allows you to type as little as 2 or 3 characters to enter a command.

# internals

>- **Persistent Updates!** - Basically when the site gets an update, it requires the user to refresh, but this doesn't work if the site is loaded from the browser [cache]. So to get around this, I've [busted] your cache. This allows a _programmatic_ or _user_ initiated refresh of the page to load the new version of the site.
>- Originally when I updated the site, I would have to log into my [CDN] (cloudflare) and manually bust the cache by telling it to purge all files. After this update, I will no longer have to do that.

>- **Database Revamp** - You, the user, won't recognize any changes with this update but because the database code got updated, it means your new stats are ready to be implemented for the next release cycle.

# fixes and security

>- **Server message fiasco** - There was a bit of code that allowed a savvy user to send server messages to everyone. That hole has been thoroughly plugged.

>- **Firefox Shenanigans** - As usual this browser likes to stand out in all the worst ways. The hint completions are mostly fixed, but a second round of cleaning up its mess in the content-editable-div, is necessary.


[cdn]:https://www.incapsula.com/cdn-guide/what-is-cdn-how-it-works.html
[cache]:https://en.wikipedia.org/wiki/Cache_(computing)
[busted]:https://www.keycdn.com/support/what-is-cache-busting/
[xp]:#/faq/what-is-xp