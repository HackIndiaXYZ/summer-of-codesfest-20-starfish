import { useState } from 'react';
import { Calendar, Clock, RefreshCw, Trash2, CheckCircle2, AlertTriangle, XCircle, ChevronRight, X, Search, Filter } from 'lucide-react';
import { Booking, BookingStatus } from '../types';

interface ScheduleListProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onResetBookings: () => void;
}

export default function ScheduleList({ bookings, onCancelBooking, onResetBookings }: ScheduleListProps) {
  const [isFullScheduleOpen, setIsFullScheduleOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalFilterStatus, setModalFilterStatus] = useState<string>('ALL');

  // Status styling map
  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          borderBar: 'bg-tertiary-container',
          badgeBg: 'bg-tertiary-container/15',
          badgeText: 'text-tertiary-container',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'WAITLISTED':
        return {
          borderBar: 'bg-[#d97706]',
          badgeBg: 'bg-[#fef3c7]',
          badgeText: 'text-[#d97706]',
          icon: <AlertTriangle className="w-3.5 h-3.5" />
        };
      case 'REJECTED':
        return {
          borderBar: 'bg-error',
          badgeBg: 'bg-error-container',
          badgeText: 'text-error',
          icon: <XCircle className="w-3.5 h-3.5" />
        };
      case 'COMPLETED':
        return {
          borderBar: 'bg-outline',
          badgeBg: 'bg-surface-variant text-on-surface-variant',
          badgeText: 'text-on-surface-variant',
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  // Filter for the modal schedule list
  const filteredModalBookings = bookings.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(modalSearchTerm.toLowerCase()) || 
                          b.resourceName.toLowerCase().includes(modalSearchTerm.toLowerCase());
    const matchesStatus = modalFilterStatus === 'ALL' || b.status === modalFilterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="glass-panel rounded-3xl h-full flex flex-col p-6 max-h-[820px] border border-white/60 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-sans font-black text-xl sm:text-2xl text-on-surface tracking-tight">
            My Schedule
          </h2>
          <button
            onClick={onResetBookings}
            title="Reset to default mock schedules"
            className="text-primary hover:bg-primary-fixed/40 p-2 rounded-full transition-all cursor-pointer active:scale-90"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto schedule-list pr-1 space-y-4 max-h-[600px]">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
              <Calendar className="w-12 h-12 text-outline-variant opacity-60" />
              <p className="text-sm font-medium">No resource allocations active.</p>
              <button 
                onClick={onResetBookings}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reload Default Schedules
              </button>
            </div>
          ) : (
            bookings.map((booking) => {
              const styles = getStatusStyle(booking.status);
              const isCompleted = booking.status === 'COMPLETED';

              return (
                <div
                  key={booking.id}
                  className={`bg-white/60 border border-white/40 rounded-2xl p-4 hover:bg-white/85 transition-all shadow-sm relative overflow-hidden group hover:translate-y-[-1px] ${
                    isCompleted ? 'opacity-70' : ''
                  }`}
                >
                  {/* Left Highlight Strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.borderBar}`} />

                  {/* Top content */}
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="pr-2">
                      <div className={`font-bold text-sm text-on-surface leading-snug tracking-tight ${isCompleted ? 'line-through text-on-surface-variant' : ''}`}>
                        {booking.title}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                        {booking.categoryName} • {booking.resourceName.replace(/\s*\(.*\)/, '')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <span className={`flex items-center gap-1 ${styles.badgeBg} ${styles.badgeText} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                        {styles.icon}
                        <span>{booking.status}</span>
                      </span>

                      {/* Cancel Action */}
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        title="Cancel Booking"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom details */}
                  <div className="flex flex-wrap items-center gap-4 pl-2 mt-3 text-xs text-on-surface-variant font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary/60" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary/60" />
                      <span>{booking.timeRange}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-outline-variant/30 text-center">
          <button
            onClick={() => setIsFullScheduleOpen(true)}
            className="text-primary font-bold text-sm hover:text-secondary flex items-center justify-center gap-1 w-full py-2 cursor-pointer transition-colors"
          >
            <span>View Full Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FULL SCHEDULE SLIDE-OVER / MODAL */}
      {isFullScheduleOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsFullScheduleOpen(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-y-0 right-0 max-w-full pl-10 flex">
            <div className="w-screen max-w-lg">
              <div className="h-full flex flex-col bg-white/95 backdrop-blur-2xl shadow-2xl overflow-y-scroll border-l border-white/40">
                {/* Modal Header */}
                <div className="px-6 py-6 border-b border-black/5 flex justify-between items-center bg-gradient-to-r from-primary-fixed/20 to-white">
                  <div>
                    <h3 className="font-sans font-black text-2xl text-on-surface tracking-tight">
                      Campus Allocations
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">
                      All reservations, active slots, and waiting list queues.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsFullScheduleOpen(false)}
                    className="p-2 rounded-xl text-on-surface-variant hover:bg-black/5 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="px-6 py-4 border-b border-black/5 bg-surface-container-low flex flex-col gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={modalSearchTerm}
                      onChange={(e) => setModalSearchTerm(e.target.value)}
                      className="w-full bg-white border border-outline-variant/60 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Filter className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mr-1">Status:</span>
                    {['ALL', 'CONFIRMED', 'WAITLISTED', 'REJECTED', 'COMPLETED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setModalFilterStatus(status)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                          modalFilterStatus === status
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-outline-variant/40 text-on-surface-variant hover:bg-black/5'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal Allocations List */}
                <div className="flex-1 p-6 space-y-4">
                  {filteredModalBookings.length === 0 ? (
                    <div className="text-center py-20 text-on-surface-variant">
                      <p className="text-sm font-semibold">No matching allocations found.</p>
                      <p className="text-xs mt-1">Try resetting your search filters or add a new reservation.</p>
                    </div>
                  ) : (
                    filteredModalBookings.map((booking) => {
                      const styles = getStatusStyle(booking.status);
                      const isCompleted = booking.status === 'COMPLETED';

                      return (
                        <div
                          key={booking.id}
                          className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between"
                        >
                          {/* Left Highlight Strip */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.borderBar}`} />

                          <div className="flex justify-between items-start pl-2">
                            <div>
                              <div className={`font-bold text-sm text-on-surface leading-snug ${isCompleted ? 'line-through text-on-surface-variant' : ''}`}>
                                {booking.title}
                              </div>
                              <div className="text-xs text-on-surface-variant mt-1">
                                {booking.categoryName} • {booking.resourceName}
                              </div>
                            </div>
                            <span className={`flex items-center gap-1 ${styles.badgeBg} ${styles.badgeText} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                              {styles.icon}
                              <span>{booking.status}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between pl-2 mt-4 pt-3 border-t border-black/5">
                            <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-primary/60" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-primary/60" />
                                {booking.timeRange}
                              </span>
                            </div>

                            <button
                              onClick={() => onCancelBooking(booking.id)}
                              className="text-xs font-bold text-error hover:bg-error-container/50 px-3 py-1.5 rounded-xl border border-error/20 flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-surface-container border-t border-black/5 text-center">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">BookWise AI Enterprise Scheduling Hub</p>
                  <p className="text-xs text-on-surface-variant font-medium">Auto-synced with administrative campus logs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
