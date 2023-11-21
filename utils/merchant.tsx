import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";

interface MerchantModalProps {
  onAddMerchant: (name: string, description: string, address: string) => Promise<void>;
  onModifyMerchant: (newName: string, newDescription: string, newAddress: string) => Promise<void>;
  onClose: () => void;
  merchant: Merchant | undefined;
}


interface Merchant {
  id: number;
  name: string;
  description: string;
  address: string;
}

const MerchantModal: React.FC<MerchantModalProps> = ({
  onAddMerchant,
  onModifyMerchant,
  onClose,
  merchant,
}) => {
  const [name, setName] = useState(merchant?.name || "");
  const [description, setDescription] = useState(merchant?.description || "");
  const [address, setAddress] = useState(merchant?.address || "");

  const handleSave = () => {
    if (merchant) {
      onModifyMerchant(name, description, address);
    } else {
      onAddMerchant(name, description, address);
    }
    onClose();
  };

  return (
    <Dialog.Root open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />

      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto px-4">
        <div className="bg-white rounded-md shadow-lg px-4 py-6">
          <div className="flex items-center justify-end">
            <Dialog.Close className="p-2 text-gray-400 rounded-md hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mx-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Dialog.Close>
          </div>
          <div className="max-w-sm mx-auto space-y-3 text-center">
            <Dialog.Title className="text-lg font-medium text-gray-800 ">
              {merchant ? "Edit Merchant" : "Add New Merchant"}
            </Dialog.Title>


            <Dialog.Description className=" text-sm text-gray-600">
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </Dialog.Description>

            <fieldset className="Fieldset relative">
              <svg
                className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <input
                className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                placeholder="Enter your email"
              />
            </fieldset>
            <Dialog.Close asChild>
              <button
                onClick={handleSave}
                className="w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2"
              >
                {merchant ? "Save Changes" : "Add Merchant"}
              </button>
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MerchantModal;