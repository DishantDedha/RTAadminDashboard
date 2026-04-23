'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Plus, Trash2, FileText, Upload, Pencil } from 'lucide-react';
import {
  getIsrFormsAdminApi,
  createIsrFormApi,
  updateIsrFormApi,
  deleteIsrFormApi,
} from '@/app/api/isrApi';

export default function IsrFormsManagement() {
  const [forms, setForms] = useState([]);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const fileInputRef = useRef(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await getIsrFormsAdminApi();
      setForms(res.data.data);
    } catch {
      showToast('Failed to fetch ISR forms.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      showToast('Please select a valid PDF file.', 'error');
      e.target.value = null;
    }
  };

  const handleSubmit = async () => {
    if (!label.trim()) { showToast('Label is required.', 'error'); return; }
    if (!description.trim()) { showToast('Description is required.', 'error'); return; }
    if (!pdfFile) { showToast('Please upload a PDF file.', 'error'); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', label.trim());
      formData.append('description', description.trim());
      formData.append('order_index', forms.length);
      formData.append('file', pdfFile);

      await createIsrFormApi(formData);

      setLabel('');
      setDescription('');
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      showToast('ISR form created successfully!', 'success');
      fetchForms();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create ISR form.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingForm.title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }
    try {
      setLoading(true);
      await updateIsrFormApi(editingForm.id, {
        title: editingForm.title,
        description: editingForm.description,
        is_active: editingForm.is_active,
        order_index: editingForm.order_index,
      });
      setEditingForm(null);
      showToast('ISR form updated!', 'success');
      fetchForms();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this ISR form?')) return;
    try {
      await deleteIsrFormApi(id);
      showToast('Form deleted.', 'success');
      fetchForms();
    } catch {
      showToast('Failed to delete ISR form.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">ISR Forms Management</h1>
        <p className="text-dynamic/70">Admin / ISR Forms Management</p>
      </div>

      {/* Create Form */}
      <Card className="card-dynamic border border-gray-200 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-dynamic">
            <Plus className="w-4 h-4" /> Create New ISR Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="isr-label">Label</Label>
            <Input
              id="isr-label"
              placeholder="e.g. ISR Form A"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="isr-desc">Short Description</Label>
            <Textarea
              id="isr-desc"
              placeholder="Brief description of this ISR form..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label>Upload PDF</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                pdfFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <Upload className={`w-6 h-6 ${pdfFile ? 'text-blue-500' : 'text-gray-400'}`} />
              {pdfFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-600">{pdfFile.name}</p>
                  <p className="text-xs text-dynamic/50">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-dynamic">Click to upload a PDF</p>
                  <p className="text-xs text-dynamic/50">PDF files only</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-dynamic text-white"
            >
              {loading ? 'Creating...' : 'Create ISR Form'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      {forms.length > 0 ? (
        <Card className="card-dynamic border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base text-dynamic">
              Created ISR Forms ({forms.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {forms.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                {editingForm?.id === f.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editingForm.title}
                      onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                      placeholder="Title"
                    />
                    <Textarea
                      value={editingForm.description}
                      onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`active-${f.id}`}
                        checked={editingForm.is_active}
                        onChange={(e) => setEditingForm({ ...editingForm, is_active: e.target.checked })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <Label htmlFor={`active-${f.id}`}>Active (visible to clients)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdate} disabled={loading} className="flex-1 btn-dynamic text-white">
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingForm(null)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-50 rounded-lg mt-0.5">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-dynamic text-sm">{f.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${f.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {f.is_active ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-dynamic/60 mt-0.5">{f.description}</p>
                        <p className="text-xs text-dynamic/40 mt-1">
                          {f.file_name} · Added {new Date(f.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">Preview</Button>
                      </a>
                      <button
                        onClick={() => setEditingForm({ ...f })}
                        className="text-blue-400 hover:text-blue-600 mt-1"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-400 hover:text-red-600 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16 text-dynamic/40">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No ISR forms created yet.</p>
        </div>
      )}
    </div>
  );
}