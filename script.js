// --- SEARCH BAR ---
const searchContainer = document.querySelector(".search-container");
const searchInput = document.getElementById("searchInput");

// Only run this if the search elements actually exist on the page
if (searchInput && searchContainer) {
    searchInput.addEventListener("focus", () => {
        searchContainer.classList.add("active");
    });

    searchInput.addEventListener("blur", () => {
        if (searchInput.value === "") {
            searchContainer.classList.remove("active");
        }
    });
}

// Toggle theme (for later use)
function toggleTheme() {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
}

// --- CAROUSEL LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    if (items.length === 0) return; // Guard: Stop if no carousel on this page

    const totalItems = items.length;
    let currentIndex = 0;

    function updateCarousel() {
        items.forEach((item, index) => {
            item.className = "carousel-item";
            let diff = index - currentIndex;

            if (diff > Math.floor(totalItems / 2)) {
                diff -= totalItems;
            } else if (diff < -Math.floor(totalItems / 2)) {
                diff += totalItems;
            }

            if (diff === 0) item.classList.add("pos-center");
            else if (diff === -1) item.classList.add("pos-left-1");
            else if (diff === 1) item.classList.add("pos-right-1");
            else if (diff === -2) item.classList.add("pos-left-2");
            else if (diff === 2) item.classList.add("pos-right-2");
            else if (diff < -2) item.classList.add("pos-hidden-left");
            else if (diff > 2) item.classList.add("pos-hidden-right");
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.closest(".prev-btn")) {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        } else if (e.target.closest(".next-btn")) {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }
    });

    updateCarousel();
});

// --- EVENTS PAGE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".filter-btn");
    const monthGroups = document.querySelectorAll(".month-group");

    // Month Dropdown
    const monthDropdown = document.getElementById("monthDropdown");
    const monthTrigger = monthDropdown.querySelector(".dropdown-trigger");
    const monthOptions = monthDropdown.querySelectorAll(".dropdown-option");

    // More Filters Dropdown (Mobile)
    const moreDropdown = document.getElementById("moreFiltersDropdown");
    const moreTrigger = moreDropdown.querySelector(".dropdown-trigger");
    const moreOptions = moreDropdown.querySelectorAll(".dropdown-option");

    let activeMonth = "all";
    let activeCategory = "all";

    function positionSidebars() {
        // Disable dynamic sidebar pushing on mobile
        if (window.innerWidth <= 850) {
            monthGroups.forEach(group => {
                const sidebar = group.querySelector(".month-sidebar");
                if (sidebar) sidebar.style.marginTop = "0px";
            });
            return;
        }

        requestAnimationFrame(() => {
            monthGroups.forEach(group => {
                if (group.style.display === "none") return;
                const grid = group.querySelector(".events-grid");
                const sidebar = group.querySelector(".month-sidebar");
                if (!grid || !sidebar) return;

                const visibleCards = Array.from(grid.querySelectorAll(".event-card")).filter(
                    card => card.style.display !== "none"
                );

                if (visibleCards.length === 0) return;

                sidebar.style.marginTop = "0px";
                let firstRowMaxHeight = 0;
                const itemsInFirstRow = Math.min(visibleCards.length, 3);

                for (let i = 0; i < itemsInFirstRow; i++) {
                    const cardHeight = visibleCards[i].offsetHeight;
                    if (cardHeight > firstRowMaxHeight) {
                        firstRowMaxHeight = cardHeight;
                    }
                }

                const sidebarHeight = sidebar.offsetHeight;
                const targetOffset = (firstRowMaxHeight - sidebarHeight) / 2;
                sidebar.style.marginTop = `${Math.max(0, targetOffset)}px`;
            });
        });
    }

    function applyFilters() {
        monthGroups.forEach(group => {
            const groupMonth = group.getAttribute("data-month");
            let hasVisibleEvents = false;
            let firstVisibleFound = false; // Tracks the first card for the mobile layout
            const events = group.querySelectorAll(".event-card");

            events.forEach(event => {
                const eventCategory = event.getAttribute("data-category");
                const matchesMonth = activeMonth === "all" || groupMonth === activeMonth;
                const matchesCategory = activeCategory === "all" || eventCategory === activeCategory;

                // Reset mobile big-card class
                event.classList.remove("featured-mobile");

                if (matchesMonth && matchesCategory) {
                    event.style.display = "flex";
                    hasVisibleEvents = true;

                    // Assign the big card class to the very first visible event
                    if (!firstVisibleFound) {
                        event.classList.add("featured-mobile");
                        firstVisibleFound = true;
                    }
                } else {
                    event.style.display = "none";
                }
            });

            group.style.display = hasVisibleEvents ? "flex" : "none";
            // Desktop resets to grid via CSS, but inline style flex overrides it if we aren't careful.
            // Better to remove the inline display and let CSS handle the display type, just toggle a hidden class.
            // For now, grid on desktop and flex on mobile works if we set it properly:
            if (hasVisibleEvents) {
                group.style.display = window.innerWidth <= 850 ? "flex" : "grid";
            }
        });

        positionSidebars();
    }

    // Generic Dropdown Logic Helper
    function setupDropdown(dropdownElem, triggerElem, optionsNodeList, type) {
        if (!dropdownElem) return;
        triggerElem.addEventListener("click", (e) => {
            e.stopPropagation();

            // Close the other dropdown if open
            if (type === 'month' && moreDropdown) moreDropdown.classList.remove("open");
            if (type === 'more' && monthDropdown) monthDropdown.classList.remove("open");

            dropdownElem.classList.toggle("open");
        });

        optionsNodeList.forEach(option => {
            option.addEventListener("click", () => {
                optionsNodeList.forEach(opt => opt.classList.remove("active"));
                option.classList.add("active");
                triggerElem.textContent = option.textContent;

                if (type === 'month') {
                    activeMonth = option.getAttribute("data-value");
                } else if (type === 'more') {
                    activeCategory = option.getAttribute("data-value");
                    // Remove active state from standard category buttons
                    categoryButtons.forEach(b => b.classList.remove("active"));
                }

                dropdownElem.classList.remove("open");
                applyFilters();
            });
        });
    }

    setupDropdown(monthDropdown, monthTrigger, monthOptions, 'month');
    setupDropdown(moreDropdown, moreTrigger, moreOptions, 'more');

    // Close dropdowns on outside click
    document.addEventListener("click", (e) => {
        if (monthDropdown && !monthDropdown.contains(e.target)) monthDropdown.classList.remove("open");
        if (moreDropdown && !moreDropdown.contains(e.target)) moreDropdown.classList.remove("open");
    });

    // Standard Category Buttons (All, Concert, etc.)
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            activeCategory = e.target.getAttribute("data-filter");

            // Reset "More" dropdown UI if a standard button is clicked
            if (moreDropdown) {
                moreOptions.forEach(opt => opt.classList.remove("active"));
                moreTrigger.textContent = "More";
            }

            applyFilters();
        });
    });

    window.addEventListener("resize", () => {
        applyFilters(); // Re-apply to fix group.style.display (grid vs flex)
    });

    applyFilters();
});

// --- ARTISTS PAGE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const artistGroup = document.querySelector(".artist-group");
    if (!artistGroup) return; // Guard: Stop if not on the Artists page

    const categoryButtons = document.querySelectorAll(".filter-btn");
    const sidebar = document.querySelector(".artist-sidebar");
    const artistsGrid = document.querySelector(".artists-grid");
    const artistCards = document.querySelectorAll(".artist-card");

    let activeCategory = "all";

    function positionSidebars() {
        requestAnimationFrame(() => {
            if (artistGroup.style.display === "none") return;

            const visibleCards = Array.from(artistCards).filter(card => card.style.display !== "none");
            if (visibleCards.length === 0) return;

            sidebar.style.marginTop = "0px";

            let firstRowMaxHeight = 0;
            const itemsInFirstRow = Math.min(visibleCards.length, 3);

            for (let i = 0; i < itemsInFirstRow; i++) {
                const cardHeight = visibleCards[i].offsetHeight;
                if (cardHeight > firstRowMaxHeight) {
                    firstRowMaxHeight = cardHeight;
                }
            }

            const sidebarHeight = sidebar.offsetHeight;
            const targetOffset = (firstRowMaxHeight - sidebarHeight) / 2;

            sidebar.style.marginTop = `${Math.max(0, targetOffset)}px`;
        });
    }

    function applyFilters() {
        let hasVisibleArtists = false;

        artistCards.forEach(card => {
            const artistCategory = card.getAttribute("data-category");
            const matchesCategory = activeCategory === "all" || artistCategory === activeCategory;

            if (matchesCategory) {
                card.style.display = "flex";
                hasVisibleArtists = true;
            } else {
                card.style.display = "none";
            }
        });

        if (hasVisibleArtists) {
            artistGroup.style.display = "grid";
        } else {
            artistGroup.style.display = "none";
        }
        positionSidebars();
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            activeCategory = e.target.getAttribute("data-filter");
            applyFilters();
        });
    });

    window.addEventListener("resize", positionSidebars);
    applyFilters();
});

// --- MOBILE MENU LOGIC ---
const burgerBtn = document.getElementById("burgerBtn");
const closeBtn = document.getElementById("closeBtn");
const mobileSidebar = document.getElementById("mobileSidebar");

// Guard: Only run if the menu elements exist
if (burgerBtn && closeBtn && mobileSidebar) {
    burgerBtn.addEventListener("click", () => {
        mobileSidebar.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    closeBtn.addEventListener("click", () => {
        mobileSidebar.classList.remove("active");
        document.body.style.overflow = "auto";
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const mobileWrapper = document.querySelector('.mobile-gallery-wrapper');

    // Only run this script if the mobile gallery exists on the page
    if (mobileWrapper) {
        const mainImg = document.getElementById('mainGalleryImage');
        const thumbs = document.querySelectorAll('.thumb-item');
        const prevBtn = document.querySelector('.prev-arrow');
        const nextBtn = document.querySelector('.next-arrow');

        let currentIndex = 0;
        const maxIndex = thumbs.length - 1;

        // Extract all image paths dynamically so we don't have to hardcode them in JS
        const imageSources = Array.from(thumbs).map(t => t.querySelector('img').src);

        // Core Update Function
        function updateGallery(index) {
            // Loop around if we go past the start or end
            if (index < 0) index = maxIndex;
            if (index > maxIndex) index = 0;

            currentIndex = index;

            // Fade out, swap image, fade in
            mainImg.style.opacity = "0.5";
            setTimeout(() => {
                mainImg.src = imageSources[currentIndex];
                mainImg.style.opacity = "1";
            }, 150);

            // Update border highlights
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[currentIndex].classList.add('active');

            // Magic touch: Automatically scroll the strip so the active thumb stays in view
            thumbs[currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        // 1. Thumbnail Clicks
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        // 2. Arrow Clicks
        prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));

        // 3. Swipe Detection Mechanics
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // You must swipe at least 50px for it to register

        // Note: { passive: true } is great for performance on mobile devices
        mainImg.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainImg.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;

            if (swipeDistance < -swipeThreshold) {
                // Swiped Left (Go to Next)
                updateGallery(currentIndex + 1);
            } else if (swipeDistance > swipeThreshold) {
                // Swiped Right (Go to Previous)
                updateGallery(currentIndex - 1);
            }
        }
    }
});
