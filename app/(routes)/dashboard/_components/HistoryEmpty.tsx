import React from 'react'

// Digital Stethoscope Icon Component
interface DigitalStethoscopeProps {
    width?: number
    height?: number
    className?: string
    animated?: boolean
}

const DigitalStethoscope: React.FC<DigitalStethoscopeProps> = ({
    width = 200,
    height = 200,
    className = '',
    animated = true
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 200 200"
            className={`medical-icon ${animated ? 'floating' : ''} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#48bb78', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#38a169', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Outer glow circle */}
            <circle cx="100" cy="100" r="90" fill="url(#grad1)" opacity="0.1" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />

            {/* Outer rings with animation */}
            {animated && (
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#grad1)"
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="5,5"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 100 100"
                        to="360 100 100"
                        dur="30s"
                        repeatCount="indefinite"
                    />
                </circle>
            )}

            {/* Stethoscope */}
            <g transform="translate(100, 100)">
                {/* Tube */}
                <path
                    d="M -30 -40 Q -30 -10, 0 10 Q 30 -10, 30 -40"
                    fill="none"
                    stroke="url(#grad1)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Earpieces */}
                <circle cx="-30" cy="-45" r="8" fill="url(#grad1)" />
                <circle cx="30" cy="-45" r="8" fill="url(#grad1)" />

                {/* Chest piece */}
                <circle cx="0" cy="25" r="20" fill="url(#grad1)" />
                <circle cx="0" cy="25" r="15" fill="white" opacity="0.9" />

                {/* Digital pulse inside chest piece */}
                <path
                    d="M -10 25 L -5 25 L -3 20 L 0 30 L 3 20 L 5 25 L 10 25"
                    fill="none"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>

            {/* Digital elements */}
            <g opacity="0.6">
                <circle cx="50" cy="50" r="3" fill="url(#grad2)" />
                <circle cx="150" cy="50" r="3" fill="url(#grad2)" />
                <circle cx="50" cy="150" r="3" fill="url(#grad2)" />
                <circle cx="150" cy="150" r="3" fill="url(#grad2)" />

                <line x1="50" y1="50" x2="70" y2="70" stroke="url(#grad2)" strokeWidth="1" opacity="0.5" />
                <line x1="150" y1="50" x2="130" y2="70" stroke="url(#grad2)" strokeWidth="1" opacity="0.5" />
                <line x1="50" y1="150" x2="70" y2="130" stroke="url(#grad2)" strokeWidth="1" opacity="0.5" />
                <line x1="150" y1="150" x2="130" y2="130" stroke="url(#grad2)" strokeWidth="1" opacity="0.5" />
            </g>
        </svg>
    )
}

// Main Component
function HistoryEmpty() {
    const handleDownloadSVG = () => {
        const svg = document.querySelector('.digital-stethoscope-icon svg')
        if (!svg) return

        const svgClone = svg.cloneNode(true) as SVGElement
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

        // Remove animations for static download
        const animations = svgClone.querySelectorAll('animate, animateTransform')
        animations.forEach(anim => anim.remove())

        const svgString = new XMLSerializer().serializeToString(svgClone)
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'digital-stethoscope.svg'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleDownloadPNG = (size: number = 512) => {
        const svg = document.querySelector('.digital-stethoscope-icon svg')
        if (!svg) return

        const svgClone = svg.cloneNode(true) as SVGElement
        svgClone.setAttribute('width', size.toString())
        svgClone.setAttribute('height', size.toString())
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

        // Remove animations
        const animations = svgClone.querySelectorAll('animate, animateTransform')
        animations.forEach(anim => anim.remove())

        const svgString = new XMLSerializer().serializeToString(svgClone)
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)

        const img = new Image()
        img.onload = function () {
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // White background
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, size, size)

            ctx.drawImage(img, 0, 0, size, size)

            canvas.toBlob(function (blob) {
                if (!blob) return
                const pngUrl = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = pngUrl
                a.download = `digital-stethoscope-${size}x${size}.png`
                a.click()
                URL.revokeObjectURL(pngUrl)
                URL.revokeObjectURL(url)
            }, 'image/png')
        }
        img.src = url
    }

    const handleCopySVG = async () => {
        const svg = document.querySelector('.digital-stethoscope-icon svg')
        if (!svg) return

        const svgClone = svg.cloneNode(true) as SVGElement
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        const svgString = new XMLSerializer().serializeToString(svgClone)

        try {
            await navigator.clipboard.writeText(svgString)
            alert('SVG code copied to clipboard!')
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        //     <div className="history-empty-container">
        //         <style jsx>{`
        //     .history-empty-container {
        //       display: flex;
        //       flex-direction: column;
        //       align-items: center;
        //       justify-content: center;
        //       min-height: 100vh;
        //       background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        //       padding: 40px 20px;
        //     }

        //     .icon-card {
        //       background: rgba(255, 255, 255, 0.95);
        //       border-radius: 24px;
        //       padding: 40px;
        //       box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        //       max-width: 500px;
        //       width: 100%;
        //       backdrop-filter: blur(10px);
        //       border: 1px solid rgba(255, 255, 255, 0.5);
        //     }

        //     .icon-showcase {
        //       display: flex;
        //       justify-content: center;
        //       align-items: center;
        //       min-height: 300px;
        //       margin-bottom: 30px;
        //       background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
        //       border-radius: 16px;
        //       position: relative;
        //       overflow: hidden;
        //     }

        //     .icon-name {
        //       font-size: 24px;
        //       font-weight: 600;
        //       color: #1e293b;
        //       margin-bottom: 12px;
        //       text-align: center;
        //     }

        //     .icon-description {
        //       font-size: 16px;
        //       color: #64748b;
        //       line-height: 1.6;
        //       text-align: center;
        //       margin-bottom: 24px;
        //     }

        //     .icon-actions {
        //       display: flex;
        //       gap: 12px;
        //       justify-content: center;
        //       flex-wrap: wrap;
        //     }

        //     .btn {
        //       padding: 12px 24px;
        //       border: none;
        //       border-radius: 12px;
        //       font-size: 14px;
        //       font-weight: 600;
        //       cursor: pointer;
        //       transition: all 0.3s ease;
        //       display: inline-flex;
        //       align-items: center;
        //       gap: 8px;
        //       color: white;
        //     }

        //     .btn-primary {
        //       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        //     }

        //     .btn-secondary {
        //       background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        //     }

        //     .btn-tertiary {
        //       background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
        //     }

        //     .btn:hover {
        //       transform: translateY(-2px);
        //       box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        //     }

        //     @keyframes float {
        //       0%, 100% {
        //         transform: translateY(0px);
        //       }
        //       50% {
        //         transform: translateY(-10px);
        //       }
        //     }

        //     .medical-icon.floating {
        //       animation: float 3s ease-in-out infinite;
        //     }

        //     .medical-icon {
        //       filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        //       transition: transform 0.3s ease;
        //     }
        //   `}</style>

        <DigitalStethoscope width={200} height={200} animated={true} />
        // </div>
    )
}

export default HistoryEmpty