import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

type HeaderFooter =
    | string
    | ((pageNumber: number, pageCount: number) => string | undefined)

interface ExportOptions {
    onClose?: () => void
    download?: boolean // default: true
    fileName?: string // default: 'exported-content.pdf'
    marginLeft?: number // px in PDF units; default: 20
    marginTop?: number // px in PDF units; default: 20
    marginBottom?: number // px in PDF units; default: 20
    marginRight?: number // px in PDF units; default: 28
    header?: HeaderFooter // optional header text or function
    footer?: HeaderFooter // optional footer text or function
    brandColor?: string // header rule color, default #2563eb
    scale?: number // html2canvas scale, default 2 for crisp text
}

/**
 * Multi-page PDF export without zoom-out:
 * - Slices a high-res canvas into page-height tiles
 * - Adds headers/footers + page numbers
 * - Keeps margins for clean UI/UX
 */
export async function exportToPdf(
    pdfRef: React.RefObject<HTMLDivElement>,
    name: string,
    onClose?: () => void, // kept for backward compatibility
    download = true // kept for backward compatibility
): Promise<string> {
    // Map legacy params into new options
    const opts: ExportOptions = { onClose, download, fileName: `${name}.pdf` }

    return exportToPdfMultipage(pdfRef, opts)
}

export async function exportToPdfMultipage(
    pdfRef: React.RefObject<HTMLElement>,
    {
        onClose,
        download = true,
        fileName,
        marginLeft = 20, // left margin 20px
        marginTop = 20, // top margin 20px
        marginBottom = 20, // bottom margin 20px
        marginRight = 20, // right margin 20px
        header,
        footer,
        brandColor = '#2563eb',
        scale = 1.8,
    }: ExportOptions = {}
): Promise<string> {
    // Wait up to ~2s for ref
    let tries = 0
    while (!pdfRef.current && tries < 20) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 100))
        tries++
    }
    if (!pdfRef.current) {
        console.error('Reference to the element is invalid or not found.')
        return ''
    }

    // Give layout a beat to settle
    await new Promise((r) => setTimeout(r, 300))

    const el = pdfRef.current

    // Make remote images CORS-friendly
    el.querySelectorAll('img').forEach((img) => {
        img.setAttribute('crossOrigin', 'anonymous')
    })

    // Clone off-screen to avoid layout shifts / sticky elements issues
    const cloned = el.cloneNode(true) as HTMLElement
    cloned.style.position = 'absolute'
    cloned.style.top = '-100000px'
    cloned.style.left = '0'
    cloned.style.width = `${el.clientWidth}px` // lock width
    document.body.appendChild(cloned)

    try {
        // High-res render
        const canvas = await html2canvas(cloned, {
            scale,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            backgroundColor: '#ffffff',
            // Optional tweaks:
            // windowWidth: el.scrollWidth,
            // windowHeight: el.scrollHeight,
        })

        document.body.removeChild(cloned)

        // Init PDF (A4 portrait, px units)
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
            compress: true,
        })

        const pdfW = pdf.internal.pageSize.getWidth()
        const pdfH = pdf.internal.pageSize.getHeight()
        const usableW = Math.max(0, pdfW - marginLeft - marginRight)
        const usableH = Math.max(0, pdfH - marginTop - marginBottom)

        // Scale the DOM canvas to fit PDF width; compute how much canvas-height fits per page
        const scaleFactor = usableW / canvas.width // how much we shrink the canvas to fit width
        const pageCanvasHeight = Math.floor(usableH / scaleFactor) // canvas px that fit vertically per page

        // Prepare a slicer canvas
        const slice = document.createElement('canvas')
        const sctx = slice.getContext('2d')
        if (!sctx) {
            console.error('Failed to get 2D context for slice canvas.')
            return ''
        }
        slice.width = canvas.width
        slice.height = pageCanvasHeight

        // Helper to draw header/footer
        const drawHeaderFooter = (pageNum: number, pageCount: number) => {
            // Header line + text
            if (header) {
                const text =
                    typeof header === 'function'
                        ? header(pageNum, pageCount)
                        : header
                if (text) {
                    pdf.setFontSize(10)
                    pdf.setTextColor('#111827')
                    pdf.text(text, marginLeft, marginTop - 8, {
                        baseline: 'bottom',
                    })
                }
            }
            /* The `pdf` object in the code is an instance of the `jsPDF` class from the `jspdf`
            library. It is used for creating and manipulating PDF documents in the browser. The
            `pdf` object is initialized with specific configuration options such as orientation,
            unit, format, and compression settings to define the properties of the PDF document
            being generated. */
            pdf.setDrawColor(brandColor)
            // pdf.setLineWidth(1)
            // pdf.line(marginLeft, marginTop - 6, pdfW - marginRight, marginTop - 6)

            // Footer line + page X of Y + custom footer
            pdf.setDrawColor('#e5e7eb')
            // pdf.setLineWidth(1)
            // pdf.line(
            //     marginLeft,
            //     pdfH - marginBottom + 6,
            //     pdfW - marginRight,
            //     pdfH - marginBottom + 6
            // )

            const pageStr = `Page ${pageNum} of ${pageCount}`
            pdf.setFontSize(9)
            pdf.setTextColor('#6b7280')
            pdf.text(pageStr, pdfW - marginRight, pdfH - marginBottom + 18, {
                align: 'right',
                baseline: 'top',
            })

            if (footer) {
                const f =
                    typeof footer === 'function'
                        ? footer(pageNum, pageCount)
                        : footer
                if (f) {
                    pdf.text(f, marginLeft, pdfH - marginBottom + 18, {
                        baseline: 'top',
                    })
                }
            }
        }

        // Figure out page count upfront
        const totalPages = Math.ceil(canvas.height / pageCanvasHeight)

        // Loop through tiles
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            if (pageIndex > 0) pdf.addPage()

            const sy = pageIndex * pageCanvasHeight
            const sh = Math.min(pageCanvasHeight, canvas.height - sy)

            // Resize slice canvas height if last chunk is shorter
            if (slice.height !== sh) {
                slice.height = sh
            }

            // Draw the portion from original canvas into slice
            sctx.clearRect(0, 0, slice.width, slice.height)
            sctx.drawImage(
                canvas,
                0, // sx
                sy, // sy
                slice.width, // sw
                sh, // sh
                0, // dx
                0, // dy
                slice.width, // dw
                sh // dh
            )

            const imgData = slice.toDataURL('image/png')

            const renderW = usableW // scaled to fit width
            const renderH = sh * scaleFactor

            // Add header/footer first (so image doesn't overlap text)
            drawHeaderFooter(pageIndex + 1, totalPages)

            // Draw the page image within margins
            pdf.addImage(
                imgData,
                'PNG',
                marginLeft,
                marginTop,
                renderW,
                renderH,
                undefined,
                'FAST'
            )
        }

        // Output
        const dataUri = pdf.output('datauristring')
        if (download) {
            pdf.save(fileName)
            onClose?.()
        }
        return dataUri
    } catch (err) {
        // Clean up clone if still present
        try {
            if (document.body.contains(cloned))
                document.body.removeChild(cloned)
        } catch {
            console.error('Error generating PDF:', err)
        }
        console.error('Error generating PDF:', err)
        return ''
    }
}
