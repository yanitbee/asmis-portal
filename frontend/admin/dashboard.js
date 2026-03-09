const listEl = document.getElementById('applicantList');
const totalEl = document.getElementById('totalApplicants');
const approvedEl = document.getElementById('approvedCount');
const pendingEl = document.getElementById('pendingCount');

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
            ${app.status === 'pending' ?
        `<button class="premium-button" style="padding: 6px 12px; font-size: 0.7rem;" onclick="approve('${app.id}')">Approve</button>` :
        `<a href="${app.qr_code}" download="qr_${app.full_name}.png" style="color: var(--primary); text-decoration: none; font-size: 0.8rem;">Download QR</a>`
    }
        </td>
    </tr>
`).join('');

// Create chart
const ctx = document.getElementById('statusChart').getContext('2d');
new Chart(ctx, {
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
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
};

window.approve = async (id) => {
    alert("Applicant approved (demo)");
    fetchApplicants();
};

fetchApplicants();
