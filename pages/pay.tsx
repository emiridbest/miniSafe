import React, { useState, useCallback, useEffect } from 'react';
import { contractAddress, abi } from '../utils/pay';
import { BrowserProvider, Contract, parseEther } from "ethers";
import PaymentModal from '../utils/modal';
import MerchantModal from '../utils/merchant';

interface Merchant {
    [x: string]: any;
    id: number;
    name: string;
    address: string;
    description: string;
}
interface MerchantTableModalProps {
    onPay: (address: string) => void;
    onModify: (merchant: Merchant) => void;
}


const Merchant: React.FC = () => {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [modal, setModal] = useState(false);
    const [merchantModal, setMerchantModal] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [merchantModalOpen, setMerchantModalOpen] = useState(false);

    const getMerchants = useCallback(async () => {
        if (window.ethereum) {
            try {
                let accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                let userAddress = accounts[0];

                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(userAddress);
                const contract = new Contract(contractAddress, abi, signer);

                let merchantIds = await contract.allMerchant();
                const formattedMerchants: Merchant[] = [];
                for (const merchantIdBN of merchantIds) {
                    const merchantId = parseInt(merchantIdBN);
                    const merchantDetail = await contract.getMerchantInfo(merchantId - 1);
                    formattedMerchants.push({ ...merchantDetail, key: merchantId });
                }
                setMerchants(formattedMerchants);
                console.log("Merchant IDs:", formattedMerchants);

            } catch (error) {
                console.error("Error fetching merchants:", error);
            }
        }
    }, []);


    const addMerchant = async (name: string, description: string, address: string) => {
        if (!name || !description || !address) return;
        if (window.ethereum) {
            let accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            let userAddress = accounts[0];
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(userAddress);
            const contract = new Contract(contractAddress, abi, signer);

            let tx = await contract.addMerchant(name, description, address);
            await tx.wait();

            getMerchants();
            setName('');
            setDescription('');
            setAddress('');
            setMerchantModal(false);

        }
    };

    const handlePay = (address: Merchant["address"]) => {
        setAddress(address);
        setPaymentModalOpen(true);
    };

    const handleModify = (merchant: Merchant) => {
        setSelectedMerchant(merchant);
        setMerchantModalOpen(true);
    };
    useEffect(() => {
        getMerchants();
    }, [getMerchants]);

    const handleSendPayment = async (merchantAddress: string, amount: number) => {
        if (window.ethereum) {
            let accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            let userAddress = accounts[0];
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(userAddress);
            const contract = new Contract(contractAddress, abi, signer);
            console.log(merchantAddress);
            let tx = await contract.send(merchantAddress, amount);
            await tx.wait();
        }
    };

    const handleModifyMerchant = async (newName: string, newDescription: string, newAddress: string) => {
        if (!newName || !newDescription || !newAddress || !selectedMerchant) return;

        if (window.ethereum) {
            let accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            let userAddress = accounts[0];
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(userAddress);
            const contract = new Contract(contractAddress, abi, signer);

            let tx = await contract.updateMerchant(selectedMerchant.key, newName, newDescription, newAddress);
            await tx.wait();
            getMerchants();
        }
    };

    return (
        <div className="flex flex-col max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="max-w-lg">
                <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                    Available Merchants
                </h3>
                <p className="text-gray-600 mt-2">
                    Welcome to your No. 1 Stable coin payment gateway!!!
                </p>
            </div>
            <div className="mt-4">
                <button
                    onClick={() => setMerchantModal(true)}
                    className="py-2 px-3 font-medium text-white hover:text-white bg-black hover:bg-blue duration-150 hover:bg-gray-50 rounded-lg"
                >
                    Add Merchant
                </button>
            </div>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                        <th className="py-3 px-6">S/N</th>
                            <th className="py-3 px-6">Product Name</th>
                            <th className="py-3 px-6">Description</th>
                            <th className="py-3 px-6">Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-black">
                        {merchants.map((selectedMerchant, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4">{selectedMerchant.id}</td>
                                <td className="px-6 py-4">{selectedMerchant.name}</td>
                                <td className="px-6 py-4">{selectedMerchant.description}</td>
                                <td className="px-6 py-4">{selectedMerchant.address}</td>
                                <td className="text-right px-6">
                                    <button
                                        onClick={() => handlePay(selectedMerchant.address)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Pay
                                    </button>
                                    <button
                                        onClick={() => handleModify(selectedMerchant)}
                                        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Modify
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/* Modal for Pay */}
            {paymentModalOpen && (
                <PaymentModal
                    onSendPayment={(merchantAddress, amount) => {
                        handleSendPayment(merchantAddress, amount);
                        setPaymentModalOpen(false);
                    }}
                    onClose={() => setPaymentModalOpen(false)}
                    address={selectedMerchant?.address || ''}
                />
            )}

            {/* Modal for Modify */}
            {merchantModalOpen && (
                <MerchantModal
                    onAddMerchant={addMerchant}
                    onModifyMerchant={handleModifyMerchant}
                    onClose={() => {
                        setMerchantModalOpen(false);
                        setSelectedMerchant(null);
                    }}
                    merchant={selectedMerchant || undefined}
                />
            )}
        </div>
    );
};

export default Merchant;
