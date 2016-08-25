System.config({
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "elements/*": "templates/elements/*"
  },
  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0-rc.1.0.0",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-rc.1.0.1",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-rc.1.0.2",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-rc.1.0.0",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-rc.1.0.0",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-rc.1.0.0",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-rc.1.0.1",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-rc.1.0.0",
    "aurelia-router": "npm:aurelia-router@1.0.0-rc.1.0.1",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-rc.1.0.1",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-rc.1.0.1",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-rc.1.0.1",
    "gsap": "npm:gsap@1.18.2",
    "moment": "npm:moment@2.12.0",
    "optiscroll": "libs/optiscroll.min.js",
    "socketio": "socket.io/socket.io",
    "text": "github:systemjs/plugin-text@0.0.8",
    "validator": "npm:validator@4.8.0",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.5"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.0-rc.1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-binding@1.0.0-rc.1.0.3": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-bootstrapper@1.0.0-rc.1.0.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-rc.1.0.2",
      "aurelia-history": "npm:aurelia-history@1.0.0-rc.1.0.0",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-rc.1.0.0",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-rc.1.0.0",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-rc.1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-rc.1.0.1",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-rc.1.0.0",
      "aurelia-router": "npm:aurelia-router@1.0.0-rc.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.1",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-rc.1.0.1",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-rc.1.0.1",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-framework@1.0.0-rc.1.0.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-rc.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-rc.1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-rc.1.0.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-history-browser@1.0.0-rc.1.0.0": {
      "aurelia-history": "npm:aurelia-history@1.0.0-rc.1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-loader-default@1.0.0-rc.1.0.0": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0-rc.1.0.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-loader@1.0.0-rc.1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-logging-console@1.0.0-rc.1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-metadata@1.0.0-rc.1.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-pal-browser@1.0.0-rc.1.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-polyfills@1.0.0-rc.1.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-route-recognizer@1.0.0-rc.1.0.1": {
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-router@1.0.0-rc.1.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0",
      "aurelia-history": "npm:aurelia-history@1.0.0-rc.1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-task-queue@1.0.0-rc.1.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0"
    },
    "npm:aurelia-templating-binding@1.0.0-rc.1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-rc.1.0.3",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-templating-resources@1.0.0-rc.1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-rc.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-rc.1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-rc.1.0.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-templating-router@1.0.0-rc.1.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0",
      "aurelia-router": "npm:aurelia-router@1.0.0-rc.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-rc.1.0.1"
    },
    "npm:aurelia-templating@1.0.0-rc.1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-rc.1.0.3",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-rc.1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-rc.1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-rc.1.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-rc.1.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-rc.1.0.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-rc.1.0.0"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:depd@1.1.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:gsap@1.18.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.5": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:validator@4.8.0": {
      "depd": "npm:depd@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  },
  depCache: {
    "app-login.js": [
      "aurelia-framework",
      "./helpers/web"
    ],
    "app.js": [
      "aurelia-framework",
      "aurelia-event-aggregator",
      "./helpers/page",
      "./app-login",
      "./helpers/modern-modal",
      "./helpers/logger",
      "./helpers/errorHandler",
      "./app-session"
    ],
    "helpers/errorHandler.js": [
      "./logger",
      "aurelia-framework"
    ],
    "helpers/logger.js": [
      "./modern-modal",
      "aurelia-framework"
    ],
    "services/clientio.js": [
      "socketio",
      "../views/chat/message",
      "../helpers/utils"
    ],
    "templates/elements/chatcmdr/chatcmdr.js": [
      "aurelia-framework",
      "../../../views/chat/message"
    ],
    "templates/elements/message/bible-verse-filter.js": [
      "./message-view"
    ],
    "templates/elements/message/message-view.js": [
      "aurelia-framework",
      "moment",
      "../../../views/chat/message",
      "../../elements/message/bible-verse-filter"
    ],
    "views/changelog/changelog.js": [
      "aurelia-framework",
      "../../helpers/modern-modal",
      "../../helpers/web"
    ],
    "views/chat/chat.js": [
      "./port",
      "aurelia-framework",
      "./message",
      "./display-verse",
      "../../services/clientio",
      "../../helpers/modern-modal"
    ],
    "views/chat/port.js": [
      "../chat/message"
    ],
    "views/home/settings.js": [
      "../../app-login",
      "aurelia-framework",
      "aurelia-router",
      "../../app-session"
    ],
    "views/home/signin.js": [
      "../../helpers/robot-check",
      "../../helpers/web",
      "aurelia-framework",
      "aurelia-router",
      "../../app-login",
      "../../app-session"
    ]
  },
  bundles: {
    "app-build.js": [
      "app-config.js",
      "app-login.js",
      "app-session.js",
      "app.js",
      "bootstrap.js",
      "helpers/cheap-encrypt.js",
      "helpers/domop.js",
      "helpers/errorHandler.js",
      "helpers/lightsOnOff.js",
      "helpers/logger.js",
      "helpers/modern-modal.js",
      "helpers/page.js",
      "helpers/robot-check.js",
      "helpers/utils.js",
      "helpers/web.js",
      "libs/TweenLite.min.js",
      "libs/live.js",
      "libs/lodash.min.js",
      "libs/optiscroll.min.js",
      "services/captcha.js",
      "services/clientio.js",
      "templates/elements/chatcmdr/chatcmdr.js",
      "templates/elements/message/bible-verse-filter.js",
      "templates/elements/message/message-view.js",
      "views/changelog/changelog.js",
      "views/chat/chat.js",
      "views/chat/display-verse.js",
      "views/chat/message.js",
      "views/chat/port.js",
      "views/error/F400.js",
      "views/error/F403.js",
      "views/error/F404.js",
      "views/home/about.js",
      "views/home/faq.js",
      "views/home/invite.js",
      "views/home/pickles.js",
      "views/home/rules.js",
      "views/home/settings.js",
      "views/home/signin.js"
    ],
    "aurelia-build.js": [
      "github:jspm/nodelibs-process@0.1.2.js",
      "github:jspm/nodelibs-process@0.1.2/index.js",
      "github:systemjs/plugin-text@0.0.8.js",
      "github:systemjs/plugin-text@0.0.8/text.js",
      "libs/optiscroll.min.js",
      "npm:aurelia-animator-css@1.0.0-rc.1.0.0.js",
      "npm:aurelia-animator-css@1.0.0-rc.1.0.0/aurelia-animator-css.js",
      "npm:aurelia-binding@1.0.0-rc.1.0.3.js",
      "npm:aurelia-binding@1.0.0-rc.1.0.3/aurelia-binding.js",
      "npm:aurelia-bootstrapper@1.0.0-rc.1.0.1.js",
      "npm:aurelia-bootstrapper@1.0.0-rc.1.0.1/aurelia-bootstrapper.js",
      "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1.js",
      "npm:aurelia-dependency-injection@1.0.0-rc.1.0.1/aurelia-dependency-injection.js",
      "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0.js",
      "npm:aurelia-event-aggregator@1.0.0-rc.1.0.0/aurelia-event-aggregator.js",
      "npm:aurelia-framework@1.0.0-rc.1.0.2.js",
      "npm:aurelia-framework@1.0.0-rc.1.0.2/aurelia-framework.js",
      "npm:aurelia-history-browser@1.0.0-rc.1.0.0.js",
      "npm:aurelia-history-browser@1.0.0-rc.1.0.0/aurelia-history-browser.js",
      "npm:aurelia-history@1.0.0-rc.1.0.0.js",
      "npm:aurelia-history@1.0.0-rc.1.0.0/aurelia-history.js",
      "npm:aurelia-loader-default@1.0.0-rc.1.0.0.js",
      "npm:aurelia-loader-default@1.0.0-rc.1.0.0/aurelia-loader-default.js",
      "npm:aurelia-loader@1.0.0-rc.1.0.0.js",
      "npm:aurelia-loader@1.0.0-rc.1.0.0/aurelia-loader.js",
      "npm:aurelia-logging-console@1.0.0-rc.1.0.0.js",
      "npm:aurelia-logging-console@1.0.0-rc.1.0.0/aurelia-logging-console.js",
      "npm:aurelia-logging@1.0.0-rc.1.0.1.js",
      "npm:aurelia-logging@1.0.0-rc.1.0.1/aurelia-logging.js",
      "npm:aurelia-metadata@1.0.0-rc.1.0.1.js",
      "npm:aurelia-metadata@1.0.0-rc.1.0.1/aurelia-metadata.js",
      "npm:aurelia-pal-browser@1.0.0-rc.1.0.1.js",
      "npm:aurelia-pal-browser@1.0.0-rc.1.0.1/aurelia-pal-browser.js",
      "npm:aurelia-pal@1.0.0-rc.1.0.0.js",
      "npm:aurelia-pal@1.0.0-rc.1.0.0/aurelia-pal.js",
      "npm:aurelia-path@1.0.0-rc.1.0.0.js",
      "npm:aurelia-path@1.0.0-rc.1.0.0/aurelia-path.js",
      "npm:aurelia-polyfills@1.0.0-rc.1.0.0.js",
      "npm:aurelia-polyfills@1.0.0-rc.1.0.0/aurelia-polyfills.js",
      "npm:aurelia-route-recognizer@1.0.0-rc.1.0.1.js",
      "npm:aurelia-route-recognizer@1.0.0-rc.1.0.1/aurelia-route-recognizer.js",
      "npm:aurelia-router@1.0.0-rc.1.0.1.js",
      "npm:aurelia-router@1.0.0-rc.1.0.1/aurelia-router.js",
      "npm:aurelia-task-queue@1.0.0-rc.1.0.0.js",
      "npm:aurelia-task-queue@1.0.0-rc.1.0.0/aurelia-task-queue.js",
      "npm:aurelia-templating-binding@1.0.0-rc.1.0.1.js",
      "npm:aurelia-templating-binding@1.0.0-rc.1.0.1/aurelia-templating-binding.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/abstract-repeater.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/analyze-view-factory.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/array-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/aurelia-hide-style.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/aurelia-templating-resources.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/binding-mode-behaviors.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/binding-signaler.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/compose.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/css-resource.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/debounce-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/dynamic-element.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/focus.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/hide.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/html-resource-plugin.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/html-sanitizer.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/if.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/map-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/null-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/number-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/repeat-strategy-locator.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/repeat-utilities.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/repeat.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/replaceable.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/sanitize-html.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/set-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/show.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/signal-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/throttle-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/update-trigger-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-rc.1.0.1/with.js",
      "npm:aurelia-templating-router@1.0.0-rc.1.0.1.js",
      "npm:aurelia-templating-router@1.0.0-rc.1.0.1/aurelia-templating-router.js",
      "npm:aurelia-templating-router@1.0.0-rc.1.0.1/route-href.js",
      "npm:aurelia-templating-router@1.0.0-rc.1.0.1/route-loader.js",
      "npm:aurelia-templating-router@1.0.0-rc.1.0.1/router-view.js",
      "npm:aurelia-templating@1.0.0-rc.1.0.1.js",
      "npm:aurelia-templating@1.0.0-rc.1.0.1/aurelia-templating.js",
      "npm:depd@1.1.0.js",
      "npm:depd@1.1.0/lib/browser/index.js",
      "npm:moment@2.12.0.js",
      "npm:moment@2.12.0/moment.js",
      "npm:process@0.11.5.js",
      "npm:process@0.11.5/browser.js",
      "npm:validator@4.8.0.js",
      "npm:validator@4.8.0/validator.js"
    ]
  }
});