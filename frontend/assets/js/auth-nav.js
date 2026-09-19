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

        // Sync local badges & progress
        syncLocalBadgesToDatabase();

        container.innerHTML = `
            <div class="dropdown auth-dropdown" style="position: relative; display: flex; align-items: center;">
                <button class="auth-user-btn" aria-expanded="false" style="background: var(--white); border: 2px solid var(--green); width: 40px; height: 40px; padding: 0; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: transform 0.2s; margin: 0; text-decoration: none;">
                    <img id="nav-profile-avatar" src="${basePath}assets/images/default-avatar.png" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <svg style="width:20px; height:20px; color:var(--green); margin: auto;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </button>
                <div class="dropdown-menu auth-dropdown-menu" style="right: 0; left: auto; min-width: 190px; margin-top: 8px; border-top: 3px solid var(--green); display: none; padding: 10px 0; border-radius: 12px; box-shadow: var(--shadow); background: var(--white); z-index: 1001;">
                    <div style="padding: 8px 16px; font-size: 11px; color: var(--text-muted); border-bottom: 1px solid var(--border); word-break: break-all; margin-bottom: 5px; line-height: 1.4;">
                        <span style="font-size: 12px; color: var(--ink);">${email}</span><br>
                        ${t('nav-profile-id', 'ID')}: <span id="nav-profile-id-val" style="font-weight: 600; color: var(--green);">${t('nav-loading', 'Loading...')}</span>
                    </div>
                    <a href="${basePath}profile.html" style="color: var(--ink); display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.85rem; transition: background 0.2s; text-decoration: none !important;" onmouseover="this.style.backgroundColor='var(--surface-soft)'" onmouseout="this.style.backgroundColor='transparent'">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        My Profile
                    </a>
                    <a href="#" id="navSignOutBtn" style="color: var(--danger-fg); display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.85rem; transition: background 0.2s; text-decoration: none !important;" onmouseover="this.style.backgroundColor='var(--surface-soft)'" onmouseout="this.style.backgroundColor='transparent'">
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
            
            const menuNode = container.querySelector('.auth-dropdown-menu');
            if (menuNode) {
                const adminLink = document.createElement('a');
                adminLink.href = `${basePath}admin-portal.html`;
                adminLink.style.cssText = 'color: var(--ink); display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.85rem; transition: background 0.2s; text-decoration: none !important;';
                adminLink.onmouseover = function() { this.style.backgroundColor='var(--surface-soft)'; };
                adminLink.onmouseout = function() { this.style.backgroundColor='transparent'; };
                adminLink.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--blue);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    Admin Dashboard
                `;
                const signOutNode = container.querySelector('#navSignOutBtn');
                menuNode.insertBefore(adminLink, signOutNode);
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
                    clearLocalProgress();
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
                clearLocalProgress();
                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    console.error("Sign out error:", error.message);
                } else {
                    window.location.reload();
                }
            });
        }

        // Fetch profile unique ID and avatar from Database profiles table
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('unique_id, avatar_url')
                .eq('id', user.id)
                .single();

            const profileSpan = container.querySelector('#nav-profile-id-val');
            const navAvatar = container.querySelector('#nav-profile-avatar');

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
                } else if (data) {
                    if (data.unique_id) {
                        profileSpan.textContent = data.unique_id;
                        profileSpan.style.color = 'var(--green)';
                    }
                    if (data.avatar_url && navAvatar) {
                        navAvatar.src = data.avatar_url;
                        navAvatar.style.display = 'block';
                        navAvatar.nextElementSibling.style.display = 'none'; // hide the default SVG icon
                    }
                }
            }
        } catch (e) {
            console.error("Exception loading user profile:", e);
        }
    }
}

function clearLocalProgress() {
    const keysToClear = [
        'onnoy_lesson_overview',
        'onnoy_lesson_attention',
        'onnoy_lesson_misinformation',
        'onnoy_lesson_scams',
        'onnoy_lesson_ai',
        'onnoy_mission_spot_lie',
        'onnoy_mission_scam_alert',
        'onnoy_mission_ai_integrity',
        'onnoy_mission_guardian',
        'onnoy_badge_informed_shown',
        'onnoy_badge_aware_shown',
        'onnoy_badge_guardian_shown'
    ];
    keysToClear.forEach(key => localStorage.removeItem(key));
    localStorage.setItem('onnoy_progress_owner', 'anonymous');
}

async function syncLocalBadgesToDatabase() {
    try {
        if (window.supabaseClient) {
            const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
            if (session && session.user) {
                const currentOwner = localStorage.getItem('onnoy_progress_owner');
                const loggedInEmail = session.user.email;

                // If progress belongs to someone else, wipe it first!
                if (currentOwner && currentOwner !== 'anonymous' && currentOwner !== loggedInEmail) {
                    console.log(`User switch detected: ${currentOwner} -> ${loggedInEmail}. Wiping local progress.`);
                    clearLocalProgress();
                }

                // Set current owner
                localStorage.setItem('onnoy_progress_owner', loggedInEmail);

                // 1. Fetch current profile status & badges
                const { data: profile, error: selectError } = await window.supabaseClient
                    .from('profiles')
                    .select('badges, status, ongoing_modules, completed_modules')
                    .eq('id', session.user.id)
                    .single();

                if (selectError) {
                    console.error("Error fetching profile during auth sync:", selectError.message);
                    return;
                }

                if (profile) {
                    let localChanged = false;
                    
                    // A. Restore database badges to localStorage
                    const dbBadges = Array.isArray(profile.badges) ? profile.badges : [];
                    dbBadges.forEach(badge => {
                        const lKey = `onnoy_badge_${badge}_shown`;
                        if (localStorage.getItem(lKey) !== 'true') {
                            localStorage.setItem(lKey, 'true');
                            localChanged = true;
                        }
                    });

                    // B. Restore database status/progress to localStorage
                    const hasFinishedLevel1 = ['Approved', 'Mission2Unlocked', 'Mission3Unlocked', 'Mission4Unlocked'].includes(profile.status);
                    if (hasFinishedLevel1) {
                        const lessons = ['overview', 'attention', 'misinformation', 'scams', 'ai'];
                        lessons.forEach(l => {
                            const lKey = `onnoy_lesson_${l}`;
                            if (localStorage.getItem(lKey) !== 'complete') {
                                localStorage.setItem(lKey, 'complete');
                                localChanged = true;
                            }
                        });
                    }

                    const statusOrder = ['Approved', 'Mission2Unlocked', 'Mission3Unlocked', 'Mission4Unlocked'];
                    const currentStatusIdx = statusOrder.indexOf(profile.status);
                    
                    if (currentStatusIdx >= 1) {
                        if (localStorage.getItem('onnoy_mission_spot_lie') !== 'complete') {
                            localStorage.setItem('onnoy_mission_spot_lie', 'complete');
                            localChanged = true;
                        }
                    } else {
                        if (localStorage.getItem('onnoy_mission_spot_lie') === 'complete') {
                            localStorage.removeItem('onnoy_mission_spot_lie');
                            localChanged = true;
                        }
                    }
                    
                    if (currentStatusIdx >= 2) {
                        if (localStorage.getItem('onnoy_mission_scam_alert') !== 'complete') {
                            localStorage.setItem('onnoy_mission_scam_alert', 'complete');
                            localChanged = true;
                        }
                    } else {
                        if (localStorage.getItem('onnoy_mission_scam_alert') === 'complete') {
                            localStorage.removeItem('onnoy_mission_scam_alert');
                            localChanged = true;
                        }
                    }
                    
                    if (currentStatusIdx >= 3) {
                        if (localStorage.getItem('onnoy_mission_ai_integrity') !== 'complete') {
                            localStorage.setItem('onnoy_mission_ai_integrity', 'complete');
                            localChanged = true;
                        }
                    } else {
                        if (localStorage.getItem('onnoy_mission_ai_integrity') === 'complete') {
                            localStorage.removeItem('onnoy_mission_ai_integrity');
                            localChanged = true;
                        }
                    }

                    if (localChanged && typeof renderBadgesDisplay === 'function') {
                        renderBadgesDisplay();
                        if (typeof renderHubProgress === 'function') renderHubProgress();
                    }

                    // C. Sync local badges and status to Supabase (in case they completed something locally before logging in)
                    let updates = {};
                    
                    const localBadges = [];
                    if (localStorage.getItem('onnoy_badge_informed_shown') === 'true') localBadges.push('informed');
                    if (localStorage.getItem('onnoy_badge_aware_shown') === 'true') localBadges.push('aware');
                    if (localStorage.getItem('onnoy_badge_guardian_shown') === 'true') localBadges.push('guardian');

                    let finalBadges = [...dbBadges];
                    let badgesUpdated = false;

                    if (localBadges.length > 0) {
                        localBadges.forEach(badge => {
                            if (!finalBadges.includes(badge)) {
                                finalBadges.push(badge);
                                badgesUpdated = true;
                            }
                        });
                    }

                    if (profile.status === 'pending' && localStorage.getItem('onnoy_lesson_overview') === 'complete') {
                        updates.status = 'Approved';
                    }

                    // Check for Informed badge: ALL 5 Level 1 modules must be complete
                    const level1Keys = [
                        'onnoy_lesson_overview',
                        'onnoy_lesson_attention',
                        'onnoy_lesson_misinformation',
                        'onnoy_lesson_scams',
                        'onnoy_lesson_ai'
                    ];
                    const allLevel1Complete = level1Keys.every(key => localStorage.getItem(key) === 'complete');
                    
                    if (allLevel1Complete) {
                        if (!finalBadges.includes('informed')) {
                            finalBadges.push('informed');
                            badgesUpdated = true;
                            localStorage.setItem('onnoy_badge_informed_shown', 'true');
                        }
                    }

                    if (badgesUpdated) {
                        updates.badges = finalBadges;
                    }

                    // D. Sync module progress (Append to existing DB arrays, do not overwrite!)
                    let completedModules = [...(profile.completed_modules || [])];
                    let ongoingModules = [];
                    let foundOngoing = false;
                    let modulesUpdated = false;
                    
                    if (window.ONNOY_TRACKABLE_MODULES) {
                        for (let item of window.ONNOY_TRACKABLE_MODULES) {
                            if (localStorage.getItem(item.key) === 'complete') {
                                if (!completedModules.includes(item.title)) {
                                    completedModules.push(item.title);
                                    modulesUpdated = true;
                                }
                            } else {
                                if (!foundOngoing && !completedModules.includes(item.title)) {
                                    ongoingModules.push(item.title);
                                    foundOngoing = true;
                                }
                            }
                        }
                    }

                    const dbOngoing = profile.ongoing_modules || [];
                    
                    if (modulesUpdated) {
                        updates.completed_modules = completedModules;
                    }
                    if (JSON.stringify(ongoingModules) !== JSON.stringify(dbOngoing)) {
                        updates.ongoing_modules = ongoingModules;
                    }

                    if (Object.keys(updates).length > 0) {
                        const { error: updateError } = await window.supabaseClient
                            .from('profiles')
                            .update(updates)
                            .eq('id', session.user.id);
                        
                        if (updateError) {
                            console.error("Error updating profile during auth sync:", updateError.message);
                        } else {
                            console.log("Successfully synced profile during auth sync:", updates);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error in syncLocalBadgesToDatabase (auth-nav):", err);
    }
}
