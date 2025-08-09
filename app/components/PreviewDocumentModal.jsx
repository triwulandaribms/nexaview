"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";


const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={
      `inline-flex items-center justify-center rounded-md font-medium transition-opacity
       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20
       disabled:opacity-50 disabled:pointer-events-none
       h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm ${className}`
    }
  >
    {children}
  </button>
);

const Icon = {
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>
  ),
  ZoomIn: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M21 21l-4.35-4.35" /></svg>
  ),
  ZoomOut: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="11" cy="11" r="7" /><path d="M8 11h6" /><path d="M21 21l-4.35-4.35" /></svg>
  ),
  Max: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M8 3H3v5M16 21h5v-5M21 8V3h-5M3 16v5h5" /></svg>
  ),
  Min: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M21 3H14M21 3v7M3 21h7M3 21v-7" /></svg>
  ),
  External: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14L21 3" /></svg>
  ),
  Download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
  ),
  Print: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
  ),
};

const ext = (url) => ((url || "").split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
const isPdf = (url) => /\.pdf($|\?|#)/i.test(url || "");
const isImage = (url) => /(png|jpe?g|gif|webp|svg)$/i.test(ext(url));
const isVideo = (url) => /(mp4|webm|ogg)$/i.test(ext(url));
const isAudio = (url) => /(mp3|wav|ogg)$/i.test(ext(url));
const isTextLike = (url) => /(txt|csv|md|json|log)$/i.test(ext(url));
const isSpreadsheet = (url) => /(xlsx|xls)$/i.test(ext(url));
const isWord = (url) => /(docx|doc)$/i.test(ext(url));
const isPpt = (url) => /(pptx|ppt)$/i.test(ext(url));
const isOffice = (url) => isSpreadsheet(url) || isWord(url) || isPpt(url);

const isPublicHttp = (url) => {
  try {
    const u = new URL(url);
    return u.protocol.startsWith("http") && !/(localhost|127\.0\.0\.1)/i.test(u.hostname);
  } catch { return false; }
};
const toOfficeViewer = (url) => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

function Viewer({ fileUrl, zoom, fit, onLoaded }) {
  const iframeRef = useRef(null);

  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!fileUrl) { if (!cancelled) setMissing(true); return; }
        const res = await fetch(fileUrl, { method: "HEAD" });
        if (!cancelled) setMissing(!res.ok);
      } catch {
        if (!cancelled) setMissing(true);
      }
    })();
    return () => { cancelled = true; };
  }, [fileUrl]);

  const pdfSrc = useMemo(() => {
    if (!fileUrl) return "";
    if (isPdf(fileUrl)) {
      const sep = fileUrl.includes("?") ? "&" : "?";
      return `${fileUrl}${sep}toolbar=0#view=${fit ? "FitH" : "fit"}`;
    }
    return fileUrl;
  }, [fileUrl, fit]);

  const base = "w-full h-full rounded-xl bg-white shadow-sm overflow-hidden";

  if (missing) {
    return (
      <div className={`${base} grid place-items-center p-6 text-center`}>
        <div className="max-w-md space-y-3">
          <div className="text-base font-semibold">File not found</div>
          <p className="text-sm opacity-70">
            We couldn’t load this file. It may have been moved or deleted, or the URL is incorrect.
          </p>
        </div>
      </div>
    );
  }
  if (isOffice(fileUrl)) {
    if (isPublicHttp(fileUrl)) {
      return (
        <div className={base}>
          <iframe title="Office Preview" src={toOfficeViewer(fileUrl)} className="w-full h-full border-0" onLoad={onLoaded} />
        </div>
      );
    }
    return (
      <div className={`${base} grid place-items-center p-6 text-center`}>
        <div className="max-w-md space-y-3">
          <div className="text-base font-semibold">Preview not available for offline Office files</div>
          <p className="text-sm opacity-70">Files <b>.docx/.xlsx/.pptx</b> from <i>localhost/intranet</i> cannot be displayed directly in the browser. Please use the <b>Download</b> button in the toolbar or open the file in a new tab.</p>
        </div>
      </div>
    );
  }

  if (isImage(fileUrl)) {
    return (
      <div className={`relative ${base}`}>
        <div className="w-full h-full grid place-items-start overflow-auto p-4" style={{ contain: "paint" }}>
          <img src={fileUrl} alt="Document Preview" className="max-w-none" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }} onLoad={onLoaded} />
        </div>
      </div>
    );
  }

  if (isVideo(fileUrl)) {
    return (
      <div className={`${base} grid place-items-center bg-black`}>
        <video src={fileUrl} controls className="w-full h-full object-contain" onLoadedData={onLoaded} />
      </div>
    );
  }

  if (isAudio(fileUrl)) {
    return (
      <div className={`${base} grid place-items-center p-6`}>
        <audio src={fileUrl} controls onLoadedData={onLoaded} className="w-full" />
      </div>
    );
  }

  if (isPdf(fileUrl)) {
    return (
      <div className={base}>
        <iframe ref={iframeRef} title="PDF Preview" src={pdfSrc} className="w-full h-full border-0" onLoad={onLoaded} allow="clipboard-write" />
      </div>
    );
  }

  if (isTextLike(fileUrl)) {
    return (
      <div className={base}>
        <iframe title="Text Preview" src={fileUrl} className="w-full h-full border-0" onLoad={onLoaded} />
      </div>
    );
  }

  return (
    <div className={`${base} grid place-items-center p-6 text-center`}>
      <div className="max-w-md space-y-3">
        <div className="text-base font-semibold">Format tidak didukung untuk preview</div>
        <p className="text-sm opacity-70">File ini tidak bisa dirender di browser. Gunakan tombol <b>Download</b> di toolbar untuk mengunduh.</p>
      </div>
    </div>
  );
}

export default function PreviewDocumentModal({ open, onOpenChange, fileUrl, title = "Preview Document", item }) {
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e) => e.key === "Escape" && onOpenChange?.(false);
      window.addEventListener("keydown", onKey);
      return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }
  }, [open, onOpenChange]);

  const increase = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));
  const decrease = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const resetZoom = () => setZoom(1);

  const openInNewTab = () => fileUrl && window.open(fileUrl, "_blank", "noopener,noreferrer");
  const download = () => {
    if (!item?.id) return;
    const url = `/api/dataset/${item?.id}/download`;
    const a = document.createElement("a");
    a.href = url;
    a.download = item?.filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const printDoc = () => openInNewTab();
  const onOverlayClick = (e) => { if (e.target === e.currentTarget) onOpenChange?.(false); };

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onOverlayClick} />

      {/* Modal Card */}
      <div className={`absolute ${isFullscreen ? "inset-0" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"} w-[100vw] sm:w-auto h-[100vh] sm:h-[80vh] ${isFullscreen ? "max-w-[100vw]" : "sm:max-w-[1000px]"} bg-white text-neutral-900 border border-black/10 rounded-none sm:rounded-xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-white sticky top-0 z-10 border-b">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex size-2 rounded-full bg-emerald-500" />
            <span className="font-semibold truncate">{title}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <Button onClick={decrease} title="Zoom out" className="bg-transparent text-neutral-700 hover:bg-neutral-100 rounded-md border-0"><Icon.ZoomOut className="w-4 h-4" /></Button>
            <Button
              onClick={resetZoom}
              title="Reset zoom"
              className="bg-transparent text-foreground border-0 px-2 whitespace-nowrap leading-none"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button onClick={increase} title="Zoom in" className="bg-transparent text-foreground border-0"><Icon.ZoomIn className="w-4 h-4" /></Button>

            <span className="hidden sm:block w-px h-5 bg-black/10 mx-1" />

            <Button
              onClick={() => setFit((f) => !f)}
              title="Toggle fit"
              className="bg-transparent text-foreground border-0 whitespace-nowrap"
            >
              <span className="sm:hidden">{fit ? "Fit" : "Page"}</span>
              <span className="hidden sm:inline">{fit ? "Fit width" : "Fit page"}</span>
            </Button>
            <Button onClick={openInNewTab} title="Open in new tab" className="bg-transparent text-foreground border-0"><Icon.External className="w-4 h-4" /></Button>
            <Button onClick={download} title="Download" className="bg-transparent text-foreground border-0"><Icon.Download className="w-4 h-4" /></Button>
            <Button onClick={printDoc} title="Print" className="bg-transparent text-foreground border-0"><Icon.Print className="w-4 h-4" /></Button>

            <span className="hidden sm:block w-px h-5 bg-black/10 mx-1" />

            <Button onClick={() => setIsFullscreen((v) => !v)} title={isFullscreen ? "Exit full screen" : "Full screen"} className="bg-transparent text-foreground border-0">{isFullscreen ? <Icon.Min className="w-4 h-4" /> : <Icon.Max className="w-4 h-4" />}</Button>
            <Button onClick={() => onOpenChange?.(false)} title="Close" className="bg-transparent text-foreground border-0"><Icon.Close className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 min-h-0 p-1 sm:p-3 bg-neutral-50 dark:bg-neutral-900/40 h-[calc(100%-52px)]">
          <div className="h-full rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden">
            <Viewer fileUrl={fileUrl} zoom={zoom} fit={fit} onLoaded={() => setLoaded(true)} />
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

