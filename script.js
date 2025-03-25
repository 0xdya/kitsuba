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
    const clickSound = new Audio('sound/throw.mp3'); // صوت لكل ضغطة
    const successSound = new Audio('sound/complet.mp3'); // صوت عند الضغطة الأخيرة

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

    const audio = new Audio(`./sound/${file}`);
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
AOS.init({
  once: true // يجعل الأنميشن يحدث مرة واحدة فقط
});


// Contact

// ✅ دالة عرض التنبيهات
function showAlert(message, type = 'info', duration = 3000) {
    const alertsContainer = document.getElementById('alerts-container');

    // إنشاء عنصر التنبيه
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <span>${message}</span>
        <span class="close-btn">&times;</span>
    `;

    // إضافة التنبيه إلى الشاشة
    alertsContainer.appendChild(alertDiv);

    // إغلاق التنبيه عند الضغط على زر الإغلاق
    alertDiv.querySelector('.close-btn').addEventListener('click', () => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    });

    // إخفاء التنبيه تلقائيًا بعد المدة المحددة
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, duration);
}
// ✅ دالة لتفريغ الحقول بعد الإرسال
function clearForm(formId) {
    document.querySelector(`#${formId} input[name="username"]`).value = '';
    document.querySelector(`#${formId} textarea[name="message"]`).value = '';

    // إذا كان النموذج الأول، امسح حقول الملفات أيضًا
    if (formId === 'contactForm1') {
        document.querySelector(`#${formId} input[type="file"]`).value = '';
        document.getElementById('file-name1').textContent = 'تحميل ملف';
        document.getElementById('image-name1').textContent = 'تحميل صورة';
    }
}

// ✅ دالة لجلب عنوان IP
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'غير متوفر';
    }
}

// ✅ معالجة النموذج الأول (مع رفع الملفات)
document.getElementById('contactForm1').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username1').value.trim();
    const message = document.getElementById('message1').value.trim();
    const fileInput = document.getElementById('file1');
    const imageInput = document.getElementById('image1');

    const file = fileInput.files.length > 0 ? fileInput.files[0] : null;
    const image = imageInput.files.length > 0 ? imageInput.files[0] : null;
    const ipAddress = await getIPAddress();

    if (!username || !message) {
        showAlert("❌ يرجى ملء جميع الحقول!", "error");
        return;
    }

    let endpoint = "sendMessage";
    let url = `https://api.telegram.org/bot7741815017:AAGTPiZID3RsHP-H9N67NVXKlrTygrMh-VY/${endpoint}`;
    let formData;

    if (file) {
        endpoint = "sendDocument";
        url = `https://api.telegram.org/bot7741815017:AAGTPiZID3RsHP-H9N67NVXKlrTygrMh-VY/${endpoint}`;
        formData = new FormData();
        formData.append('chat_id', 5962064921);
        formData.append('caption', `👤 الاسم: ${username}\n💬 الرسالة: ${message}\n🌐 IP: ${ipAddress}`);
        formData.append('document', file);
    } else if (image) {
        endpoint = "sendPhoto";
        url = `https://api.telegram.org/bot7741815017:AAGTPiZID3RsHP-H9N67NVXKlrTygrMh-VY/${endpoint}`;
        formData = new FormData();
        formData.append('chat_id', 5962064921);
        formData.append('caption', `👤 الاسم: ${username}\n💬 الرسالة: ${message}\n🌐 IP: ${ipAddress}`);
        formData.append('photo', image);
    } else {
        formData = JSON.stringify({
            chat_id: 5962064921,
            text: `👤 الاسم: ${username}\n💬 الرسالة: ${message}\n🌐 IP: ${ipAddress}`
        });
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: file || image ? {} : { "Content-Type": "application/json" }
        });

        const data = await response.json();
        console.log("📨 Telegram Response:", data);

        if (data.ok) {
            showAlert("✅ تم إرسال البلاغ بنجاح!", "success");
            clearForm("contactForm1");
        } else {
            showAlert(`❌ فشل الإرسال: ${data.description || "خطأ غير معروف"}`, "error");
        }
    } catch (error) {
        console.error("❌ خطأ أثناء الإرسال:", error);
        showAlert("❌ حدث خطأ أثناء الإرسال!", "error");
    }
});

// ✅ معالجة النموذج الثاني (بدون رفع ملفات)
        document.getElementById('messageForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const statusMessage = document.getElementById('status-message');
            statusMessage.textContent = "🚀 جاري الإرسال...";
            statusMessage.style.color = "blue";

            const fullName = document.getElementById('fullName').value.trim();
            const userMessage = document.getElementById('userMessage').value.trim();

            if (!fullName || !userMessage) {
                statusMessage.textContent = "❌ يرجى ملء جميع الحقول!";
                statusMessage.style.color = "red";
                return;
            }

            const ipAddress = await getIPAddress();

            const botToken = "8182375548:AAEwMmAtlekkMM_12SerT66cc4e2DxJJv3g"; // استبدله بالتوكن الفعلي
            const chatID = 5962064921; // استبدله بـ chat_id الفعلي

            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatID,
                        text: `👤 الاسم: ${fullName}\n💬 الرسالة: ${userMessage}\n🌐 IP: ${ipAddress}`
                    })
                });

                const data = await response.json();
                console.log("📨 Telegram Response:", data);

                if (data.ok) {
                    statusMessage.textContent = "✅ تم إرسال الرسالة بنجاح!";
                    statusMessage.style.color = "green";
                    document.getElementById('messageForm').reset();
                } else {
                    statusMessage.textContent = "❌ فشل في الإرسال: " + (data.description || "خطأ غير معروف");
                    statusMessage.style.color = "red";
                }
            } catch (error) {
                console.error("❌ Error:", error);
                statusMessage.textContent = "❌ حدث خطأ أثناء الإرسال!";
                statusMessage.style.color = "red";
            }
        });

        async function getIPAddress() {
            try {
                const res = await fetch('https://api64.ipify.org?format=json');
                const data = await res.json();
                return data.ip;
            } catch (error) {
                console.error("❌ Error fetching IP:", error);
                return "غير معروف";
            }
        }

// دالة عرض التنبيهات
function showAlert(message, type) {
    alert(message);
}
