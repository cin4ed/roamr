'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone, FileRejection, FileError } from 'react-dropzone';
import { cn } from '@/lib/cn';

interface FileWithPreview extends File {
  preview: string;
}

interface ImageDropzoneProps {
  children?: React.ReactNode;
  onChange?: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
}

export default function ImageDropzone({
  onChange,
  className,
  children,
  maxFiles = 5,
}: ImageDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  // Handler for accepted files
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length >= maxFiles) return;
      const remainingCapacity = maxFiles - files.length;
      const filesToAdd = acceptedFiles.slice(0, remainingCapacity);
      const filesWithPreview = filesToAdd.map(
        file => Object.assign(file, { preview: URL.createObjectURL(file) }) as FileWithPreview
      );
      const updatedFiles = [...files, ...filesWithPreview];
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, maxFiles, onChange]
  );

  // Handler for rejected files
  const handleDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    setFileRejections(rejectedFiles);
    setTimeout(() => setFileRejections([]), 3000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles,
    multiple: maxFiles > 1,
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
  });

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="bg-background rounded-md">
        <div
          {...getRootProps()}
          className={cn(
            'relative flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-md p-6 text-center',
            'border-muted-foreground/30 border-secondary border border-dashed',
            'hover:bg-secondary/30 transition-colors duration-200',
            isDragActive && 'bg-primary/5',
            files.length >= maxFiles && 'dz-max-files-reached cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-muted-foreground text-sm text-balance">Drop the images here...</p>
          ) : files.length >= maxFiles ? (
            <p className="text-muted-foreground text-sm text-balance">
              Maximum number of files reached
            </p>
          ) : (
            <i className="fa-solid fa-photo-film text-primary text-xl"></i>
          )}
        </div>
      </div>
      <p className="text-muted text-sm">Drag and drop images or click to select. (JPG, PNG only)</p>

      {fileRejections.length > 0 && (
        <div className="mt-1 rounded-md bg-red-50 p-2 text-xs text-red-500">
          {fileRejections.map((rejection, index) => (
            <div key={index}>
              {rejection.errors.map((error: FileError, errorIndex) => (
                <p key={errorIndex}>{error.message}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {children}

      {files.length > 0 && (
        <div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="group border-secondary relative aspect-square overflow-hidden rounded-md border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="border-input bg-background hover:text-accent-foreground absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <i className="fa-solid fa-xmark text-primary"></i>
                </button>
                <div className="bg-primary/60 absolute inset-x-0 bottom-0 truncate px-2 py-1 text-xs text-white">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
