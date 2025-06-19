// Анимация появления секций при скролле
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.section');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            sections.forEach(section => {
                observer.observe(section);
            });
        });

        // Разбиваем текст на буквы
        const text = document.querySelector('h1');
        text.innerHTML = text.textContent.split('').map(letter => 
        `<span>${letter}</span>`
        ).join('');

          
         // Замените эти значения на свои
    const BOT_TOKEN = '8196953274:AAFPzfz7wmf_qW_vNA33Zy8eSc9wmMabIa0';
    const CHAT_ID = '1820923390';
    
    function updateGuestFields() {
        const guestsSelect = document.getElementById('guests');
        const guestCount = parseInt(guestsSelect.value);
        const container = document.getElementById('guest-fields-container');
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Добавляем поля только если выбрано больше 1 гостя
        if (guestCount > 1) {
            for (let i = 2; i <= guestCount; i++) {
                const div = document.createElement('div');
                div.className = 'form-group';
                
                const label = document.createElement('label');
                label.setAttribute('for', `guest-name-${i}`);
                label.textContent = `Имя гостя ${i}`;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `guest-name-${i}`;
                input.name = `guest-name-${i}`;
                input.required = true;
                
                div.appendChild(label);
                div.appendChild(input);
                container.appendChild(div);
            }
        }
    }
    
    function resetForm() {
        const form = document.getElementById('rsvpForm');
        form.reset();
        
        // Очищаем динамические поля гостей
        const container = document.getElementById('guest-fields-container');
        container.innerHTML = '';
        
        // Сбрасываем количество гостей на 1
        document.getElementById('guests').value = '1';
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        updateGuestFields();
        
        document.getElementById('rsvpForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const guestsCount = parseInt(formData.get('guests'));
            let messageText = `Новое подтверждение присутствия:\n\n`;
            
            messageText += `👤 Основной гость: ${formData.get('name')}\n`;
            messageText += `🔢 Количество гостей: ${guestsCount}\n`;
            
            if (guestsCount > 1) {
                for (let i = 2; i <= guestsCount; i++) {
                    messageText += `👥 Гость ${i}: ${formData.get(`guest-name-${i}`)}\n`;
                }
            }
            
            messageText += `\nПрисутствие: ${formData.get('attending') === 'yes' ? '✅ Приду' : '❌ Не смогу'}\n`;
            
            if (formData.get('message')) {
                messageText += `\n💬 Пожелания: ${formData.get('message')}`;
            }
            
            // Отправка в Telegram
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: messageText,
                    parse_mode: 'HTML'
                })
            })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('form-message');
                messageDiv.style.display = 'block';
                messageDiv.innerHTML = '<p style="color: green;">Спасибо! Ваше сообщение получено.</p>';
                
                // Сбрасываем форму и убираем лишние поля
                resetForm();
                
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                const messageDiv = document.getElementById('form-message');
                messageDiv.style.display = 'block';
                messageDiv.innerHTML = '<p style="color: red;">Ошибка при отправке. Пожалуйста, попробуйте позже.</p>';
            });
        });
    });