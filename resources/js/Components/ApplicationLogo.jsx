export default function ApplicationLogo({ className }) {
    return (
        <img 
            src="\assets\logo-uns-1.png" 
            alt="Application Logo" 
            className={`w-16 h-16 ${className}`} // Ubah ukuran sesuai kebutuhan
        />
    );
}
