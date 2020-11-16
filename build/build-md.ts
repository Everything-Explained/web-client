import bundler from '@everything_explained/web-md-bundler';
import { getBlogPosts } from '../src/apis/api_blog';

const staticPageDirs = [
  './src/views/home',
  // './src/views/changelog',
  // './src/views/faq',
];
const blogDir = './src/views/blog';
const blogPagesCreator = new bundler.MDPageCreator(blogDir);

async function bundleBlog() {
  const posts = await getBlogPosts();
  blogPagesCreator.createPages(posts);
  bundler.bundleMDPages([blogDir], 'html');
}

function bundleStaticPages() {
  bundler.bundleMDPages(staticPageDirs, 'html');
}

const [exe, path, arg] = process.argv;

if (arg == 'blog') {
  bundleBlog();
}

if (arg == 'static') {
  bundleStaticPages();
}