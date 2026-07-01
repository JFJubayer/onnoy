const supabaseClient = window.supabaseClient;

if (typeof window.ADMIN_EMAILS === 'undefined') {
  window.ADMIN_EMAILS = [
    'zubayertalukdar2002@gmail.com',
    'masuma.sarker21220@gmail.com',
    'nayeemahrahman@gmail.com',
    'alfeeasha84@gmail.com',
    'jubayerjf28@gmail.com',
    'fnfahim122@gmail.com'
  ];
}

const initAuthNav = () => {
    if (!supabaseClient) {
        console.warn("Supabase client is not loaded. Auth navigation will not be initialized.");
        return;
    }

    // Set up auth state change listener
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        await renderAuthNav(session);
    });

    // Render immediately based on current session to prevent blank state on slower loads
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        renderAuthNav(session);
    }).catch(err => {
        console.error("Error getting session:", err);
        renderAuthNav(null);
    });

    // Listen for language toggling to update auth texts
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            // Wait brief moment for main.js to update document lang attribute
            setTimeout(async () => {
                const sessionRes = await supabaseClient.auth.getSession().catch(() => null);
                const session = sessionRes ? sessionRes.data.session : null;
                await renderAuthNav(session);
            }, 50);
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthNav);
} else {
    initAuthNav();
}

async function renderAuthNav(session) {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    let container = document.getElementById('nav-auth-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'nav-auth-container';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        
        // Insert right before nav-controls if present, otherwise append
        const controls = document.querySelector('.nav-controls');
        const cta = navRight.querySelector('.nav-cta');
        if (controls) {
            navRight.insertBefore(container, controls);
        } else if (cta) {
            cta.after(container);
        } else {
            navRight.appendChild(container);
        }
    } else {
        // Self-healing re-order logic to guarantee exact placement before settings toggles
        const controls = document.querySelector('.nav-controls');
        if (controls && container.nextSibling !== controls) {
            navRight.insertBefore(container, controls);
        }
    }

    const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('onnoy_lang') || 'en';
    const dict = typeof translations !== 'undefined' ? translations : {};
    const t = (key, def) => (dict[key] && dict[key][lang] !== undefined) ? dict[key][lang] : def;

    const basePath = window.location.pathname.includes('/courses/') ? '../' : '';

    if (!session) {
        // User is logged out
        container.innerHTML = `
            <a href="${basePath}login.html" class="btn btn-outline nav-login-btn" style="height: 38px; display: inline-flex; align-items: center; justify-content: center; padding: 0 22px; font-size: 0.88rem; border-radius: 40px; border: 1.5px solid var(--green); color: var(--green); transition: all 0.2s; box-sizing: border-box; font-weight: 600;">
                ${t('nav-login', 'Log In')}
            </a>
        `;
        
        // Apply hover styling via JS to keep it pure CSS variables compatible
        const loginBtn = container.querySelector('.nav-login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('mouseenter', () => {
                loginBtn.style.backgroundColor = 'var(--green)';
                loginBtn.style.color = '#FFFFFF';
            });
            loginBtn.addEventListener('mouseleave', () => {
                loginBtn.style.backgroundColor = 'transparent';
                loginBtn.style.color = 'var(--green)';
            });
        }
    } else {
        // User is logged in
        const user = session.user;
        const email = user.email;

        container.innerHTML = `
            <div class="dropdown auth-dropdown" style="position: relative; display: flex; align-items: center;">
                <button class="dropdown-toggle auth-user-btn" aria-expanded="false" style="background: var(--green-pale); border: 1.5px solid var(--green); height: 38px; padding: 0 22px; border-radius: 40px; color: var(--green); font-size: 0.88rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; box-sizing: border-box; margin: 0;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span class="auth-email-span" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle;">${email}</span>
                </button>
                <div class="dropdown-menu auth-dropdown-menu" style="right: 0; left: auto; min-width: 190px; margin-top: 8px; border-top: 3px solid var(--green); display: none; padding: 10px 0; border-radius: 12px; box-shadow: var(--shadow);">
                    <div style="padding: 8px 16px; font-size: 11px; color: var(--ink-light); border-bottom: 1px solid var(--border); word-break: break-all; margin-bottom: 5px;">
                        ${t('nav-profile-id', 'Profile ID')}: <span id="nav-profile-id-val" style="font-weight: 600; color: var(--ink);">${t('nav-loading', 'Loading...')}</span>
                    </div>
                    <a href="#" id="navSignOutBtn" style="color: var(--danger-fg); display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.85rem; transition: background 0.2s;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--danger-fg);"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        ${t('nav-signout', 'Sign Out')}
                    </a>
                </div>
            </div>
        `;
        if (window.ADMIN_EMAILS.includes(user.email)) {
            const profileSpan = container.querySelector('#nav-profile-id-val');
            if (profileSpan) {
                profileSpan.textContent = lang === 'bn' ? 'অ্যাডমিন' : 'Admin';
                profileSpan.style.color = 'var(--green)';
            }
            // Add Sign Out listener and return early
            const signOutBtn = container.querySelector('#navSignOutBtn');
            const btn = container.querySelector('.auth-user-btn');
            const menu = container.querySelector('.auth-dropdown-menu');
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = menu.style.display === 'block';
                    menu.style.display = isOpen ? 'none' : 'block';
                    btn.setAttribute('aria-expanded', String(!isOpen));
                });
                document.addEventListener('click', () => {
                    menu.style.display = 'none';
                    btn.setAttribute('aria-expanded', 'false');
                });
                signOutBtn.addEventListener('mouseenter', () => {
                    signOutBtn.style.backgroundColor = 'var(--green-pale)';
                });
                signOutBtn.addEventListener('mouseleave', () => {
                    signOutBtn.style.backgroundColor = 'transparent';
                });
            }
            if (signOutBtn) {
                signOutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await supabaseClient.auth.signOut();
                    window.location.reload();
                });
            }
            return;
        }

        const btn = container.querySelector('.auth-user-btn');
        const menu = container.querySelector('.auth-dropdown-menu');
        const signOutBtn = container.querySelector('#navSignOutBtn');

        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.style.display === 'block';
                menu.style.display = isOpen ? 'none' : 'block';
                btn.setAttribute('aria-expanded', String(!isOpen));
            });

            document.addEventListener('click', () => {
                menu.style.display = 'none';
                btn.setAttribute('aria-expanded', 'false');
            });
            
            // Hover background for dropdown items
            signOutBtn.addEventListener('mouseenter', () => {
                signOutBtn.style.backgroundColor = 'var(--green-pale)';
            });
            signOutBtn.addEventListener('mouseleave', () => {
                signOutBtn.style.backgroundColor = 'transparent';
            });
        }

        if (signOutBtn) {
            signOutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    console.error("Sign out error:", error.message);
                } else {
                    window.location.reload();
                }
            });
        }

        // Fetch profile unique ID from Database profiles table
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('unique_id')
                .eq('id', user.id)
                .single();

            const profileSpan = container.querySelector('#nav-profile-id-val');
            if (profileSpan) {
                if (error) {
                    if (error.code === 'PGRST116') {
                        // Profile row does not exist yet (email unverified or not verified when table was populated)
                        profileSpan.textContent = lang === 'bn' ? 'অপ্রমাণিত' : 'Unverified / Pending';
                        profileSpan.style.color = 'var(--caution-fg)';
                    } else {
                        console.error("Error reading profile unique_id:", error.message);
                        profileSpan.textContent = 'None';
                    }
                } else if (data && data.unique_id) {
                    profileSpan.textContent = data.unique_id;
                    profileSpan.style.color = 'var(--green)';
                }
            }
        } catch (e) {
            console.error("Exception loading user profile:", e);
        }
    }
}
