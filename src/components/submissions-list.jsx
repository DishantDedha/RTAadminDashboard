'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const dummySubmissions = [
  {
    id: 1,
    type: "Service Request",
    submittedBy: "Rahul Sharma",
    date: "25 Mar 2026",
    status: "Pending",
    details: "Request for duplicate share certificate. PAN: ABCDE1234F",
  },
  {
    id: 2,
    type: "General Query",
    submittedBy: "Priya Patel",
    date: "24 Mar 2026",
    status: "Resolved",
    details: "Query regarding dividend credit delay. Folio: 12345678",
  },
  {
    id: 3,
    type: "Complaint",
    submittedBy: "Amit Kumar",
    date: "23 Mar 2026",
    status: "In Progress",
    details: "Complaint about incorrect KYC update.",
  },
  {
    id: 4,
    type: "Exemption Form",
    submittedBy: "Sneha Rao",
    date: "22 Mar 2026",
    status: "Submitted",
    details: "Form 15G submitted for TDS exemption.",
  },
  {
    id: 5,
    type: "ISR Form",
    submittedBy: "Vikas Singh",
    date: "21 Mar 2026",
    status: "Pending",
    details: "ISR-1 for PAN & KYC update.",
  },
];

export default function SubmissionsList() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">All Submissions</h1>
        <p className="text-dynamic/70">Admin / Submissions</p>
      </div>

      <Card className="card-dynamic border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-dynamic">Recent Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Type</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummySubmissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.type}</TableCell>
                  <TableCell>{sub.submittedBy}</TableCell>
                  <TableCell>{sub.date}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sub.status === "Resolved" ? "bg-green-100 text-green-700" :
                      sub.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {sub.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-dynamic">
              {selectedSubmission?.type} Details
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission?.date} by {selectedSubmission?.submittedBy}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-dynamic font-medium mb-2">Submitted Data:</p>
              <p className="text-dynamic/80 whitespace-pre-wrap">
                {selectedSubmission?.details}
              </p>
            </div>

            {/* Placeholder for file preview */}
            <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <p className="text-dynamic/60">Submitted File / Document</p>
              <p className="text-xs text-dynamic/40 mt-2">(PDF / Image preview would appear here in real app)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSelectedSubmission(null)}>
              Close
            </Button>
            <Button className="flex-1 btn-dynamic text-white">
              Download File
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}