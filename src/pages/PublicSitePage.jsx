import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MessageCircle, MapPin, Phone, Home, ShoppingCart, Gift, Globe, Download, Check } from 'lucide-react';

const PALETTE_COLORS = {
  blue: { primary: '#4285F4', secondary: '#34A853', bg: '#E8F0FE' },
  green: { primary: '#34A853', secondary: '#FBBC04', bg: '#E6F4EA' },
  red: { primary: '#EA4335', secondary: '#4285F4', bg: '#FCE8E6' },
  yellow: { primary: '#FBBC04', secondary: '#EA4335', bg: '#FEF7E0' },
  purple: { primary: '#9C27B0', secondary: '#E91E63', bg: '#F3E5F5' },
  teal: { primary: '#009688', secondary: '#4CAF50', bg: '#E0F2F1' },
};

export default function PublicSitePage() {
  const { slug } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    fetchSite();
  }, [slug]);

  const fetchSite = async () => {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data) {
      setError(true);
    } else {
      setSite(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-google-blue border-t-transparent"></div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-google-black mb-4">Page Not Found</h1>
          <p className="text-google-gray mb-8">This website doesn't exist or is not published.</p>
          <a
            href="/"
            className="btn-google btn-primary inline-flex"
          >
            Go to Launch Business
          </a>
        </div>
      </div>
    );
  }

  const colors = PALETTE_COLORS[site.palette] || PALETTE_COLORS.blue;
  const whatsappLink = `https://wa.me/${site.whatsapp?.replace(/\D/g, '')}`;

  // Get pages configuration
  const pages = site.pages || { home: true, selling: false, prize: false, webapp: false };
  const availablePages = [
    { id: 'home', label: 'Home', icon: Home },
    ...(pages.selling ? [{ id: 'selling', label: 'Sell', icon: ShoppingCart }] : []),
    ...(pages.prize ? [{ id: 'prize', label: 'Prizes', icon: Gift }] : []),
    ...(pages.webapp ? [{ id: 'webapp', label: 'App', icon: Globe }] : []),
  ];

  const showBranding = true;

  // Render Home Page
  const renderHomePage = () => (
    <>
      {/* Hero Section */}
      <section
        className="min-h-[70vh] flex items-center justify-center px-4 py-16"
        style={{ backgroundColor: colors.bg }}
      >
        <div className="text-center max-w-3xl">
          <h1
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: colors.primary }}
          >
            {site.headline}
          </h1>
          <p className="text-xl md:text-2xl text-google-gray mb-8">
            {site.tagline}
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-medium hover:shadow-lg transition-all"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle className="w-6 h-6" />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: colors.primary }}
          >
            Our Services
          </h2>
          <div className="grid gap-4">
            {site.services?.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 rounded-2xl border-2 transition-all hover:shadow-md"
                style={{ borderColor: colors.primary + '20' }}
              >
                <span className="text-lg font-medium text-google-black">
                  {service.name}
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: colors.primary }}
                >
                  ₹{service.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4" style={{ backgroundColor: colors.bg }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: colors.primary }}
          >
            About Us
          </h2>
          <p className="text-lg text-google-black leading-relaxed whitespace-pre-line">
            {site.about}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: colors.primary }}
          >
            Visit Us
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50">
              <MapPin className="w-6 h-6 mt-1" style={{ color: colors.primary }} />
              <div>
                <h3 className="font-medium text-google-black mb-1">Address</h3>
                <p className="text-google-gray">{site.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl text-white font-medium"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp
              </a>
              <a
                href={`tel:${site.whatsapp}`}
                className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl text-white font-medium"
                style={{ backgroundColor: colors.primary }}
              >
                <Phone className="w-6 h-6" />
                Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // Render Selling Page
  const renderSellingPage = () => (
    <>
      <section
        className="min-h-[50vh] flex items-center justify-center px-4 py-16"
        style={{ backgroundColor: colors.bg }}
      >
        <div className="text-center max-w-3xl">
          <ShoppingCart className="w-16 h-16 mx-auto mb-6" style={{ color: colors.primary }} />
          <h1
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            {site.selling_content || 'Our Products & Offers'}
          </h1>
          <p className="text-xl text-google-gray">
            Check out our special products and services
          </p>
        </div>
      </section>

      {/* Selling Items */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {site.selling_items?.map((item, index) => (
              <div
                key={index}
                className="card-google hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold text-google-black mb-2">
                  {item.name}
                </h3>
                <p className="text-google-gray mb-4">{item.description}</p>
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {item.price || 'Contact for price'}
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Order Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  // Render Prize Page
  const renderPrizePage = () => (
    <>
      <section
        className="min-h-[50vh] flex items-center justify-center px-4 py-16"
        style={{ backgroundColor: colors.bg }}
      >
        <div className="text-center max-w-3xl">
          <Gift className="w-16 h-16 mx-auto mb-6" style={{ color: colors.primary }} />
          <h1
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            {site.prize_content || 'Exciting Prizes & Rewards'}
          </h1>
          <p className="text-xl text-google-gray">
            Participate and win amazing prizes!
          </p>
        </div>
      </section>

      {/* Prize Items */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {site.prize_items?.map((item, index) => (
              <div
                key={index}
                className="card-google hover:shadow-xl transition-all border-2"
                style={{ borderColor: colors.primary + '30' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: colors.bg }}
                >
                  <Gift className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-bold text-google-black mb-2">
                  {item.name}
                </h3>
                <p className="text-google-gray mb-4">{item.description}</p>
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {item.value}
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: colors.primary }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Participate Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  // Render Web App Page
  const renderWebappPage = () => {
    const webapp = site.webapp_data || {};

    return (
      <>
        {/* Hero Section */}
        <section
          className="min-h-[70vh] flex items-center justify-center px-4 py-16"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="text-center max-w-3xl">
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              {webapp.appName || site.webapp_content || 'Our Web App'}
            </h1>
            <p className="text-xl md:text-2xl text-google-gray mb-8">
              {webapp.tagline || 'Discover our powerful application'}
            </p>
            {webapp.downloadLink && (
              <a
                href={webapp.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-medium hover:shadow-lg transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                <Download className="w-6 h-6" />
                Download App
              </a>
            )}
          </div>
        </section>

        {/* App Description */}
        {webapp.description && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: colors.primary }}
              >
                About the App
              </h2>
              <p className="text-lg text-google-gray leading-relaxed whitespace-pre-line">
                {webapp.description}
              </p>
            </div>
          </section>
        )}

        {/* App Features */}
        {webapp.features && webapp.features.length > 0 && (
          <section className="py-16 px-4" style={{ backgroundColor: colors.bg }}>
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-3xl font-bold text-center mb-12"
                style={{ color: colors.primary }}
              >
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {webapp.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <Check className="w-5 h-5" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="text-xl font-bold text-google-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-google-gray">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Download CTA */}
        {webapp.downloadLink && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                Ready to Get Started?
              </h2>
              <p className="text-lg text-google-gray mb-8">
                Download now and experience the power of our app.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={webapp.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-medium hover:shadow-lg transition-all"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Download className="w-6 h-6" />
                  Download Now
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-medium"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="w-6 h-6" />
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: 'Google Sans, system-ui, sans-serif' }}
    >
      {/* Floating Branding Card for Free Users */}
      {showBranding && (
        <div className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none">
          <div className="bg-white shadow-lg rounded-xl p-4 flex items-center justify-between pointer-events-auto border border-gray-200 max-w-md mx-auto">
            <div className="flex-1">
              <p className="text-sm text-google-gray">Made with</p>
              <p className="font-bold text-google-black">Launch Business</p>
            </div>
            <a
              href="/"
              className="btn-google btn-primary text-sm py-2 px-4"
            >
              Create Yours
            </a>
          </div>
        </div>
      )}

      {/* Top Navigation Bar for Multiple Pages */}
      {availablePages.length > 1 && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-center">
            {availablePages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
                    activePage === page.id
                      ? ''
                      : 'text-google-gray border-transparent hover:text-google-black'
                  }`}
                  style={{
                    color: activePage === page.id ? colors.primary : undefined,
                    borderColor: activePage === page.id ? colors.primary : undefined,
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {page.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Page Content */}
      {activePage === 'home' && renderHomePage()}
      {activePage === 'selling' && renderSellingPage()}
      {activePage === 'prize' && renderPrizePage()}
      {activePage === 'webapp' && renderWebappPage()}

      {/* Footer */}
      <footer className="py-8 px-4 bg-google-black text-white text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </div>
  );
}
