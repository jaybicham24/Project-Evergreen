// =========================================
// PROJECT EVERGREEN
// MAIN JAVASCRIPT
// =========================================


// =========================================
// COUNTDOWN
// =========================================

const wedding = new Date("December 26, 2026 09:00:00").getTime();

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");


function updateCountdown() {

    const now = new Date().getTime();
    const distance = wedding - now;

    if (distance <= 0) {

        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        return;
    }

    days.textContent =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    hours.textContent =
        Math.floor(
            (distance % (1000 * 60 * 60 * 24))
            / (1000 * 60 * 60)
        );

    minutes.textContent =
        Math.floor(
            (distance % (1000 * 60 * 60))
            / (1000 * 60)
        );

    seconds.textContent =
        Math.floor(
            (distance % (1000 * 60))
            / 1000
        );
}


updateCountdown();
setInterval(updateCountdown, 1000);



// =========================================
// NAVBAR
// =========================================

const nav = document.querySelector(".navbar");

if (nav) {

    // Show navbar immediately
    nav.classList.add("show");

    window.addEventListener("scroll", () => {

        nav.classList.add("show");

    });

}



// =========================================
// SMOOTH NAVIGATION
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});



// =========================================
// FADE SECTIONS
// =========================================

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show-section");

            }

        });

    },
    {
        threshold: 0.12
    }
);


document.querySelectorAll(".hidden").forEach(section => {

    observer.observe(section);

});



// =========================================
// PROGRAMME ACCORDION
// =========================================

// Native <details> handles this.
// No JavaScript required.



// =========================================
// MAP LINKS
// =========================================

// Map URLs are already provided directly
// in index.html, so no JavaScript is required here.