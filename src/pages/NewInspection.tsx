import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { uploadImage, uploadVideo, startInspection } from '../services/api';
import {
  UploadCloud,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

export const NewInspection: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'image' ? 'image' : 'video';

  const [activeTab, setActiveTab] = useState<'video' | 'image'>(initialTab);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];

  const handleTabSwitch = (tab: 'video' | 'image') => {
    setActiveTab(tab);
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
  };

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    if (activeTab === 'image') {
      if (!allowedImageTypes.includes(file.type)) {
        setValidationError('Unsupported format. Only JPG, PNG, and WebP images are supported.');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setValidationError('File size exceeds 25 MB limit for single image frames.');
        return;
      }
    } else {
      if (!allowedVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
        setValidationError('Unsupported format. Only MP4, MOV, and WebM video streams are supported.');
        return;
      }
      if (file.size > 250 * 1024 * 1024) {
        setValidationError('File size exceeds 250 MB limit for roadway video uploads.');
        return;
      }
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartInspection = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    setValidationError(null);

    try {
      let uploadRes;
      if (activeTab === 'image') {
        uploadRes = await uploadImage(selectedFile);
      } else {
        uploadRes = await uploadVideo(selectedFile);
      }

      const { inspectionId } = await startInspection(
        uploadRes.uploadId,
        activeTab === 'image' ? 'IMAGE' : 'VIDEO'
      );
      navigate(`/live/${inspectionId}`);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to initialize inspection pipeline.');
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2 font-medium">
          INSPECTION INGESTION // STAGE 01
        </div>
        <h1 className="font-sans font-bold text-4xl sm:text-5xl tracking-tight text-text">
          Initialize Pavement Inspection
        </h1>
        <p className="text-muted text-sm mt-3 font-normal max-w-xl font-sans leading-relaxed">
          Upload multi-frame video runs (MP4/MOV) or calibrated high-resolution camera imagery for autonomous feature extraction and temporal persistence verification.
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-3 mt-8 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => handleTabSwitch('video')}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-none transition-colors ${
              activeTab === 'video'
                ? 'bg-text text-bg border border-border-strong font-bold'
                : 'bg-surface text-muted hover:text-text border border-border'
            }`}
          >
            Video Sequence (Temporal Re-check)
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('image')}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-none transition-colors ${
              activeTab === 'image'
                ? 'bg-text text-bg border border-border-strong font-bold'
                : 'bg-surface text-muted hover:text-text border border-border'
            }`}
          >
            Single Frame Capture
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-none border border-sev-high/40 bg-sev-high/10 flex items-center gap-3 font-mono text-xs text-sev-high">
          <AlertCircle className="w-4 h-4 shrink-0 text-sev-high" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Upload Zone & Preview */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-14 md:p-20 rounded-none bg-surface border border-dashed text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
            isDragging
              ? 'border-accent bg-surface-alt'
              : 'border-border hover:border-border-strong'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={activeTab === 'video' ? 'video/mp4,video/quicktime,video/webm' : 'image/jpeg,image/png,image/webp'}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-none border border-border bg-surface-alt flex items-center justify-center text-muted mb-4">
            <UploadCloud className="w-6 h-6 stroke-[1.5]" />
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-text font-bold block mb-1">
            DROP SENSOR {activeTab === 'video' ? 'VIDEO FOOTAGE' : 'IMAGE FILE'}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-6 font-medium">
            OR CLICK TO SELECT FROM DISK
          </span>

          <div className="px-4 py-2 rounded-none border border-border bg-surface-alt font-mono text-[10px] uppercase tracking-wider text-muted">
            {activeTab === 'video' ? 'MP4, MOV, WEBM (UP TO 250MB)' : 'JPG, PNG, WEBP (UP TO 25MB)'}
          </div>
        </div>
      ) : (
        /* File Selected Preview */
        <div className="rounded-none bg-surface border border-border p-6 space-y-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-none border border-border bg-surface-alt text-text">
                <CheckCircle2 className="w-5 h-5 text-sev-low" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold text-text">{selectedFile.name}</h3>
                <div className="font-mono text-[10px] text-muted uppercase tracking-wider mt-0.5">
                  SIZE: {formatFileSize(selectedFile.size)} · FORMAT: {selectedFile.type || 'STANDARD'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-none hover:bg-surface-alt text-muted hover:text-text transition-colors cursor-pointer"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Media Player / Thumbnail Preview */}
          <div className="aspect-[16/9] w-full max-h-80 bg-black rounded-none overflow-hidden border border-border flex items-center justify-center">
            {activeTab === 'video' && previewUrl ? (
              <video src={previewUrl} controls className="w-full h-full object-contain" />
            ) : previewUrl ? (
              <img src={previewUrl} alt="Selected preview" className="w-full h-full object-contain" />
            ) : null}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              CLICKING START ENGAGES THE AUTONOMOUS AGENT STATE MACHINE
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 rounded-none border border-border hover:bg-surface-alt text-text font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleStartInspection}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-none bg-text text-bg border border-border-strong font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>{isSubmitting ? 'ENGAGING AGENT...' : 'START INSPECTION'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInspection;
