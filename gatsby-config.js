require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const path = require('path');
const website = require('./config/website');
const redirects = require('./config/redirects');
const rewrites = require('./config/rewrites');

// --------------------
// Prismic schemas
// --------------------
const pageSchema = require('./.prismic/page.json');
const settingsSchema = require('./.prismic/settings.json');

// Environment variables
const {
  IS_STAGING,
  SITE_URL,
  PRISMIC_REPO_NAME,
  PRISMIC_API_KEY,
  HOST,
  gatsby_executing_command: GATSBY_CMD,
} = process.env;

const pathPrefix = website.pathPrefix === '/' ? '' : website.pathPrefix;
const isDev = process.env.NODE_ENV === 'development';

// --------------------
// Check for default website config values
// --------------------
if (website.siteName === 'Website Name') {
  console.log('\x1b[41m%s\x1b[0m', 'Found default values in /config/website.js, update before launch');
}

// --------------------
// Robots.txt warning on build (do not block content on production)
// --------------------
if (IS_STAGING && !isDev) {
  console.log('\x1b[41m%s\x1b[0m', 'blocking search engines, change IS_STAGING env variable to prevent this');
}
if (!IS_STAGING && !isDev) {
  console.log('\x1b[42m%s\x1b[0m', 'visible to search engines, change IS_STAGING env variable to prevent this');
}

// --------------------
// Check all required ENV variables are set
// --------------------
if (GATSBY_CMD !== 'serve') {
  const requiredEnvVariables = ['SITE_URL', 'PRISMIC_REPO_NAME', 'PRISMIC_API_KEY'];
  requiredEnvVariables.map((item) => {
    if (!process.env[item]) {
      throw Error(`Set ${item} env variable. See README`);
    }
    return null;
  });
}

// --------------------
// Prismic plugins
// --------------------
const prismicPlugins = () => {
  const plugins = [];

  plugins.push({
    resolve: 'gatsby-source-prismic',
    options: {
      repositoryName: PRISMIC_REPO_NAME,
      accessToken: PRISMIC_API_KEY,
      linkResolver: () => (doc) => {
        const { uid } = doc;
        if (uid === 'home') {
          return `/`;
        }
        // Example of link resolver for other post type
        // --------------------------------------------
        // if (doc.type === 'blog_post') {
        //   return `/blog/${uid}/`;
        // }
        return `/${doc.uid}/`;
      },
      // shouldDownloadImage: () => !isDev,
      schemas: {
        page: pageSchema,
        settings: settingsSchema
      },
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-create-client-paths',
    options: { prefixes: ['/preview/*', '/unpublishedPreview/*'] },
  });

  return plugins;
};

// --------------------
// SEO plugins
// --------------------
const seoPlugins = () => {
  const plugins = [];

  plugins.push('gatsby-plugin-react-helmet');
  plugins.push({
    resolve: 'wm-redirects-manager',
    options: {
      host: HOST,
      redirects,
      rewrites,
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-robots-txt',
    options: {
      host: null,
      sitemap: null,
      configFile: IS_STAGING ? 'config/robots-txt.staging.js' : 'config/robots-txt.production.js',
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
      siteUrl: SITE_URL + pathPrefix,
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-force-trailing-slashes',
    options: {
      excludedPaths: ['/404.html'],
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-sitemap',
    options: {
      output: '/sitemap.xml',
      exclude: ['/preview/', '/unpublishedPreview/'],
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: website.title,
      short_name: website.shortName,
      description: website.description,
      start_url: '/',
      background_color: website.backgroundColor,

      theme_color: website.themeColor,
      display: 'standalone',
      icon: website.icon,
      include_favicon: false,
    },
  });
  plugins.push('gatsby-plugin-offline');
  plugins.push('gatsby-plugin-brotli');

  return plugins;
};

// --------------------
// Tracking plugins
// --------------------
const trackingPlugins = () => {
  const plugins = [];

  if (process.env.GA_ID) {
    plugins.push({
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_ID,
        head: true,
        anonymize: true,
      },
    });
  }

  if (process.env.GTM_ID) {
    const getUrlParams = (queries) => {
      if (!queries) return {};
      return Object.fromEntries(new URLSearchParams(queries));
    };
    plugins.push({
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: process.env.GTM_ID,
        includeInDevelopment: true,
        defaultDataLayer: {
          platform: `gatsby`,
          ...getUrlParams(document.location.search),
        },
      },
    });
  }

  if (process.env.SEGMENT_WRITE_KEY) {
    plugins.push({
      resolve: `gatsby-plugin-segment-js`,
      options: {
        prodKey: process.env.SEGMENT_WRITE_KEY,
        devKey: process.env.SEGMENT_WRITE_KEY,
        trackPage: false,
      },
    });
  }

  if (process.env.HUBSPOT_ID) {
    plugins.push({
      resolve: 'gatsby-plugin-hubspot',
      options: {
        trackingCode: process.env.HUBSPOT_ID,
        respectDNT: false,
        productionOnly: true,
      },
    });
  }

  if (process.env.HOTJAR_ID && process.env.HOTJAR_VERSION) {
    plugins.push({
      resolve: `gatsby-plugin-hotjar`,
      options: {
        id: process.env.HOTJAR_ID,
        sv: process.env.HOTJAR_VERSION,
      },
    });
  }

  return plugins;
};

// --------------------
// Hosting plugins
// --------------------
const hostingPlugins = () => {
  const plugins = [];
  const securityHeaders = {
    '/*': ['X-Frame-Options: DENY', 'X-XSS-Protection: 1; mode=block', 'X-Content-Type-Options: nosniff'],
  };
  if (HOST === 'netlify') {
    plugins.push(
      { resolve: 'gatsby-plugin-netlify-cache' },
      {
        resolve: `gatsby-plugin-netlify`,
        options: {
          headers: securityHeaders, // option to add more headers. `Link` headers are transformed by the below criteria
          allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
          mergeSecurityHeaders: true, // boolean to turn off the default security headers
          mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers (disabled by default, until gzip is fixed for server push)
          mergeCachingHeaders: true, // boolean to turn off the default caching headers
        },
      }
    );
  }
  if (HOST === 'gatsby-cloud') {
    plugins.push({
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        headers: securityHeaders, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
      },
    });
  }
  return plugins;
};

module.exports = {
  /* General Information */
  pathPrefix: website.pathPrefix,
  siteMetadata: {
    siteUrl: SITE_URL + pathPrefix,
    pathPrefix,
    title: website.title,
    description: website.description,
    banner: website.banner,
    siteName: website.siteName,
    siteLanguage: website.siteLanguage,
    ogLanguage: website.ogLanguage,
    author: website.author,
    twitter: website.twitter,
    prismicRepo: PRISMIC_REPO_NAME,
  },
  /* Plugins */
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'src', path: path.join(__dirname, 'src') },
    },
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        src: path.join(__dirname, 'src'),
        components: path.join(__dirname, 'src/components'),
        images: path.join(__dirname, 'src/images'),
        slices: path.join(__dirname, 'src/slices'),
      },
    },
    'wm-disable-css-order-warnings',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        additionalData: '@import "resources.scss";',
        sassOptions: {
          includePaths: ['src/sass/base'],
        },
      },
    },
    ...trackingPlugins(),
    ...prismicPlugins(),
    ...seoPlugins(),
    ...hostingPlugins(),
  ],
};
