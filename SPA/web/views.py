from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
from .models import Comment
from .serializers import CommentSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from django.http import JsonResponse
from captcha.models import CaptchaStore
from captcha.helpers import captcha_image_url
import requests
from django.conf import settings

def refresh_captcha(request):
    """Оновлення CAPTCHA і повернення нового зображення і ключа."""
    new_key = CaptchaStore.generate_key()
    new_image_url = captcha_image_url(new_key)
    return JsonResponse({
        'key': new_key,
        'image_url': new_image_url,
    })

def verify_recaptcha(captcha_token):
    """Перевірка reCAPTCHA з використанням Google API"""
    recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': settings.RECAPTCHA_PRIVATE_KEY,
        'response': captcha_token
    }
    response = requests.post(recaptcha_url, data=data)
    result = response.json()
    return result.get('success', False)

@api_view(['POST'])
def add_comment(request):
    captcha_token = request.data.get('captcha_token')

    if not verify_recaptcha(captcha_token):
        return JsonResponse({'error': 'CAPTCHA перевірка не пройдена'}, status=400)
    
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.errors, status=400)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Comment.objects.filter(parent__isnull=True)

        username = self.request.query_params.get('username')
        email = self.request.query_params.get('email')
        date = self.request.query_params.get('date')

        if username:
            queryset = queryset.filter(user__username__icontains=username)
        if email:
            queryset = queryset.filter(user__email__icontains=email)
        if date:
            queryset = queryset.filter(created_at__date=date)

        queryset = queryset.order_by('-created_at')

        return queryset


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
