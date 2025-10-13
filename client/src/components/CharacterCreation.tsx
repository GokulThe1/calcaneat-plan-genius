import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, User, Heart, Sparkles, Star, Smile } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const PRESET_AVATARS = [
  { id: 'avatar-1', icon: User, color: 'bg-chart-1', label: 'Classic' },
  { id: 'avatar-2', icon: Heart, color: 'bg-chart-2', label: 'Heart' },
  { id: 'avatar-3', icon: Sparkles, color: 'bg-chart-3', label: 'Sparkles' },
  { id: 'avatar-4', icon: Star, color: 'bg-chart-4', label: 'Star' },
  { id: 'avatar-5', icon: Smile, color: 'bg-chart-5', label: 'Smile' },
];

interface CharacterCreationProps {
  onComplete: (characterData: { characterImageUrl?: string; characterType?: string }) => void;
  onSkip?: () => void;
}

export function CharacterCreation({ onComplete, onSkip }: CharacterCreationProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedAvatar(null);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setUploadedImage(null);
  };

  const handleContinue = () => {
    if (uploadedImage) {
      onComplete({ characterImageUrl: uploadedImage });
    } else if (selectedAvatar) {
      onComplete({ characterType: selectedAvatar });
    }
  };

  const canContinue = uploadedImage || selectedAvatar;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-2xl md:text-3xl font-semibold" data-testid="text-character-title">
          Create Your Health Journey Character
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-character-subtitle">
          Your character will accompany you through each milestone of your health journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover-elevate" data-testid="card-upload-photo">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Upload Your Photo</h3>
                <p className="text-sm text-muted-foreground">Create a custom character</p>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-md p-8 text-center space-y-4">
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary">
                    <img
                      src={uploadedImage}
                      alt="Character preview"
                      className="w-full h-full object-cover"
                      data-testid="img-character-preview"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                    data-testid="button-remove-photo"
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <Label
                      htmlFor="photo-upload"
                      className="cursor-pointer text-primary hover:underline"
                      data-testid="label-upload-photo"
                    >
                      Click to upload
                    </Label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      data-testid="input-photo-upload"
                    />
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-preset-avatars">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Choose a Preset Avatar</h3>
                <p className="text-sm text-muted-foreground">Quick and fun options</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {PRESET_AVATARS.map((avatar) => {
                const Icon = avatar.icon;
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-md border-2 transition-all hover-elevate active-elevate-2',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    )}
                    data-testid={`button-avatar-${avatar.id}`}
                  >
                    <div className={cn('h-16 w-16 rounded-full flex items-center justify-center', avatar.color)}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-xs font-medium">{avatar.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 justify-center">
        {onSkip && (
          <Button
            variant="outline"
            size="lg"
            onClick={onSkip}
            data-testid="button-skip-character"
          >
            Skip for Now
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!canContinue}
          data-testid="button-continue-character"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
