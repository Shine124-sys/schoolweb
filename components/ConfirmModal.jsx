'use client';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ConfirmModal({ title, message, onConfirm, onClose, danger = true }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
                        <ExclamationTriangleIcon className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-amber-600'}`} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 justify-center font-medium px-4 py-2 rounded-lg text-sm transition-all ${danger ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
