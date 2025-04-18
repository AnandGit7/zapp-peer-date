
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  User, 
  MapPin, 
  Calendar, 
  X, 
  Plus, 
  Save, 
  Upload, 
  Loader2 
} from 'lucide-react';
import { useDatingProfile, DatingProfile } from './hooks/useDatingProfile';

interface DatingProfileSettingsProps {
  onClose: () => void;
}

const DatingProfileSettings: React.FC<DatingProfileSettingsProps> = ({ onClose }) => {
  const { profile, isLoading, isSaving, saveProfile } = useDatingProfile();
  const [formData, setFormData] = useState<Partial<DatingProfile>>(profile || {});
  const [newInterest, setNewInterest] = useState('');
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>
            There was an error loading your profile. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onClose}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    const interests = [...(formData.interests || [])];
    if (!interests.includes(newInterest)) {
      interests.push(newInterest);
      setFormData({
        ...formData,
        interests
      });
    }
    setNewInterest('');
  };
  
  const handleRemoveInterest = (interest: string) => {
    const interests = (formData.interests || []).filter(i => i !== interest);
    setFormData({
      ...formData,
      interests
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveProfile(formData);
    if (success) {
      onClose();
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Your Dating Profile</CardTitle>
        <CardDescription>
          Update your profile information to help others get to know you better
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 mx-auto md:mx-0 bg-muted rounded-full flex items-center justify-center overflow-hidden border-2 border-muted">
                {profile.photos && profile.photos.length > 0 ? (
                  <img 
                    src={profile.photos[0]} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
                
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  type="button"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    value={formData.age || ''} 
                    onChange={handleChange}
                    placeholder="Your age"
                    min={18}
                    max={120}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location || ''} 
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About Me</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio || ''} 
              onChange={handleChange}
              placeholder="Tell others about yourself..."
              rows={4}
            />
          </div>
          
          {/* Interests */}
          <div className="space-y-3">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {(formData.interests || []).map((interest, index) => (
                <Badge key={index} variant="secondary" className="py-1 pl-3 pr-2">
                  {interest}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1" 
                    onClick={() => handleRemoveInterest(interest)}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              
              {(formData.interests || []).length === 0 && (
                <p className="text-sm text-muted-foreground">Add some interests to help find better matches</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input 
                value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)} 
                placeholder="Add an interest"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddInterest}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DatingProfileSettings;
