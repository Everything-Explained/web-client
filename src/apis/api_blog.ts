import * as contentful from 'contentful';

interface BlogPost {
  title: string;
  author: string;
  content: string;
}

export async function getBlogPosts() {
  const client = contentful.createClient({
    space: 'd19u7a1621pm',
    accessToken: 'qge6UaNRaVqaKtoqRL_0Qep0Co0TZ4bUA9FvpB_F7rg'
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