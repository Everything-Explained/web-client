"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleMDPages = void 0;
const web_md_bundler_1 = __importDefault(require("@everything_explained/web-md-bundler"));
const api_storyblok_1 = require("../api/api_storyblok");
async function bundleMDPages() {
    const posts = await api_storyblok_1.getBlogPosts();
    const singlePages = await api_storyblok_1.getSinglePages();
    await web_md_bundler_1.default.bundlePageMaps([
        { dir: '../src/views/blog', pages: posts },
        { dir: '../src/views/home', pages: [singlePages.home] }
    ], 'html');
}
exports.bundleMDPages = bundleMDPages;
