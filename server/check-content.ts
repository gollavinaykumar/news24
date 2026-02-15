
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'breaking-news-political-update-ap';
  console.log(`Checking content for slug: ${slug}`);
  
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, title: true, content: true }
  });

  if (article) {
    console.log(`Article Found: ${article.title}`);
    console.log(`Content Length: ${article.content.length}`);
    console.log('--- Content Snip ---');
    console.log(article.content.substring(0, 200));
    console.log('--- End Snip ---');
  } else {
    console.log('Article NOT found during check.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
