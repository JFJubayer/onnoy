// Supabase Initialization for Onnoy-অন্বয়
// You can hardcode your Supabase URL and Anon Key here,
// or set them dynamically in the browser console via:
// localStorage.setItem('SUPABASE_URL', 'your-url')
// localStorage.setItem('SUPABASE_ANON_KEY', 'your-anon-key')

const getStorageOrFallback = (key, fallback) => {
    try {
        const val = localStorage.getItem(key);
        if (val && val !== "YOUR_SUPABASE_URL" && val !== "YOUR_SUPABASE_ANON_KEY" && val.trim() !== "" && val !== "null" && val !== "undefined") {
            return val;
        }
    } catch (e) {}
    return fallback;
};

const SUPABASE_URL = getStorageOrFallback('SUPABASE_URL', "https://rsjrcpfszcmniyylmhev.supabase.co");
const SUPABASE_ANON_KEY = getStorageOrFallback('SUPABASE_ANON_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzanJjcGZzemNtbml5eWxtaGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3ODEzMDMsImV4cCI6MjA5ODM1NzMwM30.VODUmfl6b_IFmmTcm3BoQ2fzAGacyqo7EslmFdpRssg");

window.supabaseClient = null;

try {
    if (typeof supabase !== 'undefined') {
        if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
            window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            console.warn(
                "Supabase is not fully configured. Please edit 'assets/js/supabase-init.js' " +
                "and set your actual SUPABASE_URL and SUPABASE_ANON_KEY.\n\n" +
                "Alternatively, for local testing, run this in your browser console:\n" +
                "localStorage.setItem('SUPABASE_URL', 'https://your-project.supabase.co');\n" +
                "localStorage.setItem('SUPABASE_ANON_KEY', 'your-anon-key-here');\n" +
                "And then reload the page."
            );
        }
    } else {
        console.error("Supabase library (CDN) is not loaded on this page.");
    }
} catch (e) {
    console.error("Error initializing Supabase client:", e);
}
