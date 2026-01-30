import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { deactivateNgoAccount } from "@/service/apiService";
import { toast } from "sonner";

const DeactivateAccountModal = () => {
  const { deactivateOpen, closeDeactivateModal } = useModal();
  const [loading, setLoading] = useState(false);

  // 🔒 modal closed → nothing render
  if (!deactivateOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await deactivateNgoAccount();
      closeDeactivateModal();
      localStorage.removeItem("token");
      toast.success("Your NGO account has been deactivated successfully.");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900">
          Deactivate Account
        </h2>

        <p className="mt-3 text-md text-gray-600">
          Are you sure you want to deactivate your NGO account?
          {/* <br /> */}
          
        </p>
        <span className="font-sm text-red-600">
            This action will disable your access and cannot be undone.
        </span>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeDeactivateModal}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deactivating..." : "Yes, Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;
