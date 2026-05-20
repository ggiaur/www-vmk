document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('is-ready');

    // --- Mobile Menu Toggle ---
    const toggle = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-menu-panel]');

    if (toggle && panel) {
        const closeMenu = () => {
            toggle.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
            document.body.classList.remove('has-open-menu');
        };

        const openMenu = () => {
            toggle.setAttribute('aria-expanded', 'true');
            panel.hidden = false;
            document.body.classList.add('has-open-menu');
        };

        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        panel.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    // --- Dual Search Toggle ---
    const dualSearch = document.querySelector('[data-dual-search]');
    if (dualSearch) {
        const tabBtns = dualSearch.querySelectorAll('.search-tab-btn');
        const form = dualSearch.querySelector('#dual-search-form');
        const input = dualSearch.querySelector('#vmk-search');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                const mode = btn.getAttribute('data-search-mode');
                if (mode === 'catalog') {
                    form.action = 'https://katalogus.vmk.hu/opac';
                    form.target = '_blank';
                    input.name = 'keyword';
                    input.placeholder = 'Írd be a könyv címét, szerzőjét vagy témáját...';
                } else {
                    form.action = '/';
                    form.target = '_self';
                    input.name = 's';
                    input.placeholder = 'Keresés a könyvtár honlapján...';
                }
            });
        });
    }

    // --- Interactive Services/Trendek Tabs ---
    const servicesTabs = document.querySelector('[data-services-tabs]');
    if (servicesTabs) {
        const triggers = servicesTabs.querySelectorAll('.service-tab-trigger');
        const panels = servicesTabs.querySelectorAll('[data-tab-panel]');

        const switchTab = (targetId) => {
            triggers.forEach(trigger => {
                const target = trigger.getAttribute('data-tab-target');
                if (target === targetId) {
                    trigger.classList.add('is-active');
                } else {
                    trigger.classList.remove('is-active');
                }
            });

            panels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.add('is-active');
                } else {
                    panel.classList.remove('is-active');
                }
            });
        };

        triggers.forEach(trigger => {
            // Support both click and hover (mouseenter) for extremely fluid desktop feel
            const handleEvent = () => {
                const targetId = trigger.getAttribute('data-tab-target');
                switchTab(targetId);
            };
            trigger.addEventListener('click', handleEvent);
            trigger.addEventListener('mouseenter', handleEvent);
        });
    }

    // --- Dynamic Branch Libraries Status ---
    const konyvtarCards = document.querySelectorAll('.tagkonyvtar-card');
    if (konyvtarCards.length > 0) {
        const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        const currentDayStr = daysMap[now.getDay()];
        const currentMin = now.getHours() * 60 + now.getMinutes();

        konyvtarCards.forEach(card => {
            const hoursRaw = card.getAttribute('data-hours-raw');
            const badge = card.querySelector('[data-status-label]');
            if (!hoursRaw || !badge) return;

            const daysData = hoursRaw.split(',');
            let daySchedule = 'closed';

            for (let i = 0; i < daysData.length; i++) {
                const parts = daysData[i].split(':');
                if (parts[0] === currentDayStr) {
                    daySchedule = parts[1];
                    break;
                }
            }

            if (daySchedule === 'closed' || !daySchedule.includes('-')) {
                badge.textContent = 'ZÁRVA';
                badge.className = 'tagkonyvtar-status-badge is-closed';
            } else {
                const timeParts = daySchedule.split('-');
                const startParts = timeParts[0].split(':');
                const endParts = timeParts[1].split(':');

                const startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
                const endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

                if (currentMin >= startMin && currentMin < endMin) {
                    badge.textContent = 'NYITVA';
                    badge.className = 'tagkonyvtar-status-badge is-open';
                } else {
                    badge.textContent = 'ZÁRVA';
                    badge.className = 'tagkonyvtar-status-badge is-closed';
                }
            }
        });
    }
});
