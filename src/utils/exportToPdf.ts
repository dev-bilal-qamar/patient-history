import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Exports an HTML element to a PDF file.
 *
 * @param pdfRef - A React Ref to the HTML element you want to export.
 * @param fileName - The name of the resulting PDF file (default: "exported-content.pdf").
 * @param onClose - An optional callback to execute after the PDF is exported.
 */
export async function exportToPdf(
    pdfRef: React.RefObject<HTMLDivElement>,
    onClose?: () => void
): Promise<void> {
    const fileName = 'exported-content.pdf'
    if (!pdfRef.current) {
        console.error('Reference to the element is invalid or not found.')
        return
    }

    try {
        // Enable CORS for all images inside the target element
        const images = pdfRef.current.querySelectorAll('img')
        images.forEach((img) => {
            img.setAttribute('crossOrigin', 'anonymous')
        })

        // Clone the element to avoid layout shifts and position it off-screen
        const clonedElement = pdfRef.current.cloneNode(true) as HTMLElement
        clonedElement.style.position = 'absolute'
        clonedElement.style.top = '-9999px'
        document.body.appendChild(clonedElement)

        // Render the cloned element into a high-resolution canvas
        const canvas = await html2canvas(clonedElement, {
            useCORS: true,
            allowTaint: true,
            scale: 1.5, // Increase scale for better resolution
        })
        document.body.removeChild(clonedElement)

        // Get the image data from the canvas
        const imageData = canvas.toDataURL('image/png')

        // Create a jsPDF instance for an A4 page (portrait)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
        })

        // Define margins (in pixels)
        const margin = 20
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const usableWidth = pdfWidth - margin * 2
        const usableHeight = pdfHeight - margin * 2

        // Calculate the scale factor to fit the entire canvas inside the usable area
        // This preserves the aspect ratio while ensuring the content fits on one page.
        const scaleFactor = Math.min(
            usableWidth / canvas.width,
            usableHeight / canvas.height
        )
        const renderedWidth = canvas.width * scaleFactor
        const renderedHeight = canvas.height * scaleFactor

        // Optionally, center the image within the usable area:
        const offsetX = margin + (usableWidth - renderedWidth) / 2
        const offsetY = margin + (usableHeight - renderedHeight) / 2

        // Add the image to the PDF using the calculated dimensions and offsets
        pdf.addImage(
            imageData,
            'PNG',
            offsetX,
            offsetY,
            renderedWidth,
            renderedHeight
        )

        // Save the PDF file with the provided file name
        pdf.save(fileName)

        // Execute the optional callback
        onClose?.()
    } catch (error) {
        console.error('Error generating PDF:', error)
    }
}
