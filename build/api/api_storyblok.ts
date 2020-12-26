import StoryblokClient from 'storyblok-js-client';
import { Page } from '@everything_explained/web-md-bundler/dist/core/md_page_bundler';
import config from '../config.json';



type ISODateString = string;
type BlogImage = {
  id?: number;
  title?: string;
  filename: string;
  copyright?: string;
}


interface PageContent {
  title: string;
  author: string;
  body: string;
}
interface BlogContent extends PageContent {
  summary: string;
  image_header: BlogImage;
}
interface VideoContent extends PageContent {
  id          : string;
  datetime    : ISODateString;
}

interface SinglePageStory {
  id                  : number;
  name                : string;
  slug                : string;
  created_at          : ISODateString;
  published_at?       : ISODateString;
  first_published_at? : ISODateString;
  content             : PageContent;
}
interface BlogStory extends SinglePageStory {
  content: BlogContent;
}
interface VideoStory extends SinglePageStory {
  content: VideoContent;
}

interface SinglePages {
  home: Page;
  [key: string]: Page;
}



const blok = new StoryblokClient({
  accessToken: config.apis.storyBlokToken,
  cache: { type: 'memory', clear: 'auto' }
});

export async function getBlogPosts() {
  return new Promise<Page[]>((rs, rj) => {
    blok
      .get('cdn/stories/', { version: 'published', starts_with: 'blog/' })
      .then(res => { rs(mapBlogPosts(res.data.stories)); })
      .catch(err => rj(err));
  });
}

export async function getVideos() {
  try {
    const allStories = [];
    for(let i = 1; i < 100; i++) {
      const stories =
        await blok.get(
          'cdn/stories/',
          { version: 'draft', starts_with: 'videos/', per_page: 100, page: i, sort_by: 'position:desc' }
        )
      ;
      if (stories.data.stories.length) {
        allStories.push(...stories.data.stories);
        continue;
      }
      return mapVideos(allStories);
    }
    throw Error('No Videos');
  }
  catch (err) { throw Error(err); }
}

export async function getSinglePages() {
  return new Promise<SinglePages>((rs, rj) => {
    blok
      .get('cdn/stories/', { version: 'published', starts_with: 'single-pages' })
      .then(res => { rs(mapSinglePages(res.data.stories)); })
      .catch(err => rj(err));
  });
}


function mapBlogPosts(stories: BlogStory[]) {
  return stories.map(story => {
    const page = mapStoryDefaults(story);
    page.summary = story.content.summary;
    page.header_image = story.content.image_header.filename || null;
    return page;
  });
}

function mapSinglePages(stories: SinglePageStory[]) {
  const singlePages = {} as SinglePages;
  stories.forEach(story => singlePages[story.slug] = mapStoryDefaults(story));
  return singlePages;
}

function mapVideos(stories: VideoStory[]) {
  return stories.map(story => {
    const page = mapStoryDefaults(story);
    page.id = story.content.id;
    return page;
  });
}

function mapStoryDefaults(story: BlogStory|SinglePageStory) {
  const c = story.content;
  return {
    title   : c.title,
    author  : c.author,
    content : c.body,
    id      : story.id,
    date    : story.first_published_at ?? story.created_at
  } as Page;
}