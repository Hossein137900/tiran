import { motion, AnimatePresence } from "framer-motion";

interface DeleteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteBlogModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteBlogModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-right shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              تایید حذف مقاله
            </h3>
            <p className="text-gray-600 mb-6">
              آیا از حذف این مقاله اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                aria-label="cancel-delete"
                className="px-4 py-2 rounded text-black bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={onConfirm}
                aria-label="confirm-delete"
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                حذف
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
