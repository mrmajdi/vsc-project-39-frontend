'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  species: string;
  product_count: number;
  children?: Category[];
}

const speciesOptions = [
  { label: 'سگ', value: 'dog' },
  { label: 'گربه', value: 'cat' },
  { label: 'پرنده', value: 'bird' },
  { label: 'ماهی', value: 'fish' },
  { label: 'خرگوش', value: 'rabbit' },
  { label: 'گورخر', value: 'hamster' },
  { label: 'گوزن', value: 'turtle' },
];

const getSpeciesLabel = (value: string) => {
  const option = speciesOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    parent_id: null as number | null,
    species: '' as string,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await axios.post('/admin/categories', formState);
      } else if (isEditModalOpen && editCategoryId !== null) {
        await axios.put(`/admin/categories/${editCategoryId}`, formState);
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditCategoryId(null);
      resetForm();
      await fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('خطا در ذخیره‌سازی دسته‌بندی');
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await axios.delete(`/admin/categories/${deleteId}`);
      setDeleteId(null);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('خطا در حذف دسته‌بندی');
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      slug: '',
      parent_id: null,
      species: '',
    });
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    resetForm();
  };

  const openEditModal = (category: Category) => {
    setEditCategoryId(category.id);
    setIsEditModalOpen(true);
    setFormState({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id,
      species: category.species,
    });
  };

  const toggleCategory = (id: number) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const buildTree = (items: Category[], parentId: number | null): Category[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }));
  };

  const categoriesTree = buildTree(categories, null);

  const renderTreeNode = (category: Category) => {
    const isCategoryExpanded = !!expanded[category.id];
    return (
      <motion.li
        key={category.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col"
      >
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-all">
          {category.children.length > 0 ? (
            <button
              onClick={() => toggleCategory(category.id)}
              className="flex-shrink-0"
            >
              {isCategoryExpanded ? (
                <ChevronUpIcon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
              )}
            </button>
          ) : (
            <span className="flex-shrink-0 h-4 w-4"></span>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-medium text-neutral-900">{category.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center bg-neutral-100 text-neutral-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {getSpeciesLabel(category.species)}
                  </span>
                  <span className="text-xs text-neutral-500">محصولات: {category.product_count}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => setDeleteId(category.id)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-danger font-medium text-base px-3 py-1.5 rounded-md hover:bg-neutral-100 hover:text-danger transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
        {isCategoryExpanded && category.children.length > 0 && (
          <motion.ul
            key={`children-${category.id}`}
            initial={{ height: 0 }}
            animate={{ height: category.children.length * 80 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 pl-4 space-y-2"
          >
            {category.children.map(child => renderTreeNode(child))}
          </motion.ul>
        )}
      </motion.li>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-900">مدیریت دسته‌بندی‌ها</h2>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          افزودن دسته‌بندی
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-neutral-600">در حال بارگذاری...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {categoriesTree.map(category => renderTreeNode(category))}
          </motion.ul>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              {isAddModalOpen ? 'افزودن دسته‌بندی' : 'ویرایش دسته‌بندی'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">نام</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormState(prev => ({
                      ...prev,
                      name: value,
                      slug: generateSlug(value)
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="نام دسته‌بندی"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">اسلاگ</label>
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(e) => setFormState(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="اسلاگ (به صورت خودکار تولید می‌شود)"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">دسته والد</label>
                <select
                  value={formState.parent_id ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormState(prev => ({
                      ...prev,
                      parent_id: value === '' ? null : Number(value)
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">ریشه (بدون والد)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">نوع موجودیت</label>
                <select
                  value={formState.species}
                  onChange={(e) => setFormState(prev => ({ ...prev, species: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {speciesOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditCategoryId(null);
                    resetForm();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddModalOpen ? 'افزودن' : 'به‌روزرسانی'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">تایید حذف</h3>
            <p className="text-neutral-600 mb-6">
              آیا از حذف این دسته‌بندی مطمئنید؟ این عمل غیرقابل بازگشت است و تمام زیردسته‌ها و محصولات مرتبط نیز حذف خواهند شد.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
