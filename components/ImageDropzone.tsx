'use client';

import { useState, useEffect } from 'react';
import { useDropzone, FileRejection, FileError } from 'react-dropzone';
import { cn } from '@/utils/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles,
    multiple: maxFiles > 1,
    onDrop: (acceptedFiles: File[]) => {
      if (files.length >= maxFiles) return;

      const remainingCapacity = maxFiles - files.length;
      const filesToAdd = acceptedFiles.slice(0, remainingCapacity);

      const filesWithPreview = filesToAdd.map(file => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview;
      });

      const updatedFiles = [...files, ...filesWithPreview];
      setFiles(updatedFiles);

      if (onChange) {
        onChange(updatedFiles);
      }
    },
    onDropRejected: rejectedFiles => {
      setFileRejections(rejectedFiles);

      // Clear rejections after 3 seconds
      setTimeout(() => {
        setFileRejections([]);
      }, 3000);
    },
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

    if (onChange) {
      onChange(newFiles);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="bg-background rounded-md p-2">
        <div
          {...getRootProps()}
          className={cn(
            'h-24 relative rounded-md p-6 text-center cursor-pointer flex flex-col items-center justify-center',
            'border-2 border-dashed border-muted-foreground/30',
            'hover:bg-muted/20 transition-colors duration-200',
            isDragActive && 'bg-primary/5',
            files.length >= maxFiles && 'opacity-50 cursor-not-allowed dz-max-files-reached'
          )}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-sm text-balance text-muted-foreground">Drop the images here...</p>
          ) : files.length >= maxFiles ? (
            <p className="text-sm text-balance text-muted-foreground">
              Maximum number of files reached
            </p>
          ) : (
            <p className="text-sm text-balance text-muted-foreground">
              Drag and drop images or click to select images
            </p>
          )}
          <p className="text-xs mt-1 text-muted-foreground">
            {files.length}/{maxFiles} images (JPG, PNG only)
          </p>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="text-xs text-red-500 mt-1 p-2 bg-red-50 rounded-md">
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
        <div className="mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-md overflow-hidden border border-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs truncate px-2 py-1">
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
