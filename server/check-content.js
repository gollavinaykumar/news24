
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'breaking-news-political-update-ap';
  try {
     const article = await prisma.article.findFirst({
        where: { slug },
     });
     
     if (article) {
        console.log('Article found:', article.title);
        console.log('Content length:', article.content.length);
     } else {
        console.log('Article not found');
     }
  } catch (error) {
     console.error('Error:', error);
  } finally {
     await prisma.$disconnect();
  }
}

main();
