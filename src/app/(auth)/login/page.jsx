'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { loginApi, sendOtpApi, loginWithOtpApi } from '../../api/authApi';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [useOTP, setUseOTP] = useState(false);
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  const description = "Indus Is A Unified Platform For Your Equity Investment Monitoring With Multiple Self-Help Features.";

  const handleGenerateOTP = async () => {
    if (!pan) {
      showToast('Please enter your PAN first.', 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await sendOtpApi({ pan });
      showToast(response.message, 'success');
      setOtpSent(true);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!pan) {
      showToast('Please enter your PAN.', 'error');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (useOTP) {
        if (!otp) {
          showToast('Please enter the OTP.', 'error');
          return;
        }
        response = await loginWithOtpApi({ pan, otp });
      } else {
        if (!password) {
          showToast('Please enter your password.', 'error');
          return;
        }
        // Login uses email but our form has PAN
        // We need to find user by PAN first — let's use pan as identifier
        response = await loginApi({ pan, password });
      }

      // Save token and user to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      showToast('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-dynamic">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 bg-dynamic relative overflow-hidden items-center justify-center p-12">
        <div className="max-w-lg text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.jpeg"
              alt="INDUS Logo"
              width={280}
              height={120}
              className="drop-shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-5xl font-bold text-dynamic tracking-tight mb-6">
            INDUS
          </h1>
          <p className="text-xl text-dynamic/80 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dynamic">
        <Card className="w-full max-w-md card-dynamic border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-dynamic">Welcome to INDUS</CardTitle>
            <CardDescription className="text-dynamic/70">
              Please Sign In.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* OTP Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="otp-toggle" className="text-sm text-dynamic">Use OTP</Label>
                <Switch
                  id="otp-toggle"
                  checked={useOTP}
                  onCheckedChange={(val) => {
                    setUseOTP(val);
                    setOtp('');
                    setPassword('');
                    setOtpSent(false);
                  }}
                />
              </div>

              {/* PAN */}
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-dynamic">PAN *</Label>
                <Input
                  id="pan"
                  type="text"
                  placeholder="Enter First Holder PAN"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Password or OTP */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="passwordOrOtp" className="text-dynamic">
                    {useOTP ? 'OTP *' : 'Password *'}
                  </Label>
                  {!useOTP && (
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                      Forgot Password / Unlock User ID
                    </Link>
                  )}
                </div>

                <div className="flex gap-3">
                  <Input
                    id="passwordOrOtp"
                    type={useOTP ? 'text' : 'password'}
                    placeholder={useOTP ? 'Enter mobile OTP' : 'Enter your Password'}
                    value={useOTP ? otp : password}
                    onChange={(e) => useOTP ? setOtp(e.target.value) : setPassword(e.target.value)}
                    className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500 flex-1"
                    required
                  />
                  {useOTP && (
                    <Button
                      type="button"
                      onClick={handleGenerateOTP}
                      disabled={loading || otpSent}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 disabled:opacity-60"
                    >
                      {otpSent ? 'OTP Sent ✓' : 'Generate OTP'}
                    </Button>
                  )}
                </div>

                {/* Resend OTP option */}
                {useOTP && otpSent && (
                  <p
                    className="text-xs text-blue-600 cursor-pointer hover:underline text-right"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                  >
                    Resend OTP
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-dynamic text-white font-semibold text-lg hover:brightness-110 transition-all disabled:opacity-60"
              >
                {loading ? 'Please wait...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-dynamic/70">
              Don&apos;t have a login?{' '}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                SIGNUP
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}