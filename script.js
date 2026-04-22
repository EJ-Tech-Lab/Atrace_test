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