import * as contentful from 'contentful';
import config from './build-config.json';

interface BlogPost {
  title: string;
  author: string;
  content: string;
}

export async function getBlogPosts() {
  const client = contentful.createClient({
    space: config.apis.contentfulSpaceID,
    accessToken: config.apis.contentfulToken
  });
  const blogData =
    await client.getEntries<BlogPost>({
      order: '-sys.createdAt'
    })
  ;
  return blogData.items.map(item => {
    return {
      title: item.fields.title,
      author: item.fields.author,
      content: item.fields.content,
      date: item.sys.createdAt
    };
  });
}