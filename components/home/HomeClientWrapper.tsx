'use client';

import { useState, type ReactNode } from 'react';
import HomeInteractive from './HomeInteractive';

interface HomeClientWrapperProps {
    staticContent: ReactNode;
    user: any; // Pass user to interactive component
}

export default function HomeClientWrapper({ staticContent, user }: HomeClientWrapperProps) {
    const [showStaticContent, setShowStaticContent] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero + Interactive Upload Section */}
            <HomeInteractive onShowStaticContent={setShowStaticContent} user={user} />

            {/* Static Content - only shown when no image is uploaded */}
            {showStaticContent && staticContent}
        </div>
    );
}
