<div class="min-h-screen bg-neutral-50">
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <a href="/" class="text-xl font-bold text-primary">PetShop</a>
      </div>
      <div class="hidden md:flex items-center space-x-4">
        <a href="/account" class="text-neutral-600 hover:text-primary transition-colors">حساب من</a>
        <a href="/cart" class="relative">
          <span class="inline-flex items-center justify-center w-8 h-8 bg-neutral-200 rounded-full text-neutral-600">
            🛒
          </span>
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
        </a>
      </div>
      <div class="flex items-center space-x-3">
        <button class="p-1 rounded-md hover:bg-neutral-100 transition-colors">
          <span class="sr-only">منو</span>
          {/* Menu icon */}
          <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div class="relative">
          <button class="flex items-center space-x-2 p-1 rounded-md hover:bg-neutral-100 transition-colors">
            <span class="sr-only">حساب کاربری</span>
            <img src="/placeholder-avatar.jpg" alt="تصویر کاربر" class="w-8 h-8 rounded-full border border-neutral-200" />
            <span class="hidden md:block text-neutral-900 font-medium">کاربر</span>
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {/* Dropdown menu */}
          <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-20">
            <div class="py-2">
              <a href="/account" class="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">حساب من</a>
              <a href="/account/settings" class="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">تنظیمات</a>
              <a href="/account/orders" class="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">سفارشات</a>
              <a href="/account/wishlist" class="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">علاقه‌مندی‌ها</a>
              <a href="/account/addresses" class="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">آدرس‌ها</a>
              <div class="border-t border-neutral-200"></div>
              <button onclick="localStorage.removeItem('token'); window.location.href='/';" class="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-neutral-50">خروج</button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-neutral-900">تنظیمات</h1>
    </div>

    <div class="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      <div class="flex border-b border-neutral-200">
        {/* Tab buttons */}
        <button 
          class={`flex-1 px-4 py-2 text-sm font-medium transition-colors 
          ${activeTab === 0 ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}
          onClick={() => setActiveTab(0)}
        >
          اطلاعات شخصی
        </button>
        <button 
          class={`flex-1 px-4 py-2 text-sm font-medium transition-colors 
          ${activeTab === 1 ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}
          onClick={() => setActiveTab(1)}
        >
          تغییر شماره موبایل
        </button>
        <button 
          class={`flex-1 px-4 py-2 text-sm font-medium transition-colors 
          ${activeTab === 2 ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}
          onClick={() => setActiveTab(2)}
        >
          رمز عبور
        </button>
        <button 
          class={`flex-1 px-4 py-2 text-sm font-medium transition-colors 
          ${activeTab === 3 ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}
          onClick={() => setActiveTab(3)}
        >
          اعلان‌ها
        </button>
      </div>

      {/* Tab panels */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
      >
        {/* Tab 1: Personal Info */}
        {activeTab === 0 && (
          <div class="p-6">
            <form onSubmit={handlePersonalInfoSubmit} class="space-y-6">
              <div class="flex items-center space-x-4">
                <label class="flex flex-col">
                  <span class="mb-1 text-sm font-medium text-neutral-800">آواتار</span>
                  <div class="relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      class="hidden"
                      id="avatar-upload"
                    />
                    <img 
                      src={avatarPreview || userData?.avatar || '/placeholder-avatar.jpg'}
                      alt="پیش‌نمایش آواتار"
                      class="w-20 h-20 rounded-full border border-neutral-200 object-cover cursor-pointer"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    />
                    {isUploadingAvatar && (
                      <div class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.82 0m0 0H15m11-11v6m0 0a8.003 8.003 0 00-13.82 0m0 0H9m11-11v6M8 9a6.006 6.006 0 00-7.58 4.416A5.988 5.988 0 007.58 20h8.84A5.988 5.988 0 0020 13.416a6.006 6.006 0 00-7.58-4.416z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
                <button 
                  type="button"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  class="bg-neutral-100 text-neutral-800 font-medium text-sm px-3 py-1.5 rounded-md hover:bg-neutral-200 transition-colors"
                >
                  انتخاب تصویر
                </button>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1 text-sm font-medium text-neutral-800">نام</label>
                  <input 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="نام"
                  />
                </div>
                <div>
                  <label class="mb-1 text-sm font-medium text-neutral-800">نام خانوادگی</label>
                  <input 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="نام خانوادگی"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 text-sm font-medium text-neutral-800">ایمیل (اختیاری)</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="example@domain.com"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 text-sm font-medium text-neutral-800">کد ملی (اختیاری)</label>
                  <input 
                    type="text"
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="0000000000"
                    inputMode="numeric"
                    maxLength="10"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSavingPersonalInfo}
                class="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPersonalInfo ? (
                  <>
                    <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.82 0m0 0H15m11-11v-6m0 0a8.003 8.003 0 00-13.82 0m0 0H9m11-11v-6M8 9a6.006 6.006 0 00-7.58 4.416A5.988 5.988 0 007.58 20h8.84A5.988 5.988 0 0020 13.416a6.006 6.006 0 00-7.58-4.416z"></path>
                    </svg>
                    ذخیره...
                  </>
                ) : (
                  'ذخیره تغییرات'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Phone Change */}
        {activeTab === 1 && (
          <div class="p-6">
            <form onSubmit={handlePhoneChangeSubmit} class="space-y-6">
              <div>
                <label class="mb-1 text-sm font-medium text-neutral-800">شماره موبایل فعلی</label>
                <div class="flex items-center space-x-2">
                  <span class="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600">
                    📱
                  </span>
                  <span class="font-mono text-neutral-900">
                    {userData?.phone ? 
                      `****${userData.phone.slice(-4)}` : 
                      '****-****'
                    }
                  </span>
                </div>
              </div>

              {phoneOtpStep === 0 ? (
                <>
                  <div>
                    <label class="mb-1 text-sm font-medium text-neutral-800">شماره موبایل جدید</label>
                    <input 
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                      class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="09123456789"
                      inputMode="tel"
                      maxLength="11"
                    />
                  </div>
                  <button 
                    type="button"
                    disabled={isSendingOtp || !newPhone}
                    onClick={handleSendOtp}
                    class="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? (
                      <>
                        <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.82 0m0 0H15m11-11v-6m0 0a8.003 8.003 0 00-13.82 0m0 0H9m11-11v-6M8 9a6.006 6.006 0 00-7.58 4.416A5.988 5.988 0 007.58 20h8.84A5.988 5.988 0 0020 13.416a6.006 6.006 0 00-7.58-4.416z"></path>
                        </svg>
                        ارسال کد...
                      </>
                    ) : (
                      'ارسال کد تأیید'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div class="space-y-4">
                    <div>
                      <label class="mb-1 text-sm font-medium text-neutral-800">کد تأیید</label>
                      <p class="text-sm text-neutral-600">کد 6 رقمی به شماره {`****${newPhone.slice(-4)}`} ارسال شد.</p>
                      <div class="flex items-center space-x-2">
                        {[0,1,2,3,4,5].map((index) => (
                          <input 
                            key={index}
                            type="text"
                            value={otpCode[index] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              const newOtp = [...otpCode];
                              newOtp[index] = value;
                              setOtpCode(newOtp);
                              if (value && index < 5) {
                                const nextInput = document.getElementById(`otp-${index+1}`);
                                if (nextInput) nextInput.focus();
                              } else if (!value && index > 0) {
                                const prevInput = document.getElementById(`otp-${index-1}`);
                                if (prevInput) prevInput.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                const prevInput = document.getElementById(`otp-${index-1}`);
                                if (prevInput) prevInput.focus();
                              }
                            }}
                            id={`otp-${index}`}
                            maxLength="1"
                            class="w-10 text-center font-mono text-neutral-900 bg-white border border-neutral-200 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            autoComplete="off"
                          />
                        ))}
                      </div>
                    </div>
                    <button 
                      type="button"
                      disabled={isVerifyingOtp || otpCode.some(c => !c)}
                      onClick={handleVerifyOtp}
                      class="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.82 0m0 0H15m11-11v-6m0 0a8.003 8.003 0 00-13.82 0m0 0H9m11-11v-6M8 9a6.006 6.006 0 00-7.58 4.416A5.988 5.988 0 007.58 20h8.84A5.988 5.988 0 0020 13.416a6.006 6.006 0 00-7.58-4.416z"></path>
                          </svg>
                          تأیید...
                        </>
                      ) : (
                        'تأیید کد'
                      )}
                    </button>
                  </>
                </>
              )}
            </form>
          </div>
        )}

        {/* Tab 3: Password Change */}
        {activeTab === 2 && (
          <div class="p-6">
            <form onSubmit={handlePasswordChangeSubmit} class="space-y-6">
              <div>
                <label class="mb-1 text-sm font-medium text-neutral-800">رمز عبور فعلی</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label class="mb-1 text-sm font-medium text-neutral-800">رمز عبور جدید</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <div class="mt-2 flex items-center space-x-2">
                  <div class="w-2 h-2" 
                    className={`${getPasswordStrength(newPassword) === 'weak' ? 'bg-danger' : 
                              getPasswordStrength(newPassword) === 'medium' ? 'bg-warning' : 
                              getPasswordStrength(newPassword) === 'strong' ? 'bg-success' : 
                              'bg-neutral-200'} rounded-full`}
                  ></div>
                  <span class="text-xs font-medium">
                    {getPasswordStrength(newPassword) === 'weak' ? 'ضعیف' : 
                     getPasswordStrength(newPassword) === 'medium' ? 'متوسط' : 
                     getPasswordStrength(newPassword) === 'strong' ? 'قوی' : 
                     '---'}
                  </span>
                </div>
              </div>
              <div>
                <label class="mb-1 text-sm font-medium text-neutral-800">تکرار رمز عبور جدید</label>
                <input 
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div class="text-xs text-neutral-500">
                • حداقل 8 کاراکتر<br />
                • حروف بزرگ و کوچک<br />
                • عدد و علامت خاص
              </div>
              <button 
                type="submit"
                disabled={isSavingPassword}
                class="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPassword ? (
                  <>
                    <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.82 0m0 0H15m11-11v-6m0 0a8.003 8.003 0 00-13.82 0m0 0H9m11-11v-6M8 9a6.006 6.006 0 00-7.58 4.416A5.988 5.988 0 007.58 20h8.84A5.988 5.988 0 0020 13.416a6.006 6.006 0 00-7.58-4.416z"></path>
                    </svg>
                    ذخیره...
                  </>
                ) : (
                  'ذخیره تغییرات'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 3 && (
          <div class="p-6">
            <form onSubmit={handleNotificationsSubmit} class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-neutral-800">اعلان سفارش‌ها</span>
                  <div class="relative w-12 h-6">
                    <input 
                      type="checkbox"
                      checked={notifications.orderUpdates}
                      onChange={(e) => setNotifications(prev => ({...prev, orderUpdates: e.target.checked}))}
                      class="absolute inset-0 h-6 w-12 opacity-0 peer"
                    />
                    <div class="w-12 h-6 bg-neutral-200 rounded-full peer-checked:bg-primary transition-all peer">
                      <div class="absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow peer-checked:left-6 transition-all"></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-neutral-800">تخفیف‌های ویژه</span>
                  <div class="relative w-12 h-6">
                    <input 
                      type="checkbox"
                      checked={notifications.specialOffers}
                      onChange={(e) => setNotifications(prev => ({...prev, specialOffers: e.target.checked}))}
                      class="absolute inset-0 h-6 w-12 opacity-0 peer"
                    />
                    <div class="w-12 h-6 bg-neutral-200 rounded-full peer-checked:bg-primary transition-all peer">
                      <div class="absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow peer-checked:left-6 transition-all"></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-neutral-800">یادآوری واکسیناسیون</span>
                  <div class="relative w-12 h-6">
                    <input 
                      type="checkbox"
                      checked={notifications.vaccineReminders}
                      onChange={(e) => setNotifications(prev => ({...prev, vaccineReminders: e.target.checked}))}
                      class="absolute inset-0 h-6 w-12 opacity-0 peer"
                    />
                    <div class="w-12 h-6 bg-neutral-200 rounded-full peer-checked:bg-primary transition-all peer">
                      <div class="absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow peer-checked:left-6 transition-all"></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-neutral-800">خبرنامه</span>
                  <div class="relative w-12 h-6">
                    <input 
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={(e) => setNotifications(prev => ({...prev, newsletter: e.target.checked}))}
                      class="absolute inset-0 h-6 w-12 opacity-0 peer"
                    />
                    <div class="w-12 h-6 bg-neutral-200 rounded-full peer-checked:bg-primary transition-all peer">
                      <div class="absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow peer-checked:left-6 transition-all"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSavingNotifications}
                class="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingNotifications ? (
                  <>
                    <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.82 0m0 0H15m11-11v-6m0 0a8.003 8.003 0 00-13.82 0m0 0H9m11-11v-6M8 9a6.006 6.006 0 00-7.58 4.416A5.988 5.988 0 007.58 20h8.84A5.988 5.988 0 0020 13.416a6.006 6.006 0 00-7.58-4.416z"></path>
                    </svg>
                    ذخیره...
                  </>
                ) : (
                  'ذخیره تغییرات'
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  </main>

  <footer class="bg-neutral-900 text-neutral-400 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-4">PetShop</h3000+ محصول برای حیوانات خانگی</h3>
        <p class="text-neutral-600"> największy wybór produktów dla zwierząt w jednym miejscu.</p>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-4">دسترسی سریع</h3>
        <ul class="space-y-2">
          <li><a href="/" class="text-neutral-600 hover:text-primary transition-colors">صفحه اصلی</a></li>
          <li><a href="/products" class="text-neutral-600 hover:text-primary transition-colors">محصولات</a></li>
          <li><a href="/vendors" class="text-neutral-600 hover:text-primary transition-colors">فروشندگان</a></li>
          <li><a href="/clinics" class="text-neutral-600 hover:text-primary transition-colors">کلینیک‌ها</a></li>
          <li><a href="/blog" class="text-neutral-600 hover:text-primary transition-colors">وبلاگ</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-4">درباره ما</h3>
        <ul class="space-y-2">
          <li><a href="/about" class="text-neutral-600 hover:text-primary transition-colors">درباره ما</a></li>
          <li><a href="/contact" class="text-neutral-600 hover:text-primary transition-colors">تماس با ما</a></li>
          <li><a href="/terms" class="text-neutral-600 hover:text-primary transition-colors">قوانین و شرایط</a></li>
          <li><a href="/privacy" class="text-neutral-600 hover:text-primary transition-colors">سیاست حریم خصوصی</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-4">دنبال ما شوید</h3>
        <div class="flex space-x-4">
          <a href="#" class="text-neutral-600 hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.014-.607 1.794-1.35 2.163-2.263-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-5.515 6.613 0 .516.045 1.019.13 1.504-4.582-.23-8.644-2.424-10.932-5.757-.475.815-.75 1.794-.75 2.902 0 2.297 1.171 4.333 2.956 5.517-.748-.023-1.45-.23-2.057-.575v.062c0 3.221 2.292 5.916 5.322 6.525-.56.153-1.151.234-1.755.234-.43 0-.852-.023-1.266-.069.622 1.956 2.425 3.38 4.604 3.42-2.27 1.78-5.096 2.846-8.17 2.846-.53 0-1.052-.023-1.566-.069 1.156 3.621 4.504 6.258 8.285 6.258 9.941 0 15.37-8.224 15.37-15.37 0-.234-.005-.47-.014-.706.897-.647 1.698-1.46 2.188-2.31z"/>
            </svg>
          </a>
          <a href="#" class="text-neutral-600 hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-20.35c-1.49 0-2.698 1.208-2.698 2.698v17.315c0 1.49 1.208 2.698 2.698 2.698h20.35c1.49 0 2.698-1.208 2.698-2.698v-17.315c0-1.49-1.208-2.698-2.698-2.698zm-20.35 17.315c-1.104 0-2-0.896-2-2s0.896-2 2-2 2 0.896 2 2-0.896 2-2 2zm10.225-6.876c0 1.018-0.807 1.825-1.806 1.825h-2.41l-0.42 2.41h-1.91l0.42-2.41h-2.41c-1.018 0-1.825-0.807-1.825-1.825v-3.713c0-1.018 0.807-1.825 1.825-1.825h2.41l0.42-2.41h1.91l-0.42 2.41h2.41c1.018 0 1.825 0.807 1.825 1.825v3.713z"/>
            </svg>
          </a>
          <a href="#" class="text-neutral-600 hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.181 0.86-0.112 1.822-0.992 1.822h-1.636c-0.88 0-1.173-0.962-0.992-1.822-0.172-0.862 0.115-1.824 0.992-1.824h1.636c0.879 0 1.172 0.963 0.992 1.824zm-12.132 0c-0.879 0-1.172-0.963-0.992-1.824-0.172-0.862 0.115-1.824 0.992-1.824h1.636c0.88 0 1.173 0.962 0.992 1.822-0.181 0.86-0.112 1.822-0.992 1.822z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="border-t border-neutral-800 py-6 text-center text-sm">
      © ۲۰۲۳ پت‌شاپ. تمام حقوق محفوظ است.
    </div>
  </footer>
</div>
) : null}
</div>
</main>
</div>
);
}

export default SettingsPage;
