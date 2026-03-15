"use client";
import LamaFooter from '@/components/Footer/footer';
import IndicatorDashboard from './gloabal';
import LamaNavbar from '@/components/Navbar/navbar';

export default function Page() {
    return (
        <>
            <LamaNavbar />
            <IndicatorDashboard />
            <LamaFooter />
        </>
    );
}