import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Upload, User, Mail, Phone, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const presetCharacters = [
  { id: 'chef', name: 'Chef Alex', emoji: '👨‍🍳', color: 'bg-orange-100' },
  { id: 'athlete', name: 'Athletic Ana', emoji: '🏃‍♀️', color: 'bg-blue-100' },
  { id: 'professional', name: 'Pro Pat', emoji: '💼', color: 'bg-purple-100' },
  { id: 'student', name: 'Student Sam', emoji: '🎓', color: 'bg-green-100' },
  { id: 'parent', name: 'Parent Parker', emoji: '👨‍👩‍👧', color: 'bg-pink-100' },
  { id: 'senior', name: 'Senior Sarah', emoji: '👵', color: 'bg-amber-100' },
];

export default function SignupCharacter() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'signup' | 'character'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setStep('character');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedCharacter('uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!selectedCharacter) {
      toast({
        title: 'Select Your Character',
        description: 'Please choose a character to represent you',
        variant: 'destructive',
      });
      return;
    }

    const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}');
    const userData = {
      ...formData,
      characterType: selectedCharacter,
      characterImage: selectedCharacter === 'uploaded' ? uploadedImage : '',
      consultationData,
    };

    localStorage.setItem('signupData', JSON.stringify(userData));
    navigate('/payment');
  };

  if (step === 'signup') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/30 via-white to-emerald-50/20">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
              <p className="text-center text-muted-foreground">
                Join us on your journey to better health
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      data-testid="input-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      data-testid="input-password"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" data-testid="button-next-character">
                  Next: Create Character
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/30 via-white to-emerald-50/20">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold" data-testid="text-character-title">
              Create Your Character
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose an avatar that represents you on your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Your Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      uploadedImage ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="space-y-3">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary"
                        />
                        <p className="text-sm text-muted-foreground">Photo uploaded successfully!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Upload a selfie to create your AI-generated avatar
                        </p>
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                    data-testid="input-upload-photo"
                  />
                  <p className="text-xs text-muted-foreground">
                    AI avatar generation coming soon! For now, we'll use your photo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Choose a Preset Character</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {presetCharacters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char.id);
                        setUploadedImage('');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-center hover-elevate ${
                        selectedCharacter === char.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      data-testid={`button-character-${char.id}`}
                    >
                      <div className={`text-4xl mb-2 p-3 rounded-full ${char.color} inline-block`}>
                        {char.emoji}
                      </div>
                      <div className="text-sm font-medium">{char.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedCharacter && (
            <div className="flex justify-center">
              <Card className="max-w-md w-full">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedCharacter === 'uploaded' && uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Selected"
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className={`text-3xl p-3 rounded-full ${
                        presetCharacters.find(c => c.id === selectedCharacter)?.color
                      }`}>
                        {presetCharacters.find(c => c.id === selectedCharacter)?.emoji}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">Character Selected</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-selected-character">
                        {selectedCharacter === 'uploaded'
                          ? 'Your Photo'
                          : presetCharacters.find(c => c.id === selectedCharacter)?.name}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleContinue} data-testid="button-proceed-payment">
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
