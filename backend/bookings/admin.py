from django.contrib import admin
from .models import Resource, Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    # What columns show up in the admin dashboard
    list_display = ('resource', 'user', 'start_time', 'end_time', 'status', 'created_at')
    
    # Adds a sidebar to filter by Pending/Waitlist/Rejected
    list_filter = ('status', 'resource__resource_type')
    
    # Adds action buttons to mass-approve or mass-reject
    actions = ['approve_bookings', 'reject_bookings']

    def approve_bookings(self, request, queryset):
        queryset.update(status='CONFIRMED')
        self.message_user(request, "Selected bookings have been confirmed.")
        
    def reject_bookings(self, request, queryset):
        queryset.update(status='REJECTED')
        self.message_user(request, "Selected bookings have been rejected.")

admin.site.register(Resource)