from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse                          # add this
from rest_framework.routers import DefaultRouter
from dashboard.views import DeviceViewSet, TicketViewSet, stats

router = DefaultRouter()
router.register(r'devices', DeviceViewSet)
router.register(r'tickets', TicketViewSet)

def root(request):                                            # add this
    return JsonResponse({'status': 'School IT Dashboard API is running', 'docs': '/api/'})

urlpatterns = [
    path('', root),                                           # add this
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/stats/', stats),
]