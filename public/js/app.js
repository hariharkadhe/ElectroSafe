const API_URL = '/api/complaints';

// --- TRANSLATIONS ---
// --- TRANSLATIONS ---
const translations = {
    en: {
        // Nav
        nav_home: "Home",
        nav_register: "Register Complaint",
        nav_track: "Track Status",
        nav_admin: "Admin",

        // Home
        hero_title: "Village Electricity Grievance Portal",
        hero_subtitle: "Fast, Transparent, and Efficient Resolution of Electricity Issues.",
        btn_file_complaint: "File a Complaint",
        track_title: "Track Your Complaint",
        track_placeholder: "Enter Complaint ID (e.g., CMS-1234)",
        btn_check_status: "Check Status",
        btn_clear: "Clear",
        recent_updates: "Recent Updates",
        recent_msg: "We are currently resolving issues in Rampur and Sonpur villages. Expected resolution time: 4 Hours.",

        // Complaint Form
        reg_title: "Register New Complaint",
        reg_subtitle: "Please provide accurate details for quick resolution.",
        lbl_action_type: "Action Type",
        opt_personal: "Personal Complaint",
        opt_anonymous: "Anonymous Report (Theft/Illegal)",
        lbl_fullname: "Full Name",
        lbl_mobile: "Mobile Number",
        ph_mobile: "10-digit number",
        lbl_email: "Email Address",
        ph_email: "example@mail.com",
        lbl_district: "District",
        ph_district: "e.g. Nashik",
        lbl_village: "Village/Area",
        ph_village: "e.g. Rampur",
        lbl_category: "Complaint Category",
        opt_select_issue: "Select Issue",
        cat_no_power: "No electricity (Power Cut)",
        cat_low_voltage: "Low voltage / Fluctuation",
        cat_transformer: "Transformer Damage/Sparks",
        cat_streetlight: "Street light not working",
        cat_wire: "Wire broken / Fallen Pole",
        cat_theft: "Electricity Theft",
        lbl_description: "Description",
        ph_description: "Describe the issue in detail...",
        lbl_photo: "Upload Photo (Optional)",
        btn_submit: "Submit Complaint"
    },
    hi: {
        // Nav
        nav_home: "मुखपृष्ठ",
        nav_register: "शिकायत दर्ज करें",
        nav_track: "स्थिति देखें",
        nav_admin: "एडमिन",

        // Home
        hero_title: "ग्राम विद्युत शिकायत पोर्टल",
        hero_subtitle: "बिजली समस्याओं का तेज, पारदर्शी और कुशल समाधान।",
        btn_file_complaint: "शिकायत दर्ज करें",
        track_title: "शिकायत की स्थिति देखें",
        track_placeholder: "शिकायत आईडी दर्ज करें (जैसे, CMS-1234)",
        btn_check_status: "स्थिति जांचें",
        btn_clear: "साफ़ करें",
        recent_updates: "हाल के अपडेट",
        recent_msg: "हम वर्तमान में रामपुर और सोनपुर गांवों में समस्याओं का समाधान कर रहे हैं। अपेक्षित समय: 4 घंटे।",

        // Complaint Form
        reg_title: "नई शिकायत दर्ज करें",
        reg_subtitle: "त्वरित समाधान के लिए सटीक जानकारी प्रदान करें।",
        lbl_action_type: "शिकायत का प्रकार",
        opt_personal: "व्यक्तिगत शिकायत",
        opt_anonymous: "गुप्त रिपोर्ट (चोरी / अवैध)",
        lbl_fullname: "पूरा नाम",
        lbl_mobile: "मोबाइल नंबर",
        ph_mobile: "10 अंकों का नंबर",
        lbl_email: "ईमेल पता",
        ph_email: "उदाहरण@mail.com",
        lbl_district: "ज़िला",
        ph_district: "जैसे, नाशिक",
        lbl_village: "गाँव / क्षेत्र",
        ph_village: "जैसे, रामपुर",
        lbl_category: "शिकायत की श्रेणी",
        opt_select_issue: "समस्या चुनें",
        cat_no_power: "बिजली नहीं है (Power Cut)",
        cat_low_voltage: "कम वोल्टेज / उतार-चढ़ाव",
        cat_transformer: "ट्रांसफार्मर खराब / चिंगारी",
        cat_streetlight: "स्ट्रीट लाइट खराब",
        cat_wire: "तार टूटा हुआ / खंभा गिरा",
        cat_theft: "बिजली चोरी",
        lbl_description: "विवरण",
        ph_description: "समस्या का विस्तार से वर्णन करें...",
        lbl_photo: "फोटो अपलोड करें (वैकल्पिक)",
        btn_submit: "शिकायत जमा करें"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

// --- DARK MODE & LANGUAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        updateIcon(true);
    }
    // Apply saved language
    applyLanguage(currentLang);
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcon(isDark);
}

function updateIcon(isDark) {
    const icon = document.querySelector('.fab .fa-moon');
    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('lang', currentLang);
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    const t = translations[lang];

    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerText = t[key];
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
}

// --- PDF RECEIPT GENERATION ---
async function downloadReceipt(complaintData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(0, 86, 179); // Blue
    doc.text("ElectroSafe - Complaint Receipt", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Complaint ID: ${complaintData.complaintId}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Category: ${complaintData.category}`, 20, 60);
    doc.text(`Village: ${complaintData.village}`, 20, 70);
    doc.text(`Status: Pending`, 20, 80);

    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(10);
    doc.text("Thank you for reporting. You can track your status online.", 20, 100);

    doc.save(`Receipt-${complaintData.complaintId}.pdf`);
}


// --- MAIN LOGIC (UNCHANGED MOSTLY) ---

// Handle Complaint Verification
async function trackComplaint() {
    const id = document.getElementById('trackId').value.trim();
    if (!id) return alert("Please enter a Complaint ID");

    const resultDiv = document.getElementById('statusResult');
    resultDiv.innerHTML = '<p>Loading...</p>';
    resultDiv.style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (data.success) {
            const c = data.data;
            let statusClass = 'status-pending';
            if (c.status === 'Resolved') statusClass = 'status-resolved';

            resultDiv.innerHTML = `
                <div style="background: ${document.body.classList.contains('dark-mode') ? '#333' : '#f8f9fa'}; padding: 15px; border-left: 4px solid var(--primary-color);">
                    <h3>ID: ${c.complaintId}</h3>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${c.status}</span></p>
                    <p><strong>Category:</strong> ${c.category}</p>
                    <p><strong>Village:</strong> ${c.village}</p>
                    <p><strong>Date:</strong> ${new Date(c.createdAt).toLocaleDateString()}</p>
                    ${c.assignedTo ? `<p><strong>Technician:</strong> ${c.assignedTo}</p>` : ''}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<p style="color: red;">Error processing request</p>`;
    }
}

function clearStatus() {
    document.getElementById('trackId').value = '';
    document.getElementById('statusResult').style.display = 'none';
    document.getElementById('statusResult').innerHTML = '';
}

// Handle Form Submission
const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = complaintForm.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Submitting...';
        submitBtn.disabled = true;

        const isAnon = document.getElementById('anonymous').value === 'true';

        const formData = {
            anonymous: isAnon,
            district: document.getElementById('district').value,
            village: document.getElementById('village').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
        };

        if (!isAnon) {
            formData.name = document.getElementById('name').value;
            formData.mobile = document.getElementById('mobile').value;
            formData.email = document.getElementById('email').value;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Ask to download receipt
                if (confirm(`Complaint Registered! ID: ${data.data.complaintId}\n\nDo you want to download the receipt?`)) {
                    await downloadReceipt(data.data);
                }

                window.location.href = 'index.html#track';
            } else {
                alert('Failed to register complaint');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting form');
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
