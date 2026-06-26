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
    const dropdown = document.getElementById("monthDropdown");
    if (!dropdown) return; // Guard: Stop if not on the Events page

    const categoryButtons = document.querySelectorAll(".filter-btn");
    const monthGroups = document.querySelectorAll(".month-group");
    const dropdownTrigger = dropdown.querySelector(".dropdown-trigger");
    const dropdownOptions = dropdown.querySelectorAll(".dropdown-option");

    let activeMonth = "all";
    let activeCategory = "all";

    function positionSidebars() {
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
            const events = group.querySelectorAll(".event-card");

            events.forEach(event => {
                const eventCategory = event.getAttribute("data-category");
                const matchesMonth = activeMonth === "all" || groupMonth === activeMonth;
                const matchesCategory = activeCategory === "all" || eventCategory === activeCategory;

                if (matchesMonth && matchesCategory) {
                    event.style.display = "flex";
                    hasVisibleEvents = true;
                } else {
                    event.style.display = "none";
                }
            });

            if (hasVisibleEvents) {
                group.style.display = "grid";
            } else {
                group.style.display = "none";
            }
        });
        positionSidebars();
    }

    dropdownTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("open");
    });

    dropdownOptions.forEach(option => {
        option.addEventListener("click", () => {
            dropdownOptions.forEach(opt => opt.classList.remove("active"));
            option.classList.add("active");
            dropdownTrigger.textContent = option.textContent;
            activeMonth = option.getAttribute("data-value");
            dropdown.classList.remove("open");
            applyFilters();
        });
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
        }
    });

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
