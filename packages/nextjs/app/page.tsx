"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import type { NextPage } from "next";
// import Modal from "react-modal";
// import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  // Modal.setAppElement("#__next"); // Needed for accessibility

  const { address: connectedAddress } = useAccount();

  const [newAddress, setNewAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Wallet | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isTxDone, setIsTxDone] = useState<boolean>(false);

  // const { writeContractAsync, isPending } = useScaffoldWriteContract("Faucet");

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider);
    setSigner(wallet);
  }, []);

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const handleFaucet = async () => {
    if (!signer) return;

    try {
      const tx = await signer.sendTransaction({
        to: newAddress, // Replace with actual recipient address
        value: ethers.parseEther("10"),
      });
      setIsDisabled(true);

      console.log("Transaction", tx);

      const receipt = await tx.wait();
      console.log("Transaction Receipt", receipt);
      // setIsModalOpen(true); // Open the modal on success
      setIsTxDone(true);
    } catch (e) {
      console.error("Error", e);
      setIsDisabled(false);
    }

    //   await writeContractAsync(
    //     {
    //       functionName: "requestEther",
    //       // args: [newGreeting],
    //       // value: parseEther("0.01"),
    //     },
    //     {
    //       onBlockConfirmation: txnReceipt => {
    //         console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    //       },
    //     },
    //   );
    // } catch (e) {
    //   console.error("Error", e);
    // }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Breeder Faucet</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div>(Only for checking value in header, input your address below for receiving)</div>
          <p className="text-center text-lg">
            <input
              type="text"
              placeholder="Input receiving address"
              className="input border border-primary"
              onChange={e => setNewAddress(e.target.value)}
              disabled={isDisabled}
            />
            <button className="btn btn-primary" onClick={handleFaucet} disabled={isDisabled}>
              {/* isPending */}
              {isTxDone ? "DONE!" : "Get BREED"}
            </button>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="http://54.169.70.143/" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
