from django.contrib import admin
from .models import Device, Ticket, UptimeLog


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display  = ['name', 'ip_address', 'status', 'location', 'added_date']
    list_filter   = ['status']
    search_fields = ['name', 'ip_address']
    ordering      = ['-added_date']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display  = ['title', 'status', 'priority', 'device', 'created_at']
    list_filter   = ['status', 'priority']
    search_fields = ['title', 'description']
    ordering      = ['-created_at']


@admin.register(UptimeLog)
class UptimeLogAdmin(admin.ModelAdmin):
    list_display = ['device', 'is_online', 'timestamp']
    list_filter  = ['is_online']
