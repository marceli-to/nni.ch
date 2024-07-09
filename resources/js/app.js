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

import './modules/theme.js';

/**
 * Import and initialize the video module
 * This module handes the video sources
 */

import './modules/video.js';

/**
 * Import and initialize swiper module for blog posts
 */

import './modules/swiper/posts.js';

/**
 * Import and initialize swiper module for team members
 */

import './modules/swiper/team.js';

/**
 * Import and initialize swiper module for projects
 */

import './modules/swiper/projects.js';

import './modules/swiper/images.js';

import './modules/touch.js';

// import './modules/fullpage.js';

import './modules/team.js';

import './modules/carousel.js';

import './modules/gdpr.js';