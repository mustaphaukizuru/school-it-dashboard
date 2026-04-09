from django.db import models


class Device(models.Model):
    STATUS_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('maintenance', 'Maintenance'),
    ]

    name       = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=50)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='online')
    location   = models.CharField(max_length=100, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def uptime_percentage(self):
        logs = self.uptimelogs.all()
        if not logs.exists():
            return 100.0
        online_count = logs.filter(is_online=True).count()
        return round((online_count / logs.count()) * 100, 1)


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title       = models.CharField(max_length=200)
    description = models.TextField()
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority    = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    device      = models.ForeignKey(
                    Device, on_delete=models.SET_NULL,
                    null=True, blank=True, related_name='tickets'
                  )
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class UptimeLog(models.Model):
    device    = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='uptimelogs')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_online = models.BooleanField(default=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        state = 'online' if self.is_online else 'offline'
        return f"{self.device.name} — {state} at {self.timestamp}"
