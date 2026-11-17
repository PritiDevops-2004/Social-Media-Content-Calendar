
// ===================================
// SOCIALFLOW - SOCIAL MEDIA PLANNER
// ===================================

// 1. Select HTML elements
const postForm = document.getElementById("postForm");
const postFormSection = document.getElementById("postFormSection");
const addPostBtn = document.getElementById("addPostBtn");
const postImage = document.getElementById("postImage");
const imagePreview = document.getElementById("imagePreview");

// 2. Image variable
let uploadedImage = "";

// 3. Sample posts
const samplePosts = [
    {
        id: 1,
        title: "Welcome to our community",
        platform: "Instagram",
        caption: "Welcome! Follow us for exciting updates.",
        hashtags: "#Welcome #Community",
        date: "2026-11-17",
        time: "10:00",
        type: "Image",
        status: "Scheduled",
        image: ""
    },
    {
        id: 2,
        title: "5 tips for better productivity",
        platform: "LinkedIn",
        caption: "Improve your productivity with these five tips.",
        hashtags: "#Productivity #Success",
        date: "2026-11-19",
        time: "09:15",
        type: "Carousel",
        status: "Scheduled",
        image: ""
    },
    {
        id: 3,
        title: "New Product Launch",
        platform: "Instagram",
        caption: "Discover our new product!",
        hashtags: "#NewProduct #Launch",
        date: "2026-11-20",
        time: "11:00",
        type: "Image",
        status: "Draft",
        image: ""
    },
    {
        id: 4,
        title: "Company Update",
        platform: "LinkedIn",
        caption: "We have exciting company news.",
        hashtags: "#Business #Update",
        date: "2026-11-21",
        time: "12:00",
        type: "Text",
        status: "Published",
        image: ""
    },
    {
        id: 5,
        title: "Weekend Campaign",
        platform: "Facebook",
        caption: "Join our weekend campaign.",
        hashtags: "#Weekend",
        date: "2026-11-22",
        time: "09:00",
        type: "Carousel",
        status: "Pending Approval",
        image: ""
    }
];

// 4. Load posts from Local Storage
let posts = [];

function loadPosts() {
    const savedPosts = localStorage.getItem("socialFlowPosts");

    if (savedPosts !== null) {
        try {
            posts = JSON.parse(savedPosts);

            if (!Array.isArray(posts)) {
                posts = [...samplePosts];
            }
        } catch (error) {
            console.error("Could not load posts:", error);
            posts = [...samplePosts];
        }
    } else {
        posts = [...samplePosts];
        savePosts();
    }
}

// 5. Save posts
function savePosts() {
    try {
        localStorage.setItem(
            "socialFlowPosts",
            JSON.stringify(posts)
        );
    } catch (error) {
        alert("Storage is full. Try using a smaller image.");
        console.error(error);
    }
}

// 6. Update Dashboard
function updateDashboard() {

    document.getElementById("totalPosts").textContent = posts.length;

    document.getElementById("draftPosts").textContent =
        posts.filter(p => p.status === "Draft").length;

    document.getElementById("scheduledPosts").textContent =
        posts.filter(p => p.status === "Scheduled").length;

    document.getElementById("publishedPosts").textContent =
        posts.filter(p => p.status === "Published").length;

    document.getElementById("pendingPosts").textContent =
        posts.filter(p => p.status === "Pending Approval").length;
}

// 7. Display Manage Posts
function renderPosts() {

    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    if (posts.length === 0) {
        postList.textContent = "No posts available.";
        return;
    }

    posts.forEach(post => {

        const card = document.createElement("div");
        card.className = "stat-card";

        const title = document.createElement("h3");
        title.textContent = post.title;

        const details = document.createElement("p");
        details.textContent =
            post.platform + " | " +
            post.date + " | " +
            post.time + " | " +
            post.status;

        const caption = document.createElement("p");
        caption.textContent = post.caption;

        if (post.image) {
            const img = document.createElement("img");
            img.src = post.image;
            img.alt = "Post image";
            img.width = 120;
            card.appendChild(img);
        }

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            editPost(post.id);
        });

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            deletePost(post.id);
        });

        // Duplicate Button
        const duplicateBtn = document.createElement("button");
        duplicateBtn.textContent = "Duplicate";

        duplicateBtn.addEventListener("click", function() {
            duplicatePost(post.id);
        });

        card.append(
            title,
            details,
            caption,
            editBtn,
            deleteBtn,
            duplicateBtn
        );

        postList.appendChild(card);
    });
}

// 8. Display Calendar
function renderCalendar() {

    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";

    if (posts.length === 0) {
        calendarGrid.textContent = "No scheduled posts.";
        return;
    }

    const sortedPosts = [...posts].sort((a, b) =>
        (a.date + a.time).localeCompare(b.date + b.time)
    );

    sortedPosts.forEach(post => {

        const item = document.createElement("div");
        item.className = "stat-card";

        const heading = document.createElement("h3");
        heading.textContent = post.title;

        const details = document.createElement("p");
        details.textContent =
            post.date + " | " +
            post.time + " | " +
            post.platform;

        const status = document.createElement("p");
        status.textContent = post.status;

        item.append(heading, details, status);
        calendarGrid.appendChild(item);
    });
}

// 9. Display Upcoming Posts
function renderUpcomingPosts() {

    const upcoming = document.getElementById("upcomingPosts");

    upcoming.innerHTML = "<h3>Upcoming Posts</h3>";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingList = posts
        .filter(post =>
            post.status === "Scheduled" &&
            new Date(post.date + "T00:00:00") >= today
        )
        .sort((a, b) =>
            (a.date + a.time).localeCompare(b.date + b.time)
        )
        .slice(0, 5);

    if (upcomingList.length === 0) {
        upcoming.append("No upcoming posts.");
        return;
    }

    upcomingList.forEach(post => {
        const item = document.createElement("p");

        item.textContent =
            post.date + " | " +
            post.title + " | " +
            post.time + " | " +
            post.platform;

        upcoming.appendChild(item);
    });
}

// 10. Platform Distribution
function renderPlatformDistribution() {

    const container = document.getElementById("platformDistribution");

    container.innerHTML = "<h3>Platform Distribution</h3>";

    const platforms = {};

    posts.forEach(post => {
        platforms[post.platform] =
            (platforms[post.platform] || 0) + 1;
    });

    Object.entries(platforms).forEach(([name, count]) => {
        const item = document.createElement("p");
        item.textContent = name + ": " + count + " posts";
        container.appendChild(item);
    });
}

// 11. Add New Post
addPostBtn.addEventListener("click", function() {

    postForm.reset();

    document.getElementById("postId").value = "";

    uploadedImage = "";
    imagePreview.src = "";
    imagePreview.hidden = true;

    postFormSection.scrollIntoView({
        behavior: "smooth"
    });
});

// 12. Save Post
postForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("postId").value;

    const newPost = {
        id: id ? Number(id) : Date.now(),
        title: document.getElementById("postTitle").value.trim(),
        platform: document.getElementById("platform").value,
        caption: document.getElementById("caption").value.trim(),
        hashtags: document.getElementById("hashtags").value.trim(),
        date: document.getElementById("postDate").value,
        time: document.getElementById("postTime").value,
        type: document.getElementById("contentType").value,
        status: document.getElementById("postStatus").value,
        image: uploadedImage
    };

    if (
        !newPost.title ||
        !newPost.caption ||
        !newPost.date ||
        !newPost.time
    ) {
        alert("Please complete all required fields.");
        return;
    }

    if (id) {
        posts = posts.map(post =>
            post.id === Number(id) ? newPost : post
        );
    } else {
        posts.push(newPost);
    }

    savePosts();

    updateDashboard();
    renderPosts();
    renderCalendar();
    renderUpcomingPosts();
    renderPlatformDistribution();

    postForm.reset();

    document.getElementById("postId").value = "";

    uploadedImage = "";
    imagePreview.src = "";
    imagePreview.hidden = true;

    alert("Post saved successfully!");
});

// 13. Edit Post
function editPost(id) {

    const post = posts.find(p => p.id === id);

    if (!post) return;

    document.getElementById("postId").value = post.id;
    document.getElementById("postTitle").value = post.title;
    document.getElementById("platform").value = post.platform;
    document.getElementById("caption").value = post.caption;
    document.getElementById("hashtags").value = post.hashtags;
    document.getElementById("postDate").value = post.date;
    document.getElementById("postTime").value = post.time;
    document.getElementById("contentType").value = post.type;
    document.getElementById("postStatus").value = post.status;

    uploadedImage = post.image || "";

    if (uploadedImage) {
        imagePreview.src = uploadedImage;
        imagePreview.hidden = false;
    } else {
        imagePreview.src = "";
        imagePreview.hidden = true;
    }

    postFormSection.scrollIntoView({
        behavior: "smooth"
    });
}

// 14. Duplicate Post
function duplicatePost(id) {

    const originalPost = posts.find(post => post.id === id);

    if (!originalPost) return;

    const copiedPost = {
        ...originalPost,
        id: Date.now(),
        title: originalPost.title + " (Copy)",
        status: "Draft"
    };

    posts.push(copiedPost);

    savePosts();

    updateDashboard();
    renderPosts();
    renderCalendar();
    renderUpcomingPosts();
    renderPlatformDistribution();

    alert("Post duplicated successfully!");
}

// 15. Delete Post
function deletePost(id) {

    if (confirm("Are you sure you want to delete this post?")) {

        posts = posts.filter(post => post.id !== id);

        savePosts();

        updateDashboard();
        renderPosts();
        renderCalendar();
        renderUpcomingPosts();
        renderPlatformDistribution();

        alert("Post deleted successfully!");
    }
}

// 16. Image Upload
postImage.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        postImage.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        uploadedImage = e.target.result;

        imagePreview.src = uploadedImage;
        imagePreview.hidden = false;
    };

    reader.readAsDataURL(file);
});

// 17. Cancel / Reset Form
postForm.addEventListener("reset", function() {

    uploadedImage = "";

    imagePreview.src = "";
    imagePreview.hidden = true;

    document.getElementById("postId").value = "";
});

// 18. Initialize Application
loadPosts();

updateDashboard();
renderPosts();
renderCalendar();
renderUpcomingPosts();
renderPlatformDistribution();
