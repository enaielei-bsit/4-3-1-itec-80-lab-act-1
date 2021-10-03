/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        src: {url: '/'},
    },
    plugins: [
        [
            '@snowpack/plugin-typescript',
            {
                /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
                ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
            },
        ],
        '@snowpack/plugin-sass'
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        /* ... */
    },
};
