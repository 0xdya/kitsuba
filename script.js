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

// تفعيل النموذج (Contact Form)
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (form && formBtn) {
    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            formBtn.disabled = !form.checkValidity();
        });
    });
}

// التنقل بين الصفحات
    const navigationLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    const secretButton = document.querySelector('[data-secret-nav]');
    let secretClickCount = 0; // عداد نقرات الزر السري

    // إنشاء عناصر الصوت
    const clickSound = new Audio('sound/vilg.mp3'); // صوت لكل ضغطة
    const successSound = new Audio('sound/complet.mp3'); // صوت عند الضغطة الأخيرة

    navigationLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (this.hasAttribute('data-secret-nav')) {
                // زر سري، يحتاج 7 نقرات
                secretClickCount++;

                if (secretClickCount < 7) {
                    clickSound.play(); // تشغيل الصوت العادي
                } else {
                    successSound.play(); // تشغيل الصوت النهائي
                    activatePage(this.innerText.trim().toLowerCase(), this);
                }
            } else {
                // باقي الأزرار تعمل بشكل طبيعي
                activatePage(this.innerText.trim().toLowerCase(), this);
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
// التحكم بالصوت والثيم
const soundButton = document.getElementById("sound-toggle");
const themeButton = document.getElementById("theme-toggle");
const body = document.body;

let soundEnabled = localStorage.getItem("sound") === "enable";

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

function playSound(file) {
    const audio = new Audio(`./sound/${file}`);
    audio.play().catch(error => console.error("خطأ في تشغيل الصوت:", error));
}

document.addEventListener("click", (event) => {
    if (!soundEnabled) return;
    const soundFile = event.target.getAttribute("data-sound");
    if (soundFile) playSound(soundFile);
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
        playSound(soundEnabled ? "up.mp3" : "down.mp3");
    });
}

updateButtons();


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
