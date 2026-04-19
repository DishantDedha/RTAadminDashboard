'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { registerApi } from '../../api/authApi';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    rePan: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  const description = "INDUS Is A Unified Platform For Your Equity Investment Monitoring With Multiple Self-Help Features.";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (formData.pan !== formData.rePan) {
      showToast("PAN numbers don't match!", 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords don't match!", 'error');
      return;
    }
    if (!agreed) {
      showToast('Please agree to the declaration.', 'error');
      return;
    }

    try {
      setLoading(true);

      const response = await registerApi({
        first_holder_name: formData.name,
        pan: formData.pan,
        mobile_number: formData.mobile,
        email: formData.email,
        password: formData.password,
        role: 'client',
      });

      // Save token and user to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      showToast('Account created successfully!', 'success');

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
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
              alt="KFINTCH Logo"
              width={280}
              height={120}
              className="drop-shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-6xl font-bold text-dynamic tracking-tight mb-6">
            INDUS
          </h1>
          <p className="text-2xl text-dynamic/80 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dynamic">
        <Card className="w-full max-w-md card-dynamic border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-dynamic">SIGN UP</CardTitle>
            <CardDescription className="text-dynamic/70">
              Create your INDUS account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              {/* First Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-dynamic">First Holder Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="First Holder Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* PAN */}
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-dynamic">PAN *</Label>
                <Input
                  id="pan"
                  name="pan"
                  placeholder="First Holder PAN"
                  value={formData.pan}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Re-Enter PAN */}
              <div className="space-y-2">
                <Label htmlFor="rePan" className="text-dynamic">Re-Enter PAN *</Label>
                <Input
                  id="rePan"
                  name="rePan"
                  placeholder="Re enter First Holder PAN"
                  value={formData.rePan}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Indian Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-dynamic">Indian Mobile Number *</Label>
                <div className="flex gap-3">
                  <div className="bg-white border border-gray-300 rounded-xl px-4 flex items-center text-dynamic/70">+91</div>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Registered Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500 flex-1"
                    required
                  />
                </div>
              </div>

              {/* Email ID */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-dynamic">Email ID *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Registered Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-dynamic">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Setup Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-dynamic">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re enter Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-dynamic placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Declaration Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="declaration"
                  checked={agreed}
                  onCheckedChange={setAgreed}
                  className="mt-1"
                />
                <Label htmlFor="declaration" className="text-sm text-dynamic/90 leading-tight cursor-pointer">
                  I declare that all the above provided information is correct and agree to all the terms &amp; conditions.
                </Label>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-dynamic text-white font-semibold text-lg hover:brightness-110 transition-all disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-dynamic/70">
              Already registered?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                LOGIN
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}