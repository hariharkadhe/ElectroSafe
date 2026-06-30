const API_URL = '/api/complaints';

// --- TRANSLATIONS ---
const translations = {
    en: {
        title: "Village Electricity Grievance Portal",
        subtitle: "Fast, Transparent, and Efficient Resolution of Electricity Issues.",
        registerBtn: "Register Complaint",
        trackBtn: "Track Status",
        home: "Home",
        admin: "Admin",
        trackTitle: "Track Your Complaint",
        recentUpdates: "Recent Updates"
    },
    hi: {
        title: "ग्राम विद्युत शिकायत पोर्टल",
        subtitle: "बिजली समस्याओं का तेज, पारदर्शी और कुशल समाधान।",
        registerBtn: "शिकायत दर्ज करें",
        trackBtn: "स्थिति देखें",
        home: "मुखपृष्ठ",
        admin: "एडमिन",
        trackTitle: "शिकायत की स्थिति देखें",
        recentUpdates: "हाल के अपडेट"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

// --- DARK MODE & LANGUAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme on load — default is DARK
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme === 'dark');
    // Apply saved language
    applyLanguage(currentLang);
});

function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#0a0e1a';
        document.body.style.color = '#e8edf5';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.style.backgroundColor = '#f0f4ff';
        document.body.style.color = '#1a1f36';
    }
    updateIcon(isDark);
}

function updateIcon(isDark) {
    // Find the moon/sun icon inside any FAB button
    const icon = document.querySelector('.fab i.fa-moon, .fab i.fa-sun');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('lang', currentLang);
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    const t = translations[lang];
    // Simple verification to see if we are on homepage to translate specific IDs
    // In a full app, we would use data-i18n attributes
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) heroH1.innerText = t.title;

    const heroP = document.querySelector('.hero p');
    if (heroP) heroP.innerText = t.subtitle;

    // More manual mapping for demo purposes...
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
