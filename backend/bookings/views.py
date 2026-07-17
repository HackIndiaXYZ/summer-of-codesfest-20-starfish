from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Booking, Resource
from django.contrib.auth.models import User
import dateutil.parser

@api_view(['POST'])
def create_booking(request):
    data = request.data
    resource_id = data.get('resource_id')
    start_time = dateutil.parser.parse(data.get('start_time'))
    end_time = dateutil.parser.parse(data.get('end_time'))
    user_id = data.get('user_id')
    action = data.get('action', 'book') 

    # Check for existing CONFIRMED bookings only
    overlapping_bookings = Booking.objects.filter(
        resource_id=resource_id,
        start_time__lt=end_time,
        end_time__gt=start_time,
        status='CONFIRMED'
    )

    resource = Resource.objects.get(id=resource_id)
    user = User.objects.get(id=user_id)

    # If there is a conflict
    if overlapping_bookings.exists():
        if action == 'waitlist':
            Booking.objects.create(
                user=user, resource=resource, start_time=start_time, end_time=end_time, status='WAITLISTED'
            )
            return Response({"message": "Successfully added to the waitlist!"}, status=status.HTTP_201_CREATED)
        else:
            conflict = overlapping_bookings.first()
            return Response({
                "error": "Resource is unavailable.",
                "booked_start": conflict.start_time.strftime("%b %d, %I:%M %p"),
                "booked_end": conflict.end_time.strftime("%b %d, %I:%M %p")
            }, status=status.HTTP_409_CONFLICT)

    # If no conflict, confirm the booking
    booking = Booking.objects.create(
        user=user, resource=resource, start_time=start_time, end_time=end_time, status='CONFIRMED'
    )
    return Response({"message": "Booking successful!"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_resources(request):
    resources = list(Resource.objects.all().values('id', 'name', 'resource_type'))
    return Response(resources)

@api_view(['GET'])
def get_user_bookings(request, user_id):
    bookings = Booking.objects.filter(user_id=user_id).order_by('-created_at')
    data = []
    for b in bookings:
        data.append({
            'id': b.id,
            'resource_name': b.resource.name,
            'resource_type': b.resource.resource_type,
            'start_time': b.start_time.strftime("%b %d, %I:%M %p"),
            'end_time': b.end_time.strftime("%b %d, %I:%M %p"),
            'status': b.status
        })
    return Response(data)

@api_view(['DELETE'])
def delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.delete()
        return Response({"message": "Booking cancelled successfully!"}, status=status.HTTP_200_OK)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)