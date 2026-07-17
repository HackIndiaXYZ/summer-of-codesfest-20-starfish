from django.contrib import admin
from django.urls import path
from bookings.views import create_booking, get_resources, get_user_bookings, delete_booking

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/book/', create_booking, name='create_booking'),
    path('api/resources/', get_resources, name='get_resources'),
    path('api/bookings/user/<int:user_id>/', get_user_bookings, name='get_user_bookings'),
    path('api/bookings/<int:booking_id>/', delete_booking, name='delete_booking'),
]