import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import type { jsPDF } from 'jspdf'

// ─── Types ─────────────────────────────────────────────────────────────────────

/**
 * Optional per-page header/footer for PDF export only.
 * html2pdf.js renders one tall canvas then slices it into A4 pages, so CSS
 * `position: fixed` does not repeat on each PDF page. We still use `onclone`
 * to hide in-flow chrome and inject layout CSS; repeating chrome is painted
 * on every page after `toPdf()` using the same HTML rasterized once.
 */
export interface PdfPageChromeConfig {
    /** Clinic header HTML (e.g. clinicProfile.header) */
    headerHtml?: string
    /** Clinic footer HTML (e.g. clinicProfile.footer) */
    footerHtml?: string
    /** Fallback header height (mm) if raster measurement is skipped */
    headerHeightMm?: number
    /** Fallback footer height (mm) if raster measurement is skipped */
    footerHeightMm?: number
    /** Distance from top page edge to stamped header (mm). Default: 2 */
    headerTopOffsetMm?: number
    /** Distance from bottom page edge to stamped footer (mm). Default: 5 */
    footerBottomOffsetMm?: number
    /**
     * When true, `onclone` also injects `position: fixed` header/footer nodes
     * (for debugging or single-page PDFs). Default false — per-page repeat uses
     * post-render stamping to avoid double-draw on page 1.
     */
    injectFixedInClone?: boolean
}

interface ExportToPdfOptions {
    margin?: number | [number, number, number, number]
    image?: {
        type?: 'jpeg' | 'png' | 'webp'
        quality?: number
    }
    html2canvas?: {
        scale?: number
        useCORS?: boolean
        allowTaint?: boolean
        logging?: boolean
        backgroundColor?: string
        onclone?: (clonedDoc: Document, element: HTMLElement) => void
    }
    jsPDF?: {
        unit?: string
        format?: string
        orientation?: 'portrait' | 'landscape'
        compress?: boolean
    }
    pagebreak?: {
        mode?: string | string[]
        before?: string | string[]
        after?: string | string[]
        avoid?: string | string[]
    }
    /** Consumed only by `generatePdf`; stripped before `html2pdf().set()` */
    pdfPageChrome?: PdfPageChromeConfig
}

/**
 * Configuration for custom page break handling based on field types
 */
export interface PageBreakConfig {
    /** Enable custom page breaks based on field types (default: true) */
    enabled?: boolean
    /** Field types that should trigger a page break after them */
    breakAfterFieldTypes?: string[]
    /** Field types that should trigger a page break before them */
    breakBeforeFieldTypes?: string[]
    /** CSS selectors for elements that should have page breaks after them */
    breakAfterSelectors?: string[]
    /** CSS selectors for elements that should have page breaks before them */
    breakBeforeSelectors?: string[]
    /** Elements to avoid breaking inside */
    avoidBreakInside?: string[]
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_PAGE_BREAK_CONFIG: PageBreakConfig = {
    enabled: true,
    breakAfterSelectors: ['.pdf-page-break', '[data-page-break="true"]'],
    breakBeforeSelectors: [],
    avoidBreakInside: ['.avoid-page-break', 'table', 'img', 'svg'],
}

/**
 * Prescription PDF: do not apply break-inside: avoid to `table` elements.
 * The default config marks every table unbreakable, which pushes the whole
 * medications grid to the next page and leaves a gap under section headings.
 * Omitting `table` here lets rows flow across pages.
 */
export const PRESCRIPTION_PDF_PAGE_BREAK_CONFIG: PageBreakConfig = {
    enabled: true,
    breakAfterSelectors: ['.pdf-page-break', '[data-page-break="true"]'],
    breakBeforeSelectors: [],
    /**
     * Signature: `adjustSignatureStampRowForPdfSlice`. Table rows: spacers in
     * `onclone` — not `tr` in avoid (avoids wrong html2pdf padding divs).
     */
    avoidBreakInside: [
        '.avoid-page-break',
        '.pdf-atomic-section',
        '[data-pdf-avoid-slice="true"]',
        'img',
        'svg',
    ],
}

/** Selectors for elements stripped from the cloned DOM before rendering */
const HIDDEN_SELECTORS = [
    '[hidden]',
    '[aria-hidden="true"]',
    '.hidden',
    '.sr-only',
    '.pdf-exclude',
    '[data-pdf-exclude="true"]',
].join(',')

// ─── DOM Helpers ───────────────────────────────────────────────────────────────

/**
 * Converts list markers (bullets/numbers) into inline <span> elements
 * so html2canvas can render them
 *  properly in the PDF.
 * Returns a cleanup function that restores the original DOM.
 */
function inlineListMarkers(element: HTMLElement): () => void {
    const addedSpans: HTMLSpanElement[] = []
    const modifiedLists: Array<{ list: HTMLElement; origStyle: string }> = []

    // Process all <ul> lists - add bullet character
    element.querySelectorAll('ul').forEach((ul) => {
        modifiedLists.push({
            list: ul as HTMLElement,
            origStyle: (ul as HTMLElement).style.listStyleType,
        })
        ;(ul as HTMLElement).style.listStyleType = 'none'
        ul.querySelectorAll(':scope > li').forEach((li) => {
            const marker = document.createElement('span')
            marker.textContent = '\u2022 '
            marker.setAttribute('data-pdf-marker', 'true')
            marker.style.fontWeight = 'bold'
            li.insertBefore(marker, li.firstChild)
            addedSpans.push(marker)
        })
    })

    // Process all <ol> lists - add number
    element.querySelectorAll('ol').forEach((ol) => {
        modifiedLists.push({
            list: ol as HTMLElement,
            origStyle: (ol as HTMLElement).style.listStyleType,
        })
        ;(ol as HTMLElement).style.listStyleType = 'none'
        ol.querySelectorAll(':scope > li').forEach((li, idx) => {
            const marker = document.createElement('span')
            marker.textContent = `${idx + 1}. `
            marker.setAttribute('data-pdf-marker', 'true')
            li.insertBefore(marker, li.firstChild)
            addedSpans.push(marker)
        })
    })

    return () => {
        addedSpans.forEach((span) => span.remove())
        modifiedLists.forEach(({ list, origStyle }) => {
            list.style.listStyleType = origStyle
        })
    }
}

/**
 * Applies custom page break CSS rules to elements before PDF generation
 */
function applyPageBreakStyles(
    element: HTMLElement,
    config: PageBreakConfig
): () => void {
    const stylesToRestore: Array<{
        element: HTMLElement
        property: string
        value: string
    }> = []

    const setStyle = (
        el: HTMLElement,
        property: string,
        value: string
    ): void => {
        const currentValue = el.style.getPropertyValue(property)
        stylesToRestore.push({ element: el, property, value: currentValue })
        el.style.setProperty(property, value)
    }

    if (config.breakAfterSelectors) {
        config.breakAfterSelectors.forEach((selector) => {
            element.querySelectorAll(selector).forEach((el) => {
                setStyle(el as HTMLElement, 'page-break-after', 'always')
                setStyle(el as HTMLElement, 'break-after', 'page')
            })
        })
    }

    if (config.breakBeforeSelectors) {
        config.breakBeforeSelectors.forEach((selector) => {
            element.querySelectorAll(selector).forEach((el) => {
                setStyle(el as HTMLElement, 'page-break-before', 'always')
                setStyle(el as HTMLElement, 'break-before', 'page')
            })
        })
    }

    if (config.avoidBreakInside) {
        config.avoidBreakInside.forEach((selector) => {
            element.querySelectorAll(selector).forEach((el) => {
                setStyle(el as HTMLElement, 'page-break-inside', 'avoid')
                setStyle(el as HTMLElement, 'break-inside', 'avoid')
            })
        })
    }

    return () => {
        stylesToRestore.forEach(({ element, property, value }) => {
            if (value) {
                element.style.setProperty(property, value)
            } else {
                element.style.removeProperty(property)
            }
        })
    }
}

/**
 * Strips hidden/utility elements from the cloned document before
 * html2canvas renders it. Reduces canvas pixel count → smaller JPEG → smaller PDF.
 */
function removeHiddenElements(clonedDoc: Document): void {
    clonedDoc.querySelectorAll(HIDDEN_SELECTORS).forEach((el) => el.remove())
}

/** html2pdf's pagebreak plugin reads `break-inside` from computed style — reinforce in clone */
function injectPdfAtomicBreakStyles(clonedDoc: Document): void {
    const s = clonedDoc.createElement('style')
    s.setAttribute('data-pdf-atomic-breaks', 'true')
    s.textContent = `
      .avoid-page-break,
      .pdf-atomic-section,
      [data-pdf-avoid-slice="true"] {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    `
    clonedDoc.head.appendChild(s)
}

/**
 * One PDF page slice height in **layout (CSS) px**, aligned with html2pdf
 * `Worker.toPdf`: `pxPageHeight = floor(canvas.width * innerH/innerW)` where
 * `canvas.width ≈ innerWidthPx * html2canvasScale`.
 */
function computePdfSliceHeightPx(
    marginsMm: [number, number, number, number],
    html2canvasScale: number
): number {
    const innerWmm = A4_WIDTH_MM - marginsMm[1] - marginsMm[3]
    const innerHmm = A4_HEIGHT_MM - marginsMm[0] - marginsMm[2]
    if (innerWmm <= 0 || innerHmm <= 0) return 0
    const k = 72 / 25.4
    const innerWpx = Math.floor(((innerWmm * k) / 72) * 96)
    const ratio = innerHmm / innerWmm
    const s = html2canvasScale > 0 ? html2canvasScale : 1.4
    const pxPageHeightCanvas = Math.floor(innerWpx * s * ratio)
    return Math.max(1, Math.round(pxPageHeightCanvas / s))
}

/** More than half of the row height falls below the seam → shift whole row to next slice */
const SIGNATURE_STAMP_SHIFT_IF_BELOW_FRACTION = 0.5

/**
 * `.pdf-signature-stamp-row` and PDF slice seams: insert a spacer **only** when
 * **more than 50%** of the row’s height would fall **below** the page boundary
 * (majority on the “next” page). Then the full row moves to the next slice.
 * If **at least half** stays **above** the seam, no spacer — row stays on the
 * current page (may leave a thin slice on the next page; avoids large blank gaps).
 * Slice height matches html2pdf’s canvas split (incl. html2canvas scale).
 */
function adjustSignatureStampRowForPdfSlice(
    rootEl: HTMLElement,
    pxPageHeight: number
): void {
    if (pxPageHeight <= 0) return
    const sig = rootEl.querySelector(
        '.pdf-signature-stamp-row'
    ) as HTMLElement | null
    if (!sig) return

    const rootRect = rootEl.getBoundingClientRect()
    const sigRect = sig.getBoundingClientRect()
    const topRel = sigRect.top - rootRect.top
    const botRel = sigRect.bottom - rootRect.top
    const h = botRel - topRel
    if (h <= 0) return

    let boundary =
        Math.floor(topRel / pxPageHeight) * pxPageHeight + pxPageHeight
    while (boundary < botRel) {
        if (topRel < boundary && botRel > boundary) {
            const above = boundary - topRel
            const below = botRel - boundary
            const fracBelow = below / h
            if (fracBelow > SIGNATURE_STAMP_SHIFT_IF_BELOW_FRACTION) {
                const pad = sig.ownerDocument.createElement('div')
                pad.setAttribute('data-pdf-sig-spacer', 'true')
                Object.assign(pad.style, {
                    display: 'block',
                    height: `${above}px`,
                    margin: '0',
                    padding: '0',
                    border: '0',
                    lineHeight: '0',
                    fontSize: '0',
                })
                sig.parentNode?.insertBefore(pad, sig)
            }
            break
        }
        boundary += pxPageHeight
    }
}

/**
 * Prescription `tbody tr`: insert a spacer before a row when a PDF slice would cut
 * through it (same layout px slice as `computePdfSliceHeightPx`). Avoids relying
 * on html2pdf’s `tr` avoid pads (wrong height vs real canvas slices).
 */
function adjustTableBodyRowsForPdfSlice(
    rootEl: HTMLElement,
    sliceHeightPx: number
): void {
    if (sliceHeightPx <= 0) return
    const rows = Array.from(rootEl.querySelectorAll('tbody tr')).reverse()
    const rootRect = rootEl.getBoundingClientRect()

    rows.forEach((row) => {
        const tr = row as HTMLElement
        const r = tr.getBoundingClientRect()
        const topRel = r.top - rootRect.top
        const botRel = r.bottom - rootRect.top
        if (botRel <= topRel) return

        let boundary =
            Math.floor(topRel / sliceHeightPx) * sliceHeightPx + sliceHeightPx
        while (boundary < botRel) {
            if (topRel < boundary && botRel > boundary) {
                const above = boundary - topRel
                const pad = tr.ownerDocument.createElement('div')
                pad.setAttribute('data-pdf-tr-spacer', 'true')
                Object.assign(pad.style, {
                    display: 'block',
                    height: `${above}px`,
                    margin: '0',
                    padding: '0',
                    border: '0',
                    lineHeight: '0',
                    fontSize: '0',
                })
                tr.parentNode?.insertBefore(pad, tr)
                break
            }
            boundary += sliceHeightPx
        }
    })
}

function injectPdfCloneRootTableStyles(clonedDoc: Document): void {
    const s = clonedDoc.createElement('style')
    s.setAttribute('data-pdf-table-slice', 'true')
    s.textContent = `
      [data-pdf-clone-root] thead {
        display: table-header-group;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      [data-pdf-clone-root] table { break-inside: auto; page-break-inside: auto; }
      [data-pdf-clone-root] tr { break-inside: avoid; page-break-inside: avoid; }
      [data-pdf-clone-root] td,
      [data-pdf-clone-root] th { break-inside: auto; page-break-inside: auto; }
      /* html2canvas + border-collapse: last line can sit on border; force symmetric block padding */
      [data-pdf-clone-root] tbody td,
      [data-pdf-clone-root] thead th {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        vertical-align: top;
      }
    `
    clonedDoc.head.appendChild(s)
}

/**
 * Downscales large images in the cloned DOM to a max width/height.
 * Images in an A4 PDF (210mm wide ≈ 595pt) don't need to be 2000px+.
 * This dramatically reduces canvas pixel data → smaller JPEG → smaller PDF.
 *
 * Runs on the CLONED document only — original DOM is untouched.
 */
const MAX_IMG_DIMENSION = 800 // px — more than enough for A4 at scale 2

function downscaleImages(clonedDoc: Document): void {
    clonedDoc.querySelectorAll('img').forEach((img) => {
        const w = img.naturalWidth || img.width
        const h = img.naturalHeight || img.height

        // Skip small images or images that failed to load
        if (!w || !h || (w <= MAX_IMG_DIMENSION && h <= MAX_IMG_DIMENSION)) {
            return
        }

        try {
            // Calculate new dimensions preserving aspect ratio
            const ratio = Math.min(MAX_IMG_DIMENSION / w, MAX_IMG_DIMENSION / h)
            const newW = Math.round(w * ratio)
            const newH = Math.round(h * ratio)

            // Draw downscaled image onto a small canvas
            const canvas = clonedDoc.createElement('canvas')
            canvas.width = newW
            canvas.height = newH
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            // If the source image has transparency, converting to JPEG would turn
            // transparent pixels black. Pre-fill a white background to avoid
            // black boxes behind logos/signatures/stamps in the exported PDF.
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, newW, newH)
            ctx.drawImage(img, 0, 0, newW, newH)

            // Replace src with compressed data URL
            img.src = canvas.toDataURL('image/jpeg', 0.8)
            img.width = newW
            img.height = newH
        } catch {
            // Cross-origin or tainted — skip silently
        }
    })
}

/** html2pdf.js margin order: [top, left, bottom, right] in mm */
function normalizeHtml2PdfMargins(margin?: ExportToPdfOptions['margin']): {
    top: number
    left: number
    bottom: number
    right: number
} {
    if (Array.isArray(margin)) {
        const [top = 10, left = 10, bottom = 10, right = 10] = margin
        return { top, left, bottom, right }
    }
    const n = typeof margin === 'number' ? margin : 10
    return { top: n, left: n, bottom: n, right: n }
}

interface ChromeRaster {
    dataUrl: string
    heightMm: number
}

const A4_WIDTH_MM = 210
/** A4 portrait height (mm); matches `jsPDF` default `format: 'a4'`. */
const A4_HEIGHT_MM = 297

/**
 * `1` = use full printable height (no extra bottom band). Values `< 1` add
 * bottom margin mm so each slice is shorter (fewer seam clips, more blank at
 * page bottom).
 */
export const PDF_PAGE_CONTENT_HEIGHT_RATIO = 1

/**
 * Do not list `tr`/`thead` here: html2pdf’s pagebreak plugin uses `inner.px.height`
 * for spacer math while `toPdf` slices with scaled canvas width — mismatch causes
 * huge gaps above rows and rows still cut. Table seams are fixed in `onclone` via
 * `adjustTableBodyRowsForPdfSlice` (same slice height as signature).
 */
const DEFAULT_PDF_PAGEBREAK_AVOID_SELECTORS = [
    'img',
    'svg',
    '.avoid-page-break',
    '.pdf-atomic-section',
    '[data-pdf-avoid-slice="true"]',
]

/** Wait for images (and fonts) so html2canvas measures full layout, not a collapsed logo box */
async function waitForChromeImages(container: HTMLElement): Promise<void> {
    const imgs = container.querySelectorAll('img')
    await Promise.all(
        Array.from(imgs).map(
            (img) =>
                new Promise<void>((resolve) => {
                    if (img.complete && img.naturalWidth > 0) {
                        resolve()
                        return
                    }
                    const done = () => resolve()
                    img.addEventListener('load', done, { once: true })
                    img.addEventListener('error', done, { once: true })
                    window.setTimeout(done, 5000)
                })
        )
    )
    await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
    )
}

/**
 * Rasterize a header/footer HTML fragment at the same width as the PDF clone (794px)
 * so measured height matches the final stamp.
 *
 * Injects PDF-only CSS so clinic header HTML is not stuck at small "logo" dimensions
 * (inline max-width/height or legacy styles). Images must finish loading before capture.
 */
async function rasterizeChromeHtml(
    html: string,
    widthPx: number,
    innerWidthMm: number,
    kind: 'header' | 'footer' = 'header'
): Promise<ChromeRaster | null> {
    if (!html?.trim()) return null
    const wrap = document.createElement('div')
    wrap.className = 'pdf-chrome-raster-root'
    wrap.style.position = 'fixed'
    wrap.style.left = '-99999px'
    wrap.style.top = '0'
    wrap.style.width = `${widthPx}px`
    wrap.style.maxWidth = `${widthPx}px`
    wrap.style.background = '#ffffff'
    wrap.style.boxSizing = 'border-box'
    wrap.style.overflow = 'visible'

    const styleEl = document.createElement('style')
    styleEl.textContent = `
      .pdf-chrome-raster-root img,
      .pdf-chrome-raster-root svg {
        display: block !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        vertical-align: top;
      }
      .pdf-chrome-raster-root table { width: 100%; border-collapse: collapse; }
    `
    if (kind === 'header') {
        styleEl.textContent += `
          .pdf-chrome-raster-root img {
            max-height: 96px !important;
            max-width: 220px !important;
          }
        `
    } else {
        styleEl.textContent += `
          .pdf-chrome-raster-root img {
            max-width: 100% !important;
            max-height: none !important;
          }
        `
    }
    wrap.appendChild(styleEl)
    const content = document.createElement('div')
    content.innerHTML = html
    if (kind === 'footer') {
        content.style.paddingBottom = '12px'
        content.style.boxSizing = 'border-box'
    }
    wrap.appendChild(content)

    document.body.appendChild(wrap)

    wrap.querySelectorAll('img').forEach((img) => {
        img.setAttribute('crossOrigin', 'anonymous')
    })

    try {
        await waitForChromeImages(wrap)
        const canvas = await html2canvas(wrap, {
            scale: 1.4,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
        })
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        const heightMm = (canvas.height / canvas.width) * innerWidthMm
        return { dataUrl, heightMm }
    } finally {
        document.body.removeChild(wrap)
    }
}

function stampPdfPageChrome(
    pdf: jsPDF,
    header: ChromeRaster | null,
    footer: ChromeRaster | null,
    margins: { top: number; left: number; bottom: number; right: number },
    offsets?: { headerTopMm?: number; footerBottomMm?: number }
): void {
    if (!header && !footer) return
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const contentW = pageW - margins.left - margins.right
    const n = pdf.getNumberOfPages()
    const topGap = offsets?.headerTopMm ?? 2
    const bottomGap = offsets?.footerBottomMm ?? 5
    for (let i = 1; i <= n; i++) {
        pdf.setPage(i)
        if (header) {
            pdf.addImage(
                header.dataUrl,
                'JPEG',
                margins.left,
                topGap,
                contentW,
                header.heightMm
            )
        }
        if (footer) {
            pdf.addImage(
                footer.dataUrl,
                'JPEG',
                margins.left,
                pageH - footer.heightMm - bottomGap,
                contentW,
                footer.heightMm
            )
        }
    }
}

// ─── Core (private) ────────────────────────────────────────────────────────────

type OutputMode = 'save' | 'blob' | 'datauristring'

interface GeneratePdfOptions {
    element: HTMLElement
    outputMode: OutputMode
    fileName?: string
    options?: Partial<ExportToPdfOptions>
    pageBreakConfig?: PageBreakConfig
    onClose?: () => void
}

/**
 * Central PDF generation engine. All public functions delegate here.
 *
 * Optimisations baked-in:
 * - JPEG at 0.85 quality (sharp text, ~7-12× smaller than PNG)
 * - html2canvas scale 2 (Retina-crisp without bloating the canvas)
 * - jsPDF compress: true (deflate on PDF byte streams)
 * - White background (prevents JPEG transparency artefacts)
 * - Hidden-element stripping via onclone (fewer pixels to encode)
 * - Large image downscaling via onclone (images capped at 800px)
 */
async function generatePdf({
    element,
    outputMode,
    fileName = 'document.pdf',
    options: userOptions,
    pageBreakConfig,
    onClose,
}: GeneratePdfOptions): Promise<string | Blob | void> {
    // 1. CORS — tag every <img> so html2canvas can read cross-origin sources
    element.querySelectorAll('img').forEach((img) => {
        img.setAttribute('crossOrigin', 'anonymous')
    })

    // 2. Inline list markers (html2canvas can't render CSS ::marker)
    const restoreMarkers = inlineListMarkers(element)

    // 3. Page-break styles
    const finalPbc = { ...DEFAULT_PAGE_BREAK_CONFIG, ...pageBreakConfig }
    const restoreStyles = finalPbc.enabled
        ? applyPageBreakStyles(element, finalPbc)
        : null

    try {
        const { pdfPageChrome, ...restUserOptions } = userOptions || {}
        const finalFileName = fileName.endsWith('.pdf')
            ? fileName
            : `${fileName}.pdf`

        const pagebreakMode = finalPbc.enabled
            ? ['css', 'legacy']
            : ['avoid-all']

        const baseMargin = normalizeHtml2PdfMargins(restUserOptions.margin)
        const innerWmm = A4_WIDTH_MM - baseMargin.left - baseMargin.right

        let headerR: ChromeRaster | null = null
        let footerR: ChromeRaster | null = null
        const gapMm = 2

        if (pdfPageChrome?.headerHtml?.trim()) {
            headerR = await rasterizeChromeHtml(
                pdfPageChrome.headerHtml,
                794,
                innerWmm,
                'header'
            )
        }
        if (pdfPageChrome?.footerHtml?.trim()) {
            footerR = await rasterizeChromeHtml(
                pdfPageChrome.footerHtml,
                794,
                innerWmm,
                'footer'
            )
        }

        const headerExtra =
            headerR != null
                ? headerR.heightMm + gapMm
                : pdfPageChrome?.headerHeightMm != null
                ? pdfPageChrome.headerHeightMm + gapMm
                : 0
        const footerExtra =
            footerR != null
                ? footerR.heightMm + gapMm
                : pdfPageChrome?.footerHeightMm != null
                ? pdfPageChrome.footerHeightMm + gapMm
                : 0

        const pdfMarginMm: [number, number, number, number] = pdfPageChrome
            ? [
                  baseMargin.top + headerExtra,
                  baseMargin.left,
                  baseMargin.bottom + footerExtra,
                  baseMargin.right,
              ]
            : [
                  baseMargin.top,
                  baseMargin.left,
                  baseMargin.bottom,
                  baseMargin.right,
              ]

        /** Optional band only when ratio < 1 (not used at 1.0 = full page height) */
        const innerHeightMm = A4_HEIGHT_MM - pdfMarginMm[0] - pdfMarginMm[2]
        if (innerHeightMm > 0 && PDF_PAGE_CONTENT_HEIGHT_RATIO < 1) {
            pdfMarginMm[2] +=
                innerHeightMm * (1 - PDF_PAGE_CONTENT_HEIGHT_RATIO)
        }

        const html2canvasScale = restUserOptions.html2canvas?.scale ?? 1.4
        const sliceHeightPx = computePdfSliceHeightPx(
            pdfMarginMm,
            html2canvasScale
        )

        const stampMargins = {
            top: pdfMarginMm[0],
            left: pdfMarginMm[1],
            bottom: pdfMarginMm[2],
            right: pdfMarginMm[3],
        }

        const userPagebreak = restUserOptions.pagebreak
        const userAvoidRaw = userPagebreak?.avoid
        const userAvoidList: string[] = Array.isArray(userAvoidRaw)
            ? [...userAvoidRaw]
            : userAvoidRaw
            ? [userAvoidRaw]
            : []
        const pagebreakAvoidSelectors = [
            ...new Set([
                ...DEFAULT_PDF_PAGEBREAK_AVOID_SELECTORS,
                ...userAvoidList,
            ]),
        ]

        // Compose onclone: strip hidden elements + downscale images + PDF chrome + forward caller's callback
        const userOnClone = restUserOptions.html2canvas?.onclone
        const onclone = (clonedDoc: Document, el: HTMLElement) => {
            removeHiddenElements(clonedDoc)
            downscaleImages(clonedDoc)
            const clonedElement = clonedDoc.body
                .firstElementChild as HTMLElement

            if (clonedElement) {
                clonedElement.style.width = '794px' // Exact A4 width
                clonedElement.style.maxWidth = '794px'
                clonedElement.style.margin = '0 auto'
                clonedElement.style.boxSizing = 'border-box'
                clonedElement.style.background = '#ffffff'
                clonedElement.setAttribute('data-pdf-clone-root', 'true')
            }

            injectPdfAtomicBreakStyles(clonedDoc)
            injectPdfCloneRootTableStyles(clonedDoc)

            const chrome = pdfPageChrome
            if (chrome) {
                if (chrome.headerHtml?.trim()) {
                    clonedDoc
                        .querySelectorAll('[data-pdf-in-flow-hf="header"]')
                        .forEach((node) => {
                            ;(node as HTMLElement).style.setProperty(
                                'display',
                                'none',
                                'important'
                            )
                        })
                }
                if (chrome.footerHtml?.trim()) {
                    clonedDoc
                        .querySelectorAll('[data-pdf-in-flow-hf="footer"]')
                        .forEach((node) => {
                            ;(node as HTMLElement).style.setProperty(
                                'display',
                                'none',
                                'important'
                            )
                        })
                }

                if (chrome.injectFixedInClone) {
                    const fixedCss = clonedDoc.createElement('style')
                    fixedCss.textContent = `
                      .pdf-export-fixed-header {
                        position: fixed;
                        top: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 794px;
                        max-width: 794px;
                        z-index: 2147483647;
                        background: #ffffff;
                        box-sizing: border-box;
                      }
                      .pdf-export-fixed-footer {
                        position: fixed;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 794px;
                        max-width: 794px;
                        z-index: 2147483647;
                        background: #ffffff;
                        box-sizing: border-box;
                      }
                    `
                    clonedDoc.head.appendChild(fixedCss)
                    if (chrome.headerHtml?.trim()) {
                        const h = clonedDoc.createElement('div')
                        h.className = 'pdf-export-fixed-header'
                        h.innerHTML = chrome.headerHtml
                        clonedDoc.body.appendChild(h)
                    }
                    if (chrome.footerHtml?.trim()) {
                        const f = clonedDoc.createElement('div')
                        f.className = 'pdf-export-fixed-footer'
                        f.innerHTML = chrome.footerHtml
                        clonedDoc.body.appendChild(f)
                    }
                }
            }

            if (sliceHeightPx > 0) {
                adjustTableBodyRowsForPdfSlice(el, sliceHeightPx)
                adjustSignatureStampRowForPdfSlice(el, sliceHeightPx)
            }

            userOnClone?.(clonedDoc, el)
        }

        const pdfOptions: ExportToPdfOptions = {
            margin: pdfMarginMm,
            image: {
                type: 'jpeg',
                quality: 0.7,
                ...restUserOptions.image,
            },
            html2canvas: {
                scale: 1.4,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: '#ffffff',
                ...restUserOptions.html2canvas,
                onclone, // always last — ensures hidden-element stripping runs
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true,
                ...restUserOptions.jsPDF,
            },
            pagebreak: {
                mode: pagebreakMode,
                ...restUserOptions.pagebreak,
                avoid: pagebreakAvoidSelectors,
            },
        }

        const worker = html2pdf().set(pdfOptions).from(element)

        await worker.toPdf()
        const pdf = (await worker.get('pdf')) as jsPDF

        const shouldStamp = Boolean(headerR || footerR)
        if (shouldStamp) {
            stampPdfPageChrome(pdf, headerR, footerR, stampMargins, {
                headerTopMm: pdfPageChrome?.headerTopOffsetMm,
                footerBottomMm: pdfPageChrome?.footerBottomOffsetMm,
            })
        }

        switch (outputMode) {
            case 'save':
                pdf.save(finalFileName)
                onClose?.()
                return
            case 'blob':
                return pdf.output('blob') as Blob
            case 'datauristring':
                return pdf.output('datauristring') as string
        }
    } catch (error) {
        console.error('Error generating PDF:', error)
        throw error
    } finally {
        restoreStyles?.()
        restoreMarkers()
    }
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Exports an HTML element to a PDF file (download) or base64 string.
 *
 * @param pdfRef      - React ref to the target element.
 * @param fileName    - Output filename (default: "document.pdf").
 * @param onClose     - Optional callback executed after export.
 * @param options     - Override default html2pdf / html2canvas / jsPDF options.
 * @param pageBreakConfig - Custom page-break rules.
 * @param download    - When false, returns a base64 data-URI instead of downloading.
 */
export async function exportToPdf(
    pdfRef: React.RefObject<HTMLDivElement>,
    fileName = 'document.pdf',
    onClose?: () => void,
    options?: Partial<ExportToPdfOptions>,
    pageBreakConfig?: PageBreakConfig,
    download = true
): Promise<string | void> {
    if (!pdfRef.current) {
        console.error('Reference to the element is invalid or not found.')
        return
    }

    return generatePdf({
        element: pdfRef.current,
        outputMode: download ? 'save' : 'datauristring',
        fileName,
        options,
        pageBreakConfig,
        onClose,
    }) as Promise<string | void>
}

/**
 * Exports an HTML element to a PDF Blob (no download).
 * Useful for previewing via URL.createObjectURL or uploading to a server.
 */
export async function exportToPdfBlob(
    pdfRef: React.RefObject<HTMLDivElement>,
    options?: Partial<ExportToPdfOptions>,
    pageBreakConfig?: PageBreakConfig
): Promise<Blob> {
    if (!pdfRef.current) {
        console.error('Reference to the element is invalid or not found.')
        throw new Error('Invalid reference to element')
    }

    return generatePdf({
        element: pdfRef.current,
        outputMode: 'blob',
        options,
        pageBreakConfig,
    }) as Promise<Blob>
}

/**
 * Exports an HTML element to a base64 data-URI string.
 * Useful for embedding PDFs or sending them to APIs.
 */
export async function exportToPdfBase64(
    pdfRef: React.RefObject<HTMLDivElement>,
    options?: Partial<ExportToPdfOptions>,
    pageBreakConfig?: PageBreakConfig
): Promise<string> {
    if (!pdfRef.current) {
        console.error('Reference to the element is invalid or not found.')
        throw new Error('Invalid reference to element')
    }

    return generatePdf({
        element: pdfRef.current,
        outputMode: 'datauristring',
        options,
        pageBreakConfig,
    }) as Promise<string>
}
