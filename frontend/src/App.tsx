import { useState, useEffect } from 'react';
import { Booking, ResourceCategory, UserProfile } from './types';
import { initialCategories } from './data';
import Header from './components/Header';
import LoginView from './components/LoginView';
import BookingForm from './components/BookingForm';
import ScheduleList from './components/ScheduleList';
import TabsView from './components/TabsView';
import { motion, AnimatePresence } from 'motion/react';
import { fetchResources, fetchUserBookings, createBooking, cancelBooking } from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bookwise_auth') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bookwise_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    return {
      id: 1,
      name: 'Sachin',
      role: 'Student Portal',
      email: 'sachin@university.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [categories, setCategories] = useState<ResourceCategory[]>(initialCategories);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track pre-filled fields from "Book This" triggers
  const [preSelected, setPreSelected] = useState<{ categoryId: string; resourceName: string } | null>(null);

  // Refresh resources and user bookings from the backend database
  const refreshData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const userBookings = await fetchUserBookings(user.id);
      setBookings(userBookings);
      const dbCategories = await fetchResources(userBookings);
      setCategories(dbCategories);
    } catch (e) {
      console.error('Failed to sync backend data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync data on auth or active user change
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, user.id]);

  // Handle authentications
  const handleLogin = (email: string) => {
    let selectedUser = {
      id: 1,
      name: 'Sachin',
      role: 'Student Portal',
      email: 'sachin@university.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    };

    if (email.toLowerCase().includes('rahul')) {
      selectedUser = {
        id: 2,
        name: 'Rahul',
        role: 'Student Portal',
        email: 'rahul@university.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256'
      };
    }

    localStorage.setItem('bookwise_user', JSON.stringify(selectedUser));
    localStorage.setItem('bookwise_auth', 'true');
    setUser(selectedUser);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('bookwise_auth');
    localStorage.removeItem('bookwise_user');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setBookings([]);
  };

  // Action: Add new booking via backend POST api
  const handleAddBooking = async (
    resourceId: number,
    startTime: string,
    endTime: string,
    action: 'book' | 'waitlist'
  ) => {
    try {
      const res = await createBooking(user.id, resourceId, startTime, endTime, action);
      if (res.success) {
        await refreshData();
      }
      return res;
    } catch (e: any) {
      console.error('Error submitting booking:', e);
      throw e;
    }
  };

  // Action: Cancel booking via backend DELETE api
  const handleCancelBooking = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking allocation?')) {
      try {
        setIsLoading(true);
        await cancelBooking(id);
        await refreshData();
      } catch (e) {
        console.error('Failed to cancel booking:', e);
        alert('Failed to cancel booking. Please try again.');
        setIsLoading(false);
      }
    }
  };

  // Action: Reset/Restore (maps to Syncing from backend)
  const handleResetBookings = () => {
    refreshData();
  };

  // Action: Shortcut book resource from inventory tab
  const handleBookResourceShortcut = (categoryId: string, resourceName: string) => {
    setPreSelected({ categoryId, resourceName });
    setActiveTab('dashboard');

    // Auto scroll or focus
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View router & content renderer
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="py-32 flex flex-col items-center justify-center gap-4 text-primary">
          <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-on-surface-variant">Syncing database assets...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Resource booking forms */}
            <div className="lg:col-span-2">
              <BookingForm
                categories={categories}
                onAddBooking={handleAddBooking}
                preSelected={preSelected}
                onClearPreSelected={() => setPreSelected(null)}
              />
            </div>

            {/* Right Column: Schedule panel tracker */}
            <div className="lg:col-span-1">
              <ScheduleList
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onResetBookings={handleResetBookings}
              />
            </div>
          </div>
        );

      case 'resources':
      case 'reservations':
      case 'schedule':
        return (
          <TabsView
            categories={categories}
            bookings={bookings}
            activeTab={activeTab}
            onBookResource={handleBookResourceShortcut}
            onCancelBooking={handleCancelBooking}
          />
        );

      default:
        return (
          <div className="py-20 text-center text-on-surface-variant">
            Under construction. Use the top menu navigation to return.
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans text-on-surface select-none">
      {/* Dynamic Header Toolbar */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
      />

      {/* Main Container Stage */}
      <main className="flex-grow pt-28 pb-16 px-6 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Universal Footer Banner */}
      <footer className="py-6 border-t border-outline-variant/30 text-center text-[10px] uppercase tracking-widest font-semibold text-outline">
        BookWise AI • Academic Ethereal Resource Management • Powered by Cloud Infrastructure
      </footer>
    </div>
  );
}
