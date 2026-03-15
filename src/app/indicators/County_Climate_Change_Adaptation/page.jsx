"use client";
import LamaFooter from '@/components/Footer/footer';
import LamaNavbar from '@/components/Navbar/navbar';
import CountyDataViewer from './county_climate_change_adaptation';

export default function Page() {
    return (
        <>
            <LamaNavbar />
            <CountyDataViewer />
            <LamaFooter />
        </>
    );
}