"""
Django settings for UserManagement project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-r2)&k+d9rw^valsfex$-+e(9&l-($t234was%#&!kc41rcvdz5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '1a1.42angouleme.fr',
    '1a2.42angouleme.fr',
    '1a3.42angouleme.fr',
    '1a4.42angouleme.fr',
    '1a5.42angouleme.fr',
    '1a6.42angouleme.fr',
    '1a7.42angouleme.fr',
    '1b1.42angouleme.fr',
    '1b2.42angouleme.fr',
    '1b3.42angouleme.fr',
    '1b4.42angouleme.fr',
    '1b5.42angouleme.fr',
    '1b6.42angouleme.fr',
    '1b7.42angouleme.fr',
    '1c1.42angouleme.fr',
    '1c2.42angouleme.fr',
    '1c3.42angouleme.fr',
    '1c4.42angouleme.fr',
    '1c5.42angouleme.fr',
    '1c6.42angouleme.fr',
    '1c7.42angouleme.fr',
    '1d1.42angouleme.fr',
    '1d2.42angouleme.fr',
    '1d3.42angouleme.fr',
    '1d4.42angouleme.fr',
    '1d5.42angouleme.fr',
    '1d6.42angouleme.fr',
    '1d7.42angouleme.fr',
    '1e1.42angouleme.fr',
    '1e2.42angouleme.fr',
    '1e3.42angouleme.fr',
    '1e4.42angouleme.fr',
    '1e5.42angouleme.fr',
    '1e6.42angouleme.fr',
    '1e7.42angouleme.fr',
    '1f1.42angouleme.fr',
    '1f2.42angouleme.fr',
    '1f3.42angouleme.fr',
    '1f4.42angouleme.fr',
    '1f5.42angouleme.fr',
    '1f6.42angouleme.fr',
    '1f7.42angouleme.fr',
    '1g1.42angouleme.fr',
    '1g2.42angouleme.fr',
    '1g3.42angouleme.fr',
    '1g4.42angouleme.fr',
    '1g5.42angouleme.fr',
    '1g6.42angouleme.fr',
    '1g7.42angouleme.fr',
    '2a1.42angouleme.fr',
    '2a2.42angouleme.fr',
    '2a3.42angouleme.fr',
    '2a4.42angouleme.fr',
    '2a5.42angouleme.fr',
    '2a6.42angouleme.fr',
    '2a7.42angouleme.fr',
    '2b1.42angouleme.fr',
    '2b2.42angouleme.fr',
    '2b3.42angouleme.fr',
    '2b4.42angouleme.fr',
    '2b5.42angouleme.fr',
    '2b6.42angouleme.fr',
    '2b7.42angouleme.fr',
    '2c1.42angouleme.fr',
    '2c2.42angouleme.fr',
    '2c3.42angouleme.fr',
    '2c4.42angouleme.fr',
    '2c5.42angouleme.fr',
    '2c6.42angouleme.fr',
    '2c7.42angouleme.fr',
    '2d1.42angouleme.fr',
    '2d2.42angouleme.fr',
    '2d3.42angouleme.fr',
    '2d4.42angouleme.fr',
    '2d5.42angouleme.fr',
    '2d6.42angouleme.fr',
    '2d7.42angouleme.fr',
    '2e1.42angouleme.fr',
    '2e2.42angouleme.fr',
    '2e3.42angouleme.fr',
    '2e4.42angouleme.fr',
    '2e5.42angouleme.fr',
    '2e6.42angouleme.fr',
    '2e7.42angouleme.fr',
    '2f1.42angouleme.fr',
    '2f2.42angouleme.fr',
    '2f3.42angouleme.fr',
    '2f4.42angouleme.fr',
    '2f5.42angouleme.fr',
    '2f6.42angouleme.fr',
    '2f7.42angouleme.fr',
    '2g1.42angouleme.fr',
    '2g2.42angouleme.fr',
    '2g3.42angouleme.fr',
    '2g4.42angouleme.fr',
    '2g5.42angouleme.fr',
    '2g6.42angouleme.fr',
    '2g7.42angouleme.fr',
    '3a1.42angouleme.fr',
    '3a2.42angouleme.fr',
    '3a3.42angouleme.fr',
    '3a4.42angouleme.fr',
    '3a5.42angouleme.fr',
    '3a6.42angouleme.fr',
    '3a7.42angouleme.fr',
    '3b1.42angouleme.fr',
    '3b2.42angouleme.fr',
    '3b3.42angouleme.fr',
    '3b4.42angouleme.fr',
    '3b5.42angouleme.fr',
    '3b6.42angouleme.fr',
    '3b7.42angouleme.fr',
    '3c1.42angouleme.fr',
    '3c2.42angouleme.fr',
    '3c3.42angouleme.fr',
    '3c4.42angouleme.fr',
    '3c5.42angouleme.fr',
    '3c6.42angouleme.fr',
    '3c7.42angouleme.fr',
    '3d1.42angouleme.fr',
    '3d2.42angouleme.fr',
    '3d3.42angouleme.fr',
    '3d4.42angouleme.fr',
    '3d5.42angouleme.fr',
    '3d6.42angouleme.fr',
    '3d7.42angouleme.fr',
    '3e1.42angouleme.fr',
    '3e2.42angouleme.fr',
    '3e3.42angouleme.fr',
    '3e4.42angouleme.fr',
    '3e5.42angouleme.fr',
    '3e6.42angouleme.fr',
    '3e7.42angouleme.fr',
    '3f1.42angouleme.fr',
    '3f2.42angouleme.fr',
    '3f3.42angouleme.fr',
    '3f4.42angouleme.fr',
    '3f5.42angouleme.fr',
    '3f6.42angouleme.fr',
    '3f7.42angouleme.fr',
    '3g1.42angouleme.fr',
    '3g2.42angouleme.fr',
    '3g3.42angouleme.fr',
    '3g4.42angouleme.fr',
    '3g5.42angouleme.fr',
    '3g6.42angouleme.fr',
    '3g7.42angouleme.fr',
    'localhost:42424',
]



# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Register42',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'UserManagement.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'UserManagement.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'zeph',
        'PASSWORD': 'zeph1234',
        'HOST': 'postgres',
        'PORT': '5432',
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'django_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/usr/src/app/logs/django.log',
            'formatter': 'simple',
        },
        'debug_file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/usr/src/app/logs/debug.log',
            'formatter': 'simple',
        },
        'print_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/usr/src/app/logs/print.log',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['django_file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['debug_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'print': {
            'handlers': ['print_file'],
            'level': 'INFO',
            'propagate': True,
        }
    },
}
