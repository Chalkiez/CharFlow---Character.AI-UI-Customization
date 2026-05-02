// ==UserScript==
// @name         CharFlow - Character AI Customization
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Customize every inch of Character.AI — chat bubbles, fonts, backgrounds, shadows, glass effects & more. 35+ settings, presets, export chats to HTML. Make your chats actually yours.
// @match        *://character.ai/chat/*
// @match        *://www.character.ai/chat/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.pathname.includes('/chat/')) return;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // --- Storage Keys ---
        const STORAGE = {
            bgType: 'cai_bg_type',
            bgUrl: 'cai_bg_url',
            bgFile: 'cai_bg_file',
            bgBlur: 'cai_bg_blur',
            bgBrightness: 'cai_bg_brightness',
            bgOverlayOpacity: 'cai_bg_overlay_opacity',
            bgOverlayColor: 'cai_bg_overlay_color',
            bubbleMode: 'cai_bubble_mode',
            bubbleGlobal: 'cai_bubble_global',
            bubbleAi: 'cai_bubble_ai',
            bubbleUser: 'cai_bubble_user',
            cornerMode: 'cai_corner_mode',
            cornerTopLeft: 'cai_corner_tl',
            cornerTopRight: 'cai_corner_tr',
            cornerBottomRight: 'cai_corner_br',
            cornerBottomLeft: 'cai_corner_bl',
            bubbleSpacing: 'cai_bubble_spacing',
            fontFamily: 'cai_font_family',
            fontCustomUrl: 'cai_font_custom_url',
            fontSize: 'cai_font_size',
            fontWeight: 'cai_font_weight',
            lineHeight: 'cai_line_height',
            textColorMode: 'cai_text_color_mode',
            textColorGlobal: 'cai_text_color_global',
            textColorAi: 'cai_text_color_ai',
            textColorUser: 'cai_text_color_user',
            textItalicColor: 'cai_text_italic_color',
            textBoldColor: 'cai_text_bold_color',
            textItalicEnabled: 'cai_text_italic_enabled',
            textBoldEnabled: 'cai_text_bold_enabled',
            shadowEnabled: 'cai_shadow_enabled',
            shadowBlur: 'cai_shadow_blur',
            shadowSpread: 'cai_shadow_spread',
            shadowOffsetX: 'cai_shadow_offset_x',
            shadowOffsetY: 'cai_shadow_offset_y',
            shadowOpacity: 'cai_shadow_opacity',
            shadowColor: 'cai_shadow_color',
            glassEnabled: 'cai_glass_enabled',
            glassBlur: 'cai_glass_blur',
            glassOpacity: 'cai_glass_opacity',
            borderEnabled: 'cai_border_enabled',
            borderWidth: 'cai_border_width',
            borderColor: 'cai_border_color',
        };

        const PRESET_PREFIX = 'cai_preset_';

        // Canonical defaults — used for reset AND preset loading fallback
        const DEFAULTS = {
            bgType: 'none',
            bgBlur: '0px',
            bgBrightness: '100%',
            bgOverlayOpacity: '0',
            bgOverlayColor: '#000000',
            bubbleMode: 'global',
            bubbleGlobal: '#2d2d3d',
            bubbleAi: '#2d2d3d',
            bubbleUser: '#1a1a2e',
            cornerMode: 'uniform',
            cornerTopLeft: '18',
            cornerTopRight: '18',
            cornerBottomRight: '18',
            cornerBottomLeft: '18',
            bubbleSpacing: '8px',
            fontFamily: 'Inter',
            fontCustomUrl: '',
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '1.5',
            textColorMode: 'global',
            textColorGlobal: '#e0e0e0',
            textColorAi: '#e0e0e0',
            textColorUser: '#e0e0e0',
            textItalicColor: '#a855f7',
            textBoldColor: '#f59e0b',
            textItalicEnabled: false,
            textBoldEnabled: false,
            shadowEnabled: false,
            shadowBlur: '12',
            shadowSpread: '0',
            shadowOffsetX: '0',
            shadowOffsetY: '4',
            shadowOpacity: '0.3',
            shadowColor: '#000000',
            glassEnabled: false,
            glassBlur: '10',
            glassOpacity: '0.7',
            borderEnabled: false,
            borderWidth: '2',
            borderColor: '#ffffff',
        };

        const PRESET_VERSION = '4.0';

        const GOOGLE_FONTS = {
            'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
            'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
            'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
            'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
            'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
            'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
            'Nunito': 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
            'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
            'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
            'Source Code Pro': 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&display=swap',
            'Comic Neue': 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap',
            'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap',
            'Quicksand': 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
            'Josefin Sans': 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap'
        };

        let loadedFonts = new Set();
        let activeFontLinks = new Set();
        let globalStyleElement = null;
        let lastStyleOutput = '';
        let backgroundLayer = null;
        let observer = null;

        // ============================================
        // IN-MEMORY STATE (single source of truth)
        // ============================================
        let STATE = {};

        function loadState() {
            for (const [key, storageKey] of Object.entries(STORAGE)) {
                STATE[key] = GM_getValue(storageKey, DEFAULTS[key] !== undefined ? DEFAULTS[key] : '');
            }
        }

        function saveState(key, value) {
            try {
                STATE[key] = value;
                GM_setValue(STORAGE[key], value);
            } catch (e) {
                console.error('[CharFlow] Failed to save:', key, e);
                showNotification('Failed to save setting - storage may be full', 'warning');
                return false;
            }
            return true;
        }

        // ============================================
        // NOTIFICATION SYSTEM
        // ============================================
        let notificationTimeout = null;
        let notificationElement = null;

        function showNotification(message, type = 'info') {
            if (notificationElement) { notificationElement.remove(); if (notificationTimeout) clearTimeout(notificationTimeout); }
            notificationElement = document.createElement('div');
            notificationElement.className = `cai-notification cai-notification-${type}`;
            const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
            notificationElement.innerHTML = `<span class="cai-notification-icon">${icons[type]||icons.info}</span><span class="cai-notification-message">${message}</span><button class="cai-notification-close">×</button>`;
            document.body.appendChild(notificationElement);
            notificationElement.querySelector('.cai-notification-close').addEventListener('click', () => {
                notificationElement.classList.add('cai-notification-hide');
                setTimeout(() => { if (notificationElement) notificationElement.remove(); notificationElement = null; }, 300);
            });
            notificationTimeout = setTimeout(() => {
                if (notificationElement) {
                    notificationElement.classList.add('cai-notification-hide');
                    setTimeout(() => { if (notificationElement) notificationElement.remove(); notificationElement = null; }, 300);
                }
            }, 4000);
        }

        // ============================================
        // FONT MANAGEMENT
        // ============================================
        function cleanupOldFonts() {
            activeFontLinks.forEach(link => { if (link && link.parentNode) link.remove(); });
            activeFontLinks.clear(); loadedFonts.clear();
        }

        function loadGoogleFont(fontName, customUrl = null) {
            if (!fontName) return;
            let fontUrl = customUrl && customUrl.trim() !== '' ? customUrl.trim() : (GOOGLE_FONTS[fontName] || null);
            if (!fontUrl) return;
            const isCustom = !!(customUrl && customUrl.trim() !== '');
            const fontId = isCustom ? `custom-${btoa(fontUrl).slice(0, 20)}` : fontName;
            if (loadedFonts.has(fontId)) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet'; link.href = fontUrl;
            link.id = `cai-font-${fontId.replace(/\s/g, '-')}`;
            link.onerror = () => {
                showNotification('Your custom font URL could not be loaded. Check that the link is a valid Google Fonts URL and try again.', 'error');
                loadedFonts.delete(fontId);
                activeFontLinks.delete(link);
                link.remove();

            };
            document.head.appendChild(link);
            activeFontLinks.add(link);
            loadedFonts.add(fontId);
        }

        function getFontFamily() {
            const fontName = STATE.fontFamily || 'Inter';
            const customUrl = STATE.fontCustomUrl || '';
            if (customUrl && customUrl.trim() !== '') return `'Custom Font', ${fontName}, system-ui, sans-serif`;
            return `${fontName}, system-ui, -apple-system, sans-serif`;
        }

        // ============================================
        // CSS GENERATION (no gradient)
        // ============================================
        function generateStyles() {
            const mode = STATE.bubbleMode;
            const globalColor = STATE.bubbleGlobal;
            const aiColor = STATE.bubbleAi;
            const userColor = STATE.bubbleUser;
            const spacing = STATE.bubbleSpacing;
            const fontFamily = getFontFamily();
            const fontSize = STATE.fontSize;
            const fontWeight = STATE.fontWeight;
            const lineHeight = STATE.lineHeight;
            const shadowEnabled = STATE.shadowEnabled;
            const shadowBlur = STATE.shadowBlur;
            const shadowSpread = STATE.shadowSpread;
            const shadowOffsetX = STATE.shadowOffsetX;
            const shadowOffsetY = STATE.shadowOffsetY;
            const shadowOpacity = STATE.shadowOpacity;
            const shadowColor = STATE.shadowColor;
            const r = parseInt(shadowColor.slice(1,3),16), g = parseInt(shadowColor.slice(3,5),16), b_c = parseInt(shadowColor.slice(5,7),16);
            const boxShadow = shadowEnabled ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px rgba(${r},${g},${b_c},${shadowOpacity})` : 'none';
            const glassEnabled = STATE.glassEnabled;
            const glassBlur = STATE.glassBlur;
            const glassOpacity = STATE.glassOpacity;
            const borderEnabled = STATE.borderEnabled;
            const borderWidth = STATE.borderWidth;
            const borderColor = STATE.borderColor;
            const borderStyle = borderEnabled ? `border: ${borderWidth}px solid ${borderColor} !important;` : '';
            const cornerMode = STATE.cornerMode;
            const tl = STATE.cornerTopLeft;
            const tr = STATE.cornerTopRight;
            const br = STATE.cornerBottomRight;
            const bl = STATE.cornerBottomLeft;
            const textColorMode = STATE.textColorMode;
            const textColorGlobal = STATE.textColorGlobal;
            const textColorAi = STATE.textColorAi;
            const textColorUser = STATE.textColorUser;
            const italicColor = STATE.textItalicColor;
            const boldColor = STATE.textBoldColor;
            const italicEnabled = STATE.textItalicEnabled;
            const boldEnabled = STATE.textBoldEnabled;

            const MSG = '[data-testid="completed-message"],[data-testid="active-message"],[data-testid="generating-message"],[data-testid="streaming-message"],[class*="message-bubble"]';
            const AI = '.group.relative:not(:has(.flex-row-reverse))';
            const USER = '.group.relative:has(.flex-row-reverse)';

            let css = `
                .group.relative.max-w-3xl.m-auto.w-full { margin-bottom: ${spacing} !important; }
                ${MSG} { transition: all 0.1s ease; box-shadow: ${boxShadow}; ${borderStyle} }
${MSG} p,
${MSG} span,
${MSG} div,
${MSG} li,
${MSG} .prose,
${MSG} .prose *,
[data-testid="completed-message"] .prose,
[data-testid="completed-message"] .prose *,
[data-testid="active-message"] .prose,
[data-testid="active-message"] .prose *,
[data-testid="generating-message"] .prose,
[data-testid="generating-message"] .prose *,
[data-testid="streaming-message"] .prose,
[data-testid="streaming-message"] .prose * {
    font-family: ${fontFamily} !important;
    font-size: ${fontSize} !important;
    font-weight: ${fontWeight} !important;
    line-height: ${lineHeight} !important;
}
            `;

            // Background / color
            if (glassEnabled) {
                css += `${MSG} { background: rgba(255,255,255,${glassOpacity}) !important; backdrop-filter: blur(${glassBlur}px) !important; -webkit-backdrop-filter: blur(${glassBlur}px) !important; background-image: none !important; }`;
            } else if (mode === 'global') {
                css += `${MSG} { background-color: ${globalColor} !important; background-image: none !important; }`;
            } else {
                css += `${AI} [data-testid="completed-message"],${AI} [data-testid="active-message"],${AI} [data-testid="generating-message"],${AI} [data-testid="streaming-message"],${AI} [class*="message-bubble"] { background-color: ${aiColor} !important; background-image: none !important; }
                ${USER} [data-testid="completed-message"],${USER} [data-testid="active-message"],${USER} [data-testid="generating-message"],${USER} [data-testid="streaming-message"],${USER} [class*="message-bubble"] { background-color: ${userColor} !important; background-image: none !important; }`;
            }

            // Corners
            if (cornerMode === 'uniform') {
                css += `${MSG} { border-radius: ${tl}px !important; }`;
            } else {
                css += `${AI} [data-testid="completed-message"],${AI} [data-testid="active-message"],${AI} [data-testid="generating-message"],${AI} [data-testid="streaming-message"],${AI} [class*="message-bubble"] { border-radius: ${tl}px ${tr}px ${br}px ${bl}px !important; }
                ${USER} [data-testid="completed-message"],${USER} [data-testid="active-message"],${USER} [data-testid="generating-message"],${USER} [data-testid="streaming-message"],${USER} [class*="message-bubble"] { border-radius: ${tr}px ${tl}px ${bl}px ${br}px !important; }`;
            }

            // Text colors
            if (textColorMode === 'global') {
                css += `
        ${AI} [data-testid="completed-message"] p, ${AI} [data-testid="active-message"] p,
        ${AI} [data-testid="generating-message"] p, ${AI} [data-testid="streaming-message"] p,
        ${AI} [class*="message-bubble"] p,
        ${USER} [data-testid="completed-message"] p, ${USER} [data-testid="active-message"] p,
        ${USER} [data-testid="generating-message"] p, ${USER} [data-testid="streaming-message"] p,
        ${USER} [class*="message-bubble"] p { color: ${textColorGlobal} !important; }
    `;
            } else {
                css += `${AI} [data-testid="completed-message"] p,${AI} [data-testid="active-message"] p,${AI} [data-testid="generating-message"] p,${AI} [data-testid="streaming-message"] p,${AI} [class*="message-bubble"] p { color: ${textColorAi} !important; }
    ${USER} [data-testid="completed-message"] p,${USER} [data-testid="active-message"] p,${USER} [data-testid="generating-message"] p,${USER} [data-testid="streaming-message"] p,${USER} [class*="message-bubble"] p { color: ${textColorUser} !important; }`;
            }

            // Italic
            const ITALIC_SEL = `[data-testid="completed-message"] em,[data-testid="completed-message"] i,
                [data-testid="active-message"] em,[data-testid="active-message"] i,
                [data-testid="generating-message"] em,[data-testid="generating-message"] i,
                [data-testid="streaming-message"] em,[data-testid="streaming-message"] i`;
            if (italicEnabled) {
                css += `${ITALIC_SEL} { color: ${italicColor} !important; font-style: italic !important; }`;
            } else {
                css += `${ITALIC_SEL} { font-style: italic !important; }`;
            }

            // Bold
            const BOLD_SEL = `[data-testid="completed-message"] strong,[data-testid="completed-message"] b,
                [data-testid="active-message"] strong,[data-testid="active-message"] b,
                [data-testid="generating-message"] strong,[data-testid="generating-message"] b,
                [data-testid="streaming-message"] strong,[data-testid="streaming-message"] b`;
            if (boldEnabled) {
                css += `${BOLD_SEL} { color: ${boldColor} !important; font-weight: 700 !important; }`;
            } else {
                css += `${BOLD_SEL} { font-weight: 700 !important; }`;
            }

            return css;
        }

        function applyStyles() {
            const fontName = STATE.fontFamily || 'Inter';
            const customUrl = STATE.fontCustomUrl || '';
            if (customUrl && customUrl.trim() !== '') loadGoogleFont('Custom Font', customUrl);
            else if (GOOGLE_FONTS[fontName]) loadGoogleFont(fontName);

            const css = generateStyles();
            if (css === lastStyleOutput) return;
            lastStyleOutput = css;

            if (!globalStyleElement || !globalStyleElement.parentNode) {
                globalStyleElement = document.createElement('style');
                globalStyleElement.id = 'cai-global-styles';
                document.head.appendChild(globalStyleElement);
            }
            globalStyleElement.textContent = css;
        }

        function cleanupBackground() {
            if (backgroundLayer && backgroundLayer.parentNode) backgroundLayer.remove();
            backgroundLayer = null;
        }

        function ensureBackgroundLayer() {
            if (!backgroundLayer || !backgroundLayer.parentNode) {
                backgroundLayer = document.createElement('div');
                backgroundLayer.id = 'cai-background-layer';
                backgroundLayer.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;pointer-events:none;background-size:cover;background-position:center;background-repeat:no-repeat;background-attachment:fixed;`;
                document.body.insertBefore(backgroundLayer, document.body.firstChild);
            }
            return backgroundLayer;
        }

        function applyBackground() {
            const bgType = STATE.bgType || 'none';
            const blur = STATE.bgBlur || '0px';
            const brightness = STATE.bgBrightness || '100%';
            const overlayColor = STATE.bgOverlayColor || '#000000';
            const overlayOpacity = STATE.bgOverlayOpacity || '0';
            let bgImage = '';
            if (bgType === 'url') bgImage = STATE.bgUrl || '';
            if (bgType === 'file') bgImage = STATE.bgFile || '';
            const layer = ensureBackgroundLayer();
            layer.style.backgroundImage = bgImage ? `url(${bgImage})` : 'none';
            if (bgImage) { layer.style.backgroundSize = 'cover'; layer.style.backgroundPosition = 'center'; layer.style.backgroundAttachment = 'fixed'; }
            layer.style.filter = `blur(${parseInt(blur)||0}px) brightness(${parseInt(brightness)||100}%)`;
            document.body.style.filter = 'none';
            const existingOverlay = document.getElementById('cai-custom-overlay');
            if (existingOverlay) existingOverlay.remove();
            if (parseFloat(overlayOpacity) > 0) {
                const overlay = document.createElement('div');
                overlay.id = 'cai-custom-overlay';
                overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:${overlayColor};opacity:${overlayOpacity/100};pointer-events:none;z-index:-1;`;
                document.body.insertBefore(overlay, document.body.firstChild);
            }
            document.body.style.position = 'relative';
            document.body.style.zIndex = '1';
            document.body.style.backgroundColor = bgImage ? 'transparent' : '';
        }

        function applyAll() {
            applyBackground();
            applyStyles();
            syncUIWithSettings();
            updateCornerPreviews();
        }

        // ============================================
        // PRESET MANAGER
        // ============================================
        function getCurrentSettings() {
            const settings = {};
            for (const [key, storageKey] of Object.entries(STORAGE)) {
                settings[key] = GM_getValue(storageKey, DEFAULTS[key] !== undefined ? DEFAULTS[key] : '');
            }
            return settings;
        }

        // applySettings: any key missing from JSON uses DEFAULTS (effectively resets that feature)
        function applySettings(settings) {
            for (const [key, storageKey] of Object.entries(STORAGE)) {
                const value = settings[key];
                const resolved = (value !== undefined && value !== null) ? value : (DEFAULTS[key] !== undefined ? DEFAULTS[key] : '');
                GM_setValue(storageKey, resolved);
                STATE[key] = resolved;
            }
            applyAll();
            showNotification('Preset loaded successfully!', 'success');
        }

        function savePreset(name) {
            if (!name || name.trim() === '') { showNotification('Please enter a preset name', 'error'); return false; }
            const presetKey = PRESET_PREFIX + name.trim();
            if (GM_getValue(presetKey, null)) { if (!confirm(`Preset "${name}" already exists. Overwrite?`)) return false; }
            const presetData = { version: PRESET_VERSION, name: name.trim(), createdAt: new Date().toISOString(), settings: getCurrentSettings() };
            try { GM_setValue(presetKey, JSON.stringify(presetData)); loadPresetList(); showNotification(`Preset "${name}" saved!`, 'success'); return true; }
            catch (e) { showNotification('Error saving: ' + e.message, 'error'); return false; }
        }

        function loadPreset(name) {
            const presetData = GM_getValue(PRESET_PREFIX + name, null);
            if (presetData) {
                try { const data = JSON.parse(presetData); applySettings(data.settings || data); return true; }
                catch (e) { showNotification('Error loading preset', 'error'); return false; }
            }
            showNotification(`Preset "${name}" not found`, 'error'); return false;
        }

        function deletePreset(name) {
            if (GM_getValue(PRESET_PREFIX + name, null)) {
                GM_deleteValue(PRESET_PREFIX + name); loadPresetList(); showNotification(`Preset "${name}" deleted`, 'success');
            } else showNotification(`Preset "${name}" not found`, 'error');
        }

        function exportPreset(name) {
            const presetData = GM_getValue(PRESET_PREFIX + name, null);
            if (presetData) {
                try {
                    const exportSettings = { ...presetData.settings };
                    if (exportSettings.bgFile && exportSettings.bgFile !== '') {
                        showNotification('Local background image was excluded from preset — only URL backgrounds are exportable', 'warning');
                    }
                    delete exportSettings.bgFile;

                    const blob = new Blob([JSON.stringify({ exportDate: new Date().toISOString(), ...JSON.parse(presetData) }, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${name.replace(/[^a-z0-9]/gi, '_')}_preset.json`;
                    a.click(); URL.revokeObjectURL(url);
                    showNotification(`Preset "${name}" exported!`, 'success');
                } catch (e) { showNotification('Export error: ' + e.message, 'error'); }
            } else showNotification(`Preset "${name}" not found`, 'error');
        }

        function importPreset(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    let presetName = (data.name || data._presetName || `imported_${Date.now()}`).replace(/[^a-zA-Z0-9\s_-]/g, '');
                    const settings = data.settings || data;
                    ['_presetName','_createdAt','name','version','exportDate'].forEach(k => delete settings[k]);
                    const presetKey = PRESET_PREFIX + presetName;
                    if (GM_getValue(presetKey, null)) { if (!confirm(`Preset "${presetName}" already exists. Overwrite?`)) return; }
                    GM_setValue(presetKey, JSON.stringify({ version: PRESET_VERSION, name: presetName, createdAt: new Date().toISOString(), settings }));
                    loadPresetList(); showNotification(`Preset "${presetName}" imported!`, 'success');
                } catch (err) { showNotification('Invalid preset file: ' + err.message, 'error'); }
            };
            reader.readAsText(file);

            if (file.size > 1024 * 1024) {
                showNotification('Preset file too large (max 1MB)', 'error');
                return;
            }

            if (!file.name.endsWith('.json')) {
                showNotification('Invalid preset file - expected .json', 'error');
                return;
            }


        }

        function loadPresetList() {
            const presetList = document.getElementById('cai-preset-list');
            if (!presetList) return;
            const presetKeys = GM_listValues().filter(k => k.startsWith(PRESET_PREFIX));
            if (presetKeys.length === 0) { presetList.innerHTML = '<div class="cai-empty-presets">No saved presets yet.</div>'; return; }
            const presets = presetKeys.map(key => {
                try { const d = JSON.parse(GM_getValue(key, '{}')); return { name: d.name || key.substring(PRESET_PREFIX.length) }; }
                catch (e) { return { name: key.substring(PRESET_PREFIX.length) }; }
            });
            presetList.innerHTML = presets.map(p => `
                <div class="cai-preset-item">
                    <span class="cai-preset-name">${p.name}</span>
                    <div class="cai-preset-dot-menu">
                        <button class="cai-preset-dot-btn" data-preset="${p.name.replace(/"/g,'&quot;')}">•••</button>
                        <div class="cai-preset-dropdown" id="cai-dd-${p.name.replace(/[^a-zA-Z0-9]/g,'_')}">
                            <button class="cai-preset-load" data-preset="${p.name.replace(/"/g,'&quot;')}">Load</button>
                            <button class="cai-preset-delete" data-preset="${p.name.replace(/"/g,'&quot;')}">Delete</button>
                            <button class="cai-preset-export" data-preset="${p.name.replace(/"/g,'&quot;')}">Export</button>
                        </div>
                    </div>
                </div>
            `).join('');

            presetList.querySelectorAll('.cai-preset-dot-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    e.stopPropagation();
                    const dd = document.getElementById(`cai-dd-${btn.dataset.preset.replace(/[^a-zA-Z0-9]/g,'_')}`);
                    document.querySelectorAll('.cai-preset-dropdown.open').forEach(d => { if (d !== dd) d.classList.remove('open'); });
                    dd?.classList.toggle('open');
                });
            });
            document.addEventListener('click', () => document.querySelectorAll('.cai-preset-dropdown.open').forEach(d => d.classList.remove('open')));
            presetList.querySelectorAll('.cai-preset-load').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); loadPreset(btn.dataset.preset); document.querySelectorAll('.cai-preset-dropdown.open').forEach(d => d.classList.remove('open')); }));
            presetList.querySelectorAll('.cai-preset-delete').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); deletePreset(btn.dataset.preset); }));
            presetList.querySelectorAll('.cai-preset-export').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); exportPreset(btn.dataset.preset); document.querySelectorAll('.cai-preset-dropdown.open').forEach(d => d.classList.remove('open')); }));
        }

        // ============================================
        // UI SYNC
        // ============================================
        function updateColorBtnBorder(btnId, color) {
            const btn = document.getElementById(btnId);
            if (btn) btn.style.borderColor = color;
        }

        function setEl(id, prop, value) {
            const el = document.getElementById(id);
            if (!el) return;
            if (prop === 'value') el.value = value;
            else if (prop === 'checked') el.checked = value;
            else if (prop === 'text') el.textContent = value;
        }

        function syncUIWithSettings() {
            const s = STATE;

            // Bubble
            setEl('cai-bubble-mode',        'value',   s.bubbleMode);
            setEl('cai-global-color',        'value',   s.bubbleGlobal);
            setEl('cai-ai-color',            'value',   s.bubbleAi);
            setEl('cai-user-color',          'value',   s.bubbleUser);
            updateColorBtnBorder('cai-global-color-btn', s.bubbleGlobal);
            updateColorBtnBorder('cai-ai-color-btn',     s.bubbleAi);
            updateColorBtnBorder('cai-user-color-btn',   s.bubbleUser);
            document.getElementById('cai-global-color-group')?.classList.toggle('cai-hidden', s.bubbleMode !== 'global');
            document.getElementById('cai-separate-color-group')?.classList.toggle('cai-hidden', s.bubbleMode !== 'separate');

            // Spacing
            const spacing = parseInt(s.bubbleSpacing) || 8;
            setEl('cai-message-spacing', 'value', spacing);
            setEl('cai-spacing-val',     'text',  spacing);

            // Glass
            setEl('cai-glass-enabled',      'checked', s.glassEnabled);
            setEl('cai-glass-blur',          'value',   s.glassBlur);
            setEl('cai-glass-blur-val',      'text',    s.glassBlur + 'px');
            setEl('cai-glass-opacity',       'value',   s.glassOpacity);
            setEl('cai-glass-opacity-val',   'text',    Math.round(parseFloat(s.glassOpacity) * 100) + '%');

            // Border
            setEl('cai-border-enabled',     'checked', s.borderEnabled);
            setEl('cai-border-width',        'value',   s.borderWidth);
            setEl('cai-border-width-val',    'text',    s.borderWidth + 'px');
            setEl('cai-border-color',        'value',   s.borderColor);
            updateColorBtnBorder('cai-border-color-btn', s.borderColor);

            // Shadow
            setEl('cai-shadow-enabled',     'checked', s.shadowEnabled);
            setEl('cai-shadow-blur',         'value',   s.shadowBlur);
            setEl('cai-shadow-blur-val',     'text',    s.shadowBlur + 'px');
            setEl('cai-shadow-offset-y',     'value',   s.shadowOffsetY);
            setEl('cai-shadow-offset-y-val', 'text',    s.shadowOffsetY + 'px');
            setEl('cai-shadow-opacity',      'value',   s.shadowOpacity);
            setEl('cai-shadow-opacity-val',  'text',    Math.round(parseFloat(s.shadowOpacity) * 100) + '%');
            setEl('cai-shadow-color',        'value',   s.shadowColor);
            updateColorBtnBorder('cai-shadow-color-btn', s.shadowColor);

            // Font
            setEl('cai-font-family',    'value', s.fontFamily);
            setEl('cai-custom-font-url','value', s.fontCustomUrl);
            setEl('cai-font-size',      'value', parseInt(s.fontSize) || 14);
            setEl('cai-fontsize-val',   'text',  (parseInt(s.fontSize) || 14) + 'px');
            setEl('cai-font-weight',    'value', s.fontWeight);
            setEl('cai-line-height',    'value', s.lineHeight);
            setEl('cai-lineheight-val', 'text',  s.lineHeight);
            document.getElementById('cai-custom-font-group')?.classList.toggle('cai-hidden', s.fontFamily !== 'custom');

            // Text colors
            setEl('cai-text-color-mode',     'value', s.textColorMode);
            setEl('cai-text-global-color',   'value', s.textColorGlobal);
            setEl('cai-text-ai-color',       'value', s.textColorAi);
            setEl('cai-text-user-color',     'value', s.textColorUser);
            updateColorBtnBorder('cai-text-global-color-btn', s.textColorGlobal);
            updateColorBtnBorder('cai-text-ai-color-btn',     s.textColorAi);
            updateColorBtnBorder('cai-text-user-color-btn',   s.textColorUser);
            document.getElementById('cai-text-global-group')?.classList.toggle('cai-hidden', s.textColorMode !== 'global');
            document.getElementById('cai-text-separate-group')?.classList.toggle('cai-hidden', s.textColorMode !== 'separate');

            // Italic / Bold
            setEl('cai-italic-enabled', 'checked', s.textItalicEnabled);
            setEl('cai-bold-enabled',   'checked', s.textBoldEnabled);
            setEl('cai-italic-color',   'value',   s.textItalicColor);
            setEl('cai-bold-color',     'value',   s.textBoldColor);
            updateColorBtnBorder('cai-italic-color-btn', s.textItalicColor);
            updateColorBtnBorder('cai-bold-color-btn',   s.textBoldColor);

            // Corners
            const cornerMode = s.cornerMode || 'uniform';
            const uniformBtn = document.getElementById('cai-corner-uniform');
            const customBtn  = document.getElementById('cai-corner-custom');
            if (cornerMode === 'uniform') {
                uniformBtn?.classList.add('active'); customBtn?.classList.remove('active');
                document.getElementById('cai-uniform-group')?.classList.remove('cai-hidden');
                document.getElementById('cai-custom-group')?.classList.add('cai-hidden');
            } else {
                customBtn?.classList.add('active'); uniformBtn?.classList.remove('active');
                document.getElementById('cai-custom-group')?.classList.remove('cai-hidden');
                document.getElementById('cai-uniform-group')?.classList.add('cai-hidden');
            }
            setEl('cai-uniform-radius', 'value', s.cornerTopLeft);
            setEl('cai-uniform-val',    'text',  s.cornerTopLeft + 'px');
            setEl('cai-corner-tl',      'value', s.cornerTopLeft);
            setEl('cai-tl-val',         'text',  s.cornerTopLeft + 'px');
            setEl('cai-corner-tr',      'value', s.cornerTopRight);
            setEl('cai-tr-val',         'text',  s.cornerTopRight + 'px');
            setEl('cai-corner-br',      'value', s.cornerBottomRight);
            setEl('cai-br-val',         'text',  s.cornerBottomRight + 'px');
            setEl('cai-corner-bl',      'value', s.cornerBottomLeft);
            setEl('cai-bl-val',         'text',  s.cornerBottomLeft + 'px');

            // Background
            setEl('cai-bg-type',       'value', s.bgType);
            setEl('cai-bg-blur',       'value', parseInt(s.bgBlur) || 0);
            setEl('cai-blur-val',      'text',  (parseInt(s.bgBlur) || 0) + 'px');
            setEl('cai-bg-brightness', 'value', parseInt(s.bgBrightness) || 100);
            setEl('cai-bright-val',    'text',  (parseInt(s.bgBrightness) || 100) + '%');
            setEl('cai-overlay-opacity','value', parseFloat(s.bgOverlayOpacity) || 0);
            setEl('cai-overlay-val',   'text',  (parseFloat(s.bgOverlayOpacity) || 0) + '%');
            setEl('cai-overlay-color', 'value', s.bgOverlayColor);
            updateColorBtnBorder('cai-overlay-color-btn', s.bgOverlayColor);
            document.getElementById('cai-url-input')?.classList.toggle('cai-hidden', s.bgType !== 'url');
            document.getElementById('cai-file-input')?.classList.toggle('cai-hidden', s.bgType !== 'file');

            // Misc
            setEl('cai-disclaimer-toggle', 'checked', GM_getValue('cai_disclaimers_hidden', false));

            updateCornerPreviews();
        }


        // ============================================
        // RESET FUNCTIONS — fully restore defaults incl. toggled features
        // ============================================
        function resetCategory(category) {
            const keys = {
                background: ['bgType','bgBlur','bgBrightness','bgOverlayOpacity','bgOverlayColor'],
                bubbles: ['bubbleMode','bubbleGlobal','bubbleAi','bubbleUser','bubbleSpacing',
                          'shadowEnabled','shadowBlur','shadowSpread','shadowOffsetX','shadowOffsetY','shadowOpacity','shadowColor',
                          'glassEnabled','glassBlur','glassOpacity',
                          'borderEnabled','borderWidth','borderColor'],
                corners: ['cornerMode','cornerTopLeft','cornerTopRight','cornerBottomRight','cornerBottomLeft'],
                typography: ['fontFamily','fontCustomUrl','fontSize','fontWeight','lineHeight',
                             'textColorMode','textColorGlobal','textColorAi','textColorUser',
                             'textItalicColor','textBoldColor','textItalicEnabled','textBoldEnabled'],
            };
            const toReset = keys[category] || [];
            toReset.forEach(key => {
                if (STORAGE[key] !== undefined && DEFAULTS[key] !== undefined) {
                    GM_setValue(STORAGE[key], DEFAULTS[key]);
                    STATE[key] = DEFAULTS[key];
                }
            });
            if (category === 'typography') cleanupOldFonts();
            applyAll();
            const labels = { background:'Background', bubbles:'Bubble', corners:'Corners', typography:'Typography' };
            showNotification(`${labels[category]||category} reset to default`, 'info');
        }

        function resetAllToDefault() {
            if (confirm('Reset ALL settings to default? This will reload the page.')) {
                for (const [key, storageKey] of Object.entries(STORAGE)) {
                    if (DEFAULTS[key] !== undefined) GM_setValue(storageKey, DEFAULTS[key]);
                }
                showNotification('All settings reset. Reloading...', 'success');
                setTimeout(() => location.reload(), 1000);
            }
        }

        // ============================================
        // CORNER PREVIEWS
        // ============================================
        function updateCornerPreviews() {
            const mode = STATE.cornerMode || 'uniform';
            if (mode === 'uniform') {
                const r = STATE.cornerTopLeft || '18';
                const p = document.getElementById('cai-uniform-preview');
                if (p) p.style.borderRadius = `${r}px`;
            } else {
                const tl = STATE.cornerTopLeft || '18', tr = STATE.cornerTopRight || '18';
                const br = STATE.cornerBottomRight || '18', bl = STATE.cornerBottomLeft || '18';
                const p = document.getElementById('cai-custom-preview');
                if (p) p.style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
            }
        }

        // ============================================
        // SETTINGS DEFINITIONS
        // ============================================
        const ALL_SETTINGS = [
            // Background
            { id: 'setting-bg-type', label: 'Background Type Image URL Local File', category: 'Background', html: `
                <div class="cai-section-title">Background Type</div>
                <div class="cai-select-wrapper"><select id="cai-bg-type"><option value="none">None</option><option value="url">Image URL</option><option value="file">Local File</option></select></div>
                <div id="cai-url-input" class="cai-hidden" style="margin-top:10px;">
                    <input type="text" id="cai-bg-url" placeholder="https://...">
                    <button id="cai-apply-bg" class="cai-btn" style="margin-top:8px;width:100%;">Apply</button>
                </div>
                <div id="cai-file-input" class="cai-hidden" style="margin-top:10px;">
                    <label class="cai-file-label">Choose Image <input type="file" id="cai-bg-file" accept="image/*"></label>
                </div>
            ` },
            { id: 'setting-bg-blur', label: 'Background Blur', category: 'Background', html: `
                <div class="cai-section-title">Blur <span class="cai-slider-val" id="cai-blur-val">0</span>px</div>
                <input type="range" id="cai-bg-blur" min="0" max="20" value="0">
            ` },
            { id: 'setting-bg-brightness', label: 'Background Brightness', category: 'Background', html: `
                <div class="cai-section-title">Brightness <span class="cai-slider-val" id="cai-bright-val">100</span>%</div>
                <input type="range" id="cai-bg-brightness" min="30" max="150" value="100">
            ` },
            { id: 'setting-overlay', label: 'Overlay Opacity Color', category: 'Background', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <span class="cai-section-title" style="margin:0;">Overlay Color</span>
                    <div style="position:relative;">
                        <button class="cai-color-btn" id="cai-overlay-color-btn" onclick="document.getElementById('cai-overlay-color').click()">Select to change</button>
                        <input type="color" id="cai-overlay-color" value="#000000" style="position:absolute;opacity:0;width:0;height:0;">
                    </div>
                </div>
                <div class="cai-section-title">Overlay Opacity <span class="cai-slider-val" id="cai-overlay-val">0</span>%</div>
                <input type="range" id="cai-overlay-opacity" min="0" max="80" value="0">
            ` },
            { id: 'setting-bg-reset', label: 'Reset Background', category: 'Background', html: `<button class="cai-reset-btn" data-category="background">Reset to Default</button>` },

            // Bubble Chat
            { id: 'setting-message-spacing', label: 'Message Spacing', category: 'Bubble Chat', html: `
                <div class="cai-section-title">Message Spacing <span class="cai-slider-val" id="cai-spacing-val">8</span>px</div>
                <input type="range" id="cai-message-spacing" min="0" max="24" value="8">
            ` },
            { id: 'setting-bubble-mode', label: 'Bubble Mode Same Color Separate Colors', category: 'Bubble Chat', html: `
                <div class="cai-section-title">Bubble Mode</div>
                <div class="cai-select-wrapper"><select id="cai-bubble-mode"><option value="global">Same Color for All</option><option value="separate">Separate Colors</option></select></div>
            ` },
            { id: 'setting-bubble-colors', label: 'AI Bubble User Bubble Color Global', category: 'Bubble Chat', html: `
                <div id="cai-global-color-group">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span class="cai-section-title" style="margin:0;">Global Bubble</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-global-color-btn" onclick="document.getElementById('cai-global-color').click()">Select to change</button>
                            <input type="color" id="cai-global-color" value="#2d2d3d" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                </div>
                <div id="cai-separate-color-group" class="cai-hidden">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span class="cai-section-title" style="margin:0;">AI Bubble</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-ai-color-btn" onclick="document.getElementById('cai-ai-color').click()">Select to change</button>
                            <input type="color" id="cai-ai-color" value="#2d2d3d" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span class="cai-section-title" style="margin:0;">User Bubble</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-user-color-btn" onclick="document.getElementById('cai-user-color').click()">Select to change</button>
                            <input type="color" id="cai-user-color" value="#1a1a2e" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                </div>
            ` },
            { id: 'setting-glass', label: 'Glassmorphism Effect Blur Intensity Opacity', category: 'Bubble Chat', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="cai-section-title" style="margin:0;">Glassmorphism Effect</span>
                    <label class="cai-switch-label"><input type="checkbox" id="cai-glass-enabled"><span class="cai-switch-slider"></span></label>
                </div>
                <div class="cai-info-small">May affect performance in long conversations</div>
                <div style="margin-top:10px;">
                    <div class="cai-section-title">Blur Intensity <span class="cai-slider-val" id="cai-glass-blur-val">10</span>px</div>
                    <input type="range" id="cai-glass-blur" min="0" max="30" value="10">
                    <div class="cai-section-title" style="margin-top:8px;">Opacity <span class="cai-slider-val" id="cai-glass-opacity-val">70%</span></div>
                    <input type="range" id="cai-glass-opacity" min="0" max="1" step="0.05" value="0.7">
                </div>
            ` },
            { id: 'setting-border', label: 'Chat Bubble Border Width Color', category: 'Bubble Chat', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="cai-section-title" style="margin:0;">Chat Bubble Border</span>
                    <label class="cai-switch-label"><input type="checkbox" id="cai-border-enabled"><span class="cai-switch-slider"></span></label>
                </div>
                <div style="margin-top:10px;">
                    <div class="cai-section-title">Border Width <span class="cai-slider-val" id="cai-border-width-val">2</span>px</div>
                    <input type="range" id="cai-border-width" min="1" max="8" step="1" value="2">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                        <span class="cai-section-title" style="margin:0;">Border Color</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-border-color-btn" onclick="document.getElementById('cai-border-color').click()">Select to change</button>
                            <input type="color" id="cai-border-color" value="#ffffff" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                </div>
            ` },
            { id: 'setting-shadow', label: 'Shadow Effects Blur Offset Opacity Color', category: 'Bubble Chat', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="cai-section-title" style="margin:0;">Shadow Effects</span>
                    <label class="cai-switch-label"><input type="checkbox" id="cai-shadow-enabled"><span class="cai-switch-slider"></span></label>
                </div>
                <div style="margin-top:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <span class="cai-section-title" style="margin:0;">Shadow Color</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-shadow-color-btn" onclick="document.getElementById('cai-shadow-color').click()">Select to change</button>
                            <input type="color" id="cai-shadow-color" value="#000000" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                    <div class="cai-two-col">
                        <div>
                            <div class="cai-section-title">Blur <span class="cai-slider-val" id="cai-shadow-blur-val">12</span>px</div>
                            <input type="range" id="cai-shadow-blur" min="0" max="40" value="12">
                        </div>
                        <div>
                            <div class="cai-section-title">Offset Y <span class="cai-slider-val" id="cai-shadow-offset-y-val">4</span>px</div>
                            <input type="range" id="cai-shadow-offset-y" min="-20" max="20" value="4">
                        </div>
                    </div>
                    <div class="cai-section-title" style="margin-top:8px;">Opacity <span class="cai-slider-val" id="cai-shadow-opacity-val">30%</span></div>
                    <input type="range" id="cai-shadow-opacity" min="0" max="1" step="0.01" value="0.3">
                </div>
            ` },
            { id: 'setting-bubbles-reset', label: 'Reset Bubble Settings', category: 'Bubble Chat', html: `<button class="cai-reset-btn" data-category="bubbles">Reset to Default</button>` },

            // Corners
            { id: 'setting-corner-mode', label: 'Corner Mode Uniform Custom', category: 'Corners', html: `
                <div class="cai-section-title">Corner Mode</div>
                <div class="cai-two-mode-btns">
                    <button id="cai-corner-uniform" class="cai-mode-btn2 active">Uniform</button>
                    <button id="cai-corner-custom" class="cai-mode-btn2">Custom</button>
                </div>
            ` },
            { id: 'setting-corner-radius', label: 'Corner Radius Top Left Right Bottom', category: 'Corners', html: `
                <div id="cai-uniform-group">
                    <div class="cai-two-col">
                        <div>
                            <div class="cai-section-title">Corner Radius <span class="cai-slider-val" id="cai-uniform-val">18</span>px</div>
                            <input type="range" id="cai-uniform-radius" min="0" max="60" step="2" value="18">
                        </div>
                        <div class="cai-corner-preview-box"><div id="cai-uniform-preview" class="cai-preview-shape" style="border-radius:18px;"></div></div>
                    </div>
                </div>
                <div id="cai-custom-group" class="cai-hidden">
                    <div class="cai-corner-grid">
                        <div class="cai-corner-item">
                            <div class="cai-section-title">Top-Left <span class="cai-slider-val" id="cai-tl-val">18</span>px</div>
                            <input type="range" id="cai-corner-tl" min="0" max="60" step="2" value="18">
                        </div>
                        <div class="cai-corner-item">
                            <div class="cai-section-title">Top-Right <span class="cai-slider-val" id="cai-tr-val">18</span>px</div>
                            <input type="range" id="cai-corner-tr" min="0" max="60" step="2" value="18">
                        </div>
                        <div class="cai-corner-item">
                            <div class="cai-section-title">Bottom-Right <span class="cai-slider-val" id="cai-br-val">18</span>px</div>
                            <input type="range" id="cai-corner-br" min="0" max="60" step="2" value="18">
                        </div>
                        <div class="cai-corner-item">
                            <div class="cai-section-title">Bottom-Left <span class="cai-slider-val" id="cai-bl-val">18</span>px</div>
                            <input type="range" id="cai-corner-bl" min="0" max="60" step="2" value="18">
                        </div>
                    </div>
                    <div class="cai-corner-preview-box"><div id="cai-custom-preview" class="cai-preview-shape"></div></div>
                </div>
            ` },
            { id: 'setting-corners-reset', label: 'Reset Corners', category: 'Corners', html: `<button class="cai-reset-btn" data-category="corners">Reset to Default</button>` },

            // Typography
            { id: 'setting-font-family', label: 'Font Family Custom URL Weight', category: 'Typography', html: `
                <div class="cai-two-col">
                    <div>
                        <div class="cai-section-title">Font Family</div>
                        <div class="cai-select-wrapper">
                            <select id="cai-font-family">
                                <option value="custom">Custom Font URL</option>
                                ${Object.keys(GOOGLE_FONTS).map(f=>`<option value="${f}">${f}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div class="cai-section-title">Font Weight</div>
                        <div class="cai-select-wrapper">
                            <select id="cai-font-weight">
                                <option value="300">Light</option>
                                <option value="400" selected>Regular</option>
                                <option value="500">Medium</option>
                                <option value="600">Semi-Bold</option>
                                <option value="700">Bold</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div id="cai-custom-font-group" class="cai-hidden" style="margin-top:10px;">
                    <div class="cai-section-title">Custom Google Font URL</div>
                    <input type="text" id="cai-custom-font-url" placeholder="https://fonts.googleapis.com/css2?family=...">
                </div>
            ` },
            { id: 'setting-font-size', label: 'Font Size Line Height', category: 'Typography', html: `
                <div class="cai-two-col">
                    <div>
                        <div class="cai-section-title">Font Size <span class="cai-slider-val" id="cai-fontsize-val">14</span>px</div>
                        <input type="range" id="cai-font-size" min="10" max="24" step="1" value="14">
                    </div>
                    <div>
                        <div class="cai-section-title">Line Height <span class="cai-slider-val" id="cai-lineheight-val">1.5</span></div>
                        <input type="range" id="cai-line-height" min="1.2" max="2.0" step="0.05" value="1.5">
                    </div>
                </div>
            ` },
            { id: 'setting-italic', label: 'Italic Text Color', category: 'Typography', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="cai-section-title" style="margin:0;">Italic Text Color</span>
                    <label class="cai-switch-label"><input type="checkbox" id="cai-italic-enabled" checked><span class="cai-switch-slider"></span></label>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                    <div style="position:relative;">
                        <button class="cai-color-btn" id="cai-italic-color-btn" onclick="document.getElementById('cai-italic-color').click()">Select to change</button>
                        <input type="color" id="cai-italic-color" value="#a855f7" style="position:absolute;opacity:0;width:0;height:0;">
                    </div>
                    <div class="cai-text-preview" style="font-style:italic;">Preview</div>
                </div>
            ` },
            { id: 'setting-bold', label: 'Bold Text Color', category: 'Typography', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="cai-section-title" style="margin:0;">Bold Text Color</span>
                    <label class="cai-switch-label"><input type="checkbox" id="cai-bold-enabled" checked><span class="cai-switch-slider"></span></label>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                    <div style="position:relative;">
                        <button class="cai-color-btn" id="cai-bold-color-btn" onclick="document.getElementById('cai-bold-color').click()">Select to change</button>
                        <input type="color" id="cai-bold-color" value="#f59e0b" style="position:absolute;opacity:0;width:0;height:0;">
                    </div>
                    <div class="cai-text-preview" style="font-weight:bold;">Preview</div>
                </div>
            ` },
            { id: 'setting-text-colors', label: 'Text Color Mode Global Separate AI User', category: 'Typography', html: `
                <div class="cai-section-title">Text Color Mode</div>
                <div class="cai-select-wrapper" style="margin-bottom:10px;">
                    <select id="cai-text-color-mode">
                        <option value="global">Global</option>
                        <option value="separate">Separate</option>
                    </select>
                </div>
                <div id="cai-text-global-group">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span class="cai-section-title" style="margin:0;">Global Text Color</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-text-global-color-btn" onclick="document.getElementById('cai-text-global-color').click()">Select to change</button>
                            <input type="color" id="cai-text-global-color" value="#e0e0e0" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                </div>
                <div id="cai-text-separate-group" class="cai-hidden">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <span class="cai-section-title" style="margin:0;">AI Text Color</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-text-ai-color-btn" onclick="document.getElementById('cai-text-ai-color').click()">Select to change</button>
                            <input type="color" id="cai-text-ai-color" value="#e0e0e0" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span class="cai-section-title" style="margin:0;">User Text Color</span>
                        <div style="position:relative;">
                            <button class="cai-color-btn" id="cai-text-user-color-btn" onclick="document.getElementById('cai-text-user-color').click()">Select to change</button>
                            <input type="color" id="cai-text-user-color" value="#e0e0e0" style="position:absolute;opacity:0;width:0;height:0;">
                        </div>
                    </div>
                </div>
            ` },
            { id: 'setting-typography-reset', label: 'Reset Typography', category: 'Typography', html: `<button class="cai-reset-btn" data-category="typography">Reset to Default</button>` },

            // Presets
            { id: 'setting-presets', label: 'Save Load Delete Export Import Preset', category: 'Presets', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <span class="cai-section-title" style="margin:0;">Save Current Presets</span>
                    <button class="cai-import-btn" id="cai-import-trigger">Import Preset</button>
                    <input type="file" id="cai-import-file" accept=".json" style="display:none;">
                </div>
                <div style="display:flex;gap:8px;margin-bottom:16px;">
                    <input type="text" id="cai-preset-name" placeholder="Preset name" style="flex:1;">
                    <button id="cai-save-preset" class="cai-btn-accent">Save</button>
                </div>
                <div class="cai-section-title">Saved Presets</div>
                <div id="cai-preset-list" class="cai-preset-list"></div>
            ` },

            // Miscellaneous
            { id: 'setting-misc-export', label: 'Export Chat Conversation Download HTML', category: 'Miscellaneous', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div class="cai-section-title" style="margin:0;font-size:12px;color:#d0d0d8;">Export this current chatbot conversation</div>
                        <div class="cai-info-small" style="margin-top:3px;">Download your current chatbot in a clean HTML format.</div>
                    </div>
                    <button id="cai-export-chat-btn" style="
                        display:flex;align-items:center;gap:6px;
                        padding:7px 13px;
                        background:#1e1e2e;border:1px solid rgba(255,255,255,0.1);
                        border-radius:8px;color:#d0d0d8;font-size:12px;
                        font-family:inherit;cursor:pointer;white-space:nowrap;
                        transition:background 0.15s;flex-shrink:0;
                    ">Export Chat <span style="opacity:0.5;font-size:11px;">›</span></button>
                </div>
            ` },
            { id: 'setting-misc-disclaimer', label: 'Remove Disclaimer Text AI Chatbot Warning', category: 'Miscellaneous', html: `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div class="cai-section-title" style="margin:0;font-size:12px;color:#d0d0d8;">Remove disclaimer text</div>
                        <div class="cai-info-small" style="margin-top:3px;">Remove disclaimer text on a chatbot. Just remember you're still talking to a bot.</div>
                    </div>
                    <label class="cai-switch-label">
                        <input type="checkbox" id="cai-disclaimer-toggle">
                        <span class="cai-switch-slider"></span>
                    </label>
                </div>
            ` },
        ];

        const CATEGORIES = ['Background', 'Bubble Chat', 'Corners', 'Typography', 'Presets', 'Miscellaneous'];

        // ============================================
        // CREATE UI
        // ============================================
        const settingsBtn = document.createElement('div');
        settingsBtn.id = 'cai-settings-btn';
        settingsBtn.innerHTML = '⚙️';
        document.body.appendChild(settingsBtn);

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'cai-settings-panel';
        settingsPanel.innerHTML = `
    <div class="cai-panel-header" id="cai-drag-handle">
        <span class="cai-panel-title">CharFlow - Character AI Customization</span>
        <button id="cai-close-panel" class="cai-close-btn">✕</button>
    </div>
    <div class="cai-controls-row">
        <div class="cai-select-wrapper cai-category-select">
            <select id="cai-category-select">
                ${!GM_getValue('cai_onboarded', false) ? `<option value="">Select Category</option>` : ''}
                ${CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join('')}
            </select>
        </div>
        <div class="cai-search-wrapper">
            <span class="cai-search-icon">🔍</span>
            <input type="text" id="cai-search-input" placeholder="Search settings..." class="cai-search-input">
        </div>
    </div>
    <div class="cai-panel-content" id="cai-panel-content">
        ${!GM_getValue('cai_onboarded', false) ? `
            <div class="cai-empty-state" id="cai-select-hint">
                <div class="cai-empty-icon">👆</div>
                <div>Select a category above to get started.</div>
                <div class="cai-empty-sub">This won't show again.</div>
            </div>
        ` : `
            <div class="cai-empty-state">
                <div class="cai-empty-icon">🙁</div>
                <div>Nothing to see here...</div>
                <div class="cai-empty-sub">Select a category above.</div>
            </div>
        `}
    </div>
    <div class="cai-panel-footer">
        <button id="cai-reset-all" class="cai-reset-all-btn">Reset All to Default</button>
    </div>
`;
        document.body.appendChild(settingsPanel);

        // ============================================
        // RENDER SETTINGS
        // ============================================
        let currentCategory = GM_getValue('cai_last_category', '');

        function renderSettings(category, searchQuery = '') {
            const content = document.getElementById('cai-panel-content');
            if (!content) return;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matches = ALL_SETTINGS.filter(s => s.label.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
                if (matches.length === 0) {
                    content.innerHTML = `<div class="cai-empty-state"><div class="cai-empty-icon">🔍</div><div>No results for "${searchQuery}"</div></div>`;
                } else {
                    content.innerHTML = matches.map(s => `<div class="cai-settings-card"><div class="cai-card-category-badge">${s.category}</div>${s.html}</div>`).join('');
                }
            } else if (category) {
                const filtered = ALL_SETTINGS.filter(s => s.category === category);
                if (filtered.length === 0) {
                    content.innerHTML = `<div class="cai-empty-state"><div>Nothing here.</div></div>`;
                } else {
                    content.innerHTML = `<div class="cai-category-heading">${category}</div>${filtered.map(s=>`<div class="cai-settings-card">${s.html}</div>`).join('')}`;
                }
            } else {
                content.innerHTML = `<div class="cai-empty-state"><div class="cai-empty-icon">🙁</div><div>Nothing to see here...</div><div class="cai-empty-sub">Select a category above.</div></div>`;
            }

            setupListeners();
            requestAnimationFrame(() => {
            syncUIWithSettings();
            updateCornerPreviews();
            if (category === 'Presets' || searchQuery.toLowerCase().includes('preset')) loadPresetList();
        });
        }

        // ============================================
        // DRAGGABLE
        // ============================================
        let isDraggingBtn = false, startX, startY, initialLeft, initialTop;
        const posLeft = GM_getValue('cai_btn_left', null), posTop = GM_getValue('cai_btn_top', null);
        if (posLeft && posTop) { settingsBtn.style.left = posLeft; settingsBtn.style.top = posTop; }
        else { settingsBtn.style.left = '20px'; settingsBtn.style.top = '50%'; settingsBtn.style.transform = 'translateY(-50%)'; }

        settingsBtn.addEventListener('mousedown', e => { e.preventDefault(); isDraggingBtn = true; startX = e.clientX; startY = e.clientY; const r = settingsBtn.getBoundingClientRect(); initialLeft = r.left; initialTop = r.top; settingsBtn.style.cursor = 'grabbing'; });
        window.addEventListener('mousemove', e => { if (!isDraggingBtn) return; let l = initialLeft + e.clientX - startX, t = initialTop + e.clientY - startY; l = Math.min(window.innerWidth - settingsBtn.offsetWidth, Math.max(0, l)); t = Math.min(window.innerHeight - settingsBtn.offsetHeight, Math.max(0, t)); settingsBtn.style.left = l+'px'; settingsBtn.style.top = t+'px'; settingsBtn.style.transform = 'none'; });
        window.addEventListener('mouseup', () => { if (isDraggingBtn) { isDraggingBtn = false; settingsBtn.style.cursor = 'pointer'; GM_setValue('cai_btn_left', settingsBtn.style.left); GM_setValue('cai_btn_top', settingsBtn.style.top); } });

        let isDraggingPanel = false, panelStartX, panelStartY, panelInitLeft, panelInitTop;
        const panelPosLeft = GM_getValue('cai_panel_left', null), panelPosTop = GM_getValue('cai_panel_top', null);
        const dragHandle = document.getElementById('cai-drag-handle');
        if (panelPosLeft && panelPosTop) { settingsPanel.style.left = panelPosLeft; settingsPanel.style.top = panelPosTop; settingsPanel.style.transform = 'none'; }

        dragHandle.addEventListener('mousedown', e => { e.preventDefault(); isDraggingPanel = true; panelStartX = e.clientX; panelStartY = e.clientY; const r = settingsPanel.getBoundingClientRect(); panelInitLeft = r.left; panelInitTop = r.top; dragHandle.style.cursor = 'grabbing'; settingsPanel.style.transform = 'none'; });
        window.addEventListener('mousemove', e => { if (!isDraggingPanel) return; let l = panelInitLeft + e.clientX - panelStartX, t = panelInitTop + e.clientY - panelStartY; l = Math.min(window.innerWidth - settingsPanel.offsetWidth - 10, Math.max(10, l)); t = Math.min(window.innerHeight - settingsPanel.offsetHeight - 10, Math.max(10, t)); settingsPanel.style.left = l+'px'; settingsPanel.style.top = t+'px'; });
        window.addEventListener('mouseup', () => { if (isDraggingPanel) { isDraggingPanel = false; dragHandle.style.cursor = 'grab'; GM_setValue('cai_panel_left', settingsPanel.style.left); GM_setValue('cai_panel_top', settingsPanel.style.top); } });
        dragHandle.style.cursor = 'grab';

        // Panel toggle
        let panelOpen = false;
        settingsBtn.addEventListener('click', () => {
            if (!isDraggingBtn) {
                panelOpen = !panelOpen;
                if (panelOpen) {
                    if (!GM_getValue('cai_panel_left', null)) {
                        settingsPanel.style.left = '';
                        settingsPanel.style.top = '';
                        settingsPanel.style.transform = 'translate(-50%, -50%)';
                    } else {
                        settingsPanel.style.transform = 'none';
                    }
                    const lastCat = GM_getValue('cai_last_category', '');
                    if (lastCat) {
                        document.getElementById('cai-category-select').value = lastCat;
                        currentCategory = lastCat;
                        renderSettings(lastCat);
                    }
                }
                settingsPanel.classList.toggle('open', panelOpen);
            }
        });

        document.getElementById('cai-close-panel').addEventListener('click', () => { panelOpen = false; settingsPanel.classList.remove('open'); });

        document.getElementById('cai-category-select').addEventListener('change', e => {
            currentCategory = e.target.value;
            GM_setValue('cai_last_category', currentCategory);
            GM_setValue('cai_onboarded', true); // mark as seen
            document.getElementById('cai-search-input').value = '';

            const placeholder = document.querySelector('#cai-category-select option[value=""]');
            if (placeholder) placeholder.remove();

            document.getElementById('cai-search-input').value = '';
            renderSettings(currentCategory);
        });

        let searchDebounce = null;
        document.getElementById('cai-search-input').addEventListener('input', e => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => renderSettings(currentCategory, e.target.value), 200);
        });

        document.getElementById('cai-reset-all').addEventListener('click', resetAllToDefault);

        // ============================================
        // EVENT LISTENERS (re-run after each render)
        // ============================================
        function setupListeners() {
            // Reset buttons
            document.querySelectorAll('.cai-reset-btn').forEach(btn => btn.addEventListener('click', () => resetCategory(btn.dataset.category)));

            // Background type
            document.getElementById("cai-bg-type")?.addEventListener("change", (e) => {
                saveState("bgType", e.target.value);
                if (e.target.value !== "url") saveState("bgUrl", "");
                if (e.target.value !== "file") saveState("bgFile", "");
                document.getElementById('cai-url-input')?.classList.toggle('cai-hidden', e.target.value !== 'url');
                document.getElementById('cai-file-input')?.classList.toggle('cai-hidden', e.target.value !== 'file');
                applyBackground();
            });
            document.getElementById('cai-apply-bg')?.addEventListener('click', () => {
                const url = document.getElementById('cai-bg-url')?.value;
                if (url) { saveState('bgUrl', url); saveState('bgType', 'url'); applyBackground(); showNotification('Background applied', 'success'); }
                else showNotification('Enter a valid URL', 'error');
            });
            document.getElementById('cai-bg-file')?.addEventListener('change', e => {
                const file = e.target.files[0];
                if (file) { const r = new FileReader(); r.onload = ev => { saveState('bgFile', ev.target.result); saveState('bgType', 'file'); applyBackground(); showNotification('Background loaded', 'success'); }; r.readAsDataURL(file); }
            });

            // Sliders
            const sliders = [
                ['cai-bg-blur','cai-blur-val','px', v => { saveState('bgBlur', v+'px'); applyBackground(); }, false],
                ['cai-bg-brightness','cai-bright-val','%', v => { saveState('bgBrightness', v+'%'); applyBackground(); }, false],
                ['cai-overlay-opacity','cai-overlay-val','%', v => { saveState('bgOverlayOpacity', v); applyBackground(); }, false],
                ['cai-message-spacing','cai-spacing-val','px', v => { saveState('bubbleSpacing', v+'px'); applyStyles(); }, false],
                ['cai-glass-blur','cai-glass-blur-val','px', v => { saveState('glassBlur', v); applyStyles(); }, false],
                ['cai-glass-opacity','cai-glass-opacity-val','%', v => { saveState('glassOpacity', v); applyStyles(); }, true],
                ['cai-border-width','cai-border-width-val','px', v => { saveState('borderWidth', v); applyStyles(); }, false],
                ['cai-shadow-blur','cai-shadow-blur-val','px', v => { saveState('shadowBlur', v); applyStyles(); }, false],
                ['cai-shadow-offset-y','cai-shadow-offset-y-val','px', v => { saveState('shadowOffsetY', v); applyStyles(); }, false],
                ['cai-shadow-opacity','cai-shadow-opacity-val','%', v => { saveState('shadowOpacity', v); applyStyles(); }, true],
                ['cai-font-size','cai-fontsize-val','px', v => { saveState('fontSize', v+'px'); applyStyles(); }, false],
                ['cai-line-height','cai-lineheight-val','', v => { saveState('lineHeight', v); applyStyles(); }, false],
                ['cai-uniform-radius','cai-uniform-val','px', v => { ['cornerTopLeft','cornerTopRight','cornerBottomRight','cornerBottomLeft'].forEach(k => saveState(k, v)); updateCornerPreviews(); applyStyles(); }, false],
                ['cai-corner-tl','cai-tl-val','px', v => { saveState('cornerTopLeft', v); updateCornerPreviews(); applyStyles(); }, false],
                ['cai-corner-tr','cai-tr-val','px', v => { saveState('cornerTopRight', v); updateCornerPreviews(); applyStyles(); }, false],
                ['cai-corner-br','cai-br-val','px', v => { saveState('cornerBottomRight', v); updateCornerPreviews(); applyStyles(); }, false],
                ['cai-corner-bl','cai-bl-val','px', v => { saveState('cornerBottomLeft', v); updateCornerPreviews(); applyStyles(); }, false],
            ];

            sliders.forEach(([sid, vid, suffix, fn, isPercent]) => {
                const slider = document.getElementById(sid), valEl = document.getElementById(vid);
                if (slider && valEl) slider.addEventListener('input', e => {
                    valEl.textContent = isPercent ? (Math.round(parseFloat(e.target.value)*100)+'%') : (e.target.value+suffix);
                    fn(e.target.value);
                });
            });

            // Color pickers
            const colors = [
                ['cai-overlay-color','cai-overlay-color-btn', 'bgOverlayColor', () => applyBackground()],
                ['cai-global-color','cai-global-color-btn', 'bubbleGlobal', () => applyStyles()],
                ['cai-ai-color','cai-ai-color-btn', 'bubbleAi', () => applyStyles()],
                ['cai-user-color','cai-user-color-btn', 'bubbleUser', () => applyStyles()],
                ['cai-border-color','cai-border-color-btn', 'borderColor', () => applyStyles()],
                ['cai-shadow-color','cai-shadow-color-btn', 'shadowColor', () => applyStyles()],
                ['cai-text-global-color','cai-text-global-color-btn', 'textColorGlobal', () => applyStyles()],
                ['cai-text-ai-color','cai-text-ai-color-btn', 'textColorAi', () => applyStyles()],
                ['cai-text-user-color','cai-text-user-color-btn', 'textColorUser', () => applyStyles()],
                ['cai-italic-color','cai-italic-color-btn', 'textItalicColor', () => applyStyles()],
                ['cai-bold-color','cai-bold-color-btn', 'textBoldColor', () => applyStyles()],
            ];
            colors.forEach(([inputId, btnId, stateKey, fn]) => {
                const input = document.getElementById(inputId), btn = document.getElementById(btnId);
                if (input) input.addEventListener('input', e => { saveState(stateKey, e.target.value); if(btn) btn.style.borderColor = e.target.value; fn(); });
            });

            // Bubble mode
            document.getElementById('cai-bubble-mode')?.addEventListener('change', e => {
                saveState('bubbleMode', e.target.value);
                document.getElementById('cai-global-color-group')?.classList.toggle('cai-hidden', e.target.value !== 'global');
                document.getElementById('cai-separate-color-group')?.classList.toggle('cai-hidden', e.target.value !== 'separate');
                applyStyles();
            });

            // Toggles
           document.getElementById('cai-glass-enabled')?.addEventListener('change', e => { saveState('glassEnabled', e.target.checked); applyStyles(); });
            document.getElementById('cai-border-enabled')?.addEventListener('change', e => { saveState('borderEnabled', e.target.checked); applyStyles(); });
            document.getElementById('cai-shadow-enabled')?.addEventListener('change', e => { saveState('shadowEnabled', e.target.checked); applyStyles(); });
            document.getElementById('cai-italic-enabled')?.addEventListener('change', e => { saveState('textItalicEnabled', e.target.checked); applyStyles(); });
            document.getElementById('cai-bold-enabled')?.addEventListener('change', e => { saveState('textBoldEnabled', e.target.checked); applyStyles(); });

            // Font family — show/hide custom URL field immediately on change
            document.getElementById('cai-font-family')?.addEventListener('change', e => {
                saveState('fontFamily', e.target.value);
                const isCustom = e.target.value === 'custom';
                document.getElementById('cai-custom-font-group')?.classList.toggle('cai-hidden', !isCustom);
                if (!isCustom) applyStyles();
            });
            document.getElementById('cai-custom-font-url')?.addEventListener('input', e => saveState('fontCustomUrl', e.target.value));
            document.getElementById('cai-custom-font-url')?.addEventListener('change', () => applyStyles());
            document.getElementById('cai-font-weight')?.addEventListener('change', e => { saveState('fontWeight', e.target.value); applyStyles(); });

            // Text color mode — show/hide global vs separate groups
            document.getElementById('cai-text-color-mode')?.addEventListener('change', e => {
                saveState('textColorMode', e.target.value);
                document.getElementById('cai-text-global-group')?.classList.toggle('cai-hidden', e.target.value !== 'global');
                document.getElementById('cai-text-separate-group')?.classList.toggle('cai-hidden', e.target.value !== 'separate');
                applyStyles();
            });

            // Corner mode buttons
            document.getElementById('cai-corner-uniform')?.addEventListener('click', () => {
                saveState('cornerMode', 'uniform');
                document.getElementById('cai-corner-uniform')?.classList.add('active');
                document.getElementById('cai-corner-custom')?.classList.remove('active');
                document.getElementById('cai-uniform-group')?.classList.remove('cai-hidden');
                document.getElementById('cai-custom-group')?.classList.add('cai-hidden');
                updateCornerPreviews(); applyStyles();
            });
            document.getElementById('cai-corner-custom')?.addEventListener('click', () => {
                saveState('cornerMode', 'custom');
                document.getElementById('cai-corner-custom')?.classList.add('active');
                document.getElementById('cai-corner-uniform')?.classList.remove('active');
                document.getElementById('cai-custom-group')?.classList.remove('cai-hidden');
                document.getElementById('cai-uniform-group')?.classList.add('cai-hidden');
                updateCornerPreviews(); applyStyles();
            });

            // Presets
            document.getElementById('cai-save-preset')?.addEventListener('click', () => {
                const name = document.getElementById('cai-preset-name')?.value?.trim();
                if (name) { savePreset(name); document.getElementById('cai-preset-name').value = ''; }
                else showNotification('Enter a preset name', 'error');
            });
            document.getElementById('cai-import-trigger')?.addEventListener('click', () => document.getElementById('cai-import-file')?.click());
            document.getElementById('cai-import-file')?.addEventListener('change', e => { if (e.target.files?.[0]) { importPreset(e.target.files[0]); e.target.value = ''; } });

            // Miscellaneous — Export Chat
            document.getElementById('cai-export-chat-btn')?.addEventListener('click', () => runExportChat());

            // Miscellaneous — Disclaimer toggle
            const disclaimerToggle = document.getElementById('cai-disclaimer-toggle');
            if (disclaimerToggle) {
                disclaimerToggle.checked = disclaimerHidden;
                disclaimerToggle.addEventListener('change', e => {
                    disclaimerHidden = e.target.checked;
                    GM_setValue('cai_disclaimers_hidden', disclaimerHidden);
                    applyDisclaimerState();
                });
            }
        }

        // ============================================
        // MISCELLANEOUS — EXPORT CHAT
        // ============================================
        function escapeHTMLExport(str) {
            return String(str || "").replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
        }

        async function imageToDataURL(url) {
            try {
                const blob = await fetch(url).then(r => r.blob());
                return await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } catch { return ""; }
        }

        function askExportNames() {
            return new Promise(resolve => {
                const overlay = document.createElement("div");
                overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:1000000;font-family:'Inter',system-ui;`;
                const box = document.createElement("div");
                box.style.cssText = `width:340px;background:#16161e;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:22px;color:#d0d0d8;`;
                box.innerHTML = `
                    <h3 style="margin:0 0 10px;font-size:15px;color:#e0e0f0;">Export Chat</h3>
                    <p style="font-size:12px;color:#8888a0;line-height:1.5;margin:0 0 14px;">Enter your name and the character's name to label the exported chat.</p>
                    <div id="cai-export-error" style="display:none;color:#f87171;font-size:12px;margin-bottom:10px;"></div>
                    <input id="cai-export-user" placeholder="Your name" style="width:100%;padding:9px 12px;margin-bottom:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:#1e1e2e;color:#d0d0d8;font-size:12px;font-family:inherit;box-sizing:border-box;outline:none;">
                    <input id="cai-export-bot" placeholder="Character name" style="width:100%;padding:9px 12px;margin-bottom:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:#1e1e2e;color:#d0d0d8;font-size:12px;font-family:inherit;box-sizing:border-box;outline:none;">
                    <div style="display:flex;gap:8px;">
                        <button id="cai-export-cancel" style="flex:1;padding:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#8888a0;font-size:12px;font-family:inherit;cursor:pointer;">Cancel</button>
                        <button id="cai-export-ok" style="flex:1;padding:10px;background:#3b2f88;border:none;border-radius:8px;color:#c0b0ff;font-size:12px;font-family:inherit;font-weight:700;cursor:pointer;">Export</button>
                    </div>
                `;
                overlay.appendChild(box);
                document.body.appendChild(overlay);
                const errBox = box.querySelector("#cai-export-error");
                const close = res => { overlay.remove(); resolve(res); };
                box.querySelector("#cai-export-cancel").onclick = () => close(null);
                box.querySelector("#cai-export-ok").onclick = () => {
                    const user = box.querySelector("#cai-export-user").value.trim();
                    const bot = box.querySelector("#cai-export-bot").value.trim();
                    if (!user || !bot) { errBox.style.display="block"; errBox.textContent="Both fields are required."; return; }
                    close({ user, bot });
                };
            });
        }

        async function loadAllChatMessages() {
            const container = document.querySelector("#chat-messages");

            if (!container) {
                showNotification('Chat container not found — are you inside a chat?', 'error');
                return false;
            }

            let last = 0, stable = 0;
            const MAX_ATTEMPTS = 20;
            let attempts = 0;

            try {
                while (attempts < MAX_ATTEMPTS) {
                    attempts++;
                    container.scrollTop = -container.scrollHeight;
                    await new Promise(r => setTimeout(r, 1200));

                    const count = container.querySelectorAll(".group").length;

                    if (count === last) {
                        stable++;
                        if (stable > 3) break;
                    } else {
                        stable = 0;
                        last = count;
                    }
                }

                if (attempts >= MAX_ATTEMPTS) {
                    showNotification('Export loaded partially — some older messages may be missing', 'warning');
                }

            } catch (e) {
                console.error('[CharFlow] Failed to load messages:', e);
                showNotification('Failed to load messages — export may be incomplete', 'error');
                return false;
            }

            return true;
        }

        async function extractChatAvatars() {
            let botAvatar = "", userAvatar = "";
            const groups = [...document.querySelectorAll("#chat-messages > .group")];
            for (const g of groups) {
                const img = g.querySelector("img");
                if (!img) continue;
                const isUser = g.querySelector(".flex-row-reverse") !== null;
                try {
                    if (isUser && !userAvatar) userAvatar = await imageToDataURL(img.src);
                    if (!isUser && !botAvatar) botAvatar = await imageToDataURL(img.src);
                } catch (e) {
                    console.warn('[CharFlow] Could not load one of the avatars:', e);
                    // silently continue — avatars are optional
                }
                if (userAvatar && botAvatar) break;
            }
            return { userAvatar, botAvatar };
        }

        function extractChatMessages(userName, botName, avatars) {
            const blocks = [...document.querySelectorAll("#chat-messages > .group")];
            const messages = [];
            for (let i = blocks.length - 1; i >= 0; i--) {
                const block = blocks[i];
                const isUser = block.querySelector(".flex-row-reverse") !== null;
                const node = block.querySelector('[data-testid="completed-message"] .prose');
                if (!node) continue;
                const text = node.innerText.trim();
                if (!text) continue;
                messages.push({ role: isUser ? userName : botName, type: isUser ? "user" : "bot", avatar: isUser ? avatars.userAvatar : avatars.botAvatar, html: node.innerHTML.trim(), text });
            }
            return messages;
        }

        function groupChatMessages(messages) {
            const groups = [];
            for (const m of messages) {
                const prev = groups[groups.length - 1];
                if (prev && prev.type === m.type) { prev.messages.push(m); }
                else { groups.push({ role: m.role, type: m.type, avatar: m.avatar, messages: [m] }); }
            }
            return groups;
        }

        function buildExportHTML(messages, botName) {
            const groups = groupChatMessages(messages);
            const userCount = messages.filter(m => m.type === "user").length;
            const totalWords = messages.reduce((a, m) => a + m.text.split(/\s+/).length, 0);
            const body = groups.map(g => `
                <div class="row ${g.type}">
                    <div class="avatarWrap">${g.avatar ? `<img class="avatar" src="${g.avatar}">` : `<div class="avatar fallback">${escapeHTMLExport(g.role[0].toUpperCase())}</div>`}</div>
                    <div class="stack">
                        <div class="name">${escapeHTMLExport(g.role)}</div>
                        ${g.messages.map(m => `<div class="bubble">${m.html}</div>`).join("")}
                    </div>
                </div>
            `).join("");
            return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTMLExport(botName)} Conversation</title>
<style>

:root{
  --bg:#0f1218;
  --surface:#151a22;
  --surface2:#1c2330;
  --text:#e7edf8;
  --muted:#9aa4b2;

  --primary:#4f8cff;

  --radius:14px;

  --s1:4px;
  --s2:8px;
  --s3:12px;
  --s4:16px;
  --s5:24px;
}

body.light{
  --bg:#f6f7fb;
  --surface:#ffffff;
  --surface2:#f1f5f9;
  --text:#111827;
  --muted:#6b7280;
}

body{
  margin:0;
  padding:28px;
  background:var(--bg);
  color:var(--text);
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
}

.wrap{
  max-width:900px;
  margin:auto;
}

/* HEADER */
header{
  background:var(--surface);
  border:1px solid rgba(148,163,184,.15);
  border-radius:var(--radius);
  padding:var(--s5);
  margin-bottom:var(--s4);
}

h1{
  margin:0 0 var(--s2);
  font-size:24px;
  font-weight:700;
}

.meta{
  font-size:13px;
  color:var(--muted);
}

/* TOOLBAR */
.toolbar{
  position:sticky;
  top:10px;
  display:flex;
  gap:var(--s2);
  padding:var(--s2);
  margin-bottom:var(--s4);
  background:rgba(21,26,34,.9);
  backdrop-filter:blur(10px);
  border-radius:var(--radius);
  border:1px solid rgba(148,163,184,.15);
}

input{
  flex:1;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid rgba(148,163,184,.2);
  background:var(--surface);
  color:var(--text);
  outline:none;
}

input:focus{
  border-color:var(--primary);
}

/* BUTTONS */
button{
  padding:10px 12px;
  border-radius:10px;
  border:none;
  background:var(--primary);
  color:white;
  font-weight:600;
  cursor:pointer;
  transition:.15s ease;
}

button:hover{
  transform:translateY(-1px);
  opacity:.95;
}

/* CHAT LAYOUT */
.chat{
  display:flex;
  flex-direction:column;
  gap:var(--s4);
}

/* MESSAGE ROW */
.row{
  display:flex;
  gap:var(--s3);
  max-width:85%;
  align-items:flex-end;
}

.row.user{
  margin-left:auto;
  flex-direction:row-reverse;
}

/* AVATARS */
.avatar, .fallback{
  width:34px;
  height:34px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:13px;
  font-weight:600;
  background:var(--surface);
  border:1px solid rgba(148,163,184,.15);
  object-fit:cover;
}

/* STACK */
.stack{
  display:flex;
  flex-direction:column;
  gap:var(--s1);
}

/* NAME (subtle hierarchy) */
.name{
  font-size:12px;
  color:var(--muted);
  margin-left:6px;
}

/* MESSAGE SURFACE */
.bubble{
  padding:12px 14px;
  border-radius:var(--radius);
  line-height:1.5;
  font-size:14px;
  background:var(--surface);
  border:1px solid rgba(148,163,184,.12);
  box-shadow:0 6px 18px rgba(0,0,0,.12);
  transition:.15s ease;
}

.bubble:hover{
  transform:translateY(-1px);
}

/* USER VS BOT DIFFERENCE */
.bot .bubble{
  background:var(--surface2);
}

.user .bubble{
  background:rgba(79,140,255,.12);
  border-color:rgba(79,140,255,.25);
}

/* LIGHT MODE SHADOW SOFTER */
body.light .bubble{
  box-shadow:0 4px 14px rgba(0,0,0,.06);
}

</style></head><body>
<div class="wrap">
<header><h1>${escapeHTMLExport(botName)} Conversation</h1>
<div class="meta">${messages.length} messages • ${userCount} user • ${messages.length-userCount} bot • ${totalWords} words • ${new Date().toLocaleString()}</div></header>
<div class="toolbar"><input id="search" placeholder="Filter messages..."><button onclick="document.body.classList.toggle('light')">Theme</button></div>
<div class="chat" id="chat">${body}</div></div>
<script>document.getElementById("search").addEventListener("input",function(){const q=this.value.toLowerCase();document.querySelectorAll(".row").forEach(r=>{r.style.display=!q||r.textContent.toLowerCase().includes(q)?"":"none";});});<\/script>
</body></html>`;
        }

        async function runExportChat() {
            try {
                const res = await askExportNames();
                if (!res) return;

                const { user, bot } = res;

                showNotification('Loading messages...', 'info');
                const loaded = await loadAllChatMessages();
                if (!loaded) return;

                showNotification('Extracting avatars...', 'info');
                const avatars = await extractChatAvatars().catch(e => {
                    console.error('[CharFlow] Avatar extraction failed:', e);
                    showNotification('Could not load avatars — exporting without them', 'warning');
                    return { userAvatar: '', botAvatar: '' };
                });

                showNotification('Building export...', 'info');
                const messages = extractChatMessages(user, bot, avatars);

                if (messages.length === 0) {
                    showNotification('No messages found to export', 'error');
                    return;
                }

                const html = buildExportHTML(messages, bot);
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cai_chat_${bot}.html`;
                a.click();
                URL.revokeObjectURL(url);

                showNotification(`Exported ${messages.length} messages successfully!`, 'success');

            } catch (e) {
                console.error('[CharFlow] Export failed:', e);
                showNotification('Export failed unexpectedly — check the console for details', 'error');
            }
        }

        // ============================================
        // MISCELLANEOUS — REMOVE DISCLAIMER
        // ============================================
        let disclaimerHidden = GM_getValue('cai_disclaimers_hidden', false);
        let disclaimerDebounce = null;
        let disclaimerObserver = null;

        const disclaimerStyle = document.createElement('style');
        disclaimerStyle.textContent = `.cai-disc-anim{transition:opacity 180ms ease,transform 180ms ease;will-change:opacity,transform;}.cai-disc-hide{opacity:0!important;transform:translateX(14px);pointer-events:none;}`;
        document.head.appendChild(disclaimerStyle);

        function hideDisclaimer(el) {
            if (el.dataset.caiHidden === "1") return;
            el.dataset.caiHidden = "1";
            el.classList.add('cai-disc-anim');
            void el.offsetWidth;
            el.classList.add('cai-disc-hide');
            el.addEventListener('transitionend', function h() { el.style.display='none'; el.removeEventListener('transitionend',h); });
        }

        function showDisclaimer(el, displayType) {
            if (el.dataset.caiHidden !== "1") return;
            el.dataset.caiHidden = "0";
            el.style.display = displayType;
            el.classList.add('cai-disc-anim');
            el.classList.add('cai-disc-hide');
            void el.offsetWidth;
            el.classList.remove('cai-disc-hide');
        }

        function applyDisclaimerState() {
            const bigWarnings = document.querySelectorAll(
                'div.flex.flex-row.space-x-4.rounded-xl.bg-warning\\/20, ' +
                'div.flex.flex-row.space-x-4.rounded-xl.max-w-\\[340px\\].bg-warning\\/20'
            );
            bigWarnings.forEach(el => { disclaimerHidden ? hideDisclaimer(el) : showDisclaimer(el, 'flex'); });

            const smallText = document.querySelectorAll(
                'p.text-muted-foreground.text-\\[0\\.70rem\\].select-none'
            );
            smallText.forEach(el => {
                if (
                    el.textContent.includes("A.I. chatbot") ||
                    el.textContent.includes("not a real person") ||
                    el.textContent.includes("not a licensed professional")
                ) {
                    disclaimerHidden ? hideDisclaimer(el) : showDisclaimer(el, 'block');
                }
            });

            // Target the chevron by walking up from the SVG path itself
            document.querySelectorAll('svg path[d="m6 9 6 6 6-6"]').forEach(path => {
                const btn = path.closest('button');
                if (!btn) return;
                disclaimerHidden ? hideDisclaimer(btn) : showDisclaimer(btn, 'flex');
            });
        }

        function startDisclaimerObserver() {
            if (disclaimerObserver) return;
            disclaimerObserver = new MutationObserver(() => {
                clearTimeout(disclaimerDebounce);
                disclaimerDebounce = setTimeout(() => { if (disclaimerHidden) applyDisclaimerState(); }, 100);
            });
            disclaimerObserver.observe(document.body, { childList: true, subtree: true });
        }

        // Apply disclaimer state on load
        applyDisclaimerState();
        startDisclaimerObserver();

        // ============================================
        // INIT
        // ============================================
        function cleanup() {
            if (observer) observer.disconnect();
            cleanupOldFonts(); cleanupBackground();
            if (globalStyleElement?.parentNode) globalStyleElement.remove();
            if (notificationElement) notificationElement.remove();
            disableScript();
        }
        window.addEventListener('beforeunload', cleanup);

        let debounceTimer = null;
        observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                applyStyles();
                if (disclaimerHidden) applyDisclaimerState();
            }, 300);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        function isInChat() {
            return window.location.pathname.includes('/chat/');
        }

        function disableScript() {
            try {
                cleanupBackground();
                if (globalStyleElement && globalStyleElement.parentNode) {
                    globalStyleElement.remove();
                    globalStyleElement = null;
                    lastStyleOutput = '';
                }
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            } catch (e) {
                console.error('[CharFlow] Failed to disable script:', e);
                showNotification('CharFlow failed to clean up properly — try refreshing', 'error');
            }
        }

        function enableScript() {
            try {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
                observer = new MutationObserver(() => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        applyStyles();
                        if (disclaimerHidden) applyDisclaimerState();
                    }, 300);
                });
                observer.observe(document.body, { childList: true, subtree: true });
                applyBackground();
                applyStyles();
            } catch (e) {
                console.error('[CharFlow] Failed to re-enable script:', e);
                showNotification('CharFlow failed to reactivate — try refreshing the page', 'error');
            }
        }

        const _pushState = history.pushState.bind(history);
        history.pushState = function(...args) {
            _pushState(...args);
            setTimeout(() => {
                if (isInChat()) {
                    enableScript();
                } else {
                    disableScript();
                }
            }, 200);
        };

        // Also catch browser back/forward
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                if (isInChat()) {
                    enableScript();
                } else {
                    disableScript();
                }
            }, 200);
        });

        loadState();
        applyBackground();
        applyStyles();
        ensureBackgroundLayer();
    }

    // ============================================
    // CSS STYLES
    // ============================================
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        #cai-settings-btn {
            position: fixed; z-index: 9998;
            width: 44px; height: 44px;
            background: #1a1a2e; color: white;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            cursor: pointer; user-select: none;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid rgba(255,255,255,0.1);
        }
        #cai-settings-btn:hover { transform: scale(1.06); box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
        #cai-settings-btn:active { transform: scale(0.95); }

        #cai-settings-panel {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.97);
            width: 360px; max-width: 95vw; max-height: 88vh;
            background: #16161e;
            border-radius: 16px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
            z-index: 10000;
            opacity: 0; visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #d0d0d8;
            display: flex; flex-direction: column;
        }
        #cai-settings-panel.open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }

        .cai-panel-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            flex-shrink: 0; user-select: none;
        }
        .cai-panel-title { font-size: 12px; font-weight: 500; color: #8888a0; letter-spacing: 0.02em; }
        .cai-close-btn {
            background: none; border: none; color: #8888a0; font-size: 16px; cursor: pointer;
            width: 28px; height: 28px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.15s, color 0.15s;
        }
        .cai-close-btn:hover { background: rgba(255,255,255,0.08); color: #d0d0d8; }

        .cai-controls-row {
            display: flex; gap: 8px; padding: 12px 16px;
            border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
        }
        .cai-category-select { flex: 0 0 160px; }

        .cai-select-wrapper { position: relative; }
        .cai-select-wrapper::after { content:'▾'; position:absolute; right:10px; top:50%; transform:translateY(-50%); color:#5555aa; pointer-events:none; font-size:12px; }
        .cai-select-wrapper select {
            width: 100%; padding: 8px 28px 8px 12px;
            background: #1e1e2e; border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; color: #d0d0d8; font-size: 12px; font-family: inherit;
            appearance: none; cursor: pointer; outline: none; transition: border-color 0.15s;
        }
        .cai-select-wrapper select:focus { border-color: rgba(100,80,180,0.5); }

        .cai-search-wrapper { flex: 1; position: relative; display: flex; align-items: center; }
        .cai-search-icon { position: absolute; left: 10px; font-size: 12px; pointer-events: none; }
        .cai-search-input {
            width: 100%; padding: 8px 12px 8px 30px;
            background: #1e1e2e; border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; color: #d0d0d8; font-size: 12px; font-family: inherit;
            outline: none; transition: border-color 0.15s; box-sizing: border-box;
        }
        .cai-search-input:focus { border-color: rgba(100,80,180,0.5); }
        .cai-search-input::placeholder { color: #555568; }

        .cai-panel-content {
            flex: 1; overflow-y: auto; padding: 12px 16px;
            scrollbar-width: thin; scrollbar-color: #333350 transparent;
        }
        .cai-panel-content::-webkit-scrollbar { width: 4px; }
        .cai-panel-content::-webkit-scrollbar-track { background: transparent; }
        .cai-panel-content::-webkit-scrollbar-thumb { background: #333350; border-radius: 2px; }

        .cai-empty-state { text-align: center; padding: 40px 20px; color: #555568; font-size: 13px; }
        .cai-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.4; }
        .cai-empty-sub { margin-top: 6px; font-size: 12px; color: #404058; }

        .cai-category-heading { font-size: 16px; font-weight: 600; color: #e0e0f0; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .cai-card-category-badge { font-size: 10px; color: #6655bb; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }

        .cai-settings-card {
            background: #1c1c28; border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px; padding: 14px; margin-bottom: 10px;
        }
        .cai-section-title { font-size: 11px; font-weight: 500; color: #8888a0; margin-bottom: 8px; letter-spacing: 0.02em; }

        .cai-settings-card input[type="text"] {
            width: 100%; padding: 8px 12px;
            background: #12121c; border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; color: #d0d0d8; font-size: 12px; font-family: inherit;
            outline: none; box-sizing: border-box; transition: border-color 0.15s;
        }
        .cai-settings-card input[type="text"]:focus { border-color: rgba(100,80,180,0.5); }

        .cai-settings-card input[type="range"] {
            width: 100%; height: 4px; -webkit-appearance: none; appearance: none;
            background: #2a2a3e; border-radius: 2px; outline: none; cursor: pointer;
        }
        .cai-settings-card input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
            background: #6655bb; cursor: pointer; box-shadow: 0 0 0 2px rgba(102,85,187,0.3);
        }
        .cai-settings-card input[type="range"]::-moz-range-thumb {
            width: 14px; height: 14px; border-radius: 50%;
            background: #6655bb; cursor: pointer; border: none;
        }
        .cai-slider-val { color: #d0d0d8; font-weight: 500; }

        .cai-color-btn {
            padding: 6px 14px;
            background: #1e1e2e; border: 2px solid #444466;
            border-radius: 8px; color: #d0d0d8; font-size: 11px;
            cursor: pointer; font-family: inherit;
            transition: background 0.15s; white-space: nowrap;
        }
        .cai-color-btn:hover { background: #28283c; }

        .cai-switch-label { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
        .cai-switch-label input { opacity: 0; width: 0; height: 0; }
        .cai-switch-slider { position: absolute; cursor: pointer; top:0; left:0; right:0; bottom:0; background:#2a2a3e; border-radius:22px; transition:0.2s; }
        .cai-switch-slider:before { position:absolute; content:""; height:16px; width:16px; left:3px; bottom:3px; background:#8888a0; border-radius:50%; transition:0.2s; }
        .cai-switch-label input:checked + .cai-switch-slider { background: #3b2f88; }
        .cai-switch-label input:checked + .cai-switch-slider:before { transform: translateX(18px); background: #a090ff; }

        .cai-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .cai-two-mode-btns { display: flex; gap: 8px; margin-top: 4px; }
        .cai-mode-btn2 {
            flex: 1; padding: 8px; background: #1e1e2e;
            border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
            color: #8888a0; font-size: 12px; font-family: inherit; cursor: pointer; transition: all 0.15s;
        }
        .cai-mode-btn2.active { background: #2a2040; border-color: #6655bb; color: #c0b0ff; }
        .cai-mode-btn2:hover:not(.active) { background: #22223a; color: #d0d0d8; }

        .cai-corner-preview-box { display: flex; align-items: center; justify-content: center; }
        .cai-preview-shape { width: 52px; height: 52px; background: #6655bb; transition: border-radius 0.1s; border-radius: 18px; }
        .cai-corner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .cai-corner-item { background: #12121c; border-radius: 8px; padding: 10px; }

        .cai-info-small { font-size: 10px; color: #555568; margin-top: 4px; }
        .cai-text-preview { padding: 6px 14px; background: #12121c; border-radius: 8px; font-size: 13px; color: #d0d0d8; min-width: 80px; text-align: center; }

        .cai-preset-list { margin-top: 8px; }
        .cai-preset-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #12121c; border-radius: 8px; margin-bottom: 6px; }
        .cai-preset-name { font-size: 12px; color: #d0d0d8; word-break: break-word; }
        .cai-preset-dot-menu { position: relative; flex-shrink: 0; }
        .cai-preset-dot-btn { background: none; border: none; color: #8888a0; font-size: 14px; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s; letter-spacing: 2px; }
        .cai-preset-dot-btn:hover { background: rgba(255,255,255,0.08); color: #d0d0d8; }
        .cai-preset-dropdown { position: absolute; right: 0; top: 100%; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 100; min-width: 110px; display: none; overflow: hidden; }
        .cai-preset-dropdown.open { display: block; }
        .cai-preset-dropdown button { display: block; width: 100%; text-align: left; padding: 9px 14px; background: none; border: none; color: #d0d0d8; font-size: 12px; font-family: inherit; cursor: pointer; transition: background 0.12s; }
        .cai-preset-dropdown button:hover { background: rgba(255,255,255,0.07); }
        .cai-preset-load:hover { color: #a090ff !important; }
        .cai-preset-delete:hover { color: #ff7070 !important; }
        .cai-preset-export:hover { color: #60d499 !important; }
        .cai-empty-presets { text-align: center; color: #555568; font-size: 12px; padding: 20px 0; }

        .cai-btn { padding: 8px 14px; background: #3b2f88; border: none; border-radius: 8px; color: #c0b0ff; font-size: 12px; font-family: inherit; cursor: pointer; transition: background 0.15s; }
        .cai-btn:hover { background: #4a3a9c; }
        .cai-btn-accent { padding: 8px 16px; background: #3b2f88; border: none; border-radius: 8px; color: #c0b0ff; font-size: 12px; font-family: inherit; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
        .cai-btn-accent:hover { background: #4a3a9c; }
        .cai-import-btn { padding: 6px 12px; background: transparent; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #8888a0; font-size: 11px; font-family: inherit; cursor: pointer; white-space: nowrap; transition: all 0.15s; }
        .cai-import-btn:hover { background: rgba(255,255,255,0.06); color: #d0d0d8; }
        .cai-reset-btn { width: 100%; padding: 9px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #cc7070; font-size: 12px; font-family: inherit; cursor: pointer; transition: all 0.15s; }
        .cai-reset-btn:hover { background: rgba(239,68,68,0.15); }
        .cai-file-label { display: block; padding: 8px 12px; background: #12121c; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #8888a0; font-size: 12px; cursor: pointer; text-align: center; }
        .cai-file-label input { display: none; }
        .cai-file-label:hover { background: #1a1a2a; color: #d0d0d8; }

        .cai-panel-footer { padding: 10px 16px; border-top: 1px solid rgba(255,255,255,0.07); flex-shrink: 0; }
        .cai-reset-all-btn { width: 100%; padding: 9px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #8888a0; font-size: 12px; font-family: inherit; cursor: pointer; transition: all 0.15s; }
        .cai-reset-all-btn:hover { background: rgba(255,255,255,0.08); color: #d0d0d8; }

        .cai-hidden { display: none !important; }

        /* Notifications */
        .cai-notification { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10001; display: flex; align-items: center; gap: 10px; padding: 10px 18px; background: #1c1c28; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border-left: 3px solid; animation: caiSlideDown 0.3s ease forwards; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; max-width: 90vw; min-width: 200px; }
        .cai-notification-success { border-left-color: #10b981; }
        .cai-notification-success .cai-notification-icon { color: #10b981; }
        .cai-notification-error { border-left-color: #ef4444; }
        .cai-notification-error .cai-notification-icon { color: #ef4444; }
        .cai-notification-warning { border-left-color: #f59e0b; }
        .cai-notification-warning .cai-notification-icon { color: #f59e0b; }
        .cai-notification-info { border-left-color: #6655bb; }
        .cai-notification-info .cai-notification-icon { color: #6655bb; }
        .cai-notification-icon { font-size: 16px; font-weight: bold; }
        .cai-notification-message { flex: 1; color: #d0d0d8; }
        .cai-notification-close { background: none; border: none; color: #8888a0; cursor: pointer; font-size: 16px; padding: 0; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: background 0.15s; }
        .cai-notification-close:hover { background: rgba(255,255,255,0.1); color: #d0d0d8; }
        .cai-notification-hide { animation: caiSlideUp 0.3s ease forwards; }
        @keyframes caiSlideDown { from { opacity:0; transform:translateX(-50%) translateY(-16px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes caiSlideUp { from { opacity:1; transform:translateX(-50%) translateY(0); } to { opacity:0; transform:translateX(-50%) translateY(-16px); } }

        #cai-custom-overlay { pointer-events: none; }
    `);
})();
