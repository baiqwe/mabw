'use client';

import { type ReactNode } from 'react';
import HomeInteractive from './HomeInteractive';

interface HomeClientWrapperProps {
    staticContent: ReactNode;
    user: any; // Pass user to interactive component
}

export default function HomeClientWrapper({ staticContent, user }: HomeClientWrapperProps) {
    return (
        <div className="min-h-screen bg-background">
            <HomeInteractive user={user} />
            {staticContent}
        </div>
    );
}
