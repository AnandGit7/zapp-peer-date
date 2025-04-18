
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to <span className="text-primary">Zapp</span>
          </CardTitle>
          <CardDescription>
            Connect, chat, and share moments with friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => navigate('/signup')}
          >
            Create Account
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;
