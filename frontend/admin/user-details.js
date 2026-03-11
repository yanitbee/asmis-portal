// Helper to parse query params
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        list: params.get('list') // 'applicants', 'admins', 'vips'
    };
}

const API_BASE = 'http://localhost:5015/api';
const token = localStorage.getItem('token');
const loggedRole = localStorage.getItem('role');

if (!token) {
    window.location.href = 'login.html';
}

// Helper to decode JWT payload safely
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const tokenData = parseJwt(token);
// Prioritize role from token, fallback to localStorage
const userRole = (tokenData && tokenData.role) ? tokenData.role : loggedRole;

const params = getQueryParams();

// Setting Correct Back Link
const backBtn = document.getElementById('backBtn');
const dashLink = document.getElementById('dashLink');

if (userRole === 'super_admin') {
    backBtn.href = 'super-dashboard.html';
    if (dashLink) dashLink.href = 'super-dashboard.html';
} else {
    backBtn.href = 'dashboard.html';
    if (dashLink) dashLink.href = 'dashboard.html';
}

// Mock Data representing the ones in the dashboards since the API isn't fully integrated here for individual users yet
const mockData = {
    applicants: [
        { id:"1", full_name:"John Doe", email:"john@example.com", role:"Influencer", country:"Ethiopia", status:"pending" },
        { id:"2", full_name:"Sara Ali", email:"sara@example.com", role:"Speaker", country:"Kenya", status:"approved", qr_code:"#" },
        { id:"3", full_name:"Michael Chen", email:"michael@example.com", role:"Media", country:"China", status:"rejected" },
        { id:"4", full_name:" bogale getaneh", email:"sara@example.com", role:"Media", country:"ethiopia", status:"approved", qr_code:"#" },
        { id:"5", full_name:"something else", email:"sara@example.com", role:"Media", country:"nigeria", status:"approved", qr_code:"#" },
        { id:"6", full_name:"Alice Brown", email:"alice@example.com", role:"Speaker", country:"Ghana", status:"rejected" }
    ],
    admins: [
        { id: "1", username: "admin1", role: "Super Admin", created_date: "2026-01-15", status: "active" },
        { id: "2", username: "moderator1", role: "Moderator", created_date: "2026-02-01", status: "active" },
        { id: "3", username: "support1", role: "Support Admin", created_date: "2026-02-15", status: "active" },
        { id: "4", username: "manager1", role: "Event Manager", created_date: "2026-03-01", status: "active" }
    ],
    vips: [
        { id: "1", name: "vipbaby", email: "vipbaby@gmail.com", type: "VIP", registered_date: "2026-01-20", status: "active" },
        { id: "2", name: "Minister", email: "minister@gov.ng", type: "VIP", registered_date: "2026-02-05", status: "active" },
        { id: "3", name: "president", email: "president@techcorp.et", type: "VVIP", registered_date: "2026-02-12", status: "active" },
        { id: "4", name: "Ambassador", email: "ambassador@foreign.za", type: "VIP", registered_date: "2026-02-28", status: "active" },
        { id: "5", name: "p.m", email: "p.m@ministry.ng", type: "VVIP", registered_date: "2026-03-05", status: "active" }
    ]
};

let currentUser = null;

function loadUserDetails() {
    if (!params.id || !params.list) {
        showError('Missing User ID or List Type.');
        return;
    }

    // In a real scenario, this would be an API call: await fetch(`${API_BASE}/user/${params.id}`)
    // Fetch from mock data based on the requested list
    const listData = mockData[params.list];
    
    if (!listData) {
        showError('Invalid List Type.');
        return;
    }

    currentUser = listData.find(u => u.id === params.id);

    if (!currentUser) {
        showError('User not found.');
        return;
    }

    renderUser(currentUser, params.list);
}

function showError(msg) {
    document.getElementById('loadingMsg').textContent = msg;
    document.getElementById('loadingMsg').style.color = '#ff6b6b';
}

function renderUser(user, listType) {
    document.getElementById('loadingMsg').classList.add('hidden');
    document.getElementById('detailsCard').classList.remove('hidden');

    const name = user.full_name || user.name || user.username;
    const email = user.email || 'N/A';
    const role = user.role || user.type || 'N/A';
    const status = user.status || 'pending';
    const statusClass = status === 'active' ? 'approved' : status; 
    const date = user.created_date || user.registered_date || 'N/A';
    
    // Photo Section
    document.getElementById('userPhoto').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c29958&color=fff&size=200`;
    document.getElementById('photoName').textContent = name;
    document.getElementById('photoRole').textContent = role;
    
    const photoStatus = document.getElementById('photoStatus');
    photoStatus.textContent = status;
    photoStatus.className = `user-status-badge status-${statusClass}`;

    // Details Section
    document.getElementById('userNameTitle').textContent = name;
    document.getElementById('userListType').textContent = listType.toUpperCase() + ' DETAILS';
    
    document.getElementById('valId').textContent = user.id;
    document.getElementById('valEmail').textContent = email;
    document.getElementById('valRole').textContent = role;
    
    if (user.country) {
        document.getElementById('valCountry').textContent = user.country;
    } else {
        document.getElementById('countryContainer').style.display = 'none';
    }

    if (date !== 'N/A') {
        document.getElementById('valDate').textContent = date;
    } else {
        document.getElementById('dateContainer').style.display = 'none';
    }
    
    if (user.qr_code && user.qr_code !== '#') {
        const qrContainer = document.getElementById('qrContainer');
        qrContainer.style.display = 'block';
        document.getElementById('valQrLink').href = user.qr_code;
    }

    setupButtons(status, listType);
}

function setupButtons(status, listType) {
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');

    if (listType === 'applicants') {
        if (status === 'approved') {
            approveBtn.disabled = true;
            approveBtn.textContent = 'Already Approved';
            rejectBtn.textContent = 'Reject';
        } else if (status === 'rejected') {
            rejectBtn.disabled = true;
            rejectBtn.textContent = 'Already Rejected';
            approveBtn.textContent = 'Approve';
        } else {
            approveBtn.textContent = 'Approve';
            rejectBtn.textContent = 'Reject';
        }
    } else {
        // For Admins and VIPs, typically just Delete logic as per dashboard.js
        approveBtn.style.display = 'none';
        rejectBtn.textContent = `Delete ${listType.slice(0, -1).toUpperCase()}`;
        rejectBtn.onclick = () => handleAction('delete');
    }
}

async function handleAction(action) {
    if (!currentUser) return;
    
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    
    // Disable buttons during "API call"
    approveBtn.disabled = true;
    rejectBtn.disabled = true;

    try {
        if (params.list === 'applicants') {
            // Using the real API endpoints defined in dashboard.js
            // Even though we rendered from mock, try to hit API if user wants real action
            // Note: Since dashboard.js has a mix of mock rendering and real fetch calls for actions, 
            // we will simulate the real fetch calls here.
            
            const url = action === 'approve' ? `${API_BASE}/admin/approve/${currentUser.id}` : `${API_BASE}/admin/reject/${currentUser.id}`;
            const remark = `Modified from User Details Page`;

            // Wait a sec to simulate API call since the dashboard currently alerts "demo" for super admin or actually fetches
            // Below is the real fetch logic, we wrap it in a try-catch
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ remark })
                });

                if (response.ok) {
                    alert(`Applicant successfully ${action}d!`);
                    // Update local mock state for UI consistency
                    currentUser.status = action === 'approve' ? 'approved' : 'rejected';
                    renderUser(currentUser, params.list);
                } else {
                    // Fallback to demo alert if API fails (common in this demo setup)
                    throw new Error("API call failed, running demo mode");
                }
            } catch (err) {
                // Demo mode fallback
                alert(`[DEMO] Applicant ${action}d!`);
                currentUser.status = action === 'approve' ? 'approved' : 'rejected';
                renderUser(currentUser, params.list);
            }
        } else {
            // Admin / VIP delete action
            if (confirm(`Are you sure you want to delete this ${params.list.slice(0,-1)}?`)) {
                 // Demo mode fallback
                 alert(`[DEMO] ${params.list.slice(0,-1)} deleted!`);
                 window.location.href = backBtn.href;
            } else {
                // Re-enable if cancelled
                 setupButtons(currentUser.status, params.list);
            }
        }
    } catch (e) {
        alert("An error occurred performing this action.");
        setupButtons(currentUser.status, params.list);
    }
}

// Init
loadUserDetails();
