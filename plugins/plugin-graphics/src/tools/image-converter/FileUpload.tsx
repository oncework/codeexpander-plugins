
import { useRef } from "react";
import { Button, Label } from "@codeexpander/dev-tools-ui";
import { Upload } from "lucide-react";
import { useI18n } from "../../context";
import { showErrorToast } from "../../toast";
import { getFileSizeString } from "./utils";

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null, previewUrl: string | null) => void;
}

export const FileUpload = ({ selectedFile, onFileSelect }: FileUploadProps) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showErrorToast(t("imageConverter.invalidFileType"), t("imageConverter.invalidFileTypeDesc"));
        return;
      }
      
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{t("imageConverter.selectImage")}</Label>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {t("imageConverter.chooseFile")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {selectedFile && (
          <div className="text-sm text-muted-foreground">
            {selectedFile.name} ({getFileSizeString(selectedFile)})
          </div>
        )}
      </div>
    </div>
  );
};
