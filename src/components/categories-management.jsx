'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import {
  getCategoriesApi, createCategoryApi, deleteCategoryApi,
  createSubCategoryApi, deleteSubCategoryApi,
  createDocumentApi, deleteDocumentApi,
} from '@/app/api/categoriesApi';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [newDocLabel, setNewDocLabel] = useState('');
  const [newDocRequired, setNewDocRequired] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();
      setCategories(res.data.data);
    } catch (err) {
      showToast('Failed to fetch categories.', 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      setLoading(true);
      await createCategoryApi(newCategory);
      setNewCategory('');
      showToast('Category added successfully!', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add category.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category and all its sub-categories?')) return;
    try {
      await deleteCategoryApi(id);
      showToast('Category deleted.', 'success');
      fetchCategories();
    } catch (err) {
      showToast('Failed to delete category.', 'error');
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim() || !selectedCategoryId) return;
    try {
      setLoading(true);
      await createSubCategoryApi(selectedCategoryId, newSubCategory);
      setNewSubCategory('');
      setSelectedCategoryId(null);
      showToast('Sub-category added successfully!', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add sub-category.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!confirm('Delete this sub-category and all its documents?')) return;
    try {
      await deleteSubCategoryApi(id);
      showToast('Sub-category deleted.', 'success');
      fetchCategories();
    } catch (err) {
      showToast('Failed to delete sub-category.', 'error');
    }
  };

  const handleAddDocument = async () => {
    if (!newDocLabel.trim() || !selectedSubCategoryId) return;
    try {
      setLoading(true);
      await createDocumentApi(selectedSubCategoryId, newDocLabel, newDocRequired);
      setNewDocLabel('');
      setSelectedSubCategoryId(null);
      showToast('Document added successfully!', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add document.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!confirm('Delete this document?')) return;
    try {
      await deleteDocumentApi(id);
      showToast('Document deleted.', 'success');
      fetchCategories();
    } catch (err) {
      showToast('Failed to delete document.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">Categories Management</h1>
        <p className="text-dynamic/70">Admin / Categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Category */}
        <Card className="card-dynamic border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl mt-4 text-dynamic">Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2">Category Name</Label>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
            <Button
              onClick={handleAddCategory}
              disabled={loading}
              className="w-full btn-dynamic text-white"
            >
              Add Category
            </Button>
          </CardContent>
        </Card>

        {/* Existing Categories */}
        <Card className="card-dynamic border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-dynamic">Existing Categories</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {categories.length === 0 && (
              <p className="text-dynamic/50 italic text-sm">No categories yet.</p>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className="mb-6 border-b pb-6 last:border-0 last:pb-0">
                {/* Category Row */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-dynamic">{cat.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setSelectedSubCategoryId(null);
                      }}
                    >
                      + Sub
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Sub Categories */}
                <div className="pl-4 space-y-3">
                  {cat.subCategories?.length === 0 && (
                    <p className="text-sm italic text-dynamic/50">No sub-categories yet.</p>
                  )}
                  {cat.subCategories?.map((sub) => (
                    <div key={sub.id}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-dynamic">• {sub.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubCategoryId(sub.id);
                              setSelectedCategoryId(null);
                            }}
                          >
                            + Doc
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-300 hover:bg-red-50"
                            onClick={() => handleDeleteSubCategory(sub.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="pl-4 mt-1 space-y-1">
                        {sub.documents?.map((doc) => (
                          <div key={doc.id} className="flex justify-between items-center text-xs text-dynamic/60">
                            <span>
                              📄 {doc.label}
                              {doc.is_required
                                ? <span className="text-red-400 ml-1">*</span>
                                : <span className="text-dynamic/40 ml-1">(optional)</span>
                              }
                            </span>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-400 hover:text-red-600 ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add Sub-category */}
      {selectedCategoryId && (
        <Card className="card-dynamic border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-dynamic">
              Add Sub-category to: {categories.find(c => c.id === selectedCategoryId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              placeholder="Enter sub-category name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory()}
            />
            <div className="flex gap-3">
              <Button
                onClick={handleAddSubCategory}
                disabled={loading}
                className="flex-1 btn-dynamic text-white"
              >
                Add Sub-category
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedCategoryId(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Document */}
      {selectedSubCategoryId && (
        <Card className="card-dynamic border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-dynamic">Add Required Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2">Document Label</Label>
              <Input
                value={newDocLabel}
                onChange={(e) => setNewDocLabel(e.target.value)}
                placeholder="e.g. Aadhaar Card, PAN Card"
                onKeyDown={(e) => e.key === 'Enter' && handleAddDocument()}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="required"
                checked={newDocRequired}
                onChange={(e) => setNewDocRequired(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <Label htmlFor="required">Required document</Label>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddDocument}
                disabled={loading}
                className="flex-1 btn-dynamic text-white"
              >
                Add Document
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedSubCategoryId(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}