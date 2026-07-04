/**
 * Import and initialize the Alpine.js
 */

import Alpine from 'alpinejs'
window.Alpine = Alpine
Alpine.start();

/**
 * Import and initialize the theme module
 * This module changes the theme of the header icons based on the section in view
 */

// import './modules/theme.js';

/**
 * Import and initialize the video module
 * This module handes the video sources
 */

import './modules/video.js';

/**
 * Import and initialize the swiper sliders (posts, team, projects, images).
 * All sliders are declared in a single config-driven module.
 */

import './modules/swiper/index.js';

import './modules/touch.js';

import './modules/team.js';

import './modules/carousel.js';

import './modules/comparison.js';

import './modules/slides.js';

import './modules/quickmenu.js';

import './modules/observer.js';

