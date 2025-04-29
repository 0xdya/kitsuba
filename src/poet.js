document.getElementById('poetryAdviceForm').addEventListener('submit', function(e) {
    e.preventDefault(); // منع الإرسال الافتراضي

    const name = document.getElementById('poetryName').value.trim() || 'بدون اسم';
    const message = document.getElementById('poetryMessage').value.trim();

    const statusMessage = document.getElementById('poetryStatusMessage');

    if (message === '') {
        statusMessage.textContent = 'الرجاء كتابة نصيحة قبل الإرسال.';
        statusMessage.style.color = 'red';
        return;
    }

    let botToken = "7952561228:AAH3QaAMuQw9vzXPOcbeG_dj-7CMms40TQ4";
    let chatId = "5962064921"; 
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const fullMessage = `✍️ نصيحة جديدة:\n\nالاسم: ${name}\nالنصيحة:\n${message}`;

    fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: fullMessage
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            statusMessage.textContent = 'تم الإرسال بنجاح!';
            statusMessage.style.color = 'white';
            document.getElementById('poetryAdviceForm').reset(); // تفريغ النموذج بعد الإرسال
        } else {
            statusMessage.textContent = 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.';
            statusMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = 'فشل الاتصال بالخادم.';
        statusMessage.style.color = 'red';
    });
});
