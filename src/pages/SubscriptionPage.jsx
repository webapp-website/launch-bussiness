import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Check, Crown } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    sites: 1,
    features: [
      '1 Website',
      'AI-powered content',
      '8 language support',
      'Mobile-responsive design',
      'WhatsApp integration',
    ],
    buttonText: 'Current Plan',
    buttonColor: 'gray',
  },
  {
    id: 'premium_500',
    name: 'Starter',
    price: '₹500',
    period: '/month',
    sites: 2,
    features: [
      '2 Websites',
      'All Free features',
      'No branding',
      'Priority support',
    ],
    buttonText: 'Upgrade',
    buttonColor: 'blue',
  },
  {
    id: 'premium_1000',
    name: 'Business',
    price: '₹1000',
    period: '/month',
    sites: 4,
    features: [
      '4 Websites',
      'All Starter features',
      'Analytics',
      'SEO tools',
    ],
    popular: true,
    buttonText: 'Upgrade',
    buttonColor: 'green',
  },
  {
    id: 'premium_1500',
    name: 'Enterprise',
    price: '₹1500',
    period: '/month',
    sites: 10,
    features: [
      '10 Websites',
      'All Business features',
      '24/7 Priority support',
      'API access',
    ],
    buttonText: 'Upgrade',
    buttonColor: 'yellow',
  },
];

export default function SubscriptionPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handleUpgrade = async (planId) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    if (planId === 'free') {
      return;
    }

    setSelectedPlan(planId);
    setLoading(true);
    try {
      // Update subscription status (without payment for demo)
      // In production, this would go through Stripe checkout
      const { error } = await supabase
        .from('profiles')
        .update({
          sub_status: planId,
          subscription_active: true,
          subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Plan upgraded successfully!');
      refreshProfile();
    } catch (error) {
      toast.error('Failed to upgrade plan');
      console.error(error);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-normal text-google-black mb-4"
            style={{ fontFamily: 'Google Sans, system-ui, sans-serif' }}
          >
            Choose Your Plan
          </h1>
          <p className="text-lg text-google-gray max-w-xl mx-auto">
            Start free and scale as you grow. All plans include AI-powered content generation.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isCurrentPlan = profile?.sub_status === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-google-blue/5 ring-2 ring-google-blue shadow-lg scale-105'
                    : hoveredPlan === plan.id
                    ? 'bg-gray-50 shadow-lg'
                    : 'bg-white border border-gray-200'
                }`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="bg-google-blue text-white px-4 py-1 rounded-full text-sm font-medium"
                      style={{ fontFamily: 'Google Sans, system-ui, sans-serif' }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3
                    className="text-xl font-normal text-google-black mb-2"
                    style={{ fontFamily: 'Google Sans, system-ui, sans-serif' }}
                  >
                    {plan.name}
                  </h3>
                  <div className="mb-1">
                    <span
                      className="text-4xl font-bold text-google-black"
                      style={{ fontFamily: 'Google Sans, system-ui, sans-serif' }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-google-gray text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-google-gray">
                    {plan.sites} website{plan.sites > 1 ? 's' : ''}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: plan.popular ? '#4285F4' : '#34A853' }}
                      />
                      <span className="text-sm text-google-gray">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-full font-medium transition-all"
                    style={{
                      fontFamily: 'Google Sans, system-ui, sans-serif',
                      backgroundColor: '#34A853',
                      color: '#ffffff',
                      opacity: 0.9,
                    }}
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading && selectedPlan === plan.id}
                    className="w-full py-3 px-6 rounded-full font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      fontFamily: 'Google Sans, system-ui, sans-serif',
                      backgroundColor: plan.buttonColor === 'gray' ? '#5F6368' :
                                      plan.buttonColor === 'blue' ? '#4285F4' :
                                      plan.buttonColor === 'green' ? '#34A853' :
                                      '#FBBC04',
                      color: plan.buttonColor === 'yellow' ? '#202124' : '#ffffff',
                    }}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Upgrading...
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4" />
                        {plan.buttonText}
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-google-gray text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-google-green" />
              <span>No credit card required for free plan</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-google-green" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-google-green" />
              <span>Secure payment via Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
