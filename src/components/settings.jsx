'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import {
  getFaqsAdminApi, createFaqApi, updateFaqApi, deleteFaqApi,
  getContactsAdminApi, createContactApi, updateContactApi, deleteContactApi,
} from '@/app/api/contenApi';

const TABS = { FAQS: 'faqs', CONTACTS: 'contacts' };

export default function Settings() {
  const [activeTab, setActiveTab] = useState(TABS.FAQS);

  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);

  // Contact state
  const [contacts, setContacts] = useState([]);
  const [newContactType, setNewContactType] = useState('phone');
  const [newContactLabel, setNewContactLabel] = useState('');
  const [newContactValue, setNewContactValue] = useState('');
  const [editingContact, setEditingContact] = useState(null);

  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchFaqs();
    fetchContacts();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await getFaqsAdminApi();
      setFaqs(res.data.data);
    } catch {
      showToast('Failed to fetch FAQs.', 'error');
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContactsAdminApi();
      setContacts(res.data.data);
    } catch {
      showToast('Failed to fetch contacts.', 'error');
    }
  };

  // ─── FAQ Handlers ──────────────────────────────────────
  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      showToast('Question and answer are required.', 'error');
      return;
    }
    try {
      setLoading(true);
      await createFaqApi({ question: newQuestion, answer: newAnswer, order_index: faqs.length });
      setNewQuestion('');
      setNewAnswer('');
      showToast('FAQ added successfully!', 'success');
      fetchFaqs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add FAQ.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      showToast('Question and answer are required.', 'error');
      return;
    }
    try {
      setLoading(true);
      await updateFaqApi(editingFaq.id, {
        question: editingFaq.question,
        answer: editingFaq.answer,
        order_index: editingFaq.order_index,
        is_active: editingFaq.is_active,
      });
      setEditingFaq(null);
      showToast('FAQ updated successfully!', 'success');
      fetchFaqs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update FAQ.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await deleteFaqApi(id);
      showToast('FAQ deleted.', 'success');
      fetchFaqs();
    } catch {
      showToast('Failed to delete FAQ.', 'error');
    }
  };

  // ─── Contact Handlers ──────────────────────────────────
  const handleAddContact = async () => {
    if (!newContactLabel.trim() || !newContactValue.trim()) {
      showToast('Label and value are required.', 'error');
      return;
    }
    try {
      setLoading(true);
      await createContactApi({
        type: newContactType,
        label: newContactLabel,
        value: newContactValue,
        order_index: contacts.length,
      });
      setNewContactLabel('');
      setNewContactValue('');
      showToast('Contact added successfully!', 'success');
      fetchContacts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add contact.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    try {
      setLoading(true);
      await updateContactApi(editingContact.id, {
        type: editingContact.type,
        label: editingContact.label,
        value: editingContact.value,
        order_index: editingContact.order_index,
        is_active: editingContact.is_active,
      });
      setEditingContact(null);
      showToast('Contact updated successfully!', 'success');
      fetchContacts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update contact.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await deleteContactApi(id);
      showToast('Contact deleted.', 'success');
      fetchContacts();
    } catch {
      showToast('Failed to delete contact.', 'error');
    }
  };

  const contactTypeIcons = {
    phone: '📞',
    email: '✉️',
    address: '📍',
    timing: '🕐',
    social: '🔗',
    other: '📌',
  };

  return (
    <div className="max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">Settings</h1>
        <p className="text-dynamic/70">Admin / Settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { key: TABS.FAQS, label: "FAQs" },
          { key: TABS.CONTACTS, label: "Contact Us" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-dynamic/60 hover:text-dynamic'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── FAQs Tab ─────────────────────────────────── */}
      {activeTab === TABS.FAQS && (
        <div className="space-y-8">
          {/* Add FAQ */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-dynamic">Add New FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2">Question</Label>
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter question"
                />
              </div>
              <div>
                <Label className="mb-2">Answer</Label>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter answer"
                  className="min-h-[100px]"
                />
              </div>
              <Button
                onClick={handleAddFaq}
                disabled={loading}
                className="w-full btn-dynamic text-white"
              >
                Add FAQ
              </Button>
            </CardContent>
          </Card>

          {/* Existing FAQs */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-dynamic">
                Existing FAQs ({faqs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.length === 0 && (
                <p className="text-dynamic/50 italic text-sm">No FAQs yet.</p>
              )}
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-xl p-4">
                  {editingFaq?.id === faq.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <Input
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                        placeholder="Question"
                      />
                      <Textarea
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        placeholder="Answer"
                        className="min-h-[80px]"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`active-${faq.id}`}
                          checked={editingFaq.is_active}
                          onChange={(e) => setEditingFaq({ ...editingFaq, is_active: e.target.checked })}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <Label htmlFor={`active-${faq.id}`}>Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateFaq}
                          disabled={loading}
                          className="flex-1 btn-dynamic text-white"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingFaq(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-dynamic text-sm flex-1 pr-4">
                          Q: {faq.question}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {faq.is_active ? 'Active' : 'Hidden'}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingFaq({ ...faq })}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-300 hover:bg-red-50"
                            onClick={() => handleDeleteFaq(faq.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-dynamic/70">A: {faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Contact Us Tab ───────────────────────────── */}
      {activeTab === TABS.CONTACTS && (
        <div className="space-y-8">
          {/* Add Contact */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-dynamic">Add Contact Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-2">Type</Label>
                  <select
                    value={newContactType}
                    onChange={(e) => setNewContactType(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-dynamic focus:outline-none focus:border-blue-500"
                  >
                    <option value="phone">📞 Phone</option>
                    <option value="email">✉️ Email</option>
                    <option value="address">📍 Address</option>
                    <option value="timing">🕐 Timing</option>
                    <option value="social">🔗 Social</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-2">Label</Label>
                  <Input
                    value={newContactLabel}
                    onChange={(e) => setNewContactLabel(e.target.value)}
                    placeholder="e.g. Customer Care"
                  />
                </div>
                <div>
                  <Label className="mb-2">Value</Label>
                  <Input
                    value={newContactValue}
                    onChange={(e) => setNewContactValue(e.target.value)}
                    placeholder="e.g. +91 9999999999"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddContact}
                disabled={loading}
                className="w-full btn-dynamic text-white"
              >
                Add Contact
              </Button>
            </CardContent>
          </Card>

          {/* Existing Contacts */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-dynamic">
                Existing Contacts ({contacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contacts.length === 0 && (
                <p className="text-dynamic/50 italic text-sm">No contacts yet.</p>
              )}
              {contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-xl p-4">
                  {editingContact?.id === contact.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          value={editingContact.type}
                          onChange={(e) => setEditingContact({ ...editingContact, type: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-dynamic"
                        >
                          <option value="phone">📞 Phone</option>
                          <option value="email">✉️ Email</option>
                          <option value="address">📍 Address</option>
                          <option value="timing">🕐 Timing</option>
                          <option value="social">🔗 Social</option>
                          <option value="other">📌 Other</option>
                        </select>
                        <Input
                          value={editingContact.label}
                          onChange={(e) => setEditingContact({ ...editingContact, label: e.target.value })}
                          placeholder="Label"
                        />
                        <Input
                          value={editingContact.value}
                          onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                          placeholder="Value"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`contact-active-${contact.id}`}
                          checked={editingContact.is_active}
                          onChange={(e) => setEditingContact({ ...editingContact, is_active: e.target.checked })}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <Label htmlFor={`contact-active-${contact.id}`}>Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateContact}
                          disabled={loading}
                          className="flex-1 btn-dynamic text-white"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingContact(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{contactTypeIcons[contact.type] || '📌'}</span>
                        <div>
                          <p className="font-medium text-dynamic text-sm">{contact.label}</p>
                          <p className="text-dynamic/70 text-sm">{contact.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${contact.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {contact.is_active ? 'Active' : 'Hidden'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingContact({ ...contact })}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-300 hover:bg-red-50"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}