// UjrahTask - Supabase Auth & Real Database Client
// Connects frontend to Supabase PostgreSQL & Auth with fallback protection

(function() {
  // Config: Put your Supabase project keys here or inject via window.UJRAH_SUPABASE_CONFIG
  const CONFIG = window.UJRAH_SUPABASE_CONFIG || {
    url: '',      // Example: 'https://xyzcompany.supabase.co'
    anonKey: ''  // Example: 'eyJhbGciOiJIUzI1NiIsIn...'
  };

  let supabase = null;

  // Initialize Supabase client if keys are present and library loaded
  function initSupabase() {
    if (CONFIG.url && CONFIG.anonKey && window.supabase && window.supabase.createClient) {
      try {
        supabase = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);
        console.log('[UjrahTask Auth]: Supabase Real Database Client initialized.');
      } catch (e) {
        console.error('[UjrahTask Auth]: Failed to initialize Supabase client:', e);
      }
    }
  }

  // Attempt initial init
  initSupabase();

  window.ujrahAuth = {
    isConfigured: function() {
      return !!(supabase && CONFIG.url && CONFIG.anonKey);
    },

    getClient: function() {
      return supabase;
    },

    // Get current logged-in user (from Supabase or local session fallback)
    getCurrentUser: async function() {
      if (supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session && session.user) {
            // Fetch profile data from PostgreSQL
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            return {
              id: session.user.id, // Real permanent server-verified UUID
              email: session.user.email,
              name: (profile && profile.full_name) || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              phone: (profile && profile.phone) || session.user.user_metadata?.phone || '',
              balance: profile ? Number(profile.balance) : 0.0,
              pending: profile ? Number(profile.pending_balance) : 0.0,
              withdrawn: profile ? Number(profile.withdrawn_balance) : 0.0,
              isRealAuth: true
            };
          }
        } catch (err) {
          console.error('[UjrahTask Auth]: Error fetching Supabase user session:', err);
        }
      }

      // Fallback to local session
      return JSON.parse(localStorage.getItem('ujrah_user') || 'null');
    },

    // Sign up with real Supabase Auth
    signUp: async function(email, password, fullName, phone) {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: fullName,
              phone: phone
            }
          }
        });

        if (error) {
          throw error;
        }

        const user = data.user;
        const sessionData = {
          id: user.id, // Permanent UUID
          email: user.email,
          name: fullName || user.email.split('@')[0],
          phone: phone,
          balance: 0.0,
          pending: 0.0,
          withdrawn: 0.0,
          isRealAuth: true
        };
        localStorage.setItem('ujrah_user', JSON.stringify(sessionData));
        return sessionData;
      }

      // Fallback mock signup if Supabase is not yet configured
      const localId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const newUser = {
        id: localId,
        email: email,
        name: fullName,
        phone: phone,
        balance: 0.0,
        pending: 0.0,
        withdrawn: 0.0,
        isRealAuth: false
      };
      let existingUsers = JSON.parse(localStorage.getItem('ujrah_users_db') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('ujrah_users_db', JSON.stringify(existingUsers));
      localStorage.setItem('ujrah_user', JSON.stringify(newUser));
      return newUser;
    },

    // Sign in with real Supabase Auth
    signIn: async function(email, password) {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          throw error;
        }

        const user = data.user;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const sessionData = {
          id: user.id,
          email: user.email,
          name: (profile && profile.full_name) || user.user_metadata?.full_name || user.email.split('@')[0],
          phone: (profile && profile.phone) || user.user_metadata?.phone || '',
          balance: profile ? Number(profile.balance) : 0.0,
          pending: profile ? Number(profile.pending_balance) : 0.0,
          withdrawn: profile ? Number(profile.withdrawn_balance) : 0.0,
          isRealAuth: true
        };
        localStorage.setItem('ujrah_user', JSON.stringify(sessionData));
        return sessionData;
      }

      // Fallback local sign in
      let existingUsers = JSON.parse(localStorage.getItem('ujrah_users_db') || '[]');
      let matched = existingUsers.find(u => u.email === email || u.phone === email);
      const sessionData = matched || {
        id: 'usr_' + Date.now().toString(36),
        name: email.split('@')[0],
        email: email,
        phone: '01700000000',
        balance: 0.0,
        pending: 0.0,
        withdrawn: 0.0,
        isRealAuth: false
      };
      localStorage.setItem('ujrah_user', JSON.stringify(sessionData));
      return sessionData;
    },

    // Sign out
    signOut: async function() {
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('[UjrahTask Auth]: Error signing out of Supabase:', e);
        }
      }
      localStorage.removeItem('ujrah_user');
    },

    // Securely retrieve the CPX Wall URL from server without exposing hash
    getCPXWallUrl: async function(userId) {
      if (!userId) {
        throw new Error('User must be logged in to access CPX survey wall.');
      }

      const res = await fetch(`/api/cpx/wall-url?user_id=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate survey wall session.');
      }
      return data.url;
    }
  };
})();
