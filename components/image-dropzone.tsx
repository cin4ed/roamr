import * as Dropzone from "@/components/dropzone";
import { useDropzone } from "@/components/dropzone";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";

type ImageDropzoneProps = {
  onChange?: (files: File[]) => void;
};

export const ImageDropzone = ({ onChange }: ImageDropzoneProps) => {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      onChange?.(dropzone.fileStatuses.map((f) => f.file));
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 10,
    },
  });

  return (
    <Dropzone.Dropzone {...dropzone}>
      <div>
        <div className="flex justify-between">
          <Dropzone.DropzoneDescription>
            Please select up to 10 images
          </Dropzone.DropzoneDescription>
          <Dropzone.DropzoneMessage />
        </div>
        <Dropzone.DropZoneArea>
          <Dropzone.DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
            <CloudUploadIcon className="size-8" />
            <div>
              <p className="font-semibold">Upload listing images</p>
              <p className="text-sm text-muted-foreground">
                Click here or drag and drop to upload
              </p>
            </div>
          </Dropzone.DropzoneTrigger>
        </Dropzone.DropZoneArea>
      </div>

      <Dropzone.DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
        {dropzone.fileStatuses.map((file) => (
          <Dropzone.DropzoneFileListItem
            className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
            key={file.id}
            file={file}
          >
            {file.status === "pending" && (
              <div className="aspect-video animate-pulse bg-black/20" />
            )}
            {file.status === "success" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.result}
                alt={`uploaded-${file.fileName}`}
                className="aspect-video object-cover"
              />
            )}
            <div className="flex items-center justify-between p-2 pl-4">
              <div className="min-w-0">
                <p className="truncate text-sm">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Dropzone.DropzoneRemoveFile
                variant="ghost"
                className="shrink-0 hover:outline"
              >
                <Trash2Icon className="size-4" />
              </Dropzone.DropzoneRemoveFile>
            </div>
          </Dropzone.DropzoneFileListItem>
        ))}
      </Dropzone.DropzoneFileList>
    </Dropzone.Dropzone>
  );
};
