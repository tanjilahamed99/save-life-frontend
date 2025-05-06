"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DiscountModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setTimeout(() => setShowModal(true), 100); // faster entry
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setShowModal(false), 200); // fast close
    router.push("/shop");
  };

  if (!showModal) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fadeInModal {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOutModal {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.96);
          }
        }

        .modal-enter {
          animation: fadeInModal 0.25s ease-out forwards;
        }

        .modal-exit {
          animation: fadeOutModal 0.3s ease-in forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          className={`bg-white max-w-md w-[90%] p-6 rounded-2xl shadow-xl ${
            closing ? "modal-exit" : "modal-enter"
          }`}>
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            🎁 Welkom bij Benzobestellen!
          </h2>
          <p className="text-center text-gray-600 mb-4">
            We zijn blij dat je er bent! Als welkomstcadeau krijg je:
          </p>
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-green-600">
              ✨ 10% korting op je eerste bestelling!
            </p>
            <div className="bg-gray-100 mt-2 py-2 px-4 inline-block rounded-md text-gray-800 font-mono tracking-wide">
              Kortingscode: <span className="font-bold">Welkom10</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-full mt-4 py-2 bg-teal-600 cursor-pointer text-white rounded-lg hover:bg-teal-700 transition">
            Begin met winkelen
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscountModal;
