from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Comment, Profile
import requests
from django.conf import settings
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(
        choices=Profile.USER_TYPES, default='commentator'
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'user_type')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Паролі не збігаються."})
        return attrs

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        Profile.objects.create(user=user, user_type=user_type)
        return user

class CommentSerializer(serializers.ModelSerializer):
    captcha_token = serializers.CharField(write_only=True)
    user = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(),
        required=False,
        allow_null=True
    )
    image = serializers.ImageField(required=False)
    file = serializers.FileField(required=False)
    image_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    parent_comment_preview = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'user',
            'text',
            'created_at',
            'parent',
            'parent_comment_preview',
            'image',
            'image_url',
            'file',
            'file_url',
            'replies',
            'is_owner',
            'captcha_token',
        ]
    def validate_captcha_token(self, value):
        secret_key = settings.RECAPTCHA_SECRET_KEY
        data = {
            'secret': secret_key,
            'response': value
        }
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result = response.json()
        if not result.get('success'):
            raise serializers.ValidationError('Неправильний код CAPTCHA.')
        return value

    def create(self, validated_data):
        validated_data.pop('captcha_token', None)
        return super().create(validated_data)
    
    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_replies(self, obj):
        replies = obj.replies.all().order_by('-created_at')
        request = self.context.get('request')

        username = request.query_params.get('username')
        email = request.query_params.get('email')
        date = request.query_params.get('date')

        if username:
            replies = replies.filter(user__username__icontains=username)
        if email:
            replies = replies.filter(user__email__icontains=email)
        if date:
            replies = replies.filter(created_at__date=date)

        serializer = CommentSerializer(replies, many=True, context=self.context)
        return serializer.data


    def get_is_owner(self, obj):
        request = self.context.get('request')
        return obj.user == request.user

    def get_parent_comment_preview(self, obj):
        if obj.parent:
            return obj.parent.text[:50]
        return ""
