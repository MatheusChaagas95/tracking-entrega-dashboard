/**
 * Componente File Uploader
 * Design: Premium Corporate Dark - Upload com drag-and-drop
 */

import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  isLoading = false,
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          transition-all duration-200 cursor-pointer
          ${isDragActive
            ? 'border-[#0F5BA3] bg-[#0F5BA3]/10'
            : 'border-[#2D3748] bg-[#1A1F2E]/50 hover:border-[#0F5BA3]'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          disabled={isLoading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {isLoading ? (
            <>
              <div className="animate-spin">
                <Upload className="text-[#0F5BA3]" size={40} />
              </div>
              <p className="text-[#CBD5E0] font-medium">Processando arquivo...</p>
            </>
          ) : (
            <>
              <FileSpreadsheet className="text-[#0F5BA3]" size={40} />
              <div>
                <p className="text-white font-semibold mb-1">
                  Arraste seu arquivo Excel aqui
                </p>
                <p className="text-[#CBD5E0] text-sm">
                  ou clique para selecionar (XLSX, XLS)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 bg-[#EF4444]/10 border border-[#EF4444] rounded-lg p-4">
          <AlertCircle className="text-[#EF4444] flex-shrink-0 mt-0.5" size={20} />
          <p className="text-[#FECACA] text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
