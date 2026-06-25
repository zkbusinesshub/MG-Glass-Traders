import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, Shield, CheckCircle, ArrowRight, Loader2, X } from 'lucide-react';
import { Order } from '../types';

interface RazorpayModalProps {
  order: Order;
  onSuccess: (paymentMethod: 'card' | 'upi' | 'razorpay') => void;
  onClose: () => void;
}

export default function RazorpayModal({ order, onSuccess, onClose }: RazorpayModalProps) {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('upi');
  const [cardNo, setCardNo] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(5);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
  };

  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'success') {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onSuccess(payMethod === 'card' ? 'card' : 'upi');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, payMethod, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-slate-900 border border-slate-800 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 px-2 py-1 rounded text-xs font-bold tracking-widest text-white">
              RAZORPAY
            </div>
            <span className="text-sm font-semibold text-slate-400">Secure Checkout</span>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {step === 'checkout' && (
          <div className="p-6">
            {/* Amount Banner */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Paying MG Glass Traders</p>
                <p className="text-sm font-semibold text-slate-200 mt-1">Invoice: {order.invoiceNumber}</p>
              </div>
              <p className="text-2xl font-bold text-blue-500">₹{order.totalAmount.toLocaleString('en-IN')}</p>
            </div>

            {/* Methods Select */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPayMethod('upi')}
                className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg border text-sm font-semibold transition ${
                  payMethod === 'upi'
                    ? 'border-blue-500 bg-blue-600/10 text-blue-400'
                    : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="h-5 w-5 mb-1.5" />
                BHIM UPI / QR Code
              </button>
              <button
                type="button"
                onClick={() => setPayMethod('card')}
                className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg border text-sm font-semibold transition ${
                  payMethod === 'card'
                    ? 'border-blue-500 bg-blue-600/10 text-blue-400'
                    : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="h-5 w-5 mb-1.5" />
                Credit & Debit Cards
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {payMethod === 'upi' ? (
                <div className="space-y-4">
                  {/* Mock UPI QR Section */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="bg-white p-3 rounded-lg mb-2">
                      {/* Representing a mock QR */}
                      <svg className="h-32 w-32 text-slate-900" viewBox="0 0 100 100">
                        <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                        <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                        <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                        <rect x="18" y="18" width="4" height="4" fill="white" />
                        <rect x="78" y="18" width="4" height="4" fill="white" />
                        <rect x="18" y="78" width="4" height="4" fill="white" />
                        <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                        <rect x="48" y="48" width="4" height="4" fill="white" />
                        <rect x="35" y="15" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="15" width="8" height="8" fill="currentColor" />
                        <rect x="15" y="45" width="8" height="8" fill="currentColor" />
                        <rect x="75" y="45" width="8" height="8" fill="currentColor" />
                        <rect x="45" y="75" width="8" height="8" fill="currentColor" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400">Scan this code using any UPI app to pay</p>
                    <div className="w-full flex items-center justify-center my-2 text-xs text-slate-500">
                      <span>— OR ENTER UPI ID —</span>
                    </div>
                    <input
                      type="text"
                      required={payMethod === 'upi'}
                      placeholder="e.g. usman@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      required={payMethod === 'card'}
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        required={payMethod === 'card'}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        required={payMethod === 'card'}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. MOHAMMED USMAN PATHAN"
                      required={payMethod === 'card'}
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center space-x-2 rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition"
              >
                <span>Authorize & Pay ₹{order.totalAmount.toLocaleString('en-IN')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>PCI-DSS Certified 256-bit Secure Bank Encryption Connection</span>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-100">Contacting Bank Gateway...</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">
              Please do not refresh this page, close this modal, or click back. We are authenticating your transaction.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-100">Payment Succeeded!</h3>
            <p className="text-sm text-emerald-400 mt-1 font-semibold">₹{order.totalAmount.toLocaleString('en-IN')} Collected</p>
            <div className="my-6 p-4 rounded bg-slate-800 text-left text-xs text-slate-300 space-y-2 w-full max-w-xs">
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-mono text-slate-400">TXN_MGG_{Math.floor(Math.random() * 900000 + 100000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Method Used:</span>
                <span className="capitalize">{payMethod === 'card' ? 'Credit Card' : 'UPI Scan'}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Registered:</span>
                <span>MG Glass Traders</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Returning to Admin Portal in <span className="text-blue-500 font-bold">{secondsLeft}s</span>...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
