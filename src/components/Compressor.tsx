import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Download, RefreshCw, ArrowRight, Settings2, Image as ImageIcon } from 'lucide-react';
import { formatBytes, cn } from '../lib/utils';
import { ImageDropzone } from './ImageDropzone';

export function Compressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [targetSize, setTargetSize] = useState<string>('');
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setCompressedFile(null);
    setCompressedUrl('');
    
    // Suggest a default target size (e.g., 70% of original, converted to KB/MB)
    if (file.size > 1024 * 1024) {
      setTargetUnit('MB');
      setTargetSize((file.size / 1024 / 1024 * 0.7).toFixed(1));
    } else {
      setTargetUnit('KB');
      setTargetSize((file.size / 1024 * 0.7).toFixed(0));
    }
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    setIsCompressing(true);
    try {
      let maxSizeMB = originalFile.size / 1024 / 1024;
      const parsedSize = parseFloat(targetSize);
      
      if (!isNaN(parsedSize) && parsedSize > 0) {
        maxSizeMB = targetUnit === 'KB' ? parsedSize / 1024 : parsedSize;
      }

      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
      };

      const compressed = await imageCompression(originalFile, options);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image. Please try another one.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile || !compressedUrl) return;
    
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed_${originalFile?.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedFile(null);
    setCompressedUrl('');
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  if (!originalFile) {
    return <ImageDropzone onFileSelect={handleFileSelect} />;
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
         <button 
          onClick={reset}
          className="text-slate-600 font-sans font-medium hover:text-[#6750A4] transition-colors flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> Start Over
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4 bg-[#FEF7FF] px-4 py-2 rounded-[24px] border border-[#EADDFF] w-full sm:w-auto">
           <Settings2 className="text-[#6750A4] w-4 h-4 shrink-0" />
           <span className="text-slate-600 font-sans font-medium text-sm shrink-0">Target:</span>
           <div className="flex items-center">
             <input 
               type="number" 
               min="0.1" step="any"
               value={targetSize} 
               onChange={(e) => setTargetSize(e.target.value)}
               disabled={isCompressing || !!compressedFile}
               className="w-16 sm:w-20 bg-white border border-[#EADDFF] rounded-l-lg px-2 py-1 text-sm text-slate-800 font-display outline-none focus:border-[#6750A4] disabled:opacity-50"
               placeholder="Auto"
             />
             <select
               value={targetUnit}
               onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
               disabled={isCompressing || !!compressedFile}
               className="bg-slate-100 border border-l-0 border-[#EADDFF] rounded-r-lg px-1 py-1 text-slate-600 font-sans font-medium text-sm outline-none cursor-pointer disabled:opacity-50"
             >
               <option value="KB">KB</option>
               <option value="MB">MB</option>
             </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Original */}
        <div className="bg-[#FEF7FF] p-6 rounded-[24px] border border-[#EADDFF] flex flex-col gap-4 min-w-0">
          <div className="flex justify-between items-start gap-4">
             <div className="min-w-0 flex-1">
               <span className="inline-block py-1.5 px-3 rounded-full bg-[#EADDFF]/50 text-[#6750A4] text-xs font-bold tracking-wider uppercase mb-2">
                 Original
               </span>
               <p className="text-slate-600 font-sans font-medium text-sm truncate w-full" title={originalFile.name}>
                 {originalFile.name}
               </p>
             </div>
             <p className="text-slate-800 font-display font-bold text-base md:text-xl shrink-0">{formatBytes(originalFile.size)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EADDFF] aspect-video overflow-hidden flex items-center justify-center p-2">
             <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        </div>

        {/* Compression Arrow / Overlay */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white text-[#6750A4] border border-[#EADDFF] shadow-sm rounded-xl items-center justify-center z-10">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* Compressed */}
        <div className="bg-[#FEF7FF] p-6 rounded-[24px] border border-[#EADDFF] flex flex-col gap-4 relative overflow-hidden transition-all min-w-0">
          {!compressedFile && isCompressing && (
             <div className="absolute inset-0 bg-[#FEF7FF]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#6750A4] animate-spin mb-4" />
                <p className="text-slate-800 font-display font-bold">Compressing Image...</p>
             </div>
          )}
          
          <div className="flex justify-between items-start gap-4">
             <div className="min-w-0 flex-1">
               <span className="inline-block py-1.5 px-3 rounded-full bg-[#6750A4]/10 text-[#6750A4] text-xs font-bold tracking-wider uppercase mb-2">
                 Compressed
               </span>
               <p className="text-slate-600 font-sans font-medium text-sm truncate w-full">
                 Optimized Result
               </p>
             </div>
             {compressedFile ? (
               <div className="text-right shrink-0">
                 <p className="text-[#10B981] font-display font-bold text-base md:text-xl">{formatBytes(compressedFile.size)}</p>
                 <p className="text-[#10B981] font-sans text-xs font-medium uppercase tracking-wider">
                   -{Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)}%
                 </p>
               </div>
             ) : (
               <p className="text-slate-400 font-display font-medium text-base md:text-xl">--</p>
             )}
          </div>
          <div className="bg-white rounded-2xl border border-[#EADDFF] aspect-video overflow-hidden flex items-center justify-center p-2">
             {compressedUrl ? (
               <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain rounded-xl" />
             ) : (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-[#EADDFF] rounded-xl text-slate-400">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
             )}
          </div>
        </div>
      </div>

      {compressedFile ? (
        <button
          onClick={handleDownload}
          className="w-full md:w-auto self-center px-8 py-3 bg-[#6750A4] text-white font-bold rounded-2xl hover:bg-[#55408a] transition-colors shadow-sm flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> Download Compressed Image
        </button>
      ) : (
        <button
          onClick={handleCompress}
          disabled={isCompressing}
          className="w-full md:w-auto self-center px-8 py-3 bg-[#6750A4] text-white font-bold rounded-2xl hover:bg-[#55408a] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={cn("w-5 h-5", isCompressing && "animate-spin")} />
          {isCompressing ? 'Compressing...' : 'Compress Image Now'}
        </button>
      )}
    </div>
  );
}
