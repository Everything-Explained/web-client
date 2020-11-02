---
title: "α11 : mustard-seed"
author: Aedaeum
date: 01/16/2017
---
# MAJOR CHANGES

>- **New Font** - General site font changed to Nunito. The previous font was a little too "cursivey". This one looks a lot more professional.

>- **New Changelog Look** - This changelog had seen better days. It was a bit too convoluted. More spacing and margins, as well as a background color has given it a bit of a face-lift.

>- **Welcome to the Invite System!** - That's right, you can now request an invite directly through the site without needing to email anyone directly. The invite system allows `only 1 invite request per IP every 24 hours`.
>- If you're thinking to yourself: _"I don't see this invite page anywhere!"_, it's probably because you're already logged in. Only guests can access the invite page.

>- **Want to Know how Development is Going?** - For registered members, you can check out the new [Development Blog] page. I wanted a way to connect you directly to the development process of this site since Noumenae is not mine, but **ours**.
>- Unfortunately, my life is quite hectic at the moment, so there will not be a defined schedule. I do plan on having one eventually though, _so stay tuned!_

>- **New Rules!** - Just what you always wanted, more rules!! There is an ongoing [Discussion] about why the rules have been expanded to include legality. Signups are now an implicit agreement to these new legal rules. Don't worry though, this has nothing to do with going after members; it's there to protect Noumenae and associated persons against severe abuse of the site.
>- In all likelyhood, this will not happen, but it's necessary as a: _"just in case"_ scenario.

>- **New Loader Animation!** A loader animation has been universalized (is that a word?). Well anyway, it just means that there are no longer different animated [GIFS] when you're waiting for a resource to load. The new animation will look like a purple rippling pond.

>- **New Form Controls!** - Input boxes, text areas, and buttons...have a new look that blends better with the flat minimalist style of the site.

# FIXES

>- **FAQ** - The FAQ has undergone a tiny face-lift as well, to fix the scrolling issue and add some much needed readability updates.

>- **Bad FireFox!!** - FireFox `Comfortaa` font rendering has been a tough cookie, but I ate it and _it was goooooood_. For those that don't understand...the [conflicts with FireFox] font rendering of Comfortaa, have been _"fixed"_.

>- **Annoying Errors** - There was a vestigial notification system built into the logging mechanism which has now been removed. This was causing every error to popup a message - very annoying, even for me as a developer.

>- **Console Double Post** - When losing a socket connection, the console would double-log it, as well as other events, whoops!

# UNDER THE HOOD

>- **Lovely Modals** - I re-wrote the modal code, which means no more lag.

>- **Aurelia CLI Build System** - Now using Aurelia's built-in [CLI] to bundle, which means no more [SystemJS] or [JSPM].

>- **Fast Promises!** - Now using [BlueBird] promises. This came with the new Aurelia-CLI anyway, so it was convenient. If you want to learn about [Promises].

>- **Entering the Modern Age** - Switched to **HTTP/2** protocol, which just means a bit more efficient website transfer and features I might utilize like [Server Push].


>- **Inlined Assets** - This means everything necessary to run the site is bundled and served when a user requests the site. This means no loading times between pages, only one loading period when the site is first requested. There are still some exceptions, like this page which requires a server request for each changelog, but the delay is insignificant.


[Development Blog]:/#/blog
[Discussion]:https://github.com/Noumenae/client/issues/37
[SystemJS]:https://github.com/systemjs/systemjs
[JSPM]:http://jspm.io/
[CLI]:http://aurelia.io/hub.html#/doc/article/aurelia/framework/latest/the-aurelia-cli
[BlueBird]:http://bluebirdjs.com/docs/why-bluebird.html
[Promises]:https://scotch.io/tutorials/javascript-promises-for-dummies
[Server Push]:http://blog.xebia.com/http2-server-push/
[GIFS]:http://lmgtfy.com/?q=what+is+a+gif
[conflicts with firefox]:https://github.com/Noumenae/client/commit/bcaacbfbfa83a6deab0511da797ce44e145dbcc5