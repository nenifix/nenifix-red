import React, { useState, useEffect } from "react";
import { 
  File, 
  FileText, 
  Image, 
  Trash2, 
  ExternalLink, 
  CloudUpload, 
  Lock, 
  CheckCircle, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import firebaseConfig from "../../firebase-applet-config.json";

export interface TransmittedFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
  transmissionTime: string;
}

interface ClientFilePickerProps {
  accessToken: string | null;
  user: any;
  onLogin: () => Promise<void>;
}

export default function ClientFilePicker({ accessToken, user, onLogin }: ClientFilePickerProps) {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [transmittedFiles, setTransmittedFiles] = useState<TransmittedFile[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  // Initialize and load saved files list on mount
  useEffect(() => {
    const saved = localStorage.getItem("nenifix_transmitted_files");
    if (saved) {
      try {
        setTransmittedFiles(JSON.parse(saved));
      } catch (err) {
        console.error("Error reading saved files", err);
      }
    }

    // Load Google API and Picker dynamically
    let scriptExists = document.getElementById("google-gapi-script");
    if (!scriptExists) {
      const script = document.createElement("script");
      script.id = "google-gapi-script";
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGapiLoaded(true);
        loadPickerApi();
      };
      script.onerror = () => {
        setPickerError("Failed to import Google client API loader script.");
      };
      document.body.appendChild(script);
    } else {
      setGapiLoaded(true);
      loadPickerApi();
    }
  }, []);

  const loadPickerApi = () => {
    const gapi = (window as any).gapi;
    if (gapi) {
      gapi.load("picker", {
        callback: () => {
          setPickerApiLoaded(true);
        },
        onerror: () => {
          setPickerError("Failed to initialize Google Picker API library.");
        }
      });
    }
  };

  // Open Picker Dialog
  const handleOpenPicker = () => {
    if (!accessToken) {
      setPickerError("Please login to authorize file actions.");
      return;
    }
    
    const gapi = (window as any).gapi;
    const google = (window as any).google;

    if (!gapi || !google || !google.picker) {
      setPickerError("Google Picker API is still initializing. Please wait...");
      // Try reloading gapi picker
      loadPickerApi();
      return;
    }

    setIsPicking(true);
    setPickerError(null);

    try {
      const developerKey = firebaseConfig.apiKey;
      
      // Create DocsView to browse Drive documents
      const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS);
      docsView.setParent("root"); // starts at top-level
      
      // Create DocsUploadView to let clients upload files from local storage
      const uploadView = new google.picker.DocsUploadView();

      const originHost = window.location.origin;

      const picker = new google.picker.PickerBuilder()
        .addView(docsView)
        .addView(uploadView)
        .setOAuthToken(accessToken)
        .setDeveloperKey(developerKey)
        .setOrigin(originHost)
        .setCallback((data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            const chosenDocs = data[google.picker.Response.DOCUMENTS] || [];
            const newFiles: TransmittedFile[] = [];

            for (const doc of chosenDocs) {
              const fileObj: TransmittedFile = {
                id: doc[google.picker.Document.ID],
                name: doc[google.picker.Document.NAME],
                url: doc[google.picker.Document.URL] || `https://drive.google.com/open?id=${doc[google.picker.Document.ID]}`,
                mimeType: doc[google.picker.Document.MIME_TYPE] || "application/octet-stream",
                sizeBytes: doc[google.picker.Document.SIZE_BYTES] || undefined,
                transmissionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " UTC"
              };
              newFiles.push(fileObj);
            }

            setTransmittedFiles((prev) => {
              const updated = [...newFiles, ...prev];
              localStorage.setItem("nenifix_transmitted_files", JSON.stringify(updated));
              return updated;
            });
            setIsPicking(false);
          } else if (data.action === google.picker.Action.CANCEL) {
            setIsPicking(false);
          }
        })
        .build();

      picker.setVisible(true);
    } catch (err: any) {
      console.error("Error drawing Google Picker:", err);
      setPickerError(`Failed to load secure widget popup: ${err.message || err.toString()}`);
      setIsPicking(false);
    }
  };

  const deleteFile = (indexToRemove: number) => {
    const isConfirmed = window.confirm("Are you sure you want to decouple this file from the live session record?");
    if (!isConfirmed) return;

    setTransmittedFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      localStorage.setItem("nenifix_transmitted_files", JSON.stringify(updated));
      return updated;
    });
  };

  // Helper dynamic file icons selector
  const renderMimeIcon = (mime: string) => {
    const lower = mime.toLowerCase();
    if (lower.includes("pdf")) return <FileText className="w-4 h-4 text-rose-500" />;
    if (lower.includes("image") || lower.includes("png") || lower.includes("jpg") || lower.includes("jpeg")) {
      return <Image className="w-4 h-4 text-emerald-400" />;
    }
    return <File className="w-4 h-4 text-indigo-400" />;
  };

  const humanReadableSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["KB", "MB", "GB"];
    if (bytes < k) return "1 KB";
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i - 1];
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5 space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-[10px] text-white/50 uppercase tracking-wider font-bold flex items-center gap-1.5">
          <CloudUpload className="w-4 h-4 text-primary" />
          <span>Client Document Transmission (Google Picker)</span>
        </h4>
        <span className="font-mono text-[9px] text-[#e2e2e2]/40 bg-zinc-800/50 border border-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-indigo-400" />
          <span>End-to-End Secure</span>
        </span>
      </div>

      {pickerError && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-mono text-[10px]">{pickerError}</p>
        </div>
      )}

      {/* Upload Zone / Launcher button */}
      {!accessToken ? (
        <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-5 rounded-2xl text-center space-y-2">
          <CloudUpload className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-white/60 text-xs font-sans">
            Authentication with Google Drive is required to use Google Picker helper.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/30 py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition duration-300 cursor-pointer"
          >
            Authenticate standard Picker
          </button>
        </div>
      ) : (
        <div className="bg-[#0A0A0B] border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative group overflow-hidden">
          <div className="space-y-2 relative z-10">
            <CloudUpload className="w-8 h-8 text-primary mx-auto animate-pulse" />
            <div>
              <p className="text-white font-bold text-xs">Drive File Portal Ready</p>
              <p className="text-white/40 text-[10px] mt-0.5">Attach investor pitch decks, sheets, folders, or PDF briefings.</p>
            </div>
            
            <button
              type="button"
              disabled={isPicking || !pickerApiLoaded}
              onClick={handleOpenPicker}
              className="mt-2 bg-primary hover:bg-[#5b61ec] text-white py-2 px-6 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isPicking ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Awaiting Selection...</span>
                </>
              ) : (
                <span>Launch Google Picker Widget</span>
              )}
            </button>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 duration-500" />
        </div>
      )}

      {/* Transmitted Files Listing view */}
      {transmittedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest pl-1">
            Session Files Attachment ({transmittedFiles.length})
          </p>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {transmittedFiles.map((f, i) => (
              <div 
                key={f.id + i} 
                className="flex items-center justify-between p-2.5 bg-[#0C0C0E] border border-white/5 rounded-xl text-xs hover:border-white/10 transition group"
              >
                <div className="flex items-center gap-2 xl:max-w-[70%] max-w-[60%]">
                  <div className="bg-white/5 p-1.5 rounded-lg">
                    {renderMimeIcon(f.mimeType)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-zinc-200 truncate leading-tight select-all" title={f.name}>
                      {f.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      {humanReadableSize(f.sizeBytes)} • {f.transmissionTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shadow-sm">
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer referrer"
                    className="p-1.5 rounded-lg bg-[#141416] hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition cursor-pointer"
                    title="View file inside Google Drive"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteFile(i)}
                    className="p-1.5 rounded-lg bg-[#141416] hover:bg-red-500/20 border border-white/5 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    title="De-associate file from briefing session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
