import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Header() {
    const [hideConnectBtn, setHideConnectBtn] = useState(false);
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    useEffect(() => {
        if (window.ethereum && window.ethereum.isMiniPay) {
            setHideConnectBtn(true);
            connect();
        }
    }, [connect]);

    return (
        <Disclosure as="nav" className="bg-black border-b border-white">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px- lg:px-4">
                        <div className="relative flex h-16 justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md  text-white focus:outline-white focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {open ? (
                                        <XMarkIcon
                                            className="block h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Bars3Icon
                                            className="block h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center pt-4 ">
                                    <Image
                                        className="block h-18 w-auto sm:block lg:block"
                                        src="/miniSafe.png"
                                        width="150"
                                        height="180"
                                        alt="MiniSafe Logo"
                                    />
                                    <div className="text-4xl font-bold justify-start text-white">MiniSafe</div>

                                </div>
                                <div className="hidden sm:ml-6 text-white sm:flex sm:space-x-8">
                                    <a
                                        href="#"
                                        className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-white"
                                    >
                                        Home
                                    </a>
                                </div>
                                <div className="hidden sm:ml-6 text-white sm:flex sm:space-x-8">

                                    <a
                                        href="#"
                                        className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-white"
                                    >
                                        Pay Bills
                                    </a>
                                </div>
                                <div className="hidden sm:ml-6 text-white sm:flex sm:space-x-8">

                                    <a
                                        href="#"
                                        className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-white"
                                    >
                                        Invest
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-white"
                                    >
                                        Log
                                    </a>
                                </div>
                                <div className="hidden sm:ml-6 text-white sm:flex sm:space-x-8">

                                    <a
                                        href="#"
                                        className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-white"
                                    >
                                        FAQ
                                    </a>
                                </div>

                            </div>

                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 pt-2 pb-4">
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-gray-500"
                            >
                                Home
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-gray-500"
                            >
                                Pay Bills
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-gray-500"
                            >
                                Invest
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-gray-500"
                            >
                                Log
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-gray-500"
                            >
                                FAQ
                            </Disclosure.Button>
                            {/* Add here your custom menu elements */}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

declare global {
    interface Window {
        ethereum: any;
    }
}
