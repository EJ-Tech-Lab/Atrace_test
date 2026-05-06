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
