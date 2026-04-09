from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Device, Ticket, UptimeLog
from .serializers import DeviceSerializer, TicketSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset         = Device.objects.all().order_by('-added_date')
    serializer_class = DeviceSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset         = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer


@api_view(['GET'])
def stats(request):
    total_devices = Device.objects.count()
    online        = Device.objects.filter(status='online').count()
    offline       = Device.objects.filter(status='offline').count()
    maintenance   = Device.objects.filter(status='maintenance').count()

    open_tickets  = Ticket.objects.filter(status='open').count()
    in_progress   = Ticket.objects.filter(status='in_progress').count()
    closed        = Ticket.objects.filter(status='closed').count()
    high_priority = Ticket.objects.filter(
                        priority='high',
                        status__in=['open', 'in_progress']
                    ).count()

    return Response({
        'devices': {
            'total':       total_devices,
            'online':      online,
            'offline':     offline,
            'maintenance': maintenance,
        },
        'tickets': {
            'open':          open_tickets,
            'in_progress':   in_progress,
            'closed':        closed,
            'high_priority': high_priority,
        },
    })
