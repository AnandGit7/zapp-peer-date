import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeExpiry, setCodeExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (codeExpiry) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((codeExpiry.getTime() - now.getTime()) / 1000);
        
        if (diff <= 0) {
          setTimeLeft(0);
          clearInterval(timer);
          toast({
            title: "Code expired",
            description: "Please request a new verification code",
            variant: "destructive",
          });
        } else {
          setTimeLeft(diff);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [codeExpiry, toast]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setIsLoading(false);
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    setCodeExpiry(expiry);
    setTimeLeft(300);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
      toast({
        title: "Verification code sent",
        description: `Your code is ${newCode} (displayed for demo purposes)`,
      });
    }, 1500);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (timeLeft <= 0) {
      setIsLoading(false);
      toast({
        title: "Code expired",
        description: "Please request a new verification code",
        variant: "destructive",
      });
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      
      if (verificationCode === generatedCode) {
        toast({
          title: "Account created successfully",
          description: "Welcome to Zapp!",
        });
        navigate('/');
      } else {
        const attempts = verificationAttempts + 1;
        setVerificationAttempts(attempts);
        
        if (attempts >= 3) {
          toast({
            title: "Too many attempts",
            description: "Please request a new verification code",
            variant: "destructive",
          });
          setStep('phone');
          setVerificationAttempts(0);
          setVerificationCode('');
        } else {
          toast({
            title: "Invalid code",
            description: `Incorrect verification code. ${3 - attempts} attempts remaining.`,
            variant: "destructive",
          });
        }
      }
    }, 1500);
  };

  const handleResendCode = () => {
    setVerificationCode('');
    setVerificationAttempts(0);
    handleRequestCode({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{step === 'phone' ? 'Create Account' : 'Verify Phone'}</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your phone number to get started.' 
              : 'Enter the 6-digit code sent to your phone.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone Number (e.g. +1234567890)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code
                  </>
                ) : (
                  'Get Verification Code'
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2 flex justify-center">
                      {slots.map((slot, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
                {timeLeft > 0 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Code expires in: {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || verificationCode.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  'Verify & Create Account'
                )}
              </Button>
              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendCode}
                  disabled={isLoading || timeLeft > 270}
                >
                  Resend Code
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setStep('phone')}
                >
                  Back to Phone Entry
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
