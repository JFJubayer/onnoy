document.addEventListener('DOMContentLoaded', async () => {
    // Wait for Supabase to initialize
    const checkSupabase = setInterval(async () => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            await initProfile();
        }
    }, 100);
});

async function initProfile() {
    const supabase = window.supabaseClient;
    const { data: { session } } = await supabase.auth.getSession();

    const authAlert = document.getElementById('auth-alert');
    const profileContent = document.getElementById('profile-content');

    if (!session) {
        authAlert.style.display = 'block';
        profileContent.style.display = 'none';
        return;
    }

    authAlert.style.display = 'none';
    profileContent.style.display = 'grid';

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Fetch Profile Data
    async function loadProfile() {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return;
        }

        if (profile) {
            // Update Headers
            document.getElementById('display-name').textContent = profile.full_name || 'Anonymous User';
            document.getElementById('display-email').textContent = userEmail;
            document.getElementById('display-school').textContent = profile.school_name || '';
            document.getElementById('display-unique-id').textContent = profile.unique_id || 'ONNOY-PENDING';
            
            const socialEl = document.getElementById('display-social');
            if (profile.social_link) {
                socialEl.href = profile.social_link;
                socialEl.style.display = 'flex';
            } else {
                socialEl.style.display = 'none';
            }
            
            if (profile.avatar_url) {
                document.getElementById('profile-avatar').src = profile.avatar_url;
            }

            // Populate Form
            document.getElementById('full_name').value = profile.full_name || '';
            document.getElementById('school_name').value = profile.school_name || '';
            document.getElementById('social_link').value = profile.social_link || '';

            // Calculate Progress from Supabase Data
            let localCompleted = [];
            let localOngoing = [];
            
            const allModules = window.ONNOY_TRACKABLE_MODULES || [];
            const userBadges = Array.isArray(profile.badges) ? profile.badges : [];
            const userStatus = profile.status || 'pending';

            if (userBadges.includes('guardian')) {
                // 3 badges = fully complete (9/9)
                localCompleted = allModules.map(m => m.title);
            } else if (userBadges.includes('aware')) {
                // 2 badges = completed till mission 3 (8/9)
                localCompleted = allModules.slice(0, 8).map(m => m.title);
                if (allModules.length > 8) localOngoing = [allModules[8].title];
            } else if (userBadges.includes('informed')) {
                // 1 badge = completed Level 1 (5/9) + missions based on status
                let completedCount = 5;
                if (userStatus === 'Mission4Unlocked') completedCount = 8;
                else if (userStatus === 'Mission3Unlocked') completedCount = 7;
                else if (userStatus === 'Mission2Unlocked') completedCount = 6;
                
                localCompleted = allModules.slice(0, completedCount).map(m => m.title);
                if (allModules.length > completedCount) localOngoing = [allModules[completedCount].title];
            } else {
                // 0 badges = track individual modules through supabase completed_modules
                const supaCompleted = profile.completed_modules || [];
                localCompleted = [...supaCompleted];
                
                // Find first ongoing module
                for (let item of allModules) {
                    if (!localCompleted.includes(item.title)) {
                        localOngoing = [item.title];
                        break;
                    }
                }
            }

            // Update Progress Ring
            const totalModules = window.ONNOY_TRACKABLE_MODULES ? window.ONNOY_TRACKABLE_MODULES.length : 9;
            const completedCount = localCompleted.length;
            const progressPercentage = Math.round((completedCount / totalModules) * 100);
            
            const progressPath = document.getElementById('progress-ring-path');
            const progressText = document.getElementById('progress-text');
            const progressDesc = document.getElementById('progress-desc');
            
            if (progressPath) {
                // stroke-dasharray is 100. Offset is 100 - percentage
                progressPath.style.strokeDashoffset = 100 - progressPercentage;
            }
            if (progressText) {
                progressText.textContent = `${progressPercentage}%`;
            }
            if (progressDesc) {
                progressDesc.textContent = `${completedCount} of ${totalModules} modules completed`;
            }

            // Render Arrays
            renderList('ongoing-modules-list', localOngoing, 'No ongoing modules.', true);
            renderList('completed-modules-list', localCompleted, 'No completed modules yet.', false);
            renderBadges(profile.badges);
        }
    }

    await loadProfile();

    // Handle Form Submit
    const form = document.getElementById('profile-form');
    const msg = document.getElementById('profile-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('save-profile-btn');
        btn.disabled = true;
        btn.textContent = 'Saving...';
        msg.textContent = '';
        msg.style.color = 'inherit';

        const updates = {
            full_name: document.getElementById('full_name').value,
            school_name: document.getElementById('school_name').value,
            social_link: document.getElementById('social_link').value,
            updated_at: new Date()
        };

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        btn.disabled = false;
        btn.textContent = 'Save Changes';

        if (error) {
            msg.textContent = 'Error updating profile: ' + error.message;
            msg.style.color = 'red';
        } else {
            msg.textContent = 'Profile updated successfully!';
            msg.style.color = 'var(--green)';
            document.getElementById('display-name').textContent = updates.full_name || 'Anonymous User';
            document.getElementById('display-school').textContent = updates.school_name || '';
            
            const socialEl = document.getElementById('display-social');
            if (updates.social_link) {
                socialEl.href = updates.social_link;
                socialEl.style.display = 'flex';
            } else {
                socialEl.style.display = 'none';
            }
            
            setTimeout(() => { msg.textContent = ''; }, 3000);
        }
    });

    // Handle Avatar Upload
    const avatarBtn = document.getElementById('avatar-btn');
    const avatarInput = document.getElementById('avatar-upload');

    avatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be less than 2MB.');
            return;
        }

        const ext = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${ext}`;

        // Upload to storage
        const avatarImg = document.getElementById('profile-avatar');
        const oldSrc = avatarImg.src;
        avatarImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50" y="50" dominant-baseline="middle" text-anchor="middle" font-size="20">...</text></svg>'; // Loading indicator

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image: ' + error.message);
            avatarImg.src = oldSrc;
            return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl, updated_at: new Date() })
            .eq('id', userId);

        if (updateError) {
            console.error('Profile update error:', updateError);
            alert('Failed to update profile with new image.');
            avatarImg.src = oldSrc;
        } else {
            avatarImg.src = publicUrl;
        }
    });

    // Helper Functions
    function renderList(elementId, items, emptyMsg, isOngoing) {
        const ul = document.getElementById(elementId);
        ul.innerHTML = '';
        
        if (!items || items.length === 0) {
            ul.innerHTML = `<li class="no-check" style="color: var(--text-muted); padding-left: 0; list-style: none; display: flex; align-items: center;"><svg width="16" height="16" fill="#e74c3c" viewBox="0 0 24 24" style="margin-right: 8px;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg> ${emptyMsg}</li>`;
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            if (isOngoing) {
                // Remove the checkmark for ongoing items
                li.className = 'no-check';
                li.style.setProperty('list-style', 'none');
                li.innerHTML = `<svg width="16" height="16" fill="var(--blue)" viewBox="0 0 24 24" style="margin-right: 8px;"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-4h2zm0-6h-2V6h2z"/></svg> ${item}`;
            }
            ul.appendChild(li);
        });
    }

    function renderBadges(badges) {
        const grid = document.getElementById('badges-grid');
        grid.innerHTML = '';

        if (!badges || badges.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted);">Complete missions to earn badges!</p>';
            return;
        }

        badges.forEach(badge => {
            const div = document.createElement('div');
            div.className = 'badge-item';
            div.innerHTML = `
                <img src="assets/images/badges/${badge.toLowerCase()}.png" alt="${badge} Badge" style="width: 48px; height: 48px; margin-bottom: 8px; object-fit: contain;">
                <span class="badge-name" style="font-weight: 600; text-transform: capitalize;">${badge}</span>
            `;
            grid.appendChild(div);
        });
    }
}
