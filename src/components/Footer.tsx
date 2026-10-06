export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black mb-3">
              MJ<span className="text-accent"> FITNESS</span>
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Dehradun, Uttarakhand</p>
            <p className="text-sm text-gray-500 leading-relaxed mt-2">
              Transform your body. Transform your life. MJ Fitness — Dehradun's home of champions.
            </p>
            <div className="flex gap-3 mt-5">
              {['Facebook','Instagram','Twitter','YouTube'].map(s => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-accent hover:text-black flex items-center justify-center text-xs font-bold transition-all duration-300">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home','About Us','Facilities','Trainers','Pricing','Contact'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Programs</h4>
            <ul className="space-y-2">
              {['Personal Training','Group Classes','Cardio Zone','Strength Training','Yoga & Stretching','Nutrition Plan'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>📍 MJ FITNESS, Dehradun, Uttarakhand 248001</li>
              <li>📞 <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a></li>
              <li>✉️ <a href="mailto:info@mjfitness.in" className="hover:text-white transition-colors">info@mjfitness.in</a></li>
              <li>⏰ Mon–Sat: 5:00 AM – 11:00 PM</li>
              <li>⏰ Sunday: 7:00 AM – 9:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2024 MJ FITNESS, Dehradun. All rights reserved.</p>
          <p className="text-xs text-gray-600">Built with 💪 for fitness enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
