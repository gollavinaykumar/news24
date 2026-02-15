export const metadata = {
  title: 'About Us - APNews.in',
  description: 'Learn more about APNews.in, your trusted source for Telugu news.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <div className="prose prose-lg text-gray-800">
        <p>
          Welcome to <strong>APNews.in</strong>, your number one source for all things news in Telugu. We're dedicated to giving you the very best of news coverage, with a focus on dependability, customer service, and uniqueness.
        </p>
        <p>
          Founded in 2024, APNews.in has come a long way from its beginnings. When we first started out, our passion for "unbiased news" drove us to do tons of research so that APNews.in can offer you the most comprehensive Telugu news coverage. We now serve customers all over the world and are thrilled that we're able to turn our passion into our own website.
        </p>
        <p>
          We hope you enjoy our news as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        <p>
          Sincerely,<br />
          The APNews.in Team
        </p>
      </div>
    </div>
  );
}
