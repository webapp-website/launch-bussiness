import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Globe, Palette, Shield, Zap, Users } from 'lucide-react';

export default function AboutPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description: 'Generate professional headlines, taglines, and about text automatically in your native language.',
    },
    {
      icon: Globe,
      title: '8 Local Languages',
      description: 'Create websites in English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, and Gujarati.',
    },
    {
      icon: Palette,
      title: 'Beautiful Designs',
      description: 'Choose from multiple color palettes with mobile-first responsive layouts.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built on enterprise-grade infrastructure with 99.9% uptime guarantee.',
    },
    {
      icon: Zap,
      title: 'Instant Publishing',
      description: 'Your website goes live instantly with a shareable URL.',
    },
    {
      icon: Users,
      title: 'WhatsApp Integration',
      description: 'Connect directly with customers through WhatsApp chat buttons.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-google-green to-google-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Launch Business
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Empowering local businesses to establish their online presence in minutes
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-google-black mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-google-gray text-center leading-relaxed">
            Launch Business was created to help small and local businesses in India
            establish a professional online presence without technical expertise or
            high costs. We believe every business deserves to be found online, and
            we've made it as easy as filling out a simple form.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-google-black mb-12 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-google hover:shadow-xl transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor:
                      index % 3 === 0
                        ? '#E8F0FE'
                        : index % 3 === 1
                        ? '#E6F4EA'
                        : '#FEF7E0',
                  }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{
                      color:
                        index % 3 === 0
                          ? '#4285F4'
                          : index % 3 === 1
                          ? '#34A853'
                          : '#FBBC04',
                    }}
                  />
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

      {/* CTA */}
      <section className="py-16 px-4 bg-google-blue">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Launch Your Business?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Create your professional website in minutes
          </p>
          <Link
            to={user ? '/create' : '/signup'}
            className="inline-block bg-white text-google-blue px-8 py-4 rounded-full text-lg font-medium hover:shadow-lg transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
