import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { scanTicket, ScanResult } from "@/api/bookings";
import { Camera, CameraOff, CheckCircle2, XCircle, AlertCircle, RefreshCw, Search } from "lucide-react";

type ScanStatus = "idle" | "scanning" | "success" | "duplicate" | "error";

interface ScanState {
  status: ScanStatus;
  result: ScanResult | null;
  errorMessage: string;
}

const TicketScanner = () => {
  const [scanState, setScanState] = useState<ScanState>({
    status: "idle",
    result: null,
    errorMessage: "",
  });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "ticket-qr-scanner";

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const processToken = async (token: string) => {
    if (!token.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await scanTicket(token.trim());
      setScanState({ status: "success", result, errorMessage: "" });
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Something went wrong";
      const resultData = err?.response?.data;

      if (status === 409) {
        setScanState({ status: "duplicate", result: resultData, errorMessage: message });
      } else {
        setScanState({ status: "error", result: null, errorMessage: message });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const startCamera = async () => {
    setScanState({ status: "idle", result: null, errorMessage: "" });
    setIsCameraActive(true);

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerDivId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await stopScanner();
            setScanState({ status: "scanning", result: null, errorMessage: "" });
            await processToken(decodedText);
          },
          undefined
        );
      } catch (err: any) {
        setIsCameraActive(false);
        setScanState({
          status: "error",
          result: null,
          errorMessage: "Camera access denied. Please allow camera permissions or use manual entry.",
        });
      }
    }, 100);
  };

  const reset = async () => {
    await stopScanner();
    setScanState({ status: "idle", result: null, errorMessage: "" });
    setManualToken("");
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processToken(manualToken);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Ticket Scanner</h2>
        <p className="text-muted-foreground">Scan QR codes to grant entry — each ticket can only be used once</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Camera Scanner
          </h3>

          <AnimatePresence mode="wait">
            {scanState.status === "idle" && !isCameraActive && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
              >
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-primary/50" />
                </div>
                <p className="text-muted-foreground text-sm text-center">Click below to activate camera and scan tickets</p>
                <Button onClick={startCamera} className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              </motion.div>
            )}

            {isCameraActive && (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div id={scannerDivId} className="w-full rounded-xl overflow-hidden border border-border" />
                <Button variant="outline" onClick={stopScanner} className="w-full">
                  <CameraOff className="mr-2 h-4 w-4" />
                  Stop Camera
                </Button>
              </motion.div>
            )}

            {scanState.status === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-12 gap-4"
              >
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-muted-foreground">Verifying ticket...</p>
              </motion.div>
            )}

            {(scanState.status === "success" || scanState.status === "duplicate" || scanState.status === "error") && (
              <motion.div
                key="result"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                {scanState.status === "success" && (
                  <div className="flex flex-col items-center py-6 gap-3 text-center">
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                    <h4 className="text-2xl font-bold text-green-500">ENTRY GRANTED</h4>
                    <div className="w-full bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-left space-y-2">
                      <p className="font-bold text-lg">{scanState.result?.booking?.name}</p>
                      <p className="text-sm text-muted-foreground">Package: <span className="font-semibold text-foreground">₹{scanState.result?.booking?.package}</span></p>
                      <p className="text-sm text-muted-foreground">Token: <span className="font-mono font-bold text-primary">{scanState.result?.booking?.token}</span></p>
                      {scanState.result?.booking?.number && (
                        <p className="text-sm text-muted-foreground">Phone: <span className="font-semibold text-foreground">{scanState.result.booking.number}</span></p>
                      )}
                    </div>
                  </div>
                )}

                {scanState.status === "duplicate" && (
                  <div className="flex flex-col items-center py-6 gap-3 text-center">
                    <AlertCircle className="h-20 w-20 text-orange-500" />
                    <h4 className="text-2xl font-bold text-orange-500">ALREADY USED</h4>
                    <div className="w-full bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-left space-y-2">
                      <p className="font-bold">{scanState.result?.booking?.name}</p>
                      <p className="text-sm text-muted-foreground">Token: <span className="font-mono font-bold">{scanState.result?.booking?.token}</span></p>
                      {scanState.result?.scannedAt && (
                        <p className="text-sm text-orange-400">
                          Used at: {new Date(scanState.result.scannedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {scanState.status === "error" && (
                  <div className="flex flex-col items-center py-6 gap-3 text-center">
                    <XCircle className="h-20 w-20 text-destructive" />
                    <h4 className="text-2xl font-bold text-destructive">INVALID TICKET</h4>
                    <p className="text-muted-foreground text-sm">{scanState.errorMessage}</p>
                  </div>
                )}

                <Button onClick={reset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Scan Next Ticket
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Manual Token Entry
          </h3>
          <p className="text-sm text-muted-foreground mb-6">Enter the token manually if camera scanning fails</p>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <Input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="e.g. ABC123"
              className="text-center text-2xl font-mono font-bold tracking-widest h-16 uppercase"
              maxLength={8}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={manualToken.length < 4 || isProcessing}
            >
              {isProcessing ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Verifying...</>
              ) : (
                <><Search className="mr-2 h-4 w-4" /> Verify Token</>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Scanner Guide</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-muted-foreground">Green = Valid ticket, entry allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="text-muted-foreground">Orange = Ticket already scanned</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
                <span className="text-muted-foreground">Red = Invalid or unpaid ticket</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TicketScanner;
