// @ts-nocheck
import React, { useState } from "react";
import { useModal } from "../context/ModalContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "@/context/AppContext";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  allCampaigns: boolean;
  editForm: boolean;
  managePayments: boolean;
  receipts: boolean;
  tapToPay: boolean;
  guestListApp: boolean;
  contacts: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

const InviteUserForm: React.FC = () => {
  const { closeModal } = useModal();
  const { profileData } = useAppContext();
  //   console.log(profileData, "profileData")
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    allCampaigns: true,
    editForm: true,
    managePayments: true,
    receipts: true,
    tapToPay: true,
    guestListApp: true,
    contacts: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.firstName.trim()) return toast.error("First name is required");
    if (!form.lastName.trim()) return toast.error("Last name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!validateEmail(form.email)) return toast.error("Email is invalid");
    if (!form.password.trim()) return toast.error("Password is required");

    try {
      const ngoEmail = profileData?.ngo?.email;

      const response = await fetch(`${API_URL}/users/inviteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ngoEmail,
          ngoPassword: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          permissions: {
            allCampaigns: form.allCampaigns,
            editForm: form.editForm,
            managePayments: form.managePayments,
            receipts: form.receipts,
            tapToPay: form.tapToPay,
            guestListApp: form.guestListApp,
            contacts: form.contacts,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("User invited successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Invite new user</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="First name*"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Last name*"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <input
          type="email"
          placeholder="Email*"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <input
          type="password"
          placeholder="NGO Password*"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <div>
          <label className="block text-gray-500 text-sm font-semibold mb-2">
            CAMPAIGN-SPECIFIC PERMISSIONS
          </label>
          <select
            name="allCampaigns"
            value={form.allCampaigns ? "all" : "specific"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                allCampaigns: e.target.value === "all",
              }))
            }
            className="border rounded px-3 py-2 w-full mb-2"
          >
            <option value="all">All campaigns</option>
            <option value="specific">Specific campaigns</option>
          </select>

          <div className="space-y-3">
            {[
              { name: "editForm", label: "Edit form" },
              { name: "managePayments", label: "Manage payments" },
              { name: "receipts", label: "Receipts" },
              {
                name: "tapToPay",
                label: "Accept Tap to Pay payments",
                app: true,
              },
              {
                name: "guestListApp",
                label: "Access guest list from app",
                app: true,
              },
            ].map((perm) => (
              <label key={perm.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={perm.name}
                  checked={form[perm.name as keyof FormState] as boolean}
                  onChange={handleChange}
                />
                {perm.label}{" "}
                {perm.app && (
                  <span className="bg-gray-200 px-1 rounded text-xs">App</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-semibold mb-2">
            GENERAL PERMISSIONS
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="contacts"
              checked={form.contacts}
              onChange={handleChange}
            />
            Contacts
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary"
          >
            Send invitation
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteUserForm;
