const listEl = document.getElementById('applicantList');
const totalEl = document.getElementById('totalApplicants');
const approvedEl = document.getElementById('approvedCount');
const pendingEl = document.getElementById('pendingCount');
const rejectedEl = document.getElementById('rejectedCount');
const vipEl = document.getElementById('vipCount');
const vipStatsEl = document.getElementById('vipStats');

const API_BASE = 'http://localhost:5000/api';

// Check if logged in and role
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
if (!token) {
    window.location.href = 'login.html';
}


const setupDashboardByRole = () => {

    if (role === "admin") {

        // Hide super admin features
        document.getElementById("adminSection").style.display = "none";
        document.getElementById("vipSection").style.display = "none";
        document.getElementById("vipStats").style.display = "none";

        document.querySelector("h1").textContent = "Admin Dashboard";

    }

    if (role === "super_admin") {

        // Show super admin features
        document.getElementById("adminSection").style.display = "block";
        document.getElementById("vipSection").style.display = "block";
        document.getElementById("vipStats").style.display = "block";

        document.querySelector("h1").textContent = "Super Admin Dashboard";

        // Load extra data
        fetchAdmins();
        fetchVIPs();
    }
};
const applyRoleBasedUI = () => {
    if (!document.querySelector('aside h3')) {
        setTimeout(applyRoleBasedUI, 100);
        return;
    }
    if (role === 'super_admin') {
        document.title = 'Super Admin Dashboard | ASMIS';
        document.querySelector('h1').textContent = 'Super Admin Dashboard';
        document.querySelector('aside h3').textContent = 'ASMIS SUPER ADMIN';
        // Add super admin menu items
      const menu = document.querySelector("aside ul");

if (role === "admin") {

    menu.innerHTML = `
        <li><a href="dashboard.html" class="active">Applicants</a></li>
        <li><a href="scan.html">Scan QR</a></li>
        <li><a href="../news.html">Public News</a></li>
        <li><a href="../media.html">Public Gallery</a></li>
    `;

}

if (role === "super_admin") {

    menu.innerHTML = `
        <li><a href="dashboard.html" class="active">Dashboard</a></li>
        <li><a href="#" onclick="openModal('adminModal')">Admin Management</a></li>
        <li><a href="#" onclick="openModal('vipModal')">VIP/VVIP Registration</a></li>
        <li><a href="upload-content.html">Upload Content</a></li>
        <li><a href="scan.html">Scan QR</a></li>
        <li><a href="../news.html">Public News</a></li>
        <li><a href="../media.html">Public Gallery</a></li>
    `;

}
        // Show super admin sections
        document.getElementById('adminSection').style.display = 'block';
        document.getElementById('vipSection').style.display = 'block';
        vipStatsEl.style.display = 'block';
        
        // Load admin and VIP data
        fetchAdmins();
        fetchVIPs();
    } else {
        // Regular admin
        document.title = 'Admin Dashboard | ASMIS';
        document.querySelector('h1').textContent = 'Manage Applicants';
        document.querySelector('aside h3').textContent = 'ASMIS ADMIN';
        // Hide super admin sections
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('vipSection').style.display = 'none';
    }
};

// Apply initial role-based UI
applyRoleBasedUI();

/*const fetchApplicants = async () => {
    if (!listEl) {
        console.error('applicantList element not found');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/admin/applicants`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = 'login.html';
            return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        totalEl.innerText = data.length;
        const approved = data.filter(app => app.status === 'approved').length;
        const pending = data.filter(app => app.status === 'pending').length;
        const rejected = data.filter(app => app.status === 'rejected').length;
        const vip = data.filter(app => app.status === 'vip').length;
        approvedEl.innerText = approved;
        pendingEl.innerText = pending;
        rejectedEl.innerText = rejected;
        if (vipEl) vipEl.innerText = vip;

        listEl.innerHTML = data.map(app => `
            <tr>
                <td>${app.full_name}<br><small style="color: #666;">${app.email}</small></td>
                <td>${app.role}</td>
                <td>${app.country}</td>
                <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                <td>
                    ${app.status === 'pending' || (role === 'super_admin' && (app.status === 'approved' || app.status === 'vip')) ?
            `<button class="premium-button" style="padding: 6px 12px; font-size: 0.7rem;" onclick="approve('${app.id}')">Approve</button>
             <button class="reject-button" style="padding: 6px 12px; font-size: 0.7rem; margin-left: 5px;" onclick="reject('${app.id}')">Reject</button>` :
            app.qr_code ? `<a href="${app.qr_code}" download="qr_${app.full_name}.png" style="color: var(--primary); text-decoration: none; font-size: 0.8rem;">Download QR</a>` : ''
        }
                </td>
            </tr>
        `).join('');

        // Create pie chart
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        const pieLabels = ['Approved', 'Pending', 'Rejected'];
        const pieData = [approved, pending, rejected];
        if (role === 'super_admin') {
            pieLabels.push('VIP');
            pieData.push(vip);
        }
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: pieLabels,
                datasets: [{
                    label: 'Number of Applicants',
                    data: pieData,
                    backgroundColor: [
                        '#f5b53c85',
                        '#FFFFFF',
                        '#e74c3c85',
                        ...(role === 'super_admin' ? ['#9b59b685'] : [])
                    ],
                    borderColor: [
                        '#000000',
                        '#000000',
                        '#000000',
                        ...(role === 'super_admin' ? ['#000000'] : [])
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 11,
                                weight: 'bold'
                            },
                            padding: 10
                        }
                    }
                }
            }
        });

        // Create bar chart
        const barCtx = document.getElementById('barChart').getContext('2d');
        const barLabels = ['Approved', 'Pending', 'Rejected'];
        const barData = [approved, pending, rejected];
        const barColors = [
            'rgba(46, 204, 113, 0.5)',
            'rgba(194, 153, 88, 0.5)',
            'rgba(231, 76, 60, 0.5)'
        ];
        const barBorderColors = [
            'rgba(46, 204, 113, 1)',
            'rgba(194, 153, 88, 1)',
            'rgba(231, 76, 60, 1)'
        ];
        if (role === 'super_admin') {
            barLabels.push('VIP');
            barData.push(vip);
            barColors.push('rgba(155, 89, 182, 0.5)');
            barBorderColors.push('rgba(155, 89, 182, 1)');
        }
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: 'Number of Applicants',
                    data: barData,
                    backgroundColor: barColors,
                    borderColor: barBorderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#FFFFFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#FFFFFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 11,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Failed to fetch applicants:', err);
        alert('Failed to load applicants');
    }

    // Apply role-based UI after data is loaded
    applyRoleBasedUI();
}; 
*/
const fetchApplicants = () => {

const data = [
{
id:"1",
full_name:"John Doe",
email:"john@example.com",
role:"Influencer",
country:"Ethiopia",
status:"pending"
},
{
id:"2",
full_name:"Sara Ali",
email:"sara@example.com",
role:"Speaker",
country:"Kenya",
status:"approved"
},
{
id:"3",
full_name:"Michael Chen",
email:"michael@example.com",
role:"Media",
country:"China",
status:"rejected"
}


];

totalEl.innerText = data.length;

const approved = data.filter(app => app.status === 'approved').length;
const pending = data.filter(app => app.status === 'pending').length;
const rejected = data.filter(app => app.status === 'rejected').length;

approvedEl.innerText = approved;
pendingEl.innerText = pending;
rejectedEl.innerText = rejected;

listEl.innerHTML = data.map(app => `
<tr>
<td>${app.full_name}<br><small>${app.email}</small></td>
<td>${app.role}</td>
<td>${app.country}</td>
<td><span class="status-badge status-${app.status}">${app.status}</span></td>
<td>
<button onclick="approve('${app.id}')">Approve</button>
<button onclick="reject('${app.id}')">Reject</button>
</td>
</tr>
`).join('');

 // Create pie chart
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        const pieLabels = ['Approved', 'Pending', 'Rejected'];
        const pieData = [approved, pending, rejected];
        if (role === 'super_admin') {
            pieLabels.push('VIP');
            pieData.push(vip);
        }
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: pieLabels,
                datasets: [{
                    label: 'Number of Applicants',
                    data: pieData,
                    backgroundColor: [
                        '#f5b53c85',
                        '#FFFFFF',
                        '#e74c3c85',
                        ...(role === 'super_admin' ? ['#9b59b685'] : [])
                    ],
                    borderColor: [
                        '#000000',
                        '#000000',
                        '#000000',
                        ...(role === 'super_admin' ? ['#000000'] : [])
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 11,
                                weight: 'bold'
                            },
                            padding: 10
                        }
                    }
                }
            }
        });

        // Create bar chart
        const barCtx = document.getElementById('barChart').getContext('2d');
        const barLabels = ['Approved', 'Pending', 'Rejected'];
        const barData = [approved, pending, rejected];
        const barColors = [
            '#2ecc7180',
            'rgba(194, 153, 88, 0.5)',
            'rgba(231, 76, 60, 0.5)'
        ];
        const barBorderColors = [
            'rgba(46, 204, 113, 1)',
            'rgba(194, 153, 88, 1)',
            'rgba(231, 76, 60, 1)'
        ];
        if (role === 'super_admin') {
            barLabels.push('VIP');
            barData.push(vip);
            barColors.push('rgba(155, 89, 182, 0.5)');
            barBorderColors.push('rgba(155, 89, 182, 1)');
        }
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: 'Number of Applicants',
                    data: barData,
                    backgroundColor: barColors,
                    borderColor: barBorderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#FFFFFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#FFFFFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 11,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
};
window.approve = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/admin/approve/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ remark: 'Approved via dashboard' })
        });
        if (response.ok) {
            alert('Applicant approved');
            fetchApplicants();
        } else {
            alert('Approval failed');
        }
    } catch (err) {
        alert('Approval failed');
    }
};

window.reject = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/admin/reject/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ remark: 'Rejected via dashboard' })
        });
        if (response.ok) {
            alert('Applicant rejected');
            fetchApplicants();
        } else {
            alert('Rejection failed');
        }
    } catch (err) {
        alert('Rejection failed');
    }
};

fetchApplicants();

// Modal functions
window.openModal = (modalId) => {
    document.getElementById(modalId).style.display = 'block';
};

window.closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
};

// Super admin functions
window.createAdmin = () => {
    const username = document.getElementById('newAdmin').value;
    const password = document.getElementById('newPassword').value;
    if (username && password) {
        alert(`Admin ${username} created (demo)`);
        closeModal('adminModal');
        fetchAdmins(); // Refresh the admin list
    } else {
        alert('Please fill in both fields');
    }
};

window.registerVIP = () => {
    const name = document.getElementById('vipName').value;
    const email = document.getElementById('vipEmail').value;
    const type = document.getElementById('vipType').value;
    if (name && email) {
        alert(`${type} ${name} registered (demo)`);
        closeModal('vipModal');
        fetchVIPs(); // Refresh the VIP list
    } else {
        alert('Please fill in all fields');
    }
};

// Admin data and functions
const adminData = [
    {
        id: "1",
        username: "admin1",
        role: "Super Admin",
        created_date: "2026-01-15",
        status: "active"
    },
    {
        id: "2",
        username: "moderator1",
        role: "Moderator",
        created_date: "2026-02-01",
        status: "active"
    },
    {
        id: "3",
        username: "support1",
        role: "Support Admin",
        created_date: "2026-02-15",
        status: "active"
    },
    {
        id: "4",
        username: "manager1",
        role: "Event Manager",
        created_date: "2026-03-01",
        status: "active"
    }
];

const fetchAdmins = () => {
    const adminListEl = document.getElementById('adminList');
    const adminCountEl = document.getElementById('adminCount');
    
    if (!adminListEl || !adminCountEl) return;
    
    const admins = adminData;
    adminCountEl.textContent = `(${admins.length} total)`;

    adminListEl.innerHTML = admins.map(admin => `
        <tr>
            <td>${admin.username}</td>
            <td>${admin.role}</td>
            <td>${admin.created_date}</td>
            <td><span class="status-badge status-${admin.status}">${admin.status}</span></td>
            <td>
                <button class="reject-button" style="padding: 4px 8px; font-size: 0.6rem;" onclick="deleteAdmin('${admin.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
};

window.deleteAdmin = (id) => {
    if (confirm('Are you sure you want to delete this admin?')) {
        const index = adminData.findIndex(admin => admin.id === id);
        if (index > -1) {
            adminData.splice(index, 1);
            fetchAdmins();
            alert('Admin deleted successfully');
        }
    }
};

// VIP data and functions
const vipData = [
    {
        id: "1",
        name: "vipbaby",
        email: "vipbaby@gmail.com",
        type: "VIP",
        registered_date: "2026-01-20",
        status: "active"
    },
    {
        id: "2",
        name: "Minister",
        email: "minister@gov.ng",
        type: "VIP",
        registered_date: "2026-02-05",
        status: "active"
    },
    {
        id: "3",
        name: "president",
        email: "president@techcorp.et",
        type: "VVIP",
        registered_date: "2026-02-12",
        status: "active"
    },
    {
        id: "4",
        name: "Ambassador",
        email: "ambassador@foreign.za",
        type: "VIP",
        registered_date: "2026-02-28",
        status: "active"
    },
    {
        id: "5",
        name: "p.m",
        email: "p.m@ministry.ng",
        type: "VVIP",
        registered_date: "2026-03-05",
        status: "active"
    }
];


const fetchVIPs = () => {
    const vipListEl = document.getElementById('vipList');
    const vipCountEl = document.getElementById('vipCount');
    
    if (!vipListEl || !vipCountEl) return;
    
    const vips = vipData;
    vipCountEl.textContent = `(${vips.length} total)`;

    vipListEl.innerHTML = vips.map(vip => `
        <tr>
            <td>${vip.name}</td>
            <td>${vip.email}</td>
            <td>${vip.type}</td>
            <td>${vip.registered_date}</td>
            <td><span class="status-badge status-${vip.status}">${vip.status}</span></td>
            <td>
                <button class="reject-button" style="padding: 4px 8px; font-size: 0.6rem;" onclick="deleteVIP('${vip.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
};

window.deleteVIP = (id) => {
    if (confirm('Are you sure you want to remove this VIP?')) {
        const index = vipData.findIndex(vip => vip.id === id);
        if (index > -1) {
            vipData.splice(index, 1);
            fetchVIPs();
            alert('VIP removed successfully');
        }
    }
};
setupDashboardByRole();
fetchApplicants();