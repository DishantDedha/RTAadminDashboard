'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from '../api/authApi';
import { useRouter } from 'next/navigation';

const STEPS = {
  PAN: 1,
  OTP: 2,
  NEW_PASSWORD: 3,
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(STEPS.PAN);
  const [pan, setPan] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  // Step 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!pan) {
      showToast('Please enter your PAN.', 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await forgotPasswordApi({ pan });
      showToast(response.message, 'success');
      setStep(STEPS.OTP);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      showToast('Please enter the OTP.', 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await verifyOtpApi({ pan, otp });
      setResetToken(response.data.resetToken);
      showToast('OTP verified successfully!', 'success');
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid or expired OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showToast('Please fill all fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    try {
      setLoading(true);
      await resetPasswordApi({ resetToken, newPassword });
      showToast('Password reset successfully! Redirecting to login...', 'success');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    [STEPS.PAN]: { title: 'Forgot Password', desc: 'Enter your PAN to receive an OTP' },
    [STEPS.OTP]: { title: 'Verify OTP', desc: `OTP sent to your registered mobile` },
    [STEPS.NEW_PASSWORD]: { title: 'Set New Password', desc: 'Enter your new password' },
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-dynamic">
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
          <h1 className="text-5xl font-bold text-dynamic tracking-tight mb-6">INDUS</h1>
          <p className="text-xl text-dynamic/80 leading-relaxed">
            Indus Is A Unified Platform For Your Equity Investment Monitoring With Multiple Self-Help Features.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dynamic">
        <Card className="w-full max-w-md card-dynamic border border-gray-200">
          <CardHeader className="text-center">
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[STEPS.PAN, STEPS.OTP, STEPS.NEW_PASSWORD].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : step > s
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < STEPS.NEW_PASSWORD && (
                    <div className={`w-8 h-0.5 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <CardTitle className="text-2xl text-dynamic">
              {stepTitles[step].title}
            </CardTitle>
            <CardDescription className="text-dynamic/70">
              {stepTitles[step].desc}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 1 — Enter PAN */}
            {step === STEPS.PAN && (
              <form onSubmit={handleSendOtp} className="space-y-6">
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 btn-dynamic text-white font-semibold text-lg disabled:opacity-60"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            )}

            {/* Step 2 — Enter OTP */}
            {step === STEPS.OTP && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-dynamic">PAN</Label>
                  <Input
                    value={pan}
                    disabled
                    className="bg-gray-50 border-gray-300 text-dynamic/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-dynamic">OTP *</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                    maxLength={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 btn-dynamic text-white font-semibold text-lg disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <p
                  className="text-center text-xs text-blue-600 cursor-pointer hover:underline"
                  onClick={() => {
                    setStep(STEPS.PAN);
                    setOtp('');
                  }}
                >
                  ← Change PAN / Resend OTP
                </p>
              </form>
            )}

            {/* Step 3 — New Password */}
            {step === STEPS.NEW_PASSWORD && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-dynamic">New Password *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-dynamic">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 btn-dynamic text-white font-semibold text-lg disabled:opacity-60"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-dynamic/70">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}