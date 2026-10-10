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

    days.textContent = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    hours.textContent = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    minutes.textContent = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    seconds.textContent = Math.floor(
        (distance % (1000 * 60)) /
        1000
    );
}

updateCountdown();
setInterval(updateCountdown, 1000);


// =========================================
// NAVIGATION
// =========================================

const nav = document.querySelector(".navbar");

if (nav) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 120) {
            nav.classList.add("show");
        } else {
            nav.classList.remove("show");
        }
    });
}


// =========================================
// SMOOTH SCROLL
// =========================================

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener("click", event => {

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


// =========================================
// SECTION REVEAL
// =========================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show-section");
        }

    });

});

document
    .querySelectorAll(".hidden")
    .forEach(section => {
        observer.observe(section);
    });


// =========================================
// SUPABASE
// =========================================

const SUPABASE_URL =
    "https://bryfgcjkdhacwatidwme.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_JxPa_HtrEpWv3Vs3n7wxhQ_1c2gjQqJ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// GUESTBOOK ELEMENTS
// =========================================

const guestbookForm =
    document.getElementById("guestbookForm");

const memoryList =
    document.getElementById("memoryList");

const memoryEmpty =
    document.getElementById("memoryEmpty");

const guestPhoto =
    document.getElementById("guestPhoto");

const photoPreview =
    document.getElementById("photoPreview");


// =========================================
// PHOTO PREVIEW
// =========================================

if (guestPhoto) {

    guestPhoto.addEventListener("change", () => {

        const file = guestPhoto.files[0];

        if (!file) {

            photoPreview.style.display = "none";
            photoPreview.innerHTML = "";

            return;
        }

        const reader = new FileReader();

        reader.onload = event => {

            photoPreview.innerHTML = `
                <img
                    src="${event.target.result}"
                    alt="Selected wedding memory"
                >
            `;

            photoPreview.style.display = "block";
        };

        reader.readAsDataURL(file);

    });
}


// =========================================
// LOAD MEMORIES
// =========================================

async function loadMemories() {

    memoryList.innerHTML = `
        <div class="memory-empty">
            <span>🌿</span>
            <p>Loading Evergreen memories...</p>
        </div>
    `;

    const {
        data,
        error
    } = await supabaseClient
        .from("memories")
        .select("*")
        .eq("approved", true)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Could not load memories:",
            error
        );

        memoryList.innerHTML = `
            <div class="memory-empty">
                <span>🌿</span>
                <p>
                    We couldn't load the memories.
                    Please try again.
                </p>
            </div>
        `;

        return;
    }

    renderMemories(data || []);
}


// =========================================
// RENDER MEMORIES
// =========================================

function renderMemories(memories) {

    memoryList.innerHTML = "";

    if (!memories.length) {

        memoryList.appendChild(memoryEmpty);

        return;
    }

    memories.forEach(memory => {

        const card =
            document.createElement("article");

        card.className =
            memory.photo_url
                ? "memory-card has-photo"
                : "memory-card";


        // PHOTO
        if (memory.photo_url) {

            const image =
                document.createElement("img");

            image.className =
                "memory-photo";

            image.src =
                memory.photo_url;

            image.alt =
                `Memory shared by ${memory.guest_name}`;

            image.loading = "lazy";

            card.appendChild(image);
        }


        // MESSAGE
        const message =
            document.createElement("p");

        message.className =
            "memory-message";

        message.textContent =
            `"${memory.message}"`;


        // NAME
        const author =
            document.createElement("p");

        author.className =
            "memory-author";

        author.textContent =
            `— ${memory.guest_name}`;


        // DATE
        const date =
            document.createElement("p");

        date.className =
            "memory-date";

        date.textContent =
            new Date(
                memory.created_at
            ).toLocaleDateString(
                "en-NG",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );


        // ADD MAIN CONTENT
        card.appendChild(message);
        card.appendChild(author);
        card.appendChild(date);


        // =====================================
        // TAG YOURSELF
        // =====================================

        const tagArea =
            document.createElement("div");

        tagArea.className =
            "memory-tag-area";


        const tagButton =
            document.createElement("button");

        tagButton.className =
            "tag-yourself";

        tagButton.type =
            "button";

        tagButton.innerHTML =
            "🏷️ Tag Yourself";


        tagButton.addEventListener("click", () => {

            showTagForm(
                memory.id,
                card
            );

        });


        tagArea.appendChild(tagButton);

        card.appendChild(tagArea);

        // ❤️ LIKE AREA
const likeArea = document.createElement("div");
likeArea.className = "memory-like-area";

likeArea.innerHTML = `
    <button
        class="memory-like-btn"
        type="button"
        data-memory-id="${memory.id}"
        aria-label="Love this memory"
    >
        <span class="like-heart">♡</span>
        <span class="like-text">Love this</span>
        <span class="like-count">0</span>
    </button>
`;

card.appendChild(likeArea);

loadMemoryLikes(memory.id, likeArea);


        // LOAD EXISTING TAGS
        loadMemoryTags(
            memory.id,
            card
        );


        memoryList.appendChild(card);

    });
}


// =========================================
// SUBMIT MEMORY
// =========================================

if (guestbookForm) {

    guestbookForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const submitButton =
                guestbookForm.querySelector(
                    ".guestbook-submit"
                );

            const name =
                document
                    .getElementById("guestName")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("guestMessage")
                    .value
                    .trim();

            const file =
                guestPhoto?.files[0];


            if (!name || !message) {

                alert(
                    "Please enter your name and message."
                );

                return;
            }


            submitButton.disabled = true;

            submitButton.innerHTML =
                `<span>⏳</span> Saving Memory...`;


            try {

                let photoUrl = null;


                // =================================
                // UPLOAD PHOTO
                // =================================

                if (file) {

                    const extension =
                        file.name
                            .split(".")
                            .pop()
                            .toLowerCase();

                    const fileName =
                        `${crypto.randomUUID()}.${extension}`;

                    const filePath =
                        `guest-memories/${fileName}`;


                    const {
                        error: uploadError
                    } =
                        await supabaseClient
                            .storage
                            .from(
                                "evergreen-memories"
                            )
                            .upload(
                                filePath,
                                file,
                                {
                                    cacheControl: "3600",
                                    upsert: false
                                }
                            );


                    if (uploadError) {
                        throw uploadError;
                    }


                    const {
                        data: publicUrlData
                    } =
                        supabaseClient
                            .storage
                            .from(
                                "evergreen-memories"
                            )
                            .getPublicUrl(
                                filePath
                            );


                    photoUrl =
                        publicUrlData.publicUrl;
                }


                // =================================
                // SAVE MEMORY
                // =================================

                const {
                    error: insertError
                } =
                    await supabaseClient
                        .from("memories")
                        .insert({
                            guest_name: name,
                            message: message,
                            photo_url: photoUrl,
                            memory_type: "message",
                            approved: true
                        });


                if (insertError) {
                    throw insertError;
                }

                await supabaseClient
    .from("guest_activity")
    .insert({
        guest_name: guestName,
        activity_type: "memory",
        activity_text: photoUrl
            ? " shared a photo memory 📸"
            : " shared a memory 💭"
    });


                // =================================
                // SUCCESS
                // =================================

                guestbookForm.reset();

                photoPreview.style.display =
                    "none";

                photoPreview.innerHTML =
                    "";


                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    `<span>♡</span> Add To Our Memories`;


                await loadMemories();


            } catch (error) {

                console.error(
                    "Memory submission failed:",
                    error
                );

                alert(
                    "We couldn't save your memory. Please try again."
                );


                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    `<span>♡</span> Add To Our Memories`;
            }

        }
    );

    loadMemories();
}


// =========================================
// TAG YOURSELF — FORM
// =========================================

function showTagForm(
    memoryId,
    card
) {

    if (
        card.querySelector(".tag-form")
    ) {
        return;
    }


    const form =
        document.createElement("form");

    form.className =
        "tag-form";


    form.innerHTML = `
        <input
            type="text"
            class="tag-name-input"
            placeholder="Enter your name"
            maxlength="60"
            required
        >

        <button type="submit">
            Add My Name
        </button>

        <button
            type="button"
            class="tag-cancel"
        >
            Cancel
        </button>
    `;


    const tagArea =
        card.querySelector(
            ".memory-tag-area"
        );

    tagArea.appendChild(form);


    // CANCEL
    form
        .querySelector(".tag-cancel")
        .addEventListener(
            "click",
            () => {
                form.remove();
            }
        );


    // SUBMIT TAG
    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const input =
                form.querySelector(
                    ".tag-name-input"
                );

            const guestName =
                input.value.trim();


            if (!guestName) {
                return;
            }


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            submitButton.disabled =
                true;

            submitButton.textContent =
                "Saving...";


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from("memory_tags")
                        .insert({
                            memory_id:
                                memoryId,

                            guest_name:
                                guestName
                        });


                if (error) {
                    throw error;
                }


                form.remove();


                await loadMemoryTags(
                    memoryId,
                    card
                );


            } catch (error) {

                console.error(
                    "Could not save tag:",
                    error
                );


                alert(
                    "We couldn't save your name. Please try again."
                );


                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Add My Name";
            }

        }
    );
}


// =========================================
// LOAD TAGGED NAMES
// =========================================

async function loadMemoryTags(
    memoryId,
    card
) {

    const tagArea =
        card.querySelector(
            ".memory-tag-area"
        );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("memory_tags")
            .select("guest_name")
            .eq(
                "memory_id",
                memoryId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Could not load tags:",
            error
        );

        return;
    }


    let tagsDisplay =
        card.querySelector(
            ".memory-tags"
        );


    if (!tagsDisplay) {

        tagsDisplay =
            document.createElement("div");

        tagsDisplay.className =
            "memory-tags";

        tagArea.appendChild(
            tagsDisplay
        );
    }


    tagsDisplay.innerHTML = "";


    if (
        !data ||
        !data.length
    ) {
        return;
    }


    const label =
        document.createElement("span");

    label.className =
        "tag-label";

    label.textContent =
        "In this memory:";

    tagsDisplay.appendChild(
        label
    );


    data.forEach(tag => {

        const name =
            document.createElement("span");

        name.className =
            "memory-tag";

        name.textContent =
            tag.guest_name;

        tagsDisplay.appendChild(
            name
        );

    });

}
// =========================================
// ❤️ MEMORY LIKES
// =========================================

async function loadMemoryLikes(memoryId, likeArea) {

    const { data, error } = await supabaseClient
        .from("memory_likes")
        .select("id")
        .eq("memory_id", memoryId);

    if (error) {
        console.error("Could not load likes:", error);
        return;
    }

    const count = data ? data.length : 0;

    const likeButton = likeArea.querySelector(".memory-like-btn");
    const likeCount = likeArea.querySelector(".like-count");

    likeCount.textContent = count;

    likeButton.addEventListener("click", async () => {

        likeButton.disabled = true;

        const { error: insertError } = await supabaseClient
            .from("memory_likes")
            .insert({
                memory_id: memoryId
            });

        if (insertError) {
            console.error("Could not add like:", insertError);
            likeButton.disabled = false;
            return;
        }

        const currentCount = Number(likeCount.textContent) || 0;

        likeCount.textContent = currentCount + 1;

        likeButton.classList.add("liked");

        const heart = likeButton.querySelector(".like-heart");
        heart.textContent = "♥";

        // 🟢 RECORD LIVE ACTIVITY
const memoryGuestName =
    document.getElementById("guestName")?.value.trim() ||
    "A guest";

await supabaseClient
    .from("guest_activity")
    .insert({
        guest_name: memoryGuestName,
        activity_type: "like",
        activity_text: " loved a memory ❤️"
    });

        likeButton.disabled = false;
    });
}
// =========================================
// PRAYER & BLESSINGS
// =========================================

const privateMessageForm =
    document.getElementById("privateMessageForm");

const privateMessageStatus =
    document.getElementById("privateMessageStatus");

if (privateMessageForm) {

    privateMessageForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const guestName =
                document
                    .getElementById("privateGuestName")
                    .value
                    .trim();

            const guestContact =
                document
                    .getElementById("privateGuestContact")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("privateMessageText")
                    .value
                    .trim();

            if (!guestName || !message) {
                privateMessageStatus.textContent =
                    "Please enter your name and message.";

                return;
            }

            const button =
                privateMessageForm.querySelector(
                    ".private-message-submit"
                );

            button.disabled = true;
            button.textContent = "Sending...";

            const { error } =
                await supabaseClient
                    .from("private_messages")
                    .insert({
                        guest_name: guestName,
                        guest_contact:
                            guestContact || null,
                        message: message
                    });

            if (error) {

                console.error(
                    "Prayer submission error:",
                    error
                );

                privateMessageStatus.textContent =
                    "Something went wrong. Please try again.";

                button.disabled = false;
                button.textContent =
                    "🕯️ Send My Blessing";

                return;
            }

            await supabaseClient
                .from("guest_activity")
                .insert({
                    guest_name: guestName,
                    activity_type: "message",
                    activity_text:
                        " left a prayer or blessing 🕯️"
                });

            privateMessageForm.reset();

            privateMessageStatus.textContent =
                "Your blessing has been received. ❤️";

            button.disabled = false;
            button.textContent =
                "🕯️ Send My Blessing";

        }
    );
}
// =========================================
// 🎵 SONG DEDICATIONS
// =========================================

const songDedicationForm =
    document.getElementById("songDedicationForm");

const songStatus =
    document.getElementById("songStatus");

if (songDedicationForm) {

    songDedicationForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const guestName =
            document.getElementById("songGuestName").value.trim();

        const songTitle =
            document.getElementById("songTitle").value.trim();

        const artist =
            document.getElementById("songArtist").value.trim();

        const message =
            document.getElementById("songMessage").value.trim();

        if (!guestName || !songTitle || !artist) {
            return;
        }

        const submitButton =
            songDedicationForm.querySelector(".song-submit");

        submitButton.disabled = true;
        submitButton.innerHTML = "Saving...";

        songStatus.textContent = "";

        const { error } = await supabaseClient
            .from("song_dedications")
            .insert({
                guest_name: guestName,
                song_title: songTitle,
                artist: artist,
                message: message || null
            });

            

        if (error) {

            console.error(
                "Song dedication error:",
                error
            );

            songStatus.textContent =
                "Something went wrong. Please try again.";

            submitButton.disabled = false;
            submitButton.innerHTML =
                "<span>🎶</span> Dedicate This Song";

            return;
        }
        // 🟢 RECORD LIVE ACTIVITY
await supabaseClient
    .from("guest_activity")
    .insert({
        guest_name: guestName,
        activity_type: "song",
        activity_text:
            ` dedicated "${songTitle}" by ${artist} 🎵`
    });

        songDedicationForm.reset();

        songStatus.textContent =
            "Your song dedication has been saved. 🎵❤️";

        submitButton.disabled = false;
        submitButton.innerHTML =
            "<span>🎶</span> Dedicate This Song";
    });
}
// =========================================
// HTML SAFETY HELPER
// =========================================

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}
// =========================================
// 🎵 LOAD SONG DEDICATIONS
// =========================================

async function loadSongDedications() {

    const songList =
        document.getElementById("songList");

    const songEmpty =
        document.getElementById("songEmpty");

    if (!songList) return;

    const { data, error } = await supabaseClient
        .from("song_dedications")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Could not load song dedications:",
            error
        );

        return;
    }

    if (!data || data.length === 0) {
        if (songEmpty) {
            songEmpty.style.display = "block";
        }
        return;
    }

    if (songEmpty) {
        songEmpty.remove();
    }

    songList.innerHTML = "";

    data.forEach(song => {

        const card =
            document.createElement("article");

        card.className = "song-card";

        const message =
            song.message
                ? `
                    <p class="song-card-message">
                        "${escapeHtml(song.message)}"
                    </p>
                  `
                : "";

        const date =
            song.created_at
                ? new Date(song.created_at)
                    .toLocaleDateString(
                        "en-GB",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                : "";

        card.innerHTML = `
            <div class="song-card-icon">🎵</div>

            <div class="song-card-content">

                <h4>
                    ${escapeHtml(song.song_title)}
                </h4>

                <p class="song-card-artist">
                    ${escapeHtml(song.artist)}
                </p>

                ${message}

                <p class="song-card-by">
                    Dedicated by
                    <strong>
                        ${escapeHtml(song.guest_name)}
                    </strong>
                    ${date ? ` · ${date}` : ""}
                </p>

            </div>
        `;

        songList.appendChild(card);
    });
}

loadSongDedications();

// =========================================
// 🟢 GUEST ACTIVITY
// =========================================

async function loadGuestActivity() {

    const activityList =
        document.getElementById("activityList");

    const activityEmpty =
        document.getElementById("activityEmpty");

    if (!activityList) return;

    const { data, error } = await supabaseClient
        .from("guest_activity")
        .select("*")
        .order("created_at", {
            ascending: false
        })
        .limit(20);

    if (error) {

        console.error(
            "Could not load guest activity:",
            error
        );

        return;
    }

    if (!data || data.length === 0) {
        return;
    }

    if (activityEmpty) {
        activityEmpty.remove();
    }

    activityList.innerHTML = "";

    data.forEach(activity => {

        const item =
            document.createElement("div");

        item.className = "activity-item";

        const time =
            activity.created_at
                ? new Date(activity.created_at)
                    .toLocaleTimeString(
                        "en-GB",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                : "";

        item.innerHTML = `
            <div class="activity-icon">
                ${getActivityIcon(activity.activity_type)}
            </div>

            <div class="activity-content">

                <p>
                    <strong>
                        ${escapeHtml(activity.guest_name)}
                    </strong>

                    ${escapeHtml(
                        activity.activity_text || ""
                    )}
                </p>

                <span>
                    ${time}
                </span>

            </div>
        `;

        activityList.appendChild(item);
    });
}


function getActivityIcon(type) {

    switch (type) {

        case "like":
            return "❤️";

        case "song":
            return "🎵";

        case "memory":
            return "📸";

        case "message":
            return "💌";

        case "tag":
            return "🏷️";

        default:
            return "🌿";
    }
}


loadGuestActivity();

// 🔄 Refresh Live Activity every 15 seconds
setInterval(() => {
    loadGuestActivity();
}, 15000);
// =========================================
// 🕯️ LIGHT A CANDLE
// =========================================

const candleForm =
    document.getElementById("candleForm");

const candleStatus =
    document.getElementById("candleStatus");

const candleDisplay =
    document.getElementById("candleDisplay");

if (candleForm) {

    candleForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const guestName =
            document.getElementById("candleGuestName")
                .value
                .trim();

        const message =
            document.getElementById("candleMessage")
                .value
                .trim();

        if (!guestName) return;

        const button =
            candleForm.querySelector(".candle-submit");

        button.disabled = true;
        button.textContent = "Lighting...";

        const { error } = await supabaseClient
            .from("wedding_candles")
            .insert({
                guest_name: guestName,
                message: message || null
            });

        if (error) {

            console.error(
                "Candle error:",
                error
            );

            candleStatus.textContent =
                "Something went wrong. Please try again.";

            button.disabled = false;
            button.textContent =
                "🕯️ Light My Candle";

            return;
        }

        candleForm.reset();

        candleStatus.textContent =
            "Your light has been added. ❤️";

        button.disabled = false;
        button.textContent =
            "🕯️ Light My Candle";

        loadCandles();

    });
}


// LOAD CANDLES

async function loadCandles() {

    if (!candleDisplay) return;

    const { data, error } = await supabaseClient
        .from("wedding_candles")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Could not load candles:",
            error
        );

        return;
    }

    candleDisplay.innerHTML = "";

    if (!data || data.length === 0) {

        candleDisplay.innerHTML = `
            <div class="candle-empty">
                🕯️
                <p>
                    Be the first to light a candle.
                </p>
            </div>
        `;

        return;
    }

    data.forEach(candle => {

        const flame =
            document.createElement("div");

        flame.className = "guest-candle";

        flame.innerHTML = `
            <span>🕯️</span>
            <small>
                ${escapeHtml(candle.guest_name)}
            </small>
        `;

        candleDisplay.appendChild(flame);
    });
}

loadCandles();
// =========================================
// MEMORY PHOTO VIEWER
// =========================================

const photoViewer =
    document.getElementById("photoViewer");

const photoViewerImage =
    document.getElementById("photoViewerImage");

const photoViewerClose =
    document.getElementById("photoViewerClose");

// Open photo when clicked
document.addEventListener("click", function (event) {

    const photo = event.target.closest(".memory-photo");

    if (!photo || !photoViewer || !photoViewerImage) {
        return;
    }

    const imageUrl = photo.currentSrc || photo.src;

    if (!imageUrl) return;

    photoViewerImage.src = imageUrl;

    photoViewer.classList.add("active");

    document.body.style.overflow = "hidden";

});

// Close viewer
function closePhotoViewer() {

    if (!photoViewer || !photoViewerImage) return;

    photoViewer.classList.remove("active");

    photoViewerImage.src = "";

    document.body.style.overflow = "";

}

// Close using the X button
if (photoViewerClose) {

    photoViewerClose.addEventListener(
        "click",
        closePhotoViewer
    );

}

// Close by clicking the dark background
if (photoViewer) {

    photoViewer.addEventListener("click", function (event) {

        if (event.target === photoViewer) {
            closePhotoViewer();
        }

    });

}

// Close using Escape key
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closePhotoViewer();
    }

});
/* =========================================
   PRELUDE PHOTO CAROUSELS
   ========================================= */

document.querySelectorAll(".photo-carousel").forEach((carousel) => {

    const photos = carousel.querySelectorAll(".carousel-photo");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const nextBtn = carousel.querySelector(".carousel-next");
    const prevBtn = carousel.querySelector(".carousel-prev");

    if (!photos.length) return;

    let current = 0;

    function showPhoto(index) {

        current = (index + photos.length) % photos.length;

        photos.forEach((photo, i) => {
            photo.classList.toggle("active", i === current);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
        });
    }

    nextBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        showPhoto(current + 1);
    });

    prevBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        showPhoto(current - 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", (event) => {
            event.stopPropagation();
            showPhoto(index);
        });
    });
    // Auto-slide every 5 seconds
    if (photos.length > 1) {
        setInterval(() => {
            showPhoto(current + 1);
        }, 5000);
    }
});
