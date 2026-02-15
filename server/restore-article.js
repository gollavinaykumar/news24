
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const slug = 'breaking-news-political-update-ap';
  
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (article) {
      console.log(`Article with slug '${slug}' exists.`);
    } else {
      console.log(`Article with slug '${slug}' NOT found. Creating it...`);
      
      // Ensure category exists
      let category = await prisma.category.findUnique({
        where: { slug: 'politics' }
      });

      if (!category) {
         console.log("Creating category 'Politics'...");
         category = await prisma.category.create({
           data: { name: 'Politics', slug: 'politics' }
         });
      }

      // Ensure author exists
      let author = await prisma.user.findFirst();
      if (!author) {
        // Create default admin if missing
        console.log("Creating default admin user...");
        author = await prisma.user.create({
           data: {
             email: "admin@apnews.in",
             name: "Admin User",
             password: "hashedpasswordplaceholder", // Placeholder
             role: "ADMIN"
           }
        });
      }

      const newArticle = await prisma.article.create({
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
      console.log(`Article '${slug}' created with ID: ${newArticle.id}`);
    }
  } catch (error) {
    console.error("Error restoring article:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
