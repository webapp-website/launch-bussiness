import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Globe, Trash2, ExternalLink, Eye, Edit2, Crown } from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  const fetchWebsites = async () => {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load websites');
    } else {
      setWebsites(data || []);
    }
    setLoading(false);
  };

  const getSubscriptionLimits = (status) => {
    switch (status) {
      case 'premium_500': return 2;
      case 'premium_1000': return 4;
      case 'premium_1500': return 10;
      default: return 1;
    }
  };

  const canCreateNew = () => {
    const limit = getSubscriptionLimits(profile?.sub_status || 'free');
    return websites.length < limit;
  };

  const togglePublish = async (id, currentState) => {
    const { error } = await supabase
      .from('websites')
      .update({ is_published: !currentState })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success(currentState ? 'Unpublished' : 'Published');
      fetchWebsites();
    }
  };

  const deleteWebsite = async (id) => {
    if (!confirm('Are you sure you want to delete this website?')) return;

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Website deleted');
      fetchWebsites();
      refreshProfile();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-google-blue border-t-transparent"></div>
      </div>
    );
  }

  const limit = getSubscriptionLimits(profile?.sub_status || 'free');
  const isFree = profile?.sub_status === 'free';

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with subscription banner for free users */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-google-black mb-2">Your Websites</h1>
          <p className="text-google-gray">
            {websites.length} of {limit} websites created
          </p>

          {/* Upgrade banner for free users */}
          {isFree && (
            <div className="mt-4 bg-gradient-to-r from-google-blue to-google-green rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6" />
                <h3 className="text-xl font-bold">Upgrade to Premium</h3>
              </div>
              <p className="mb-4 opacity-90">
                Create more websites and remove branding
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/subscription"
                  className="bg-white text-google-blue px-5 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  View Plans
                </Link>
              </div>
              <div className="mt-4 text-sm opacity-80">
                ₹500/mo (2 sites) • ₹1000/mo (4 sites) • ₹1500/mo (10 sites)
              </div>
            </div>
          )}
        </div>

        {/* Create new button */}
        {canCreateNew() ? (
          <Link
            to="/create"
            className="block w-full card-google hover:shadow-xl transition-all text-center border-2 border-dashed border-google-blue mb-8"
          >
            <div className="py-8">
              <div className="w-16 h-16 bg-google-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-google-blue" />
              </div>
              <span className="text-xl font-medium text-google-blue">
                Create New Website
              </span>
            </div>
          </Link>
        ) : (
          <div className="card-google text-center mb-8 bg-gray-100">
            <div className="py-8">
              <p className="text-google-gray mb-4">
                You've reached your website limit ({limit})
              </p>
              <Link
                to="/subscription"
                className="btn-google btn-primary inline-flex"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        )}

        {/* Website list */}
        {websites.length > 0 ? (
          <div className="space-y-4">
            {websites.map((site) => (
              <div key={site.id} className="card-google flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-google-black">{site.name}</h3>
                  <p className="text-google-gray text-sm">{site.type} • {site.city}</p>
                  <p className="text-google-blue text-sm truncate">
                    /site/{site.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    site.is_published
                      ? 'bg-google-green/10 text-google-green'
                      : 'bg-gray-200 text-google-gray'
                  }`}>
                    {site.is_published ? 'Published' : 'Draft'}
                  </span>
                  <a
                    href={`/site/${site.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 text-google-blue"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => togglePublish(site.id, site.is_published)}
                    className="p-2 rounded-full hover:bg-gray-100 text-google-gray"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteWebsite(site.id)}
                    className="p-2 rounded-full hover:bg-red-50 text-google-red"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-google-gray">No websites yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
