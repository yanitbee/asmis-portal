const scanBtn = document.getElementById('scanBtn');
const resultCard = document.getElementById('resultCard');

scanBtn.addEventListener('click', async () => {
    const rawData = document.getElementById('manualId').value;
    let id = rawData;

    // Attempt to parse JSON if it's the full QR data
    try {
        const parsed = JSON.parse(rawData);
        id = parsed.id;
    } catch (e) {
        // Assume it's a raw ID
    }

    if (!id) return alert('Please enter data');

    try {
        const response = await fetch(`http://localhost:5000/api/admin/verify-qr/${id}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('resName').innerText = data.full_name;
            document.getElementById('resRole').innerText = data.role;
            document.getElementById('resCountry').innerText = data.country;
            document.getElementById('resStatus').innerText = 'Access Granted';
            document.getElementById('resStatus').style.color = 'var(--accent)';
            resultCard.style.display = 'block';
        } else {
            document.getElementById('resStatus').innerText = 'Check Failed - Invalid QR';
            document.getElementById('resStatus').style.color = '#ff4d4d';
            resultCard.style.display = 'block';
        }
    } catch (err) {
        alert('Verification error');
    }
});
