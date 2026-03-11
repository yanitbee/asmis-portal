// Countdown Timer
const d = new Date();
d.setMonth(d.getMonth() + 1);
const targetDate = d.getTime();
const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.innerText = days.toString().padStart(2, '0');
    if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
    if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
    if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
};

setInterval(updateCountdown, 1000);
updateCountdown();

// Interactive SVG Map Logic
document.addEventListener('DOMContentLoaded', async () => {
    const tooltip = document.getElementById('map-tooltip');
    const regions = document.querySelectorAll('.map-region');

    if (!tooltip || regions.length === 0) return; // Only run on pages with the map

    let countryStats = {};

    try {
        const response = await fetch('http://localhost:5015/api/stats/countries');
        if (response.ok) {
            countryStats = await response.json();
        } else {
            throw new Error('API Error');
        }
    } catch (err) {
        console.warn('Failed to fetch real stats, using fallback demo data.');
        countryStats = {
            "Egypt": { Influencer: 12, Media: 3, Sponsor: 1, Public: 45, total: 61 },
            "Nigeria": { Influencer: 34, Media: 8, Sponsor: 5, Public: 120, total: 167 },
            "Senegal": { Influencer: 5, Media: 2, Sponsor: 0, Public: 15, total: 22 },
            "Ghana": { Influencer: 18, Media: 4, Sponsor: 2, Public: 60, total: 84 },
            "Ethiopia": { Influencer: 45, Media: 12, Sponsor: 8, Public: 150, total: 215 },
            "Kenya": { Influencer: 25, Media: 6, Sponsor: 3, Public: 85, total: 119 },
            "Tanzania": { Influencer: 15, Media: 2, Sponsor: 1, Public: 40, total: 58 },
            "Uganda": { Influencer: 10, Media: 3, Sponsor: 0, Public: 30, total: 43 },
            "Rwanda": { Influencer: 8, Media: 1, Sponsor: 1, Public: 20, total: 30 },
            "South Africa": { Influencer: 40, Media: 15, Sponsor: 10, Public: 200, total: 265 }
        };
    }

    regions.forEach(region => {
        region.addEventListener('mouseenter', (e) => {
            const countryName = region.getAttribute('data-country');
            const stats = countryStats[countryName] || {};

            tooltip.innerHTML = `
                <h4>${countryName}</h4>
                <div class="tooltip-stat"><label>Influencers:</label> <span>${stats.Influencer || 0}</span></div>
                <div class="tooltip-stat"><label>Media:</label> <span>${stats.Media || 0}</span></div>
                <div class="tooltip-stat"><label>Sponsors:</label> <span>${stats.Sponsor || 0}</span></div>
                <div class="tooltip-stat"><label>Public:</label> <span>${stats.Public || 0}</span></div>
                <div class="tooltip-stat" style="margin-top: 5px; border-top: 1px solid #444; padding-top: 5px; color: var(--primary);">
                    <label>Total Registered:</label> <span>${stats.total || 0}</span>
                </div>
            `;
            tooltip.style.opacity = 1;
        });

        region.addEventListener('mousemove', (e) => {
            // Position tooltip slightly offset from cursor
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        });

        region.addEventListener('mouseleave', () => {
            tooltip.style.opacity = 0;
        });
    });
});

// Animated Statistics Counting
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);

        // Easing function: easeOutQuad
        const easeOutQuad = (t) => t * (2 - t);

        let frame = 0;
        const timer = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentValue = Math.round(target * progress);

            if (suffix === 'K') {
                // Special formatting for Influencers (e.g. 5.2K)
                el.innerText = (currentValue / 1000).toFixed(1) + suffix + '+';
            } else {
                el.innerText = currentValue + '+';
            }

            if (frame === totalFrames) {
                clearInterval(timer);
            }
        }, frameDuration);
    };

    const observerOptions = {
        threshold: 0.1
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
            } else {
                // Reset for re-trigger
                entry.target.innerText = '0+';
                if (entry.target.timer) clearInterval(entry.target.timer);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
});

// Sequential Schedule Item Reveal
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.schedule-item');
    if (items.length === 0) return;

    const revealItems = (section) => {
        const scheduleItems = section.querySelectorAll('.schedule-item');
        scheduleItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200); // Fast staggered reveal (200ms)
        });
    };

    const resetItems = (section) => {
        const scheduleItems = section.querySelectorAll('.schedule-item');
        scheduleItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealItems(entry.target);
            } else {
                resetItems(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) observer.observe(scheduleSection);
});
