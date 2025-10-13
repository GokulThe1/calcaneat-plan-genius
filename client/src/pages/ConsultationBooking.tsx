import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const doctors = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'Clinical Nutritionist', slots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'] },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Endocrinologist', slots: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'] },
  { id: '3', name: 'Dr. Anjali Mehta', specialty: 'Dietitian & Wellness Coach', slots: ['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '05:30 PM'] },
];

const CONSULTATION_FEE = 1999;

export default function ConsultationBooking() {
  const [, navigate] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);

  const minDate = addDays(new Date(), 1);

  const isDateDisabled = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(minDate));
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const bookingData = {
      planType: 'clinical',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      doctorName: selectedDoctor.name,
    };

    localStorage.setItem('consultationData', JSON.stringify(bookingData));
    navigate('/signup-character');
  };

  const canContinue = selectedDate && selectedTime;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/30 via-white to-emerald-50/20">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="font-display text-3xl md:text-4xl font-bold" data-testid="text-booking-title">
                Book Your Consultation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-booking-subtitle">
                Schedule your first appointment with our expert medical team
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Select Doctor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setSelectedTime('');
                          }}
                          className={`p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                            selectedDoctor.id === doctor.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                          data-testid={`button-doctor-${doctor.id}`}
                        >
                          <div className="font-semibold">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                          {selectedDoctor.id === doctor.id && (
                            <CheckCircle2 className="h-4 w-4 text-primary mt-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      Select Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="rounded-md border"
                        data-testid="calendar-date-picker"
                      />
                    </div>
                    {selectedDate && (
                      <p className="text-sm text-muted-foreground text-center mt-4" data-testid="text-selected-date">
                        Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Select Time Slot
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedDoctor.slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover-elevate ${
                              selectedTime === slot
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border'
                            }`}
                            data-testid={`button-time-${slot.replace(/[: ]/g, '-')}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Plan Type</span>
                        <span className="font-medium" data-testid="text-plan-type">Clinical-Level Guided</span>
                      </div>
                      
                      {selectedDoctor && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Doctor</span>
                          <span className="font-medium" data-testid="text-selected-doctor">{selectedDoctor.name}</span>
                        </div>
                      )}

                      {selectedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium" data-testid="text-summary-date">
                            {format(selectedDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}

                      {selectedTime && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time</span>
                          <span className="font-medium" data-testid="text-summary-time">{selectedTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Consultation Fee</span>
                        <span className="font-mono text-xl font-bold" data-testid="text-consultation-fee">
                          ₹{CONSULTATION_FEE}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">One-time consultation fee</p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      disabled={!canContinue}
                      onClick={handleContinue}
                      data-testid="button-continue-signup"
                    >
                      Continue to Sign Up
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {!canContinue && (
                      <p className="text-xs text-center text-muted-foreground">
                        Please select a date and time to continue
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
