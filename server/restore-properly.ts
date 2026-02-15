
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const slug = 'breaking-news-political-update-ap';
  console.log(`Checking article: ${slug}`);

  try {
      const article = await prisma.article.findUnique({
        where: { slug },
      });

      if (article) {
        console.log(`Article found: ${article.title}`);
        console.log(`Content length: ${article.content.length}`);
        if (!article.content || article.content.trim() === '') {
             console.log('Content is empty. Updating...');
             await prisma.article.update({
                 where: { id: article.id },
                 data: {
                     content: '<p>This is the restored content for the breaking news article. The previous content was missing.</p><p>We have restored it successfully.</p>'
                 }
             });
             console.log('Content updated.');
        } else {
             console.log('Content exists.');
        }
      } else {
        console.log('Article NOT found. Creating fully...');
        
        // Ensure category
        let category = await prisma.category.findUnique({ where: { slug: 'politics' } });
        if (!category) {
            category = await prisma.category.create({ data: { name: 'Politics', slug: 'politics' } });
        }

        // Ensure user
        let user = await prisma.user.findFirst();
        if (!user) {
             user = await prisma.user.create({
                 data: {
                     email: 'admin@apnews.in',
                     name: 'Admin',
                     password: 'placeholder',
                     role: 'ADMIN'
                 }
             });
        }

        await prisma.article.create({
            data: {
                title: 'Breaking News: Political Update AP',
                slug: slug,
                content: '<p>This is the restored content for the breaking news article. The previous content was missing.</p><p>We have restored it successfully.</p>',
                categoryId: category.id,
                authorId: user.id,
                status: 'PUBLISHED',
                image: 'https://images.unsplash.com/photo-1529101091760-61df6be21965?auto=format&fit=crop&q=80&w=800',
                isBreaking: true,
                showFeaturedImage: true
            }
        });
        console.log('Article created.');
      }

  } catch (error) {
      console.error('Error:', error);
  } finally {
      await prisma.$disconnect();
  }
}

main();
