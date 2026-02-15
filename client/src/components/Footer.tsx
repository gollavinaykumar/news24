import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-indigo-400">APNews.in</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              తెలుగు వార్తల్లో మీ నమ్మకమైన మూలం - రాజకీయాలు, క్రీడలు, వినోదం మరియు మరెన్నో.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">త్వరిత లింకులు</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors">హోమ్</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">మా గురించి</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">సంప్రదించండి</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">గోప్యతా విధానం</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">మమ్మల్ని అనుసరించండి</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} APNews.in. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.
        </div>
      </div>
    </footer>
  );
}
