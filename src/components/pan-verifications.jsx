'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { getAllVerificationsApi, reviewVerificationApi } from '@/app/api/verificationApi';

export default function PanVerifications() {
  const [verifications, setVerifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchVerifications();
  }, [page, statusFilter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const res = await getAllVerificationsApi(page, 10, statusFilter);
      const { verifications, totalPages, total } = res.data.data;
      setVerifications(verifications);
      setTotalPages(totalPages);
      setTotal(total);
    } catch {
      showToast('Failed to fetch verifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status) => {
    if (status === 'Rejected' && !rejectionReason.trim()) {
      showToast('Please enter a rejection reason.', 'error');
      return;
    }
    try {
      setLoading(true);
      await reviewVerificationApi(selected.id, {
        status,
        rejected_reason: rejectionReason,
        user_id: selected.user_id,
      });
      showToast(`Verification ${status.toLowerCase()} successfully!`, 'success');
      setSelected(null);
      setRejectionReason('');
      fetchVerifications();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to review.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">PAN Verifications</h1>
        <p className="text-dynamic/70">Admin / PAN Verifications — {total} total</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['', 'Pending', 'Approved', 'Rejected'].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-gray-300 text-dynamic hover:border-blue-400'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <Card className="card-dynamic border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-dynamic">Verification Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-dynamic/50">Loading...</div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-12 text-dynamic/50">No verification requests.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.first_holder_name}</TableCell>
                    <TableCell className="font-mono text-xs">{v.pan}</TableCell>
                    <TableCell>{v.email}</TableCell>
                    <TableCell>{v.mobile_number}</TableCell>
                    <TableCell>
                      {new Date(v.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[v.status]}`}>
                        {v.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelected(v); setRejectionReason(''); }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-dynamic/60">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === page ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                    className={p === page ? 'btn-dynamic text-white' : ''}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setRejectionReason(''); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-dynamic">Review PAN Verification</DialogTitle>
            <DialogDescription>
              {selected?.first_holder_name} — PAN: {selected?.pan}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Document Preview */}
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-dynamic mb-2">Submitted Document:</p>
              <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <span className="text-sm text-blue-800">📄 {selected?.file_name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selected?.file_url, '_blank')}
                >
                  View
                </Button>
              </div>
            </div>

            {/* Current Status */}
            <div className="text-sm">
              <span className="font-medium text-dynamic">Current Status: </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selected?.status]}`}>
                {selected?.status}
              </span>
            </div>

            {/* Rejection Reason */}
            <div>
              <label className="block text-sm font-medium text-dynamic mb-2">
                Rejection Reason
                <span className="text-dynamic/40 ml-1 text-xs">(required if rejecting)</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-dynamic text-sm min-h-[80px] resize-none focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleReview('Approved')}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
              >
                {loading ? 'Processing...' : '✓ Approve'}
              </Button>
              <Button
                onClick={() => handleReview('Rejected')}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
              >
                {loading ? 'Processing...' : '✕ Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}