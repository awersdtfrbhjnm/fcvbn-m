import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ChatInterface } from './components/ChatInterface';
import { TaxAnalysisView } from './components/TaxAnalysisView';
import { Calculator, MessageSquare, FileText, LogOut } from 'lucide-react';
import { seedTaxData } from './utils/seedTaxData';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'chat' | 'analysis'>('chat');
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    checkUser();
    seedTaxData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
      await ensureUserProfile(session.user.id, session.user.email || '');
    }
  };

  const ensureUserProfile = async (uid: string, userEmail: string) => {
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from('user_profiles').insert({
        user_id: uid,
        email: userEmail,
        full_name: userEmail.split('@')[0]
      } as any);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'demo-password-123'
      });

      if (error) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'demo-password-123'
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          setUserId(signUpData.user.id);
          await ensureUserProfile(signUpData.user.id, email);
        }
      } else if (data.user) {
        setUserId(data.user.id);
        await ensureUserProfile(data.user.id, email);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setEmail('');
    setAnalysis(null);
    setView('chat');
  };

  const handleAnalysisComplete = (analysisData: any) => {
    setAnalysis(analysisData);
    setView('analysis');
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Calculator className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Tax Advisor</h1>
            <p className="text-slate-600">Intelligent tax planning powered by AI</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Please wait...' : 'Sign In / Sign Up'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            By continuing, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Tax Advisor</h1>
                <p className="text-xs text-slate-500">Powered by Gemini AI</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('chat')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  view === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare size={18} />
                Chat
              </button>
              <button
                onClick={() => setView('analysis')}
                disabled={!analysis}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  view === 'analysis'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <FileText size={18} />
                Analysis
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-12rem)]">
          {view === 'chat' ? (
            <ChatInterface userId={userId} onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <div className="h-full overflow-y-auto">
              {analysis ? (
                <TaxAnalysisView analysis={analysis} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                    <p>No analysis available yet.</p>
                    <p className="text-sm mt-2">Complete the chat to generate your tax analysis.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
