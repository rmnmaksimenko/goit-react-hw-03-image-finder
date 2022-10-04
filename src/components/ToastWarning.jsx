import { toast } from 'react-toastify';
export default function ToastWarning(message) {
    return toast.warn(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
}