
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContractDocument } from '@/types';

interface DocumentUploaderProps {
  type: 'primary' | 'supporting' | 'context';
  label: string;
  description: string;
  documents: ContractDocument[];
  onAdd: (docs: ContractDocument[]) => void;
  onRemove: (id: string) => void;
}

export default function DocumentUploader({
  type,
  label,
  description,
  documents,
  onAdd,
  onRemove,
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      
      const newDocs: ContractDocument[] = await Promise.all(
        acceptedFiles.map(async (file) => {
          const content = await file.text();
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            content,
            type,
            size: file.size,
            uploadedAt: new Date(),
          };
        })
      );

      onAdd(newDocs);
      setUploading(false);
    },
    [type, onAdd]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{label}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
      
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-700 hover:border-zinc-600 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-blue-400 font-medium">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <Upload size={28} className="text-zinc-400" />
              </div>
              <p className="text-zinc-300 font-medium mb-1">
                {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
              </p>
              <p className="text-zinc-500 text-sm">or click to browse</p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{doc.name}</p>
                    <p className="text-xs text-zinc-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(doc.id)}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} className="text-zinc-500" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
