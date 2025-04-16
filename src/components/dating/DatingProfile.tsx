
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User, Heart } from 'lucide-react';

type DatingProfileProps = {
  profile: {
    id: string;
    username: string;
    age: number;
    bio: string;
    interests: string[];
    photos: string[];
    location?: {
      city: string;
      country: string;
    };
    lastActive: Date;
  };
};

const DatingProfile: React.FC<DatingProfileProps> = ({ profile }) => {
  const { username, age, bio, interests, photos, location } = profile;
  
  return (
    <Card className="overflow-hidden">
      {/* Profile Photo */}
      <div className="relative w-full h-[60vh] bg-muted">
        {photos.length > 0 ? (
          <img 
            src={photos[0]} 
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        
        {/* Profile info overlaid on photo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">{username}, {age}</h2>
              {location && (
                <div className="flex items-center text-white/80 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location.city}, {location.country}</span>
                </div>
              )}
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Active recently</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Bio */}
        <div className="mb-4">
          <h3 className="font-medium mb-1">Bio</h3>
          <p className="text-muted-foreground">{bio}</p>
        </div>
        
        {/* Interests */}
        <div>
          <h3 className="font-medium mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary/30">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatingProfile;
