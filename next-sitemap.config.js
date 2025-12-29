/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://makebw.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/api/*', '/_next/*', '/server-sitemap.xml'],

    // Generate alternate language links
    alternateRefs: [
        {
            href: 'https://makebw.com/en',
            hreflang: 'en',
        },
        {
            href: 'https://makebw.com/zh',
            hreflang: 'zh',
        },
    ],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
    },

    transform: async (config, path) => {
        // Add priority and changefreq based on page type
        let priority = 0.7;
        let changefreq = 'weekly';

        if (path === '/en' || path === '/zh') {
            // Homepage has highest priority
            priority = 1.0;
            changefreq = 'daily';
        } else if (path.includes('-to-black-and-white')) {
            // Format pages are important landing pages
            priority = 0.9;
            changefreq = 'weekly';
        } else if (path.includes('photo-to-coloring-page') || path.includes('color-to-black-and-white')) {
            // Feature pages
            priority = 0.8;
            changefreq = 'weekly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};
