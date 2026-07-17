import { ResourceCategory, Booking } from '../types';
import { Layers, CheckCircle2, AlertTriangle, Hammer, Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TabsViewProps {
  categories: ResourceCategory[];
  bookings: Booking[];
  activeTab: string;
  onBookResource: (categoryId: string, resourceName: string) => void;
  onCancelBooking: (id: string) => void;
}

export default function TabsView({ categories, bookings, activeTab, onBookResource, onCancelBooking }: TabsViewProps) {
  const [resourceFilter, setResourceFilter] = useState('ALL');
  const [resourceSearch, setResourceSearch] = useState('');

  // 1. RESOURCES TAB
  if (activeTab === 'resources') {
    // Gather all individual resources with their category parent details
    const allResources = categories.flatMap(cat => 
      cat.resources.map(res => ({
        ...res,
        categoryId: cat.id,
        categoryName: cat.name
      }))
    );

    const filteredResources = allResources.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(resourceSearch.toLowerCase()) || 
                            res.categoryName.toLowerCase().includes(resourceSearch.toLowerCase());
      const matchesStatus = resourceFilter === 'ALL' || res.status === resourceFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-on-surface tracking-tight mb-2">Campus Inventory</h1>
          <p className="text-sm text-on-surface-variant font-medium">Browse, search, and check real-time availability of all university assets.</p>
        </div>

        {/* Toolbar */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center border border-white/60 shadow-md">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search resources..."
              value={resourceSearch}
              onChange={(e) => setResourceSearch(e.target.value)}
              className="w-full bg-white border border-outline-variant/60 rounded-xl py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-1">Availability:</span>
            {['ALL', 'Available', 'In Use', 'Under Maintenance'].map((status) => (
              <button
                key={status}
                onClick={() => setResourceFilter(status)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  resourceFilter === status
                    ? 'bg-primary border-primary text-white font-bold'
                    : 'bg-white/60 border-outline-variant/40 text-on-surface-variant hover:bg-black/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredResources.map((res, idx) => {
            const isAvailable = res.status === 'Available';
            const isInUse = res.status === 'In Use';

            return (
              <div 
                key={idx} 
                className="glass-panel bg-white/50 border border-white/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-primary bg-primary-fixed/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {res.categoryName}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isAvailable 
                        ? 'text-tertiary bg-tertiary-container/10' 
                        : isInUse 
                          ? 'text-[#d97706] bg-[#fef3c7]' 
                          : 'text-error bg-error-container/40'
                    }`}>
                      {isAvailable ? <CheckCircle2 className="w-3 h-3" /> : isInUse ? <AlertTriangle className="w-3 h-3" /> : <Hammer className="w-3 h-3" />}
                      <span>{res.status}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-on-surface tracking-tight group-hover:text-primary transition-colors">
                    {res.name.replace(/\s*\(.*\)/, '')}
                  </h3>
                </div>

                <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Standard slot: 2 hours</span>
                  <button
                    onClick={() => onBookResource(res.categoryId, res.name)}
                    className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Book this</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. RESERVATIONS TAB
  if (activeTab === 'reservations') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-on-surface tracking-tight mb-2">My Reservations</h1>
          <p className="text-sm text-on-surface-variant font-medium">Review and manage allocations registered under your account.</p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/60 shadow-xl bg-white/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-4">Resource Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Reserved Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-sm">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-on-surface-variant font-semibold">
                      No reservations found. Create a reservation from the Dashboard.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-on-surface">{booking.title}</div>
                        <div className="text-[11px] text-on-surface-variant mt-0.5">{booking.resourceName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-fixed/20 text-primary">
                          {booking.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-on-surface-variant">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs mt-1">
                          <Clock className="w-3.5 h-3.5 text-primary/60" />
                          <span>{booking.timeRange}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-tertiary-container/10 text-tertiary-container'
                            : booking.status === 'WAITLISTED'
                              ? 'bg-amber-100 text-[#d97706]'
                              : booking.status === 'REJECTED'
                                ? 'bg-error-container text-error'
                                : 'bg-surface-variant text-on-surface-variant'
                        }`}>
                          <span>{booking.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="text-xs font-bold text-error hover:bg-error-container/60 p-2 rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Cancel</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 3. SCHEDULE TAB
  if (activeTab === 'schedule') {
    // Sort bookings chronologically (best effort based on dates)
    const sortedBookings = [...bookings].sort((a, b) => {
      if (!a.rawDate || !b.rawDate) return 0;
      return a.rawDate.localeCompare(b.rawDate);
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-on-surface tracking-tight mb-2">Agenda View</h1>
          <p className="text-sm text-on-surface-variant font-medium">Daily cron schedule of allocated and requested slots.</p>
        </div>

        <div className="relative pl-4 border-l-2 border-primary/20 space-y-8 py-2">
          {sortedBookings.length === 0 ? (
            <div className="pl-4 text-on-surface-variant font-semibold py-12">
              No schedules allocated. Book resources from the dashboard to populate your timeline.
            </div>
          ) : (
            sortedBookings.map((booking, idx) => {
              const styles = {
                CONFIRMED: 'border-tertiary-container text-tertiary-container',
                WAITLISTED: 'border-[#d97706] text-[#d97706]',
                REJECTED: 'border-error text-error',
                COMPLETED: 'border-outline text-on-surface-variant'
              }[booking.status];

              return (
                <div key={booking.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-primary shadow-sm group-hover:scale-125 transition-transform`} />

                  <div className="glass-panel bg-white/60 hover:bg-white/90 border border-white/60 p-5 rounded-2xl shadow-sm transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        {booking.date}
                      </div>
                      <h3 className="font-bold text-lg text-on-surface tracking-tight">
                        {booking.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-medium mt-1">
                        Resource: {booking.resourceName}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-black/5 px-3 py-1.5 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{booking.timeRange}</span>
                      </div>

                      <span className={`text-[10px] font-bold border ${styles} px-3 py-1 rounded-full uppercase tracking-wider`}>
                        {booking.status}
                      </span>

                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-xl cursor-pointer transition-colors"
                        title="Cancel Allocated Slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return null;
}
