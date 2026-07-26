<div class="min-h-screen bg-neutral-50">
  <aside className="lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-neutral-200">
    <div className="p-4">
      <div className="flex items-center space-x-3">
        <img 
          src={user.avatar || '/default-avatar.png'} 
          alt="تصویر کاربر" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium text-neutral-900">{user.name}</p>
          <p className="text-xs text-neutral-500">{user.phone}</p>
        </div>
      </div>
    </div>
    <nav className="mt-6 space-y-2">
      <NavLink 
        href="/account" 
        className={({ isActive }) => `
          inline-flex items-center w-full gap-3 text-sm font-medium 
          ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
          px-3 py-2 rounded-md 
          hover:bg-neutral-50 
          focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        داشبورد
      </NavLink>
      <NavLink 
        href="/account/pets" 
        className={({ isActive }) => `
          inline-flex items-center w-full gap-3 text-sm font-medium 
          ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
          px-3 py-2 rounded-md 
          hover:bg-neutral-50 
          focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        حیوانات خانگی
      </NavLink>
      <NavLink 
        href="/account/orders" 
        className={({ isActive }) => `
          inline-flex items-center w-full gap-3 text-sm font-medium 
          ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
          px-3 py-2 rounded-md 
          hover:bg-neutral-50 
          focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        سفارش‌ها
      </NavLink>
      <NavLink 
        href="/account/wishlist" 
        className={({ isActive }) => `
          inline-flex items-center w-full gap-3 text-sm font-medium 
          ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
          px-3 py-2 rounded-md 
          hover:bg-neutral-50 
          focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        علاقه‌مندی‌ها
      </NavLink>
      <NavLink 
        href="/account/addresses" 
        className={({ isActive }) => `
          inline-flex items-center w-full gap-3 text-sm font-medium 
          ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
          px-3 py-2 rounded-md 
          hover:bg-neutral-50 
          focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        آدرس‌ها
      </NavLink>
      <NavLink 
        href="/account/settings" 
        className={({ isActive }) => `
          inline-flex items-center w-full gap-3 text-sm font-medium 
          ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
          px-3 py-2 rounded-md 
          hover:bg-neutral-50 
          focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        تنظیمات
      </NavLink>
    </nav>
  </aside>
  <main className="flex-1 lg:ml-64 lg:mr-0">
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  </main>
  <nav className="lg:hidden bg-white border-t border-neutral-200">
    <div className="overflow-x-auto whitespace-nowrap px-4 py-2">
      <div className="flex space-x-4">
        <NavLink 
          href="/account" 
          className={({ isActive }) => `
            text-sm font-medium 
            ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
            px-3 py-1.5 rounded-md 
            hover:bg-neutral-50 
            focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          داشبورد
        </NavLink>
        <NavLink 
          href="/account/pets" 
          className={({ isActive }) => `
            text-sm font-medium 
            ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
            px-3 py-1.5 rounded-md 
            hover:bg-neutral-50 
            focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          حیوانات خانگی
        </NavLink>
        <NavLink 
          href="/account/orders" 
          className={({ isActive }) => `
            text-sm font-medium 
            ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
            px-3 py-1.5 rounded-md 
            hover:bg-neutral-50 
            focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          سفارش‌ها
        </NavLink>
        <NavLink 
          href="/account/wishlist" 
          className={({ isActive }) => `
            text-sm font-medium 
            ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
            px-3 py-1.5 rounded-md 
            hover:bg-neutral-50 
            focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          علاقه‌مندی‌ها
        </NavLink>
        <NavLink 
          href="/account/addresses" 
          className={({ isActive }) => `
            text-sm font-medium 
            ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
            px-3 py-1.5 rounded-md 
            hover:bg-neutral-50 
            focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          آدرس‌ها
        </NavLink>
        <NavLink 
          href="/account/settings" 
          className={({ isActive }) => `
            text-sm font-medium 
            ${isActive ? 'text-primary bg-primary/10' : 'text-neutral-600'}
            px-3 py-1.5 rounded-md 
            hover:bg-neutral-50 
            focus:outline-none focus:ring-2 focus-ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          تنظیمات
        </NavLink>
      </div>
    </div>
  </nav>
</div>
