// @vsc repo:vsc-project-39-frontend file:src/app/admin/products/page.tsx task:f12-src-app-admin-products-page-tsx module:frontend session:39
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { ArrowPathIcon, Trash2Icon, PlusIcon, RefreshCwIcon, SearchIcon } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTables';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { ProductMergeModal } from '@/components/admin/ProductMergeModal';
import { api } from '@/lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [mergeProductIds, setMergeProductIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState<any>(null);

  // Debounced search handler
  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 300);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/products', {
        params: { search: searchTerm }
      });
      setProducts(response.data);
    } catch (error) {
      toast.error('خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Effect for initial load and search changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

// Handle add product
const handleAddProduct = () => {
setSelectedProductId(null);
setEditProductData(null);
setIsAddModalOpen(true);
};

// Handle edit product
const handleEditProduct = (product: any) => {
setSelectedProductId(product.id);
setEditProductData(product);
setIsEditModalOpen(true);
};

// Handle delete product
const handleDeleteProduct = async (id: string) => {
if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
try {
await api.delete(`/admin/products/${id}`);
toast.success('محصول با موفقیت حذف شد');
fetchProducts();
} catch (error) {
toast.error('خطا در حذف محصول');
}
};

// Handle merge products
const handleMergeProducts = () => {
setIsMergeModalOpen(true);
};

// Handle merge confirmation
const handleMergeConfirm = async (primaryId: string) => {
try {
await api.post(`/admin/products/merge`, { primaryId, duplicateIds: mergeProductIds });
toast.success('محصولات با موفقیت ادغام شد');
fetchProducts();
setMergeProductIds([]);
setIsMergeModalOpen(false);
} catch (error) {
toast.error('خطا در ادغام محصولات');
}
};

// Handle form submission (add/edit)
const handleFormSubmit = async (data: FormData) => {
try {
if (selectedProductId) {
// Update existing product
await api.put(`/admin/products/${selectedProductId}`, data);
toast.success('محصول با موفقیت به‌روزرسانی شد');
} else {
// Create new product
await api.post('/admin/products', data);
toast.success('محصول با موفقیت اضافه شد');
}
fetchProducts();
setIsAddModalOpen(false);
setIsEditModalOpen(false);
// Reset form state
setSelectedProductId(null);
setEditProductData(null);
// Note: The modal should reset itself on close via its own state
} catch (error) {
toast.error(selectedProductId ? 'خطا در به‌روزرسانی محصول' : 'خطا در افزودن محصول');
}
};

return (
<main className="min-h-[calc(100vh-64px)] bg-neutral-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
<h1 className="text-3xl font-bold text-neutral-900">مدیریت محصولات</h1>
<div className="flex flex-wrap gap-4">
<button
onClick={handleAddProduct}
className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
>
<PlusIcon className="h-4 w-4" aria-hidden="true" />
افزودن محصول
</button>
<button
onClick={handleMergeProducts}
disabled={mergeProductIds.length === 0}
className={`inline-flex items-center justify-center gap-2 bg-accent text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-orange-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${
mergeProductIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
}`}
>
<RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
ادغام محصولات تکراری ({mergeProductIds.length})
</button>
</div>
</header>

{/* Search Bar */}
<div className="mb-6">
<div className="flex flex-col gap-2">
<label htmlFor="product-search" className="text-sm font-medium text-neutral-800">
جستجو بر اساس نام محصول
</label>
<div className="relative">
<SearchIcon className="absolute left-[12px] top-[50%] -translate-y-[50%] h-4 w-4 text-neutral-400" aria-hidden="true" />
<input
type="text"
id="product-search"
placeholder="نام محصول را وارد کنید..."
value={searchTerm}
onChange={handleSearchChange}
className={`w-full pl-[36px] pr-[12px] py-[10px] bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-
400 focus:outline-none focus:ring-
2 focus:ring-primary focus:border-transparent transition-all rtl`}
dir="rtl"
/>
</div>
</div>
</div>

{/* Products Table */}
{loading ? (
<div className="flex min-h-[300px] items-center justify-center">
<div className="animate-spin rounded-full h-
8 w-
8 border-b-
2 border-primary"></div>
</div>
) : (
<AdminTable
data={products}
columns={[
{
accessorKey: 'id',
header: 'ID',
cell: ({ row }: any) => <span className=
"font-mono text-sm">{row.original.id}</span>,
},
{
accessorKey: 'imageUrl',
header: 'تصویر',
cell: ({ row }: any) => (
<img
src={row.original.imageUrl || '/placeholder.png'}
alt={`${row.original.name || ''} thumbnail`}
className="
w-
16 h-
16 object-
cover rounded-md border border-
neutral-
200"
/>
)
},
{
accessorKey: 'name',
header: 'نام محصول',
cell: ({ row }: any) => <span>{row.original.name}</span>,
},
{
accessorKey: 'brand',
header': برند',
cell: ({ row }: any) => <span>{row.original.brand?.name || '-'}</span>,
},
{
accessorKey: 'category',
header': دسته‌بندی',
cell: ({ row }: any) => <span>{row.original.category?.name || '-'}</span>,
},
{
accessorKey:
'suitable_for',
header': مناسب برای',
cell:
({ row }: any) =>
(
<div className="
flex flex-wrap gap-
1">
{(row.original.suitable_for || []).map((species:
any,
index:
number) =>
(
<span key={
index} className="
inline-flex items-center bg-success/
10 text-success text-xs font-medium px-
2 py-
1 rounded-full"
aria-hidden="
true"
>{species}</span>
))}
</div>
)
},
{
accessorKey:
'created_at',
header': تاریخ ایجاد',
cell:
({ row }: any) =>
(
<span className="
text-xs text-neutral-
500">
{new Date(row.original.created_at).toLocaleDateString(
'fa-IR'
)}
</span>
)
},
{
accessorKey:
'actions',
header': عمل‌ها',
cell:
({ row }: any) =>
(
<div className="
flex items-center gap-
2">
<button onClick={() =>
handleEditProduct(row.original)}
className="
inline-flex items-center justify-center gap-
1 bg-transparent text-primary font-medium text-sm px-
3 py-
1.5 rounded-md hover:bg-neutral-
50 transition-all focus:
outline-none focus:ring-
2 focus:ring-primary"
aria-label="
ویرایش محصول"
><ArrowPathIcon className="
h-
3 w-
3" aria-hidden=
"true" /></button>
<button onClick={() =>
handleDeleteProduct(row.original.id)}
className="
inline-flex items-center justify-center gap-
1 bg-danger text-white font-medium text-sm px-
3 py-
1.5 rounded-md shadow-sm hover:bg-red-
600 transition-all focus:
outline-none focus:ring-
2 focus:ring-offset-
2 focus:ring-danger disabled:
opacity-
50 disabled:
cursor-not-
allowed"
aria-label="
حذف محصول"
><Trash2Icon className="
h-
3 w=
3" aria-hidden=
"true" /></button>
</div>
)
},
]}
isLoading={loading}
enableSelection={true}
onSelectionChange={(ids:string[]) =>
setMergeProductIds(ids)}
/*
Note:
The AdminTable component is expected to have selection functionality.
We assume it has props like enableSelection and onSelectionChange.
If not exactly matching this API,
adjust based on actual AdminTables.tsx implementation.
*/
/>   )}
</div>

{/* Add/Edit Product Modal */}
<ProductFormModal
isOpen={isAddModalOpen || isEditModalOpen}
onClose={() => {
setIsAddModalOpen(false)
setIsEditModalOpen(false)
}}
onSubmit={handleFormSubmit}
initialData={editProductData}
/>

{/* Merge Products Modal */}
<ProductMergeModal
isOpen={isMergeModalOpen}
onClose={() => setIsMergeModalOpen(false)}
onConfirm={handleMergeConfirm}
/>

<style jsx>{`
.main-content-container {
/* Ensures proper RTL layout */
direction: rtl;
text-align:right;
}

/* Additional RTL specific adjustments if needed */
[dir=rtl] .AdminTable th,
[dir=rtl] .AdminTable td {
/* Table cells already handled by logical properties in design system */
}
`}</style>
</main>)}
