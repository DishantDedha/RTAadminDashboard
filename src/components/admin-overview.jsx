'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminOverview() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-dynamic mb-2">Admin Dashboard</h1>
      <p className="text-dynamic/70 mb-8">Overview of all submissions</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="card-dynamic border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-dynamic/70">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-dynamic">248</p>
          </CardContent>
        </Card>
        <Card className="card-dynamic border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-dynamic/70">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-600">87</p>
          </CardContent>
        </Card>
        <Card className="card-dynamic border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-dynamic/70">Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">142</p>
          </CardContent>
        </Card>
        <Card className="card-dynamic border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-dynamic/70">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-dynamic">19</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card className="card-dynamic border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-dynamic">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Service Request</TableCell>
                <TableCell>Rahul Sharma</TableCell>
                <TableCell>24 Mar 2026</TableCell>
                <TableCell className="text-amber-600">Pending</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Complaint</TableCell>
                <TableCell>Priya Patel</TableCell>
                <TableCell>23 Mar 2026</TableCell>
                <TableCell className="text-green-600">Processed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}