"use client";
import LamaFooter from '@/components/Footer/footer';
import LamaNavbar from '@/components/Navbar/navbar';
import NDCDataViewer from './national_ndc';

export default function Page() {
    return (
        <>
            <LamaNavbar />
            <NDCDataViewer />
            <LamaFooter />
        </>
    );
}