const searchContainer = document.querySelector(".search-container");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("focus", () => {
    searchContainer.classList.add("active");
});

searchInput.addEventListener("blur", () => {
    if (searchInput.value === "") {
        searchContainer.classList.remove("active");
    }
});
// Toggle theme (for later use)
function toggleTheme() {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
}
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    const totalItems = items.length;
    let currentIndex = 0; // The item currently in the center

    function updateCarousel() {
        items.forEach((item, index) => {
            // Strip old position classes
            item.className = "carousel-item";

            // Calculate the shortest distance from the current index in a circular array
            let diff = index - currentIndex;

            if (diff > Math.floor(totalItems / 2)) {
                diff -= totalItems;
            } else if (diff < -Math.floor(totalItems / 2)) {
                diff += totalItems;
            }

            // Assign structural classes based on distance from center
            if (diff === 0) item.classList.add("pos-center");
            else if (diff === -1) item.classList.add("pos-left-1");
            else if (diff === 1) item.classList.add("pos-right-1");
            else if (diff === -2) item.classList.add("pos-left-2");
            else if (diff === 2) item.classList.add("pos-right-2");
            else if (diff < -2) item.classList.add("pos-hidden-left");
            else if (diff > 2) item.classList.add("pos-hidden-right");
        });
    }

    // Event Delegation: Listen for clicks on the dynamically generated buttons
    document.addEventListener("click", (e) => {
        // If clicking a previous arrow
        if (e.target.closest(".prev-btn")) {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }
        // If clicking a next arrow
        else if (e.target.closest(".next-btn")) {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }
    });

    // Fire on load
    updateCarousel();
});
document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".filter-btn");
    const monthGroups = document.querySelectorAll(".month-group");

    // Custom Dropdown Elements
    const dropdown = document.getElementById("monthDropdown");
    const dropdownTrigger = dropdown.querySelector(".dropdown-trigger");
    const dropdownOptions = dropdown.querySelectorAll(".dropdown-option");

    let activeMonth = "all";
    let activeCategory = "all";

    // Dynamic layout calculation for the sidebars
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

    // Core Filter Logic
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

    // --- CUSTOM DROPDOWN INTERACTION LOGIC ---

    // Toggle menu open/close
    dropdownTrigger.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents instant closing from document click listener
        dropdown.classList.toggle("open");
    });

    // Option selection interaction
    dropdownOptions.forEach(option => {
        option.addEventListener("click", () => {
            // Remove active status from options, add to clicked option
            dropdownOptions.forEach(opt => opt.classList.remove("active"));
            option.classList.add("active");

            // Update main view text window and active system filters
            dropdownTrigger.textContent = option.textContent;
            activeMonth = option.getAttribute("data-value");

            // Close panel and process filter updates
            dropdown.classList.remove("open");
            applyFilters();
        });
    });

    // Close dropdown instantly if user clicks anywhere else on screen
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
        }
    });

    // --- CATEGORY BUTTON INTERACTION LOGIC ---
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            activeCategory = e.target.getAttribute("data-filter");
            applyFilters();
        });
    });

    // Layout resizing tracker loops
    window.addEventListener("resize", positionSidebars);

    // Initial pass run engine initialization layout settings
    applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".filter-btn");
    const artistGroup = document.querySelector(".artist-group");
    const sidebar = document.querySelector(".artist-sidebar");
    const artistsGrid = document.querySelector(".artists-grid");
    const artistCards = document.querySelectorAll(".artist-card");

    let activeCategory = "all";

    // Dynamic layout calculation for the empty sidebar (retains your centering math)
    function positionSidebars() {
        requestAnimationFrame(() => {
            if (!artistGroup || artistGroup.style.display === "none") return;

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

    // Core Filter Logic
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

    // --- CATEGORY BUTTON INTERACTION LOGIC ---
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active from all buttons, add to clicked
            categoryButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            // Update variable and filter the grid
            activeCategory = e.target.getAttribute("data-filter");
            applyFilters();
        });
    });

    // Layout resizing tracker
    window.addEventListener("resize", positionSidebars);

    // Initial layout setup
    applyFilters();
});
