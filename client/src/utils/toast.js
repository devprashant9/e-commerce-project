import { toast } from 'react-hot-toast';

export const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast(message),
    warning: (message) => toast(message, {
        icon: '⚠️',
    }),
}; 