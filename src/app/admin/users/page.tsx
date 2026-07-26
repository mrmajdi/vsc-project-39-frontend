import { useState, useEffect } from 'react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all, user, vendor, admin
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        role: roleFilter === 'all' ? '' : roleFilter,
      });
      const res = await fetch(`/api/admin/users?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err) {
      setError(err.message);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id, newStatus) => {
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (err) {
      setError('خطا در تغییر وضعیت کاربر');
      // Revert optimistic update
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, isActive: !newStatus } : user
        )
      );
    }
  };

  const fetchUserDetail = async (id) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user details');
      const data = await res.json();
      setProfileUser(data);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const openProfileModal = (user) => {
    setShowProfileModal(true);
    fetchUserDetail(user.id);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileUser(null);
    setProfileLoading(false);
    setProfileError(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchTerm, roleFilter]);

  const getRoleBadgeBg = (role) => {
    switch (role) {
      case 'admin': return 'bg-primary/10';
      case 'vendor': return 'bg-secondary/10';
      default: return 'bg-neutral-100';
    }
  };

  const getRoleBadgeText = (role) => {
    switch (role) {
      case 'admin': return 'text-primary';
      case 'vendor': return 'text-secondary';
      default: return 'text-neutral-600';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'ادمین';
      case 'vendor': return 'فروشنده';
      default: return 'کاربر';
    }
  };

  if (loading && users.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-pulse inline-flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
            <div className="h-8 w-24 bg-neutral-200 rounded"></div>
          </div>
          <p className="text-neutral-500">در حال بارگذاری کاربران...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 sm:flex-none">
          <h1 className="text-2xl font-bold text-neutral-900">مدیریت کاربران</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${roleFilter === 'all' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'} rounded-lg hover:bg-neutral-50 transition-all`}
            >
              همه
            </button>
            <button
              onClick={() => setRoleFilter('user')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${roleFilter === 'user' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'} rounded-lg hover:bg-neutral-50 transition-all`}
            >
              کاربران
            </button>
            <button
              onClick={() => setRoleFilter('vendor')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${roleFilter === 'vendor' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'} rounded-lg hover:bg-neutral-50 transition-all`}
            >
              فروشندگان
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${roleFilter === 'admin' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'} rounded-lg hover:bg-neutral-50 transition-all`}
            >
              ادمین‌ها
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا شماره موبایل"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger border border-danger rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {!loading && users.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-neutral-500">کاربری یافت نشد</p>
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">آواتار</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">نام کامل</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">شماره موبایل</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">ایمیل</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">نقش</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تعداد حیوانات</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تعداد سفارشات</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تاریخ ثبت نام</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">وضعیت</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeBg(user.role)} ${getRoleBadgeText(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {user.petCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {user.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {user.isActive ? 'فعال' : 'مسدود'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleBlock(user.id, !user.isActive)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium ${user.isActive ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-success/10 text-success hover:bg-success/20'} rounded-lg`}
                    >
                      {user.isActive ? 'مسدود کردن' : 'فعال کردن'}
                    </button>
                    <button
                      onClick={() => openProfileModal(user)}
                      className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-lg"
                    >
                      مشاهده پروفایل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-lg">
        <span className="text-sm text-neutral-600">
          نمایش {Math.min((currentPage - 1) * pageSize + 1, users.length)} تا {Math.min(currentPage * pageSize, users.length)} از {totalUsers} کاربر
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50"
          >
            قبلی
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalUsers / pageSize)))}
            disabled={currentPage === Math.ceil(totalUsers / pageSize)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-white hover:bg-primary-dark rounded-lg"
          >
            بعدی
          </button>
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-neutral-900">پروفایل کاربر</h3>
              <button
                onClick={closeProfileModal}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                aria-label="بستن"
              >
                ×
              </button>
            </div>
            {profileLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-pulse inline-flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
                  <div className="h-8 w-24 bg-neutral-200 rounded"></div>
                </div>
                <p className="text-neutral-500">در حال بارگذاری...</p>
              </div>
            ) : profileError ? (
              <div className="bg-danger/10 text-danger border border-danger rounded-lg p-4">
                {profileError}
              </div>
            ) : profileUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={profileUser.avatar || '/default-avatar.png'}
                    alt={profileUser.fullName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-medium text-neutral-900">{profileUser.fullName}</p>
                    <p className="text-sm text-neutral-600">{profileUser.email}</p>
                    <p className="text-sm text-neutral-600">{profileUser.phone}</p>
                  </div>
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">حیوانات</h4>
                  {profileUser.pets && profileUser.pets.length > 0 ? (
                    <ul className="space-y-2">
                      {profileUser.pets.map((pet) => (
                        <li key={pet.id} className="flex items-center gap-2">
                          <span className="material-icons">pets</span>
                          <span>{pet.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-500">حیوانی ثبت نشده</p>
                  )}
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">سفارشات اخیر</h4>
                  {profileUser.recentOrders && profileUser.recentOrders.length > 0 ? (
                    <ul className="space-y-2">
                      {profileUser.recentOrders.map((order) => (
                        <li key={order.id} className="flex justify-between">
                          <span>#{order.id}</span>
                          <span className="text-sm text-neutral-600">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-500">سفارشی ثبت نشده</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-neutral-500">اطلاعات کاربر یافت نشد</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUsersPage;
