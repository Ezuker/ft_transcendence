# transcendence/views.py
from django.shortcuts import redirect
from django.conf import settings
from django.urls import reverse
from django.shortcuts import render

def set_language(request, language_code):
    next_page = request.META.get('HTTP_REFERER', '/')
    if language_code in dict(settings.LANGUAGES):
        request.session['django_language'] = language_code
        return redirect(next_page)
    return redirect(reverse('some_default_view')) 

def custom_404_view(request, exception):
    return render(request, 'global_templates/404.html', {}, status=404)

def index(request):
    if request.user.is_authenticated:
        context = {
            'no_footer': False,
        }
    else:
        context = {
            'no_footer': True,
        }
    if request.htmx:
        return render(request, 'homePage.html', context)
    return render(request, 'homePage_full.html', context)