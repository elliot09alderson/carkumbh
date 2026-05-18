import { useState, useEffect } from "react";
import { X } from "lucide-react";

const isInAppBrowser = () =>
  /Instagram|FBAN|FBAV|FB_IAB|FB4A|FBIOS|Twitter|LinkedInApp|Line\/|MicroMessenger/i.test(
    navigator.userAgent
  );

const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function InAppBrowserBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInAppBrowser()) setVisible(true);
  }, []);

  if (!visible) return null;

  const ios = isIOS();

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-orange-500/40 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
        {/* close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="text-4xl text-center mb-3">🌐</div>

        <h2 className="text-white font-bold text-lg text-center mb-1">
          Open in your browser
        </h2>
        <p className="text-gray-400 text-sm text-center mb-5">
          You're inside Instagram's built-in browser which{" "}
          <span className="text-orange-400 font-semibold">cannot download tickets</span>.
          Open this page in {ios ? "Safari" : "Chrome"} to download your ticket properly.
        </p>

        {/* Steps */}
        <ol className="space-y-3 text-sm text-gray-300 mb-5">
          {ios ? (
            <>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                Tap the <span className="mx-1 font-bold text-white">···</span> (three dots) at the bottom-right corner
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                Tap <span className="mx-1 font-bold text-white">"Open in Safari"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                Then tap <span className="mx-1 font-bold text-white">"Download Ticket"</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                Tap the <span className="mx-1 font-bold text-white">⋮</span> menu (top-right)
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                Tap <span className="mx-1 font-bold text-white">"Open in Chrome"</span> or <span className="mx-1 font-bold text-white">"Open in browser"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                Then tap <span className="mx-1 font-bold text-white">"Download Ticket"</span>
              </li>
            </>
          )}
        </ol>

        <button
          onClick={() => setVisible(false)}
          className="w-full py-2.5 rounded-xl border border-gray-600 text-gray-400 text-sm hover:text-white hover:border-gray-400 transition-colors"
        >
          I understand, continue anyway
        </button>
      </div>
    </div>
  );
}
