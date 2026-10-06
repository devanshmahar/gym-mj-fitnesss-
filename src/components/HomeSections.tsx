'use client';
import { useState, useEffect } from 'react';

const stats = [
  { label: 'Members', value: 5000, suffix: '+' },
  { label: 'Expert Trainers', value: 30, suffix: '+' },
  { label: 'Equipment', value: 200, suffix: '+' },
  { label: 'Years of Excellence', value: 12, suffix: '' },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const count = useCountUp(value);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-accent glow">
        {count}{suffix}
      </div>
      <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mt-2">{label}</div>
    </div>
  );
}

/* ── Hero ── */
export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Gym background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'linear-gradient(rgba(57,255,20,0.1) 1px, transparent 1px),linear-gradient(90deg,rgba(57,255,20,0.1) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6">
          #1 Fitness Destination
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-none mb-6 tracking-tight">
          TRANSFORM<br/>
          <span className="text-accent glow">YOUR BODY</span><br/>
          <span className="text-white/90">TRANSFORM YOUR LIFE</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
          State-of-the-art equipment, expert coaches, and a community that pushes you beyond your limits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#pricing"
            className="bg-accent text-black px-10 py-4 rounded font-black text-lg uppercase tracking-wider hover:bg-[#2de010] transition-all duration-300 btn-glow pulse-green">
            Join Now — Start Today
          </a>
          <a href="#about"
            className="border border-white/30 text-white px-10 py-4 rounded font-bold text-lg uppercase tracking-wider hover:border-accent hover:text-accent transition-all duration-300">
            Explore the Gym
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent"/>
        </div>
      </div>
    </section>
  );
}

/* ── Stats Banner ── */
export function StatsSection() {
  return (
    <section className="bg-[#0d0d0d] border-y border-[#1a1a1a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

/* ── About ── */
export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-divider mb-6"/>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              NOT JUST A GYM.<br/><span className="text-accent">A LIFESTYLE.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              At MJ FITNESS Dehradun, we believe fitness is more than lifting weights — it's a complete transformation of mind, body, and spirit. Founded right here in the heart of Uttarakhand, we've helped thousands of members achieve their peak physical condition.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Our certified trainers craft personalized programs that match your goals, whether you're a beginner stepping into the gym for the first time or an athlete preparing for competition.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Certified Trainers','Modern Equipment','Flexible Hours','Nutrition Guidance'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-sm font-semibold text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
              alt="Gym interior" className="rounded-lg w-full object-cover h-[500px]"/>
            <div className="absolute -bottom-4 -right-4 bg-accent text-black p-6 rounded-lg">
              <div className="text-4xl font-black">12+</div>
              <div className="text-sm font-bold uppercase tracking-wide">Years Strong</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Facilities ── */
const facilities = [
  { icon: '🏃', title: 'Cardio Zone', desc: 'Over 50 treadmills, ellipticals, and bikes with HD screens and virtual routes.', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80' },
  { icon: '🏋️', title: 'Weights Zone', desc: 'Free weights from 2.5 kg to 100 kg, power racks, barbells, and cable machines.', img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80' },
  { icon: '👤', title: 'Personal Training', desc: 'One-on-one sessions with certified trainers customized to your specific goals.', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80' },
  { icon: '👥', title: 'Group Classes', desc: 'Zumba, HIIT, Yoga, CrossFit, and more — 30+ classes per week.', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80' },
  { icon: '🧖', title: 'Recovery Spa', desc: 'Steam room, sauna, ice bath, and massage therapy for optimal recovery.', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80' },
  { icon: '🥗', title: 'Nutrition Bar', desc: 'Post-workout shakes, protein meals, and personalised nutrition counseling.', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80' },
];

export function FacilitiesSection() {
  return (
    <section id="facilities" className="py-24 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-divider mx-auto mb-6"/>
          <h2 className="text-4xl md:text-5xl font-black mb-4">WORLD-CLASS <span className="text-accent">FACILITIES</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to achieve peak performance, all under one roof.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map(f => (
            <div key={f.title} className="card-hover bg-[#111] rounded-xl overflow-hidden border border-[#1a1a1a] group">
              <div className="h-48 overflow-hidden relative">
                <img src={f.img} alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"/>
                <span className="absolute top-4 left-4 text-3xl">{f.icon}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Trainers ── */
const trainers = [
  { name: 'Arjun Sharma', role: 'Head Strength Coach', specialty: 'Powerlifting & Muscle Building', exp: '10 yrs', img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80' },
  { name: 'Priya Nair',   role: 'Cardio & HIIT Expert', specialty: 'Fat Loss & Endurance', exp: '8 yrs', img: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&q=80' },
  { name: 'Ravi Kumar',   role: 'Yoga & Flexibility', specialty: 'Mobility & Mind-Body', exp: '12 yrs', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
  { name: 'Sneha Patel',  role: 'Nutrition Coach',     specialty: 'Diet Planning & Wellness', exp: '7 yrs', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80' },
];

export function TrainersSection() {
  return (
    <section id="trainers" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-divider mx-auto mb-6"/>
          <h2 className="text-4xl md:text-5xl font-black mb-4">MEET YOUR <span className="text-accent">COACHES</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Certified, passionate, and dedicated to your transformation journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map(t => (
            <div key={t.name} className="card-hover bg-[#111] rounded-xl overflow-hidden border border-[#1a1a1a] group text-center">
              <div className="h-64 overflow-hidden relative">
                <img src={t.img} alt={t.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-xs bg-accent text-black px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                    {t.exp} exp
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-0.5 group-hover:text-accent transition-colors">{t.name}</h3>
                <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">{t.role}</p>
                <p className="text-gray-500 text-xs">{t.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */
const plans = [
  {
    name: 'Monthly',
    price: '₹1,499',
    period: '/month',
    features: ['Full gym access','Group classes','Locker room','Fitness assessment'],
    popular: false,
    color: 'border-[#2a2a2a]',
  },
  {
    name: 'Quarterly',
    price: '₹3,999',
    period: '/3 months',
    features: ['Everything in Monthly','1 PT session/month','Nutrition consultation','Progress tracking','Priority booking'],
    popular: true,
    color: 'border-accent',
  },
  {
    name: 'Yearly',
    price: '₹11,999',
    period: '/year',
    features: ['Everything in Quarterly','Unlimited PT sessions','Spa & sauna access','Custom meal plan','Guest passes (×12)','VIP locker'],
    popular: false,
    color: 'border-[#2a2a2a]',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-divider mx-auto mb-6"/>
          <h2 className="text-4xl md:text-5xl font-black mb-4">MEMBERSHIP <span className="text-accent">PLANS</span></h2>
          <p className="text-gray-400">Choose a plan that fits your goals and budget. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map(p => (
            <div key={p.name}
              className={`card-hover relative rounded-2xl border-2 ${p.color} ${p.popular ? 'bg-[#111]' : 'bg-[#0e0e0e]'} p-8`}>
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-black px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-black uppercase tracking-wide mb-1">{p.name}</h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className={`text-5xl font-black ${p.popular ? 'text-accent' : 'text-white'}`}>{p.price}</span>
                  <span className="text-gray-500 text-sm">{p.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-accent font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact"
                className={`block text-center py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                  p.popular
                    ? 'bg-accent text-black hover:bg-[#2de010] btn-glow'
                    : 'border border-[#333] text-white hover:border-accent hover:text-accent'
                }`}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
const testimonials = [
  { name: 'Rahul M.', role: 'Lost 25 kg in 6 months', text: 'IronPeak completely changed my life. The trainers are incredibly supportive and the facilities are top-notch. Best investment I\'ve ever made!', rating: 5 },
  { name: 'Ananya K.', role: 'Marathon runner', text: 'The cardio zone and coaching here took my running from 5k to full marathon in just one year. Incredible results!', rating: 5 },
  { name: 'Suresh T.', role: 'Gained 8 kg of muscle', text: 'As a skinny guy, I was skeptical. But the personalized plan and constant motivation from my coach made all the difference.', rating: 5 },
  { name: 'Divya R.', role: 'Member for 3 years', text: 'Love the group classes! The energy, the music, the community — it\'s the only place I actually look forward to going every morning.', rating: 5 },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-divider mx-auto mb-6"/>
          <h2 className="text-4xl md:text-5xl font-black mb-4">SUCCESS <span className="text-accent">STORIES</span></h2>
          <p className="text-gray-400">Real results from real people — here's what our members say.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card-hover bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
              <div className="flex gap-0.5 mb-4">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="text-accent text-lg">{s}</span>)}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-accent text-xs font-semibold mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-divider mx-auto mb-6"/>
          <h2 className="text-4xl md:text-5xl font-black mb-4">FIND <span className="text-accent">US</span></h2>
          <p className="text-gray-400">Visit us or get in touch — we're always here to help.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Map — Dehradun */}
          <div className="rounded-xl overflow-hidden border border-[#1a1a1a] h-80 bg-[#111] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55889.95022487838!2d77.9554!3d30.3165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908d7d7b6b5e6b7%3A0x1b2b3c4d5e6f7a8b!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
              width="100%" height="100%" style={{border:0, filter:'invert(90%) hue-rotate(180deg)'}}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </div>

          {/* Contact form */}
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { label: 'Phone / Email', type: 'text', placeholder: 'Contact details' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Message</label>
                <textarea rows={4} placeholder="Your message..."
                  className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors resize-none"/>
              </div>
            </div>
            <button className="w-full bg-accent text-black py-3 rounded-lg font-black uppercase tracking-wider hover:bg-[#2de010] transition-all btn-glow">
              Send Message
            </button>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#111] rounded-lg p-4 border border-[#1a1a1a]">
                <div className="text-accent text-lg mb-1">📍</div>
                <div className="text-xs text-gray-400">123 Fitness Street,<br/>Mumbai, MH 400001</div>
              </div>
              <div className="bg-[#111] rounded-lg p-4 border border-[#1a1a1a]">
                <div className="text-accent text-lg mb-1">⏰</div>
                <div className="text-xs text-gray-400">Mon–Sat: 5 AM – 11 PM<br/>Sunday: 7 AM – 9 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
