<div class="space-y-4">
  {tempPreview ? (
    <>
      <img
        src={tempPreview}
        alt="پیش‌نمایش عکس پت"
        className="w-24 h-24 rounded-full object-cover mx-auto"
      />
      <button
        className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
        onClick={() => {
          setTempPreview(null);
          setError(null);
          inputRef.current?.value = '';
        }}
      >
        تغییر عکس
      </button>
    </>
  ) : value ? (
    <>
      <img
        src={value}
        alt="عکس پت"
        className="w-24 h-24 rounded-full object-cover mx-auto"
      />
      <button
        className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
        onClick={() => {
          setTempPreview(null);
          setError(null);
          inputRef.current?.value = '';
        }}
      >
        تغییر عکس
      </button>
    </>
  ) : (
    <div
      ref={dropZoneRef}
      className={`border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-neutral-300'} rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-all`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="آپلود عکس حیوان خانگی"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="space-y-3">
        <div className="text-3xl">📷</div>
        <p className="text-sm text-neutral-600">
          عکس پت رو اینجا بکش و رها کن یا کلیک کن
        </p>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </div>
  )}
</div>
