import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void;
}

export function ImageDropzone({ onFileSelect }: ImageDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full bg-[#FEF7FF]/30 p-6 md:p-8 rounded-[24px] border-2 border-dashed border-[#EADDFF] text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px]",
        isDragActive ? "border-[#6750A4] bg-[#6750A4]/5" : "hover:shadow-sm hover:border-[#6750A4]/30"
      )}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 bg-white text-[#6750A4] border border-[#EADDFF] shadow-sm rounded-2xl flex items-center justify-center mb-6">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="text-slate-800 font-display font-bold text-xl mb-2">
        {isDragActive ? "Drop your image here" : "Drag & drop an image"}
      </h3>
      <p className="text-slate-600 font-sans font-medium mb-6">
        or click to browse from your device
      </p>
      
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#EADDFF]/50 text-[#6750A4] text-xs font-bold tracking-wider uppercase">
          <ImageIcon className="w-3 h-3" /> JPG
        </span>
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#EADDFF]/50 text-[#6750A4] text-xs font-bold tracking-wider uppercase">
          <ImageIcon className="w-3 h-3" /> PNG
        </span>
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#EADDFF]/50 text-[#6750A4] text-xs font-bold tracking-wider uppercase">
          <ImageIcon className="w-3 h-3" /> WEBP
        </span>
      </div>
    </div>
  );
}
