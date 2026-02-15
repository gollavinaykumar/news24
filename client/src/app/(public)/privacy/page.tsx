export const metadata = {
  title: 'Privacy Policy - APNews.in',
  description: 'Privacy Policy for APNews.in.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg text-gray-800">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          At APNews.in, accessible from https://apnews.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by APNews.in and how we use it.
        </p>
        <h2>Log Files</h2>
        <p>
          APNews.in follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>
        <h2>Cookies and Web Beacons</h2>
        <p>
          Like any other website, APNews.in uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>
        <h2>Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a>
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about our Privacy Policy, do not hesitate to contact us.
        </p>
      </div>
    </div>
  );
}
