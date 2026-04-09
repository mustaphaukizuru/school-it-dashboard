from rest_framework import serializers
from .models import Device, Ticket, UptimeLog


class UptimeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UptimeLog
        fields = '__all__'


class DeviceSerializer(serializers.ModelSerializer):
    uptime_percentage = serializers.ReadOnlyField()
    ticket_count      = serializers.SerializerMethodField()

    class Meta:
        model  = Device
        fields = [
            'id', 'name', 'ip_address', 'status',
            'location', 'added_date',
            'uptime_percentage', 'ticket_count',
        ]

    def get_ticket_count(self, obj):
        return obj.tickets.filter(status__in=['open', 'in_progress']).count()


class TicketSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)

    class Meta:
        model  = Ticket
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'device', 'device_name',
            'created_at', 'updated_at',
        ]
