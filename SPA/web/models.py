from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from PIL import Image
import bleach

class Profile(models.Model):
    USER_TYPES = (
        ('author', 'Author'),
        ('commentator', 'Commentator'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='commentator')

    def __str__(self):
        return f'{self.user.username} ({self.get_user_type_display()})'

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    file = models.FileField(upload_to='files/', blank=True, null=True)

    def parent_comment_preview(self):
        if self.parent:
            return self.parent.text[:50]  # Показуємо перші 50 символів батьківського коментаря
        return None

    def clean(self):
        if self.file and self.file.size > 102400:  # 100 КБ
            raise ValidationError("Файл не повинен бути більшим за 100 КБ.")
        if self.image and self.image.size > 1024 * 1024:  # 1 МБ
            raise ValidationError("Зображення не повинно бути більшим за 1 МБ.")

    def save(self, *args, **kwargs):
        self.clean()  # Перевірка файлу перед збереженням
        self.text = bleach.clean(self.text)
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image.path)
            max_width = 320
            max_height = 240
            if img.height > max_height or img.width > max_width:
                output_size = (max_width, max_height)
                img.thumbnail(output_size)
                img.save(self.image.path)

    def __str__(self):
        return f'{self.user.username} - {self.text[:20]}'
