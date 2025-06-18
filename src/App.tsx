import React, { useRef, useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [width, setWidth] = useState<number>(2);
  const [height, setHeight] = useState<number>(30);
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = barcodeRef.current;
    const isValidValue = value.length === 12;
    const isValidSize = width > 0 && height > 0;

    if (svg && isValidValue && isValidSize) {
      try {
        JsBarcode(svg, value, {
          format: 'upc',
          lineColor: '#000',
          width,
          height,
          displayValue: true,
        });
      } catch (err) {
        console.error('Error generating barcode:', err);
        svg.innerHTML = '';
      }
    } else if (svg) {
      svg.innerHTML = '';
    }
  }, [value, width, height]);

  const downloadSVG = () => {
    if (!barcodeRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(barcodeRef.current);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${value}_barcode.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f8',
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h1 style={{ marginBottom: '1rem' }}>UPC Barcode Generator</h1>

        <input
          type="text"
          maxLength={12}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 12-digit UPC code"
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            width: '80%',
            maxWidth: '300px',
            marginBottom: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <label>
            Width:
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 1)}
              min={1}
              style={{ marginLeft: '0.5rem', width: '60px' }}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 20)}
              min={20}
              style={{ marginLeft: '0.5rem', width: '60px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <svg ref={barcodeRef}></svg>
        </div>

        {value.length === 12 && (
          <button
            onClick={downloadSVG}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Download SVG
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
