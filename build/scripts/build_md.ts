import bundler from '@everything_explained/web-md-bundler';
import { getSinglePages, getBlogPosts, getVideos } from '../api/api_storyblok';




export async function bundleMDPages() {
  const posts = await getBlogPosts();
  const singlePages = await getSinglePages();
  const videos = await getVideos();
  await bundler.bundlePageMaps([
    { dir: '../src/views/blog', pages: posts },
    { dir: '../src/views/home', pages: [singlePages.home] },
    { dir: '../src/views/red33m', pages: videos }
  ], 'html');
}