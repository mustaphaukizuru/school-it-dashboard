from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from dashboard.views import DeviceViewSet, TicketViewSet, stats

router = DefaultRouter()
router.register(r'devices', DeviceViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/stats/', stats),
]
