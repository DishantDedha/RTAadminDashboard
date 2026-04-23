'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { getSubmissionsApi, getSubmissionDetailsApi, getExemptionFormsApi } from '@/app/api/submissionsApi';

const TABS = { ALL: 'all', EXEMPTION: 'exemption' };

export default function SubmissionsList() {
  const [activeTab, setActiveTab] = useState(TABS.ALL);

  // All submissions state
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Exemption forms state
  const [exemptions, setExemptions] = useState([]);
  const [exemptionPage, setExemptionPage] = useState(1);
  const [exemptionTotalPages, setExemptionTotalPages] = useState(1);
  const [exemptionTotal, setExemptionTotal] = useState(0);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const typeToSlug = {
    'Service Request': 'service-request',
    'Complaint': 'complaint',
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Resolved: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Submitted: 'bg-purple-100 text-purple-700',
  };

  useEffect(() => {
    if (activeTab === TABS.ALL) fetchSubmissions();
  }, [page, activeTab]);

  useEffect(() => {
    if (activeTab === TABS.EXEMPTION) fetchExemptions();
  }, [exemptionPage, activeTab]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await getSubmissionsApi(page, 10);
      const { submissions, totalPages, total } = res.data.data;
      setSubmissions(submissions);
      setTotalPages(totalPages);
      setTotal(total);
    } catch {
      showToast('Failed to fetch submissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchExemptions = async () => {
    try {
      setLoading(true);
      const res = await getExemptionFormsApi(exemptionPage, 10);
      const { submissions, totalPages, total } = res.data.data;
      setExemptions(submissions);
      setExemptionTotalPages(totalPages);
      setExemptionTotal(total);
    } catch {
      showToast('Failed to fetch exemption forms.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (sub, isExemption = false) => {
    setSelectedSubmission({ ...sub, isExemption });
    setDetails(null);

    if (isExemption) {
      setDetails(sub);
      return;
    }

    const slug = typeToSlug[sub.type];
    if (!slug) {
      setDetails(sub);
      return;
    }
    try {
      setDetailsLoading(true);
      const res = await getSubmissionDetailsApi(slug, sub.id);
      setDetails(res.data.data);
    } catch {
      showToast('Failed to fetch details.', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  const renderPagination = (currentPage, totalPgs, setPageFn) => {
    if (totalPgs <= 1) return null;
    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-dynamic/60">Page {currentPage} of {totalPgs}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPageFn(p => p - 1)}>
            Previous
          </Button>
          {Array.from({ length: totalPgs }, (_, i) => i + 1).map(p => (
            <Button
              key={p}
              variant={p === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPageFn(p)}
              className={p === currentPage ? 'btn-dynamic text-white' : ''}
            >
              {p}
            </Button>
          ))}
          <Button variant="outline" size="sm" disabled={currentPage === totalPgs} onClick={() => setPageFn(p => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">All Submissions</h1>
        <p className="text-dynamic/70">Admin / Submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => { setActiveTab(TABS.ALL); setPage(1); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === TABS.ALL
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-dynamic/60 hover:text-dynamic'
          }`}
        >
          All Submissions
          <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {total}
          </span>
        </button>
        <button
          onClick={() => { setActiveTab(TABS.EXEMPTION); setExemptionPage(1); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === TABS.EXEMPTION
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-dynamic/60 hover:text-dynamic'
          }`}
        >
          Exemption Forms
          <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {exemptionTotal}
          </span>
        </button>
      </div>

      <Card className="card-dynamic border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-dynamic">
            {activeTab === TABS.ALL ? `Recent Form Submissions — ${total} total` : `Exemption Forms — ${exemptionTotal} total`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-dynamic/50">Loading...</div>
          ) : (
            <>
              {/* All Submissions Tab */}
              {activeTab === TABS.ALL && (
                <>
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-dynamic/50">No submissions yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>URN</TableHead>
                          <TableHead>Form Type</TableHead>
                          <TableHead>Submitted By</TableHead>
                          <TableHead>PAN</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((sub, index) => (
                          <TableRow key={`${sub.type}-${sub.id}-${index}`}>
                            <TableCell className="font-mono text-xs text-blue-600 font-medium">
                              {sub.urn || '—'}
                            </TableCell>
                            <TableCell className="font-medium">{sub.type}</TableCell>
                            <TableCell>{sub.submitted_by}</TableCell>
                            <TableCell className="font-mono text-xs">{sub.pan}</TableCell>
                            <TableCell>
                              {new Date(sub.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[sub.status] || 'bg-gray-100 text-gray-700'}`}>
                                {sub.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleView(sub)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {renderPagination(page, totalPages, setPage)}
                </>
              )}

              {/* Exemption Forms Tab */}
              {activeTab === TABS.EXEMPTION && (
                <>
                  {exemptions.length === 0 ? (
                    <div className="text-center py-12 text-dynamic/50">No exemption forms yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>URN</TableHead>
                          <TableHead>Submitted By</TableHead>
                          <TableHead>PAN</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Form Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exemptions.map((ex) => (
                          <TableRow key={ex.id}>
                            <TableCell className="font-mono text-xs text-blue-600 font-medium">
                              {ex.urn || '—'}
                            </TableCell>
                            <TableCell>{ex.submitted_by}</TableCell>
                            <TableCell className="font-mono text-xs">{ex.pan}</TableCell>
                            <TableCell>{ex.company}</TableCell>
                            <TableCell>{ex.form_type}</TableCell>
                            <TableCell>
                              {new Date(ex.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ex.status] || 'bg-gray-100 text-gray-700'}`}>
                                {ex.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleView(ex, true)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {renderPagination(exemptionPage, exemptionTotalPages, setExemptionPage)}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => { setSelectedSubmission(null); setDetails(null); }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dynamic">
              {selectedSubmission?.isExemption ? 'Exemption Form' : selectedSubmission?.type} Details
            </DialogTitle>
            <DialogDescription>
              URN: <span className="font-mono text-blue-600 font-medium">{selectedSubmission?.urn}</span>
              {' · '}Submitted by {selectedSubmission?.submitted_by} on{' '}
              {selectedSubmission && new Date(selectedSubmission.created_at).toLocaleDateString('en-IN')}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="text-center py-8 text-dynamic/50">Loading details...</div>
          ) : details && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                {details.company && <div><span className="font-medium text-dynamic">Company:</span><span className="text-dynamic/80 ml-2">{details.company}</span></div>}
                {details.folio && <div><span className="font-medium text-dynamic">Folio:</span><span className="text-dynamic/80 ml-2">{details.folio}</span></div>}
                {details.form_type && <div><span className="font-medium text-dynamic">Form Type:</span><span className="text-dynamic/80 ml-2">{details.form_type}</span></div>}
                {details.date_of_birth && <div><span className="font-medium text-dynamic">Date of Birth:</span><span className="text-dynamic/80 ml-2">{new Date(details.date_of_birth).toLocaleDateString('en-IN')}</span></div>}
                {details.assessment_year && <div><span className="font-medium text-dynamic">Assessment Year:</span><span className="text-dynamic/80 ml-2">{details.assessment_year}</span></div>}
                {details.holding_type && <div><span className="font-medium text-dynamic">Holding:</span><span className="text-dynamic/80 ml-2">{details.holding_type}</span></div>}
                {details.dp_id && <div><span className="font-medium text-dynamic">DPID:</span><span className="text-dynamic/80 ml-2">{details.dp_id}</span></div>}
                {details.client_id && <div><span className="font-medium text-dynamic">Client ID:</span><span className="text-dynamic/80 ml-2">{details.client_id}</span></div>}
                {details.category_name && <div><span className="font-medium text-dynamic">Category:</span><span className="text-dynamic/80 ml-2">{details.category_name}</span></div>}
                {details.sub_category_name && <div><span className="font-medium text-dynamic">Sub-Category:</span><span className="text-dynamic/80 ml-2">{details.sub_category_name}</span></div>}
                {details.category && <div><span className="font-medium text-dynamic">Category:</span><span className="text-dynamic/80 ml-2">{details.category}</span></div>}
                {details.complaint_details && <div><span className="font-medium text-dynamic">Details:</span><p className="text-dynamic/80 mt-1">{details.complaint_details}</p></div>}
                {details.pan && <div><span className="font-medium text-dynamic">PAN:</span><span className="font-mono text-dynamic/80 ml-2">{details.pan}</span></div>}
                {details.email && <div><span className="font-medium text-dynamic">Email:</span><span className="text-dynamic/80 ml-2">{details.email}</span></div>}
              </div>

              {/* Exemption form files */}
              {selectedSubmission?.isExemption && (
                <div>
                  <p className="font-medium text-dynamic mb-2 text-sm">Uploaded Files:</p>
                  <div className="space-y-2">
                    {details.pan_copy_url && (
                      <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <span className="text-sm text-blue-800">📄 PAN Copy</span>
                        {!details.pan_copy_url.startsWith('dev_placeholder') && (
                          <a href={details.pan_copy_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Download</Button>
                          </a>
                        )}
                      </div>
                    )}
                    {details.form_copy_url && (
                      <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <span className="text-sm text-blue-800">📄 15H/15G Form</span>
                        {!details.form_copy_url.startsWith('dev_placeholder') && (
                          <a href={details.form_copy_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Download</Button>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service request documents */}
              {details.documents?.length > 0 && (
                <div>
                  <p className="font-medium text-dynamic mb-2 text-sm">Uploaded Documents:</p>
                  <div className="space-y-2">
                    {details.documents.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <span className="text-sm text-blue-800">📄 {doc.document_label}</span>
                        {doc.file_url && !doc.file_url.startsWith('dev_placeholder') && (
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Download</Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complaint attachments */}
              {details.attachments?.length > 0 && (
                <div>
                  <p className="font-medium text-dynamic mb-2 text-sm">Attachments:</p>
                  <div className="space-y-2">
                    {details.attachments.map(att => (
                      <div key={att.id} className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <span className="text-sm text-blue-800">📄 {att.file_name}</span>
                        {att.file_url && !att.file_url.startsWith('dev_placeholder') && (
                          <a href={att.file_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Download</Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => { setSelectedSubmission(null); setDetails(null); }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}