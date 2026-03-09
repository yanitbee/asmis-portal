const listEl = document.getElementById('applicantList');
const totalEl = document.getElementById('totalApplicants');
const approvedEl = document.getElementById('approvedCount');
const pendingEl = document.getElementById('pendingCount');

// Admin elements
const adminListEl = document.getElementById('adminList');
const adminCountEl = document.getElementById('adminCount');

// VIP elements
const vipListEl = document.getElementById('vipList');
const vipCountEl = document.getElementById('vipCount');

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
full_name:"olatunde oladeji",
email:"sara@example.com",
role:"Media",
country:"nigeria",
status:"approved",
qr_code:"#"
},
{
id:"3",
full_name:"ayelech bergasa",
email:"david@example.com",
role:"Sponsor",
country:"Ghana",
status:"pending"
},
{
id:"4",
full_name:" bogale getaneh",
email:"sara@example.com",
role:"Media",
country:"ethiopia",
status:"approved",
qr_code:"#"
},
{
id:"5",
full_name:"something else",
email:"sara@example.com",
role:"Media",
country:"nigeria",
status:"approved",
qr_code:"#"
}
];

totalEl.innerText = data.length;
const approved = data.filter(app => app.status === 'approved').length;
const pending = data.filter(app => app.status === 'pending').length;
approvedEl.innerText = approved;
pendingEl.innerText = pending;

listEl.innerHTML = data.map(app => `
<tr>
<td>${app.full_name}<br><small style="color: #666;">${app.email}</small></td>
<td>${app.role}</td>
<td>${app.country}</td>
<td><span class="status-badge status-${app.status}">${app.status}</span></td>
<td>
${app.status === 'pending'
? `<button class="premium-button" style="padding: 6px 12px; font-size: 0.7rem;" onclick="approve('${app.id}')">Approve</button>`
: `<a href="${app.qr_code}" download="qr_${app.full_name}.png" style="color: var(--primary); text-decoration: none; font-size: 0.8rem;">Download QR</a>`
}
</td>
</tr>
`).join('');

// Create pie chart
const pieCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Approved', 'Pending'],
        datasets: [{
            label: 'Number of Applicants',
            data: [approved, pending],
            backgroundColor: [
                '#f5b53c85',
                '#FFFFFF'
            ],
            borderColor: [
                '#000000',
                '#000000'
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
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Approved', 'Pending'],
        datasets: [{
            label: 'Number of Applicants',
            data: [approved, pending],
            backgroundColor: [
                'rgba(46, 204, 113, 0.5)',
                'rgba(194, 153, 88, 0.5)'
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(194, 153, 88, 1)'
            ],
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
    alert("Applicant approved (demo)");
    fetchApplicants();
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
    const admins = adminData;
    adminCountEl.textContent = `(${admins.length} total)`;

    adminListEl.innerHTML = admins.map(admin => `
        <tr>
            <td>${admin.username}</td>
            <td>${admin.role}</td>
            <td>${admin.created_date}</td>
            <td>
                <span class="status-badge status-${admin.status === 'active' ? 'approved' : 'pending'}">
                    ${admin.status}
                </span>
            </td>
            <td>
                <button class="btn" onclick="deleteAdmin('${admin.id}', '${admin.username}')">
                    <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                        <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
};

window.deleteAdmin = async (id, username) => {
    if (confirm(`Are you sure you want to delete admin "${username}"? This action cannot be undone.`)) {
        // Remove admin from data array
        const index = adminData.findIndex(admin => admin.id === id);
        if (index > -1) {
            adminData.splice(index, 1);
        }
        alert(`Admin "${username}" has been deleted (demo)`);
        fetchAdmins();
    }
};

function createAdmin() {
    const username = document.getElementById('newAdmin').value;
    const password = document.getElementById('newPassword').value;
    if (username && password) {
        // Add new admin to the data array
        const newAdmin = {
            id: Date.now().toString(), // Simple ID generation
            username: username,
            role: "Admin", // Default role
            created_date: new Date().toISOString().split('T')[0], // Today's date
            status: "active"
        };
        adminData.push(newAdmin);

        alert(`Admin ${username} created (demo)`);
        document.getElementById('newAdmin').value = '';
        document.getElementById('newPassword').value = '';
        closeModal('adminModal');
        fetchAdmins(); // Refresh the admin list
    } else {
        alert('Please fill in both fields');
    }
}

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
    const vips = vipData;
    vipCountEl.textContent = `(${vips.length} total)`;

    vipListEl.innerHTML = vips.map(vip => `
        <tr>
            <td>${vip.name}</td>
            <td>${vip.email}</td>
            <td>
                <span class="status-badge ${vip.type === 'VVIP' ? 'status-approved' : 'status-pending'}">
                    ${vip.type}
                </span>
            </td>
            <td>${vip.registered_date}</td>
            <td>
                <span class="status-badge status-${vip.status === 'active' ? 'approved' : 'pending'}">
                    ${vip.status}
                </span>
            </td>
            <td>
                <button class="btn" onclick="deleteVIP('${vip.id}', '${vip.name}')">
                    <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                        <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
};

window.deleteVIP = async (id, name) => {
    if (confirm(`Are you sure you want to delete VIP "${name}"? This action cannot be undone.`)) {
        // Remove VIP from data array
        const index = vipData.findIndex(vip => vip.id === id);
        if (index > -1) {
            vipData.splice(index, 1);
        }
        alert(`VIP "${name}" has been deleted (demo)`);
        fetchVIPs();
    }
};

function registerVIP() {
    const name = document.getElementById('vipName').value;
    const email = document.getElementById('vipEmail').value;
    const type = document.getElementById('vipType').value;
    if (name && email) {
        // Add new VIP to the data array
        const newVIP = {
            id: Date.now().toString(), // Simple ID generation
            name: name,
            email: email,
            type: type,
            registered_date: new Date().toISOString().split('T')[0], // Today's date
            status: "active"
        };
        vipData.push(newVIP);

        alert(`${type} participant ${name} registered (demo)`);
        document.getElementById('vipName').value = '';
        document.getElementById('vipEmail').value = '';
        closeModal('vipModal');
        fetchVIPs(); // Refresh the VIP list
    } else {
        alert('Please fill in name and email');
    }
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

fetchApplicants();
fetchAdmins();
fetchVIPs();