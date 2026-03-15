"use client";
import LamaFooter from '@/components/Footer/footer';
// import IndicatorDashboard from './gloabal';
import LamaNavbar from '@/components/Navbar/navbar';
import LAMAIndicatorViewer from './lama-indicators';

export default function Page() {
    return (
        <>
            <LamaNavbar />
            <LAMAIndicatorViewer />
            <LamaFooter />
        </>
    );
}