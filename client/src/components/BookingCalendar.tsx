import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  day: string;
  slots: TimeSlot[];
}

const availableDates: DaySlots[] = [
  {
    date: '2025-01-06',
    day: 'Mon, Jan 6',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '02:00 PM', available: false },
      { time: '04:00 PM', available: true },
    ],
  },
  {
    date: '2025-01-07',
    day: 'Tue, Jan 7',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '03:00 PM', available: true },
      { time: '05:00 PM', available: false },
    ],
  },
  {
    date: '2025-01-08',
    day: 'Wed, Jan 8',
    slots: [
      { time: '10:00 AM', available: true },
      { time: '01:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: true },
    ],
  },
];

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      console.log('Booking consultation:', { date: selectedDate, time: selectedTime });
      alert(`Consultation booked for ${selectedDate} at ${selectedTime}`);
    }
  };

  return (
    <Card data-testid="card-booking-calendar">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule Your Consultation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a date and time for your initial physician consultation
          </p>

          <div className="space-y-3">
            <label className="text-sm font-medium">Available Dates</label>
            <div className="grid gap-2">
              {availableDates.map((dateSlot) => (
                <Button
                  key={dateSlot.date}
                  variant={selectedDate === dateSlot.date ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedDate(dateSlot.date);
                    setSelectedTime(null);
                  }}
                  data-testid={`button-date-${dateSlot.date}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateSlot.day}
                </Button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Available Time Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {availableDates
                  .find((d) => d.date === selectedDate)
                  ?.slots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      disabled={!slot.available}
                      className="w-full"
                      onClick={() => setSelectedTime(slot.time)}
                      data-testid={`button-time-${slot.time.replace(/\s/g, '-')}`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {slot.time}
                      {!slot.available && (
                        <Badge variant="secondary" className="ml-2">
                          Booked
                        </Badge>
                      )}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium mb-2">Selected Appointment</p>
              <p className="text-sm text-muted-foreground">
                {availableDates.find((d) => d.date === selectedDate)?.day} at {selectedTime}
              </p>
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime}
          data-testid="button-confirm-booking"
        >
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
}
