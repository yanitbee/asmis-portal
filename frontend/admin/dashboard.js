const listEl = document.getElementById('applicantList');
const totalEl = document.getElementById('totalApplicants');

const fetchApplicants = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/applicants');
        const data = await response.json();

        totalEl.innerText = data.length;
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
    } catch (err) {
        console.error('Failed to fetch applicants');
    }
};

window.approve = async (id) => {
    if (!confirm('Approve this applicant and generate QR code?')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ remark: 'Approved by Admin' })
        });

        if (response.ok) {
            alert('Applicant approved and QR code generated!');
            fetchApplicants();
        }
    } catch (err) {
        alert('Approval failed');
    }
};

fetchApplicants();
