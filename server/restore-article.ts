
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'breaking-news-political-update-ap';
  
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (article) {
    console.log(`Article with slug '${slug}' exists.`);
  } else {
    console.log(`Article with slug '${slug}' NOT found. Creating it...`);
    
    // Ensure category exists
    let category = await prisma.category.findFirst({
      where: { slug: 'politics' }
    });

    if (!category) {
       category = await prisma.category.create({
         data: { name: 'Politics', slug: 'politics' }
       });
    }

    // Ensure author exists
    const author = await prisma.user.findFirst();
    if (!author) {
      console.error('No users found. Please run full seed.');
      return;
    }

    await prisma.article.create({
      data: {
        title: 'Breaking News: Political Update AP',
        slug: slug,
        content: '<p>This is a restored article content to fix the 404 error.</p>',
        categoryId: category.id,
        authorId: author.id,
        status: 'PUBLISHED',
        image: 'https://images.unsplash.com/photo-1529101091760-61df6be21965?auto=format&fit=crop&q=80&w=800',
        isBreaking: true,
        showFeaturedImage: true,
      }
    });
    console.log(`Article '${slug}' created.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
