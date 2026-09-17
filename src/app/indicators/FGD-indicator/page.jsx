"use client";
import LamaFooter from '@/components/Footer/footer';
import LamaNavbar from '@/components/Navbar/navbar';
import FGDIndicatorViewer from './fgd-indicators';

export default function Page() {
    return (
        <>
            <LamaNavbar />
            <FGDIndicatorViewer />
            <LamaFooter />
        </>
    );
}
