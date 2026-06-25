import React, { useRef } from 'react';
import { X, Printer, Download, Share2 } from 'lucide-react';
import { Order, Quotation, Product } from '../types';

interface PDFViewerModalProps {
  type: 'invoice' | 'quotation' | 'catalog';
  data: {
    order?: Order;
    quotation?: Quotation;
    products?: Product[];
    category?: string;
  };
  onClose: () => void;
}

export default function PDFViewerModal({ type, data, onClose }: PDFViewerModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Simple print simulation or actual window.print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Document - MG Glass Traders</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                body { font-family: sans-serif; background: white; color: black; padding: 20px; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div>${printContent}</div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-xl bg-slate-900 border border-slate-800 text-white shadow-2xl flex flex-col my-8 max-h-[90vh]">
        
        {/* Action Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 shrink-0 bg-slate-950 rounded-t-xl">
          <span className="text-sm font-semibold tracking-wider text-blue-400 capitalize">
            Document Center: PDF {type} Preview
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition active:scale-95"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Frame Area */}
        <div className="overflow-y-auto p-8 bg-slate-800/20 flex justify-center">
          
          <div 
            ref={printRef}
            className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-12 shadow-xl rounded-lg border border-slate-200"
            style={{ minHeight: '297mm', color: '#1e293b' }}
          >
            {/* INVOICE TYPE */}
            {type === 'invoice' && data.order && (
              <div className="text-sm">
                {/* PDF Header Logo */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">MG GLASS TRADERS</h1>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-0.5">Your Trusted Automotive Glass Solution</p>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                      Door No. 12-2-45/A, Mallapally Road, Nampally, Hyderabad, TS - 500001<br />
                      GSTIN: 36AAMFM4855D1ZX | Tel: +91 98765 43210
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-4 py-1.5 rounded">TAX INVOICE</h2>
                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                      <p><span className="font-semibold text-slate-700">Invoice No:</span> {data.order.invoiceNumber}</p>
                      <p><span className="font-semibold text-slate-700">Date:</span> {new Date(data.order.orderDate).toLocaleDateString('en-IN')}</p>
                      <p><span className="font-semibold text-slate-700">Payment Status:</span> <span className="text-emerald-600 font-bold uppercase">{data.order.paymentStatus}</span></p>
                      <p><span className="font-semibold text-slate-700">Payment Mode:</span> <span className="uppercase">{data.order.paymentMethod}</span></p>
                    </div>
                  </div>
                </div>

                {/* Billed To / Vehicle Details */}
                <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">BILLED TO:</h3>
                    <p className="font-bold text-slate-800 text-base">{data.order.customerName}</p>
                    <p className="text-slate-500 mt-1">Phone: {data.order.phone}</p>
                    <p className="text-slate-500">Address: Hyderabad, Telangana, India</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">VEHICLE DETAILS:</h3>
                    <p className="font-bold text-slate-800">{data.order.vehicleBrand} {data.order.vehicleModel}</p>
                    <p className="text-slate-500 mt-1">Model Year: {data.order.vehicleYear}</p>
                    <p className="text-slate-500">Service Type: Automotive Glass Fitment</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="py-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-b border-slate-300">
                        <th className="py-3 px-4">Item & Specification</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Unit Price</th>
                        <th className="py-3 px-4 text-right">GST (18%)</th>
                        <th className="py-3 px-4 text-right">Total (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {data.order.items.map((item, idx) => {
                        const preTax = item.price / 1.18;
                        const gstAmount = item.price - preTax;
                        return (
                          <tr key={idx} className="text-slate-700">
                            <td className="py-4 px-4">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">Automotive Safety Glass, Leak Proof Sealant Applied</p>
                            </td>
                            <td className="py-4 px-4 text-center font-semibold">{item.quantity}</td>
                            <td className="py-4 px-4 text-right font-mono">₹{preTax.toFixed(2)}</td>
                            <td className="py-4 px-4 text-right font-mono">₹{gstAmount.toFixed(2)}</td>
                            <td className="py-4 px-4 text-right font-bold font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals Breakdown */}
                <div className="grid grid-cols-2 gap-4 py-6 border-t border-slate-200">
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <p className="font-bold text-slate-700 mb-2">Terms & Conditions:</p>
                    <p>1. Warranty covers leakage and sealant displacement only.</p>
                    <p>2. Warranty does not cover physical stone cracks or accidental impact.</p>
                    <p>3. Do not wash the vehicle for 48 hours after glass installation.</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Subtotal (Pre-Tax):</span>
                      <span className="font-mono">₹{(data.order.totalAmount - data.order.taxAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">CGST (9.0%):</span>
                      <span className="font-mono">₹{(data.order.taxAmount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">SGST (9.0%):</span>
                      <span className="font-mono">₹{(data.order.taxAmount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-bold text-slate-900">
                      <span>Grand Total:</span>
                      <span className="font-mono text-blue-600">₹{data.order.totalAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-16 flex justify-between items-end">
                  <div className="text-center text-xs text-slate-400">
                    <p className="border-t border-slate-300 pt-2 w-32">Customer Signature</p>
                  </div>
                  <div className="text-center text-xs text-slate-700">
                    <p className="italic text-slate-400 mb-1">M.U. Pathan</p>
                    <p className="font-bold text-blue-600">For MG GLASS TRADERS</p>
                    <p className="border-t border-slate-300 pt-2 mt-1 w-48 mx-auto font-semibold">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            )}

            {/* QUOTATION TYPE */}
            {type === 'quotation' && data.quotation && (
              <div className="text-sm">
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">MG GLASS TRADERS</h1>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-0.5">Automotive Glass, Side Mirrors & Sunroof Experts</p>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs">
                      Mallapally Road, Nampally, Hyderabad, Telangana - 500001<br />
                      Email: info@mgglasstraders.com | Tel: +91 98765 43210
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider bg-blue-50 text-blue-700 px-4 py-1.5 rounded">PRICE QUOTATION</h2>
                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                      <p><span className="font-semibold text-slate-700">Quotation No:</span> {data.quotation.id}</p>
                      <p><span className="font-semibold text-slate-700">Date:</span> {new Date(data.quotation.date).toLocaleDateString('en-IN')}</p>
                      <p><span className="font-semibold text-slate-700">Validity:</span> 15 Days from Issue</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">QUOTED TO:</h3>
                    <p className="font-bold text-slate-800 text-base">{data.quotation.customerName}</p>
                    <p className="text-slate-500 mt-1">Phone: {data.quotation.phone}</p>
                    <p className="text-slate-500">WhatsApp: {data.quotation.whatsapp}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">VEHICLE INQUIRY:</h3>
                    <p className="font-bold text-slate-800">{data.quotation.vehicleBrand} {data.quotation.vehicleModel}</p>
                    <p className="text-slate-500 mt-1">Year: {data.quotation.vehicleYear}</p>
                    <p className="text-slate-500">Glass Requested: {data.quotation.requiredGlassType}</p>
                  </div>
                </div>

                <div className="py-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                        <th className="py-3 px-4">Required Service / Glass Product</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Estimated Unit Price</th>
                        <th className="py-3 px-4 text-right">Est. Total Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {data.quotation.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4 px-4">
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Includes high-grade adhesive, labor charges & standard warranty.</p>
                          </td>
                          <td className="py-4 px-4 text-center font-semibold">{item.quantity}</td>
                          <td className="py-4 px-4 text-right font-mono">₹{item.price.toLocaleString('en-IN')}.00</td>
                          <td className="py-4 px-4 text-right font-bold font-mono">₹{(item.price * item.quantity).toLocaleString('en-IN')}.00</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-t border-slate-200">
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <p className="font-bold text-slate-700 mb-1">Inclusions & Warranty Terms:</p>
                    <p>• Prices include standard fitment and polyurethane glue sealing.</p>
                    <p>• Complete 1-Year leak-proof warranty included.</p>
                    <p>• Doorstep home installation is free within a 10km radius.</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-bold text-slate-900">
                      <span>Estimated Total:</span>
                      <span className="font-mono text-blue-600">₹{data.quotation.totalAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium italic mt-1">*All estimates are inclusive of GST.</p>
                  </div>
                </div>

                <div className="mt-20 flex justify-between items-end">
                  <div className="text-xs text-slate-400">
                    <p>Looking forward to serving you.</p>
                    <p className="mt-1">Generated digitally on {todayStr}</p>
                  </div>
                  <div className="text-center text-xs text-slate-700">
                    <p className="font-bold text-blue-600">MG GLASS TRADERS</p>
                    <p className="border-t border-slate-300 pt-2 mt-1 w-48 font-semibold">Sales Representative Desk</p>
                  </div>
                </div>
              </div>
            )}

            {/* CATALOG TYPE */}
            {type === 'catalog' && data.products && (
              <div className="text-sm">
                <div className="text-center border-b border-slate-200 pb-6 mb-6">
                  <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">MG GLASS TRADERS</h1>
                  <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-0.5">Official Automotive Glass & Windshield Catalog</p>
                  <p className="text-xs text-slate-400 mt-1">Filter: {data.category || 'All Products'} | Generated: {todayStr}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {data.products.map((p, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4 flex space-x-3 text-xs">
                      <div className="h-16 w-16 bg-slate-100 rounded shrink-0 overflow-hidden flex items-center justify-center">
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-blue-600 font-semibold">{p.brand} {p.model} ({p.year})</p>
                        <p className="text-slate-500">SKU: <span className="font-mono">{p.sku}</span></p>
                        <p className="text-slate-400 line-clamp-1">{p.description}</p>
                        <div className="flex items-baseline space-x-2 pt-1">
                          <span className="font-bold text-slate-900 text-sm">₹{p.discountPrice || p.price}</span>
                          {p.discountPrice && (
                            <span className="text-slate-400 line-through">₹{p.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
                  <p className="font-bold">MG Glass Traders • Hyderabad Main • Gachibowli Branch</p>
                  <p className="mt-1">Call +91 98765 43210 or email info@mgglasstraders.com for immediate glass fittings.</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
