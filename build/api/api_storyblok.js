"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSinglePages = exports.getBlogPosts = void 0;
const storyblok_js_client_1 = __importDefault(require("storyblok-js-client"));
const config_json_1 = __importDefault(require("../config.json"));
const blok = new storyblok_js_client_1.default({
    accessToken: config_json_1.default.apis.storyBlokToken,
    cache: { type: 'memory', clear: 'auto' }
});
async function getBlogPosts() {
    return new Promise((rs, rj) => {
        blok
            .get('cdn/stories/', { version: 'published', starts_with: 'blog/' })
            .then(res => { rs(mapBlogPosts(res.data.stories)); })
            .catch(err => rj(err));
    });
}
exports.getBlogPosts = getBlogPosts;
async function getSinglePages() {
    return new Promise((rs, rj) => {
        blok
            .get('cdn/stories/', { version: 'published', starts_with: 'single-pages' })
            .then(res => { rs(mapSinglePages(res.data.stories)); })
            .catch(err => rj(err));
    });
}
exports.getSinglePages = getSinglePages;
function mapBlogPosts(stories) {
    return stories.map(story => {
        const page = mapStoryDefaults(story);
        page.summary = story.content.summary;
        page.header_image = story.content.image_header.filename || null;
        return page;
    });
}
function mapSinglePages(stories) {
    const singlePages = {};
    stories.forEach(story => singlePages[story.slug] = mapStoryDefaults(story));
    return singlePages;
}
function mapStoryDefaults(story) {
    const c = story.content;
    return {
        title: c.title,
        author: c.author,
        content: c.body,
        id: story.id,
        date: story.first_published_at ?? story.created_at
    };
}
