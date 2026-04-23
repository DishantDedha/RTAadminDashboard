'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSubmissionsApi, getSubmissionStatsApi } from '@/app/api/submissionsApi';

export default function AdminOverview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, today: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, submissionsRes] = await Promise.all([
        getSubmissionStatsApi(),
        getSubmissionsApi(1, 5),
      ]);
      setStats(statsRes.data.data);
      setRecent(submissionsRes.data.data.submissions);
    } catch (err) {
      console.error('Failed to fetch overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: 'text-amber-600',
    Resolved: 'text-green-600',
    'In Progress': 'text-blue-600',
    Submitted: 'text-purple-600',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-dynamic mb-2">Admin Dashboard</h1>
      <p className="text-dynamic/70 mb-8">Overview of all submissions</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Submissions', value: stats.total, color: 'text-dynamic' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
          { label: 'Today', value: stats.today, color: 'text-blue-600' },
        ].map((stat) => (
          <Card key={stat.label} className="card-dynamic border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-dynamic/70">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${stat.color}`}>
                {loading ? '—' : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card className="card-dynamic border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-dynamic">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-dynamic/50">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8 text-dynamic/50">No submissions yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URN</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((sub, index) => (
                  <TableRow key={`${sub.type}-${sub.id}-${index}`}>
                    <TableCell className="font-mono text-xs text-blue-600 font-medium">
                      {sub.urn || '—'}
                    </TableCell>
                    <TableCell>{sub.type}</TableCell>
                    <TableCell>{sub.submitted_by}</TableCell>
                    <TableCell className="font-mono text-xs">{sub.pan}</TableCell>
                    <TableCell>
                      {new Date(sub.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className={statusColors[sub.status] || 'text-dynamic'}>
                      {sub.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}