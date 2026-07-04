import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Plus, X, Loader2, Check, Home, ShoppingCart, Gift, Globe, Crown } from 'lucide-react';

// Subscription limits
const SUBSCRIPTION_LIMITS = {
  free: 1,
  premium_500: 2,
  premium_1000: 4,
  premium_1500: 10,
};

const STEPS = ['Profile', 'Language', 'Contact', 'Services', 'Design', 'Pages'];

const LANGUAGES = [
  { code: 'en', name: 'English', script: 'Latin' },
  { code: 'hi', name: 'Hindi', script: 'Devanagari' },
  { code: 'tm', name: 'Tamil', script: 'Tamil' },
  { code: 'te', name: 'Telugu', script: 'Telugu' },
  { code: 'kn', name: 'Kannada', script: 'Kannada' },
  { code: 'mr', name: 'Marathi', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', script: 'Bengali' },
  { code: 'gu', name: 'Gujarati', script: 'Gujarati' },
];

const BUSINESS_TYPES = [
  'Restaurant', 'Cafe', 'Salon', 'Spa', 'Gym', 'Clothing Store',
  'Electronics', 'Grocery', 'Pharmacy', 'Medical Clinic', 'Dental Clinic',
  'Law Firm', 'Accounting', 'Real Estate', 'Education', 'Coaching',
  'Photography', 'Event Planning', 'Catering', 'Bakery', 'Auto Service',
  'Hair Salon', 'Beauty Parlor', 'Tailor', 'Hardware Store', 'Other'
];

const PALETTES = [
  { id: 'blue', primary: '#4285F4', secondary: '#34A853', name: 'Ocean' },
  { id: 'green', primary: '#34A853', secondary: '#FBBC04', name: 'Forest' },
  { id: 'red', primary: '#EA4335', secondary: '#4285F4', name: 'Energy' },
  { id: 'yellow', primary: '#FBBC04', secondary: '#EA4335', name: 'Sunshine' },
  { id: 'purple', primary: '#9C27B0', secondary: '#E91E63', name: 'Royal' },
  { id: 'teal', primary: '#009688', secondary: '#4CAF50', name: 'Nature' },
];

const PAGE_OPTIONS = [
  {
    id: 'home',
    name: 'Home Page',
    description: 'Main landing page with your business info, hero section, and services',
    icon: Home,
    required: true,
  },
  {
    id: 'selling',
    name: 'Selling Page',
    description: 'Showcase products or services you want to sell or promote',
    icon: ShoppingCart,
    required: false,
  },
  {
    id: 'prize',
    name: 'Prize Page',
    description: 'Display prizes, rewards, contests, or special offers',
    icon: Gift,
    required: false,
  },
  {
    id: 'webapp',
    name: 'Web App Page',
    description: 'Interactive app showcase with features, download links, and app preview',
    icon: Globe,
    required: false,
  },
];

export default function CreateSitePage() {
  const navigate = useNavigate();
  const { refreshProfile, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [canCreate, setCanCreate] = useState(false);
  const [sitesCreated, setSitesCreated] = useState(0);

  useEffect(() => {
    checkCreationLimit();
  }, [profile]);

  const checkCreationLimit = async () => {
    if (!profile) {
      setCheckingLimit(false);
      return;
    }

    try {
      const limit = SUBSCRIPTION_LIMITS[profile.sub_status] || 1;
      const currentCount = profile.websites_count || 0;
      setSitesCreated(currentCount);
      setCanCreate(currentCount < limit);
    } catch (error) {
      console.error('Error checking limit:', error);
    } finally {
      setCheckingLimit(false);
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    city: '',
    lang: 'en',
    whatsapp: '',
    address: '',
    services: [{ name: '', price: '' }],
    palette: 'blue',
    pages: { home: true, selling: false, prize: false, webapp: false },
    sellingItems: [{ name: '', description: '', price: '' }],
    prizeItems: [{ name: '', description: '', value: '' }],
    webappData: {
      appName: '',
      tagline: '',
      description: '',
      features: [{ title: '', description: '' }],
      downloadLink: '',
      previewImage: '',
    },
  });

  const updateForm = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const addService = () => {
    updateForm({
      services: [...formData.services, { name: '', price: '' }],
    });
  };

  const removeService = (index) => {
    const services = formData.services.filter((_, i) => i !== index);
    updateForm({ services });
  };

  const updateService = (index, field, value) => {
    const services = [...formData.services];
    services[index] = { ...services[index], [field]: value };
    updateForm({ services });
  };

  const togglePage = (pageId) => {
    if (pageId === 'home') return; // Home is always enabled
    updateForm({
      pages: {
        ...formData.pages,
        [pageId]: !formData.pages[pageId],
      },
    });
  };

  const addSellingItem = () => {
    updateForm({
      sellingItems: [...formData.sellingItems, { name: '', description: '', price: '' }],
    });
  };

  const removeSellingItem = (index) => {
    const items = formData.sellingItems.filter((_, i) => i !== index);
    updateForm({ sellingItems: items });
  };

  const updateSellingItem = (index, field, value) => {
    const items = [...formData.sellingItems];
    items[index] = { ...items[index], [field]: value };
    updateForm({ sellingItems: items });
  };

  const addPrizeItem = () => {
    updateForm({
      prizeItems: [...formData.prizeItems, { name: '', description: '', value: '' }],
    });
  };

  const removePrizeItem = (index) => {
    const items = formData.prizeItems.filter((_, i) => i !== index);
    updateForm({ prizeItems: items });
  };

  const updatePrizeItem = (index, field, value) => {
    const items = [...formData.prizeItems];
    items[index] = { ...items[index], [field]: value };
    updateForm({ prizeItems: items });
  };

  const updateWebappData = (field, value) => {
    updateForm({
      webappData: {
        ...formData.webappData,
        [field]: value,
      },
    });
  };

  const addWebappFeature = () => {
    updateForm({
      webappData: {
        ...formData.webappData,
        features: [...formData.webappData.features, { title: '', description: '' }],
      },
    });
  };

  const removeWebappFeature = (index) => {
    const features = formData.webappData.features.filter((_, i) => i !== index);
    updateForm({
      webappData: {
        ...formData.webappData,
        features,
      },
    });
  };

  const updateWebappFeature = (index, field, value) => {
    const features = [...formData.webappData.features];
    features[index] = { ...features[index], [field]: value };
    updateForm({
      webappData: {
        ...formData.webappData,
        features,
      },
    });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const generateAIContent = async () => {
    const contentByLang = {
      en: {
        headline: `Welcome to ${formData.name} - Your Trusted ${formData.type} in ${formData.city}`,
        tagline: `Quality service and customer satisfaction guaranteed.`,
        about: `At ${formData.name}, we take pride in serving the ${formData.city} community. Our experienced team is dedicated to providing exceptional ${formData.type.toLowerCase()} services. We believe in building lasting relationships with our customers through quality, trust, and reliability.`,
        sellingHeadline: `Our Products & Special Offers`,
        sellingDescription: `Discover our carefully curated selection of products and services designed to meet your needs.`,
        prizeHeadline: `Exciting Prizes & Rewards`,
        prizeDescription: `Participate in our contests and stand a chance to win amazing prizes!`,
        webappHeadline: `Powerful Web App`,
        webappDescription: `Experience our feature-rich application designed to make your life easier.`,
      },
      hi: {
        headline: `${formData.name} में आपका स्वागत है - ${formData.city} में आपका विश्वसनीय ${formData.type}`,
        tagline: `गुणवत्तापूर्ण सेवा और ग्राहक संतुष्टि की गारंटी।`,
        about: `${formData.name} में, हम ${formData.city} समुदाय की सेवा करने पर गर्व करते हैं। हमारी अनुभवी टीम उत्कृष्ट ${formData.type.toLowerCase()} सेवाएं प्रदान करने के लिए समर्पित है।`,
        sellingHeadline: `हमारे उत्पाद और विशेष ऑफर`,
        sellingDescription: `आपकी जरूरतों को पूरा करने के लिए डिज़ाइन किए गए हमारे उत्पादों और सेवाओं की विशेष रूप से चुनी गई श्रेणी की खोज करें।`,
        prizeHeadline: `रोमांचक पुरस्कार और इनाम`,
        prizeDescription: `हमारी प्रतियोगिताओं में भाग लें और अद्भुत पुरस्कार जीतने का मौका पाएं!`,
      },
      tm: {
        headline: `${formData.name}-க்கு வருக - ${formData.city} இல் உங்கள் நம்பகமான ${formData.type}`,
        tagline: `தரமான சேவை மற்றும் வாடிக்கையாளர் திருப்தி உறுதி.`,
        about: `${formData.name} இல், ${formData.city} சமூகத்திற்கு சேவை செய்வதில் நாங்கள் பெருமை அடைகிறோம்.`,
        sellingHeadline: `எங்கள் தயாரிப்புகள் மற்றும் சிறப்பு சலுகைகள்`,
        sellingDescription: `உங்கள் தேவைகளை பூர்த்தி செய்ய வடிவமைக்கப்பட்ட எங்கள் தயாரிப்புகள் மற்றும் சேவைகளைக் கண்டறியவும்.`,
        prizeHeadline: `அற்புதமான பரிசுகள் மற்றும் வெகுமதிகள்`,
        prizeDescription: `எங்கள் போட்டிகளில் பங்கேற்று அற்புதமான பரிசுகளை வெல்லுங்கள்!`,
      },
      te: {
        headline: `${formData.name}కి స్వాగతం - ${formData.city}లో మీ విశ్వసనీయ ${formData.type}`,
        tagline: `నాణ్యమైన సేవ మరియు కస్టమర్ సంతృప్తి హామీ.`,
        about: `${formData.name}లో, మేము ${formData.city} సమాజానికి సేవ చేయడంపై గర్వపడతాము.`,
        sellingHeadline: `మా ఉత్పత్తులు & ప్రత్యేక ఆఫర్లు`,
        sellingDescription: `మీ అవసరాలను తీర్చడానికి రూపొందించిన మా ఉత్పత్తులు మరియు సేవలను కనుగొనండి.`,
        prizeHeadline: `ఉత్తేజకరమైన బహుమతులు & రివార్డ్లు`,
        prizeDescription: `మా పోటీలలో పాల్గొనండి మరియు అద్భుతమైన బహుమతులను గెలుచ్చుకోండి!`,
      },
      kn: {
        headline: `${formData.name}ಗೆ ಸ್ವಾಗತ - ${formData.city}ನಲ್ಲಿ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ${formData.type}`,
        tagline: `ಗುಣಮಟ್ಟದ ಸೇವೆ ಮತ್ತು ಗ್ರಾಹಕರ ಸಂತೃಪ್ತಿ ಖಾತರಿ.`,
        about: `${formData.name}ನಲ್ಲಿ, ನಾವು ${formData.city} ಸಮುದಾಯಕ್ಕೆ ಸೇವೆ ಸಲ್ಲಿಸುವುದನ್ನು ಹೆಮ್ಮೆಪಡುತ್ತೇವೆ.`,
        sellingHeadline: `ನಮ್ಮ ಉತ್ಪನ್ನಗಳು & ವಿಶೇಷ ಆಫರ್‌ಗಳು`,
        sellingDescription: `ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳನ್ನು ಪೂರೈಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಿದ ನಮ್ಮ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಸೇವೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`,
        prizeHeadline: `ರೋಮಾಂಚನಕಾರಿ ಬಹುಮತುಗಳು & ಪ್ರತಿಫಲಗಳು`,
        prizeDescription: `ನಮ್ಮ ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ ಭಾಗವಹಿಸಿ ಅದ್ಭುತ ಬಹುಮತುಗಳನ್ನು ಗೆಲ್ಲಿ!`,
      },
      mr: {
        headline: `${formData.name} मध्ये आपले स्वागत आहे - ${formData.city} मध्ये तुमचा विश्वसनीय ${formData.type}`,
        tagline: `दर्जेदार सेवा आणि ग्राहक समाधानाची हमी.`,
        about: `${formData.name} मध्ये, आम्ही ${formData.city} समुदायाची सेवा करण्यावर अभिमान बाळगतो.`,
        sellingHeadline: `आमची उत्पादने आणि विशेष ऑफर`,
        sellingDescription: `तुमच्या गरजा पूर्ण करण्यासाठी तयार केलेली आमची उत्पादने आणि सेवा शोधा.`,
        prizeHeadline: `उत्साहवर्धक पारितोषिके आणि बक्षिसी`,
        prizeDescription: `आमच्या स्पर्धांमध्ये सहभागी व्हा आणि अद्भुत पारितोषिके जिंका!`,
      },
      bn: {
        headline: `${formData.name}এ স্বাগতম - ${formData.city}এ আপনার বিশ্বস্ত ${formData.type}`,
        tagline: `মানসম্মত সেবা এবং গ্রাহক সন্তুষ্টির গ্যারান্টি।`,
        about: `${formData.name}এ, আমরা ${formData.city} সম্প্রদায়ের সেবা করতে পেরে গর্বিত।`,
        sellingHeadline: `আমাদের পণ্য এবং বিশেষ অফার`,
        sellingDescription: `আপনার চাহিদা মেটাতে ডিজাইন করা আমাদের পণ্য এবং সেবা আবিষ্কার করুন।`,
        prizeHeadline: `উত্তেজনাপূর্ণ পুরস্কার এবং পুরস্কার`,
        prizeDescription: `আমাদের প্রতিযোগিতায় অংশগ্রহণ করুন এবং আশ্চর্যজনক পুরস্কার জয়লাভ করুন!`,
      },
      gu: {
        headline: `${formData.name}માં સ્વાગત છે - ${formData.city}માં તમારો વિશ્વસનીય ${formData.type}`,
        tagline: `ગુણવત્તાવાળી સેવા અને ગ્રાહક સંતોષની ગેરંટી.`,
        about: `${formData.name}માં, અમે ${formData.city} સમુદાયને સેવા આપવાનું ગૌરવ અનુભવીએ છીએ.`,
        sellingHeadline: `અમારા ઉત્પાદનો અને વિશેષ ઓફર`,
        sellingDescription: `તમારી જરૂરિયાતોને પૂર્ણ કરવા માટે ડિઝાઇન કરેલા અમારા ઉત્પાદનો અને સેવાઓ શોધો.`,
        prizeHeadline: `રોમાંચક ઇનામો અને ઇનામો`,
        prizeDescription: `અમારી સ્પર્ધાઓમાં ભાગ લો અને અદ્ભુત ઇનામો જીતો!`,
      },
    };

    return contentByLang[formData.lang] || contentByLang.en;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const aiContent = await generateAIContent();
      const validServices = formData.services.filter(
        (s) => s.name.trim() && s.price.trim()
      );
      const validSellingItems = formData.sellingItems.filter(
        (s) => s.name.trim()
      );
      const validPrizeItems = formData.prizeItems.filter(
        (s) => s.name.trim()
      );
      const validWebappFeatures = formData.webappData.features.filter(
        (f) => f.title.trim()
      );

      const slug = generateSlug(formData.name);

      const { data, error } = await supabase
        .from('websites')
        .insert({
          name: formData.name,
          type: formData.type,
          city: formData.city,
          lang: formData.lang,
          whatsapp: formData.whatsapp,
          address: formData.address,
          services: validServices,
          headline: aiContent.headline,
          tagline: aiContent.tagline,
          about: aiContent.about,
          slug: slug + '-' + Date.now().toString(36),
          palette: formData.palette,
          is_published: true,
          pages: formData.pages,
          selling_items: validSellingItems,
          prize_items: validPrizeItems,
          webapp_data: {
            ...formData.webappData,
            features: validWebappFeatures,
          },
          selling_content: aiContent.sellingHeadline,
          prize_content: aiContent.prizeHeadline,
          webapp_content: aiContent.webappHeadline,
        })
        .select()
        .single();

      if (error) throw error;

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.rpc('increment_websites_count', {
          user_id: userData.user.id,
        });
      }

      toast.success('Website created successfully!');
      refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create website');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.name && formData.type && formData.city;
      case 1:
        return formData.lang;
      case 2:
        return formData.whatsapp && formData.address;
      case 3:
        return formData.services.some((s) => s.name && s.price);
      case 4:
        return formData.palette;
      case 5:
        // At least home page is always selected
        return formData.pages.home;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Check subscription limit */}
        {checkingLimit ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-google-blue" />
          </div>
        ) : !canCreate ? (
          <div className="card-google text-center py-12">
            <div className="w-20 h-20 rounded-full bg-google-blue/10 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-google-blue" />
            </div>
            <h2 className="text-2xl font-bold text-google-black mb-4">
              {sitesCreated === 0 ? 'Upgrade to Create Websites' : 'Website Limit Reached'}
            </h2>
            <p className="text-google-gray mb-2">
              {profile?.sub_status === 'free'
                ? `Free plan allows only 1 website. You have created ${sitesCreated} website${sitesCreated > 1 ? 's' : ''}.`
                : `Your ${profile?.sub_status?.replace('premium_', 'Premium ')} plan allows ${SUBSCRIPTION_LIMITS[profile?.sub_status] || 1} websites. You have created ${sitesCreated}.`}
            </p>
            <p className="text-google-gray mb-6">
              Upgrade your subscription to create more websites.
            </p>
            <Link
              to="/subscription"
              className="inline-flex items-center gap-2 bg-google-blue text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
            >
              <Crown className="w-5 h-5" />
              View Plans
            </Link>
          </div>
        ) : (
        <>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex items-center ${
                  i < STEPS.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
                      ? 'bg-google-blue text-white'
                      : 'bg-gray-200 text-google-gray'
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      i < step ? 'bg-google-blue' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-google-black text-center">
            {STEPS[step]}
          </h2>
        </div>

        {/* Step Content */}
        <div className="card-google">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-google-black mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className="input-google"
                  placeholder="e.g., Sharma's Restaurant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-google-black mb-2">
                  Business Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateForm({ type: e.target.value })}
                  className="input-google"
                >
                  <option value="">Select type...</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-google-black mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateForm({ city: e.target.value })}
                  className="input-google"
                  placeholder="e.g., Mumbai"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-google-black mb-4">
                  Select Your Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => updateForm({ lang: lang.code })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.lang === lang.code
                          ? 'border-google-blue bg-google-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-google-black">{lang.name}</div>
                      <div className="text-sm text-google-gray">{lang.script}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-google-black mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateForm({ whatsapp: e.target.value })}
                  className="input-google"
                  placeholder="e.g., +91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-google-black mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateForm({ address: e.target.value })}
                  className="input-google min-h-[100px]"
                  placeholder="Full business address..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-google-black mb-4">
                  Your Services / Products
                </label>
                <div className="space-y-3">
                  {formData.services.map((service, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) =>
                          updateService(index, 'name', e.target.value)
                        }
                        className="input-google flex-1"
                        placeholder="Service name"
                      />
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) =>
                          updateService(index, 'price', e.target.value)
                        }
                        className="input-google w-32"
                        placeholder="₹ Price"
                      />
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="p-3 text-google-red hover:bg-red-50 rounded-xl"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addService}
                  className="mt-4 flex items-center gap-2 text-google-blue hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-google-black mb-4">
                  Choose Your Color Palette
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PALETTES.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => updateForm({ palette: palette.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.palette === palette.id
                          ? 'border-google-blue bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: palette.secondary }}
                        />
                      </div>
                      <div className="font-medium text-google-black">
                        {palette.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-google-black mb-4">
                  Select Pages for Your Website
                </label>
                <p className="text-sm text-google-gray mb-6">
                  Choose which pages to include. Home page is included by default.
                </p>
                <div className="space-y-4">
                  {PAGE_OPTIONS.map((page) => {
                    const isSelected = formData.pages[page.id];
                    const Icon = page.icon;
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => togglePage(page.id)}
                        disabled={page.required}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'border-google-blue bg-google-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${page.required ? 'opacity-80' : ''}`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-google-blue/20' : 'bg-gray-100'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-google-blue' : 'text-google-gray'}`} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-google-black">{page.name}</span>
                            {page.required && (
                              <span className="text-xs bg-google-green/10 text-google-green px-2 py-0.5 rounded-full">
                                Included
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-google-gray mt-1">
                            {page.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-google-blue flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selling Items */}
              {formData.pages.selling && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-google-black mb-4">
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Selling Page Items
                  </label>
                  <div className="space-y-3">
                    {formData.sellingItems.map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateSellingItem(index, 'name', e.target.value)}
                            className="input-google flex-1"
                            placeholder="Product/Service name"
                          />
                          {formData.sellingItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSellingItem(index)}
                              className="p-3 text-google-red hover:bg-red-50 rounded-xl"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateSellingItem(index, 'description', e.target.value)}
                          className="input-google"
                          placeholder="Short description"
                        />
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => updateSellingItem(index, 'price', e.target.value)}
                          className="input-google"
                          placeholder="Price (e.g., ₹299 or Contact for price)"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addSellingItem}
                    className="mt-4 flex items-center gap-2 text-google-blue hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              )}

              {/* Prize Items */}
              {formData.pages.prize && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-google-black mb-4">
                    <Gift className="w-4 h-4 inline mr-2" />
                    Prize Page Items
                  </label>
                  <div className="space-y-3">
                    {formData.prizeItems.map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updatePrizeItem(index, 'name', e.target.value)}
                            className="input-google flex-1"
                            placeholder="Prize/Contest name"
                          />
                          {formData.prizeItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePrizeItem(index)}
                              className="p-3 text-google-red hover:bg-red-50 rounded-xl"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updatePrizeItem(index, 'description', e.target.value)}
                          className="input-google"
                          placeholder="Description (how to win, rules, etc.)"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => updatePrizeItem(index, 'value', e.target.value)}
                          className="input-google"
                          placeholder="Value (e.g., ₹5000 worth products)"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addPrizeItem}
                    className="mt-4 flex items-center gap-2 text-google-blue hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Prize
                  </button>
                </div>
              )}

              {/* Web App Data */}
              {formData.pages.webapp && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-google-black mb-4">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Web App Page Details
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.webappData.appName}
                      onChange={(e) => updateWebappData('appName', e.target.value)}
                      className="input-google"
                      placeholder="App Name"
                    />
                    <input
                      type="text"
                      value={formData.webappData.tagline}
                      onChange={(e) => updateWebappData('tagline', e.target.value)}
                      className="input-google"
                      placeholder="App Tagline (short description)"
                    />
                    <textarea
                      value={formData.webappData.description}
                      onChange={(e) => updateWebappData('description', e.target.value)}
                      className="input-google min-h-[100px]"
                      placeholder="Detailed app description..."
                    />
                    <input
                      type="text"
                      value={formData.webappData.downloadLink}
                      onChange={(e) => updateWebappData('downloadLink', e.target.value)}
                      className="input-google"
                      placeholder="Download link (Play Store, App Store, or direct)"
                    />

                    {/* App Features */}
                    <div className="pt-4">
                      <label className="block text-sm font-medium text-google-gray mb-3">
                        App Features
                      </label>
                      <div className="space-y-3">
                        {formData.webappData.features.map((feature, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={feature.title}
                                onChange={(e) => updateWebappFeature(index, 'title', e.target.value)}
                                className="input-google flex-1"
                                placeholder="Feature title"
                              />
                              {formData.webappData.features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeWebappFeature(index)}
                                  className="p-3 text-google-red hover:bg-red-50 rounded-xl"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={feature.description}
                              onChange={(e) => updateWebappFeature(index, 'description', e.target.value)}
                              className="input-google"
                              placeholder="Feature description"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addWebappFeature}
                        className="mt-4 flex items-center gap-2 text-google-blue hover:underline"
                      >
                        <Plus className="w-4 h-4" /> Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-google flex-1 border-2 border-gray-200 text-google-gray hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5 inline mr-1" />
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-google btn-primary flex-1 disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-5 h-5 inline ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="btn-google btn-success flex-1 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                ) : null}
                Create Website
              </button>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
