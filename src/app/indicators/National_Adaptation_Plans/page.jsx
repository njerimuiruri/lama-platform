"use client";
import LamaFooter from '@/components/Footer/footer';
import LamaNavbar from '@/components/Navbar/navbar';
import NAPDataViewer from './National_Adaptation_Plans';

export default function Page() {
    return (
        <>
            <LamaNavbar />
            <NAPDataViewer />
            <LamaFooter />
        </>
    );
}