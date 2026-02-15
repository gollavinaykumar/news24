import prisma from './utils/prisma';

async function main() {
  console.log('Testing prisma.article.findMany...');
  try {
    const articles = await prisma.article.findMany({
      take: 50,
      skip: 0,
      orderBy: { createdAt: 'desc' },
      include: {
          category: true,
          author: { select: { name: true, image: true } }, // check if image exists in User
          tags: true
      }
    });
    console.log('Success. Found:', articles.length);
  } catch (e) {
    console.error('Error:', e);
  } finally {
      await prisma.$disconnect();
  }
}
main();
