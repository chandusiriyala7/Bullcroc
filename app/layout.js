import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata = {
    title: 'Bullcroc - Premium Customized Signage',
    description: 'Create custom name plates, metal letters, and neon light signs with premium quality and expert craftsmanship.',
    keywords: ['custom signage', 'name plates', 'metal letters', 'neon signs', 'customization'],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen antialiased">
                <ToastProvider>
                    <AuthProvider>
                        <CartProvider>
                            <Header />
                            {children}
                            <Footer />
                        </CartProvider>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
