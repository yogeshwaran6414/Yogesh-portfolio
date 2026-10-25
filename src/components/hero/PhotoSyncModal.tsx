import React, { useState, useRef } from 'react';
import { X, Upload, Image, CheckCircle, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface PhotoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onUpdateImage: (newSrc: string) => void;
  onResetToDefault: () => void;
}

export const PhotoSyncModal: React.FC<PhotoSyncModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onUpdateImage,
  onResetToDefault,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (e.g., .jpeg, .jpg, .png)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setPreviewUrl(dataUrl);
        onUpdateImage(dataUrl);
        setSuccessMessage('Hero banner updated successfully with your photo!');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1200);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      id="photo-sync-modal-overlay"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
        id="photo-sync-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Hero Section Banner Photo
              </h3>
              <p className="text-xs text-slate-400">
                Set or sync your <code className="text-blue-400 font-mono">portfolio.jpeg</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            id="modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification banner */}
        {successMessage ? (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs font-medium animate-in fade-in">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        ) : null}

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/70'
          }`}
          id="photo-dropzone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileInputChange}
            id="photo-file-input"
          />
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">
              Drag & drop your <span className="text-blue-400 font-semibold">portfolio.jpeg</span> here
            </p>
            <p className="text-xs text-slate-500">
              or click to browse from your device (JPEG, PNG, WebP)
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Direct Instant Browser Sync
          </span>
        </div>

        {/* Information tip */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11px] leading-relaxed">
            <p>
              <strong>Static Deployment Tip:</strong> You can also copy your photo file directly to <code className="text-slate-200 font-mono bg-slate-800 px-1 py-0.5 rounded">public/portfolio.jpeg</code> in your project repository so it serves automatically across Next.js static builds.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onResetToDefault();
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
            id="reset-photo-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to default / SVG
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
