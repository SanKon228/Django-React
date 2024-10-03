from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from captcha.fields import CaptchaField
from .models import Comment

class RegisterForm(UserCreationForm):
    email = forms.EmailField()
    captcha = CaptchaField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'captcha']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text', 'image', 'file', 'captcha']
        widgets = {
            'text': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Введіть ваш коментар...'}),
        }

    def clean_text(self):
        text = self.cleaned_data.get('text')
        if not text:
            raise forms.ValidationError("Коментар не може бути порожнім.")
        return text

    def clean_file(self):
        file = self.cleaned_data.get('file')
        if file:
            if file.size > 102400:  
                raise forms.ValidationError("Файл не повинен бути більшим за 100 КБ.")
            if not file.name.endswith('.txt'):
                raise forms.ValidationError("Файл повинен бути у форматі .txt.")
        return file

    def clean_image(self):
        image = self.cleaned_data.get('image')
        if image:
            if image.size > 1024 * 1024:  # 1 МБ
                raise forms.ValidationError("Зображення не повинно бути більшим за 1 МБ.")
        return image
