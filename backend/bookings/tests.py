from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Resource, Booking
from django.utils import timezone
from datetime import timedelta

class BookingConflictTests(TestCase):
    def setUp(self):
        # Initialize the test client
        self.client = APIClient()
        
        # Create a dummy user and resource in the test database
        self.user = User.objects.create_user(username='teststudent', password='password123')
        self.resource = Resource.objects.create(name='Computer Lab A', resource_type='Lab')
        
        self.now = timezone.now()
        
        # Create an initial booking from "now" to "2 hours from now"
        self.initial_booking = Booking.objects.create(
            user=self.user,
            resource=self.resource,
            start_time=self.now,
            end_time=self.now + timedelta(hours=2)
        )
        
        # The URL endpoint for creating bookings
        self.url = reverse('create_booking')

    def test_successful_booking(self):
        # Attempt to book a safe, non-overlapping slot (3 hours to 4 hours from now)
        data = {
            'user_id': self.user.id,
            'resource_id': self.resource.id,
            'start_time': (self.now + timedelta(hours=3)).isoformat(),
            'end_time': (self.now + timedelta(hours=4)).isoformat()
        }
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "Booking successful!")

    def test_conflict_booking(self):
        # Attempt to book an overlapping slot (1 hour to 3 hours from now)
        data = {
            'user_id': self.user.id,
            'resource_id': self.resource.id,
            'start_time': (self.now + timedelta(hours=1)).isoformat(),
            'end_time': (self.now + timedelta(hours=3)).isoformat()
        }
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_delete_booking(self):
        # Delete the initial booking
        delete_url = reverse('delete_booking', args=[self.initial_booking.id])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Booking cancelled successfully!")

        # Verify it is deleted
        self.assertFalse(Booking.objects.filter(id=self.initial_booking.id).exists())