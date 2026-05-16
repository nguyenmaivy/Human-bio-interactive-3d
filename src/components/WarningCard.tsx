/**
 * WarningCard.tsx - Display health warning about drug effects
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function WarningCard() {
    return (
        <div className="p-4 bg-red-900/30 border-2 border-red-600/50 rounded-lg">
            <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-red-200 mb-1">⚠️ Lưu ý sức khỏe</h4>
                    <p className="text-xs text-red-100 leading-relaxed">
                        Ứng dụng này mô phỏng tác động của chất kích thích dựa trên nghiên cứu y học từ NIH, WHO, CDC,
                        và PubMed. <strong>Không phải là lời khuyên y tế.</strong> Nếu bạn hoặc người thân có vấn đề
                        sử dụng chất, liên hệ với chuyên gia y tế hoặc gọi đường dây nóng tại quốc gia của bạn.
                    </p>
                </div>
            </div>
        </div>
    );
}
