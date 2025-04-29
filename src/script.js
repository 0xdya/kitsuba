document.addEventListener("DOMContentLoaded", function () {
    // تعطيل التمرير عند تحميل الصفحة
    disableScroll();

    // التأكد من أن مكتبة AOS تم تحميلها
    if (typeof AOS !== "undefined") {
        // تهيئة AOS
        AOS.init({
            once: true // يجعل الأنميشن يحدث مرة واحدة فقط
        });

        // إخفاء البريلودر بعد تهيئة AOS
        hidePreloader();
    } else {
        console.error("مكتبة AOS لم يتم تحميلها بشكل صحيح.");
        // إخفاء البريلودر حتى لو لم يتم تحميل AOS
        hidePreloader();
    }
});

// دالة لإخفاء البريلودر
function hidePreloader() {
    let preloader = document.getElementById("preloader");
    if (preloader) {
        // إضافة كلاس لإخفاء البريلودر بتأثير تأخيري
        preloader.classList.add("preloader-hidden");

        // إخفاء البريلودر نهائيًا وإعادة التمرير بعد انتهاء التأثير
        setTimeout(() => {
            preloader.style.display = "none";
            enableScroll(); // إعادة التمرير بعد اختفاء البريلودر
        }, 600); // مدة التأخير تتناسب مع سرعة التأثير
    }
}

// تعطيل التمرير بالكامل
function disableScroll() {
    document.body.classList.add("no-scroll"); // إضافة كلاس لتعطيل التمرير
}

// إعادة التمرير بعد اختفاء البريلودر
function enableScroll() {
    document.body.classList.remove("no-scroll"); // إزالة الكلاس لإعادة التمرير
}

// update card
    function makeDraggable(box) {
    let isDragging = false, offsetX, offsetY, posX = 0, posY = 0;

    box.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - posX;
        offsetY = e.clientY - posY;
        box.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            posX = e.clientX - offsetX;
            posY = e.clientY - offsetY;
            box.style.transform = `translate(${posX}px, ${posY}px)`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        box.style.cursor = "grab";
    });
}
function timeSinceUpdate(lastUpdate) {
    let lastUpdateDate = new Date(lastUpdate);
    let now = new Date();
    let diffMs = now - lastUpdateDate;

    let diffSeconds = Math.floor(diffMs / 1000);
    let diffMinutes = Math.floor(diffSeconds / 60) % 60;
    let diffHours = Math.floor(diffSeconds / 3600) % 24;
    let diffDays = Math.floor(diffSeconds / (3600 * 24));
    let diffWeeks = Math.floor(diffDays / 7);
    let diffMonths = Math.floor(diffDays / 30);

    function getPluralForm(value, singular, dual, plural) {
        if (value === 1) return singular;
        if (value === 2) return dual;
        return plural;
    }

    let parts = [];

    if (diffMonths > 0) {
        parts.push(`${diffMonths} ${getPluralForm(diffMonths, "شهر", "شهرين", "أشهر")}`);
    } else if (diffWeeks > 0) {
        parts.push(`${diffWeeks} ${getPluralForm(diffWeeks, "أسبوع", "أسبوعين", "أسابيع")}`);
    } else if (diffDays > 0) {
        parts.push(`${diffDays} ${getPluralForm(diffDays, "يوم", "يومين", "أيام")}`);
    } else {
        if (diffHours > 0) {
            parts.push(`${diffHours} ${getPluralForm(diffHours, "ساعة", "ساعتين", "ساعات")}`);
        }
        if (diffMinutes > 0) {
            parts.push(`${diffMinutes} ${getPluralForm(diffMinutes, "دقيقة", "دقيقتين", "دقائق")}`);
        }
    }

    if (parts.length === 0) {
        parts.push(`${diffSeconds} ${getPluralForm(diffSeconds, "ثانية", "ثانيتين", "ثوانٍ")}`);
    }

    return parts.join(" و ");
}
function fetchUpdateDetails() {
        fetch("../update_log.json")
            .then(response => response.json())
            .then(data => {
                let updateHTML =`<div class="update_line">   <span class="variable update_margin1">publish</span>: <span class="string">"${data.pub}"</span>,<br></div>`;

            updateHTML += ` <div class="update_line">  <span class="variable update_margin1">lastUpdate</span>: <span class="string" dir="rtl">"${timeSinceUpdate(data.lastUpdate)}"</span>,<br></div>`;

                if (data.newFeatures.length > 0) {
                    updateHTML += ` <div class="update_line"> <span class="variable update_margin1">newFeatures</span>: <span class="bracket">[</span></div>`;
                    data.newFeatures.forEach(feature => {
                        updateHTML += `  <div class="update_line">  <span class="string update_margin2">"${feature}"</span>,</div>`;
                    });
                    updateHTML += ` <div class="update_line"> <span class="bracket">]</span>,</div>`;
                }

                if (data.bugFixes.length > 0) {
                    updateHTML += ` <div class="update_line"><span class="variable update_margin1">bugFixes</span>: <span class="bracket">[</span></div>`;
                    data.bugFixes.forEach(fix => {
                        updateHTML += `   <div class="update_line"> <span class="string update_margin2">"${fix}"</span>,</div>`;
                    });
                    updateHTML += `  <div class="update_line"><span class="bracket">]</span></div>`;
                }
                updateHTML += ``;
                document.getElementById("update-details").innerHTML = updateHTML;
            })
            .catch(() => {
                document.getElementById("update-details").textContent = "⚠️ فشل تحميل التحديثات!";
            });
    }
    fetchUpdateDetails();


'use strict';

// فتح أو إغلاق الشريط الجانبي
const elementToggleFunc = (elem) => elem.classList.toggle("active");

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));
}

// تفعيل الفلتر عند الاختيار
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = (selectedValue) => {
    filterItems.forEach(item => {
        const category = item.dataset.category || "";
        if (selectedValue === "all" || category === selectedValue) {
            item.classList.add('active');
            item.style.display = "block";
        } else {
            item.classList.remove('active');
            item.style.display = "none";
        }
    });
};

if (select && selectValue) {
    select.addEventListener('click', () => elementToggleFunc(select));

    selectItems.forEach(item => {
        item.addEventListener('click', function () {
            const selectedValue = this.innerText.trim().toLowerCase();
            selectValue.innerText = this.innerText;
            elementToggleFunc(select);
            filterFunc(selectedValue);
        });
    });
}

let lastClickedBtn = filterBtn.length ? filterBtn[0] : null;

filterBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        const selectedValue = this.innerText.trim().toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        if (lastClickedBtn) lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;
    });
});

// التنقل بين الصفحات
    const navigationLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    const secretButton = document.querySelector('[data-secret-nav]');
    let secretClickCount = 0; // عداد نقرات الزر السري

    // إنشاء عناصر الصوت
    const clickSound = new Audio('../sound/note.mp3'); // صوت لكل ضغطة
    const successSound = new Audio('../sound/complet.mp3'); // صوت عند الضغطة الأخيرة

navigationLinks.forEach(link => {
    link.addEventListener('click', function () {
        let targetPage = this.dataset.target || this.innerText.trim().toLowerCase(); // استخدم data-target إن وُجد وإلا فالنص العادي
        
        if (this.hasAttribute('data-secret-nav')) {
            secretClickCount++;
            if (secretClickCount < 7) {
                clickSound.play();
            } else {
                successSound.play();
                activatePage(targetPage, this);
            }
        } else {
            activatePage(targetPage, this);
        }
    });
});

function activatePage(targetPage, clickedElement) {
    pages.forEach(page => {
        page.classList.toggle('active', page.dataset.page === targetPage);
    });

    navigationLinks.forEach(nav => nav.classList.remove('active'));
    clickedElement.classList.add('active');

    window.scrollTo(0, 0);
}

    
    
// زر العودة إلى الرئيسية
document.querySelectorAll('#back-to-home').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        const homeNav = [...navigationLinks].find(nav => nav.innerText.trim() === "الرئيسية");

        if (homeNav) {
            homeNav.click();
            setTimeout(() => {
                const mapElement = document.getElementById('map');
                if (mapElement) {
                    mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    });
});

// عرض التسميات عند تمرير الفأرة على الأيقونات
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".laung").forEach(laung => {
        const label = document.createElement("div");
        label.className = "svg-label";
        label.textContent = laung.getAttribute("data-label");
        laung.appendChild(label);

        laung.addEventListener("click", function () {
            document.querySelectorAll(".svg-label").forEach(lbl => lbl.style.display = "none");
            label.style.display = "block";
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".laung")) {
            document.querySelectorAll(".svg-label").forEach(lbl => lbl.style.display = "none");
        }
    });
});

// حساب الوقت منذ تاريخ معين
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".date").forEach(element => {
        const dataDate = element.getAttribute("data-date");
        const date = new Date(dataDate);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / 86400000);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        let message = "";

        if (days < 1) {
            const hours = Math.floor(diff / 3600000);
            message = hours < 1 ? `قبل ${Math.floor(diff / 60000)} دقيقة` : `قبل ${hours} ساعة`;
        } else if (days <= 6) {
            message = `قبل ${days} ${days === 1 ? "يوم" : "أيام"}`;
        } else if (weeks <= 4) {
            message = `قبل ${weeks} ${weeks === 1 ? "أسبوع" : "أسابيع"}`;
        } else {
            message = `قبل ${months} ${months === 1 ? "شهر" : "أشهر"}`;
        }

        element.textContent = message;
    });
});

// التحكم بالصوت والثيم
const soundButton = document.getElementById("sound-toggle");
const themeButton = document.getElementById("theme-toggle");
soundButton.checked = localStorage.getItem("sound") === "enable";
themeButton.checked = localStorage.getItem("theme") === "light";
const body = document.body;

let soundEnabled = localStorage.getItem("sound") === "enable";

// إنشاء AudioContext للتأكد من تشغيل الصوت عند التفاعل الأول
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(file) {
    if (audioContext.state === "suspended") {
        audioContext.resume().then(() => {
            console.log("تم استئناف AudioContext.");
        });
    }

    const audio = new Audio(`../sound/${file}`);
    audio.play().catch(error => console.error("خطأ في تشغيل الصوت:", error));
}

// إذا كانت أول زيارة، فعل الصوت تلقائيًا
if (localStorage.getItem("sound") === null) {
    soundEnabled = true;
    localStorage.setItem("sound", "enable");
}

// استرجاع الثيم المخزن وتطبيقه عند تحميل الصفحة
let theme = localStorage.getItem("theme") || "dark";
body.classList.toggle("light-mode", theme === "light");

function updateButtons() {
    if (soundButton) {
        soundButton.textContent = soundEnabled ? "🔊 صوت مفعل" : "🔇 صوت معطل";
    }
    if (themeButton) {
        themeButton.textContent = theme === "dark" ? "🌙 الوضع الداكن" : "☀️ الوضع الفاتح";
    }
}
updateButtons();

// تفعيل الصوت عند التفاعل الأول
document.addEventListener("click", (event) => {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    if (!soundEnabled) return;
    
    const soundFile = event.target.getAttribute("data-sound");
    if (soundFile) {
        playSound(soundFile);
    }
});

if (themeButton) {
    themeButton.addEventListener("click", () => {
        playSound(theme === "dark" ? "light_on.wav" : "light_on.wav");
        theme = theme === "dark" ? "light" : "dark";
        body.classList.toggle("light-mode", theme === "light");
        localStorage.setItem("theme", theme);
        updateButtons();
    });
}

if (soundButton) {
    soundButton.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem("sound", soundEnabled ? "enable" : "disable");
        updateButtons();
        playSound(soundEnabled ? "enable.mp3" : "disable.mp3");
    });
}
    // إنشاء مشهد ثلاثي الأبعاد بسيط لتأثير الخلفية
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 9);
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('bg'), alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // إضافة مكعب بسيط يدور
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // تأثير التدوير المستمر
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
// اهتزاز الزر
        document.getElementById("shakeButton").addEventListener("click", function() {
            let button = this;
            button.classList.add("shake");

            // إزالة التأثير بعد انتهاء الاهتزاز
            setTimeout(() => {
                button.classList.remove("shake");
            }, 300);
        });
if (navigator.userAgent.includes("Instagram")) {
    alert("قد تواجه مشاكل في عرض الموقع داخل متصفح Instagram. يُفضل فتحه في متصفح خارجي.");
}


