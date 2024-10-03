document.addEventListener('DOMContentLoaded', function() {
    // Обробка кнопок "Відповісти"
    const replyButtons = document.querySelectorAll('.reply-button');
    console.log('Знайдено кнопок відповісти:', replyButtons.length);
    
    replyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log('Кнопка відповісти натиснута');
            const commentId = this.getAttribute('data-comment-id');
            const replyForm = document.getElementById('reply-form-' + commentId);
            console.log('replyForm:', replyForm);
            
            if (replyForm) {
                // Перемикаємо видимість форми
                replyForm.style.display = (replyForm.style.display === 'none' || replyForm.style.display === '') ? 'block' : 'none';
            } else {
                console.warn(`Форма відповіді з ID "reply-form-${commentId}" не знайдена.`);
            }
        });
    });

    // Обробка зміни файлів у всіх формах
    document.body.addEventListener('change', function(event) {
        const fileInput = event.target;
        if (fileInput.tagName.toLowerCase() === 'input' && fileInput.type === 'file') {
            const form = fileInput.closest('form');
            if (!form) return;

            // Оновлюємо пошук елемента прев'ю
            const previewImage = form.querySelector('.previewImage'); // Пошук елементу для прев'ю

            if (fileInput.name === 'image') {
                const file = fileInput.files[0];
                if (file) {
                    if (validateImage(file)) {
                        if (previewImage) {
                            displayImagePreview(file, previewImage); // Виклик функції для показу зображення
                        }
                    } else {
                        alert('Зображення має бути менше ніж 1 МБ і бути зображенням.');
                        if (previewImage) {
                            previewImage.style.display = 'none';
                            previewImage.src = '';
                        }
                        fileInput.value = ''; // Очищаємо інпут після помилки
                    }
                } else {
                    if (previewImage) {
                        previewImage.style.display = 'none';
                        previewImage.src = '';
                    }
                }
            }
        }
    });

    // Функція для перевірки зображення
    function validateImage(file) {
        const maxSize = 1024 * 1024; // 1 МБ
        return file.type.startsWith('image/') && file.size <= maxSize;
    }

    // Функція для відображення прев'ю зображення
    function displayImagePreview(file, previewElement) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Функція для додавання тегів до текстової області
function addTag(startTag, endTag) {
    const textArea = document.querySelector('textarea');
    if (!textArea) {
        console.warn('Текстова область не знайдена.');
        return;
    }
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = textArea.value.substring(start, end);
    const newText = startTag + selectedText + endTag;
    textArea.value = textArea.value.substring(0, start) + newText + textArea.value.substring(end);
    textArea.focus();
    textArea.setSelectionRange(start + startTag.length, end + startTag.length);
}
