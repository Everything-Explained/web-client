import bundler from '@everything_explained/web-md-bundler';
import { getSinglePages, getBlogPosts } from '../api/api_storyblok';




export async function bundleMDPages() {
  const posts = await getBlogPosts();
  const singlePages = await getSinglePages();
  await bundler.bundlePageMaps([
    { dir: '../src/views/blog', pages: posts },
    { dir: '../src/views/home', pages: [singlePages.home] }
  ], 'html');
}