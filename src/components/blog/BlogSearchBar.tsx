<div class="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-neutral-800">جستجوی مقالات</label>
  <div className="relative w-full">
    <motion.input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="w-full ps-4 px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      style={{
        width: isFocused ? 'calc(100% + 8px)' : '100%',
        marginInlineStart: isFocused ? '-4px' : '0px',
        marginInlineEnd: isFocused ? '-4px' : '0px',
        transition: 'width 0.2s ease, margin 0.2s ease'
      }}
      placeholder="عنوان یا کلیدواژه مورد نظر..."
    />
    <svg
      aria-hidden="true"
      className="absolute inset-y-0 start-0 ps-4 h-4 w-4 text-neutral-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M9.063 6.063a3 3 0 104.243 4.243M9.063 6.063L3 12m0 0l6.063 6.063" />
    </svg>
  </div>
</div>
