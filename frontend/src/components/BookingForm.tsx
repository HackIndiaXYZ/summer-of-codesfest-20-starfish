import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Calendar, AlertTriangle, HelpCircle, CheckSquare, ListPlus } from 'lucide-react';
import { ResourceCategory, Booking } from '../types';

interface BookingFormProps {
  categories: ResourceCategory[];
  onAddBooking: (
    resourceId: number,
    startTime: string,
    endTime: string,
    action: 'book' | 'waitlist'
  ) => Promise<{ success: boolean; conflict?: { booked_start: string; booked_end: string }; message?: string }>;
  preSelected?: { categoryId: string; resourceName: string } | null;
  onClearPreSelected?: () => void;
}

export default function BookingForm({ categories, onAddBooking, preSelected, onClearPreSelected }: BookingFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('projectors');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [conflictState, setConflictState] = useState<boolean>(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto fill when preselected changes
  useEffect(() => {
    if (preSelected) {
      setSelectedCategoryId(preSelected.categoryId);
      setSelectedResource(preSelected.resourceName);
      if (onClearPreSelected) {
        onClearPreSelected();
      }
    }
  }, [preSelected]);

  // Get active category structure
  const activeCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  // Reset selected resource when category changes, but only if it doesn't belong to the category already
  useEffect(() => {
    if (activeCategory && activeCategory.resources.length > 0) {
      const exists = activeCategory.resources.some(r => r.name === selectedResource);
      if (!exists) {
        setSelectedResource(activeCategory.resources[0].name);
      }
    }
  }, [selectedCategoryId, activeCategory]);

  // Handle form submission
  const handleRequestAllocation = (e: React.FormEvent, statusOverride?: 'CONFIRMED' | 'WAITLISTED') => {
    e.preventDefault();

    const resourceObj = activeCategory?.resources.find(r => r.name === selectedResource);
    if (!resourceObj || !resourceObj.id) {
      setFormFeedback({ type: 'error', message: 'Selected resource is invalid or has no ID.' });
      return;
    }

    if (!startTime || !endTime) {
      setFormFeedback({ type: 'error', message: 'Please specify start and end times.' });
      return;
    }

    const isoStart = new Date(startTime).toISOString();
    const isoEnd = new Date(endTime).toISOString();
    const actionVal = statusOverride === 'WAITLISTED' ? 'waitlist' : 'book';

    onAddBooking(resourceObj.id, isoStart, isoEnd, actionVal)
      .then(res => {
        if (res.success) {
          setFormFeedback({
            type: 'success',
            message: actionVal === 'waitlist'
              ? `Added to waitlist cycle for ${selectedResource}!`
              : `Successfully allocated slot for ${selectedResource}!`
          });
          setConflictState(false);
          setStartTime('');
          setEndTime('');
        } else {
          setConflictState(true);
          setFormFeedback({
            type: 'error',
            message: `Conflict: Slot booked from ${res.conflict?.booked_start} to ${res.conflict?.booked_end}.`
          });
        }
      })
      .catch(err => {
        setFormFeedback({
          type: 'error',
          message: err.message || 'An error occurred while booking.'
        });
      });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="font-sans font-black text-4xl md:text-5xl text-on-surface tracking-tight mb-2">
          Resource Allocation
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl font-normal leading-relaxed">
          Select a category and specify requirements to request campus resources.
        </p>
      </div>

      {/* Glass Form Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border border-white/60 shadow-xl relative overflow-hidden">
        {/* Category Grid Section */}
        <div>
          <h2 className="font-sans font-extrabold text-lg sm:text-xl text-on-surface mb-4 tracking-tight">
            Select Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              // Dynamically pick the correct Lucide icon
              const IconComponent = (Icons as any)[category.iconName] || HelpCircle;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`category-card flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                    isSelected
                      ? 'border-secondary bg-primary-fixed text-primary shadow-lg shadow-primary/5 font-bold scale-[1.02]'
                      : 'border-white/40 bg-white/50 text-on-surface hover:bg-white/80 border-outline-variant/30'
                  }`}
                >
                  <IconComponent 
                    className={`w-7 sm:h-7 w-7 sm:w-7 transition-colors ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`} 
                  />
                  <span className="text-xs sm:text-sm tracking-tight">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Inputs (Resource Select & Timing) */}
        <form onSubmit={(e) => handleRequestAllocation(e)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant pl-1" htmlFor="resource-select">
              Specific Resource
            </label>
            <div className="relative">
              <select
                id="resource-select"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="w-full bg-white/90 border border-outline-variant/60 text-on-surface rounded-xl px-4 py-3.5 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm appearance-none cursor-pointer"
              >
                {activeCategory?.resources.map((resource, idx) => (
                  <option key={idx} value={resource.name}>
                    {resource.name} ({resource.status})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <Icons.ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant pl-1" htmlFor="start-time">
                Start Time
              </label>
              <input
                id="start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white/90 border border-outline-variant/60 text-on-surface rounded-xl px-4 py-3.5 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant pl-1" htmlFor="end-time">
                End Time
              </label>
              <input
                id="end-time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white/90 border border-outline-variant/60 text-on-surface rounded-xl px-4 py-3.5 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Feedback message overlay / animation */}
          {formFeedback && (
            <div className={`p-4 rounded-xl text-sm font-semibold border ${
              formFeedback.type === 'success' 
                ? 'bg-tertiary-container/10 border-tertiary-container/30 text-tertiary-container' 
                : 'bg-error-container/20 border-error/30 text-error'
            } animate-fade-in`}>
              {formFeedback.message}
            </div>
          )}

          {/* Actions Area */}
          <div className="pt-6 border-t border-outline-variant/30">
            {!conflictState ? (
              <div className="block space-y-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Request Slot Allocation</span>
                </button>
                {/* Demo toggle for conflict state */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setConflictState(true)}
                    className="text-xs text-primary font-bold hover:text-secondary underline cursor-pointer select-none"
                  >
                    Simulate Conflict State
                  </button>
                </div>
              </div>
            ) : (
              /* Conflict State (Hidden by default, displayed on toggle) */
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-error-container/20 border border-error/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-error mb-1">Time Slot Conflict</h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                      The selected resource is already booked for this duration. You can join the waitlist.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setConflictState(false)}
                    className="flex-1 bg-surface-container-high text-on-surface font-bold py-4 px-6 rounded-2xl border border-outline-variant/50 hover:bg-surface-container-highest transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRequestAllocation(e, 'WAITLISTED')}
                    className="flex-1 bg-secondary text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <ListPlus className="w-5 h-5" />
                    <span>Enter Waitlist Cycle</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
