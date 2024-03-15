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