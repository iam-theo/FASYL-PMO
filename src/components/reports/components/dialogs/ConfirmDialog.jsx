import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../ui/Modal";

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  loading,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
}) {
  const variants = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-500 hover:bg-amber-600",
    primary: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onCancel}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-5 py-2.5 hover:bg-slate-100 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-lg px-5 py-2.5 text-white ${variants[confirmVariant]}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle className="text-red-600" size={24} />
        </div>

        <div>
          <p className="text-slate-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
