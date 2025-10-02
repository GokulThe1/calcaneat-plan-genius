import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import avatar1 from '@assets/generated_images/Woman_testimonial_headshot_34c9f5bd.png';
import avatar2 from '@assets/generated_images/Man_testimonial_headshot_748c9c8d.png';
import avatar3 from '@assets/generated_images/Young_woman_fitness_headshot_5dc7ec73.png';

const testimonials = [
  {
    name: 'Sarah Johnson',
    image: avatar1,
    achievement: 'Lost 15 lbs in 2 months',
    quote: 'The premium clinical plan changed my life. The personalized approach and professional guidance made all the difference.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    image: avatar2,
    achievement: 'Gained 8 lbs muscle',
    quote: 'Amazing meal quality and the AI-assisted plan perfectly matched my fitness goals. The convenience is unbeatable.',
    rating: 5,
  },
  {
    name: 'Emma Davis',
    image: avatar3,
    achievement: 'Improved energy levels',
    quote: 'I love how easy it is to stick to my nutrition goals. The meals are delicious and the nutritional info helps me stay on track.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold" data-testid="text-testimonials-title">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-subtitle">
            Real results from real people
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-elevate transition-all" data-testid={`card-testimonial-${index}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" data-testid={`star-${index}-${i}`} />
                  ))}
                </div>

                <p className="text-sm leading-relaxed italic" data-testid={`text-quote-${index}`}>
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar data-testid={`avatar-${index}`}>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm" data-testid={`text-name-${index}`}>{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-achievement-${index}`}>{testimonial.achievement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
