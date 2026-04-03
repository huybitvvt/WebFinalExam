const initAccounts = [
    { username: 'admin123', password: '12', role: 'admin', name: 'Admin', email: 'admin@gunstore.com', phone: '0999999999', status: 'active' },
    { username: 'khach123', password: '12', role: 'customer', name: 'Khách VIP 1', email: 'khach123@gmail.com', phone: '0888888888', spent: 2150, status: 'active' }
];

const productStorageKey = 'productCatalog';
const productSeedVersionKey = 'productSeedVersion';
// Đổi version sang v3 để hệ thống tự động xóa data cũ và nạp data mới có dấu
const productSeedVersion = 'dngear-product-seed-v3'; 
const productFallbackImage = 'product-fallback.svg';

function escapeSvgText(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function truncateSvgText(value, limit = 32) {
    const normalized = String(value || '').trim();
    if (normalized.length <= limit) return normalized;
    return `${normalized.slice(0, Math.max(0, limit - 3)).trim()}...`;
}

function getProductIllustrationPalette(product = {}) {
    const category = String(product.category || product.subcategory || 'phukien').trim().toLowerCase();
    const paletteMap = {
        sungngan: { start: '#08111f', end: '#163f8c', accent: '#60a5fa', chip: 'SIDEARM' },
        shotgun: { start: '#18110c', end: '#9a5b14', accent: '#f59e0b', chip: 'SHOTGUN' },
        sungtruong: { start: '#091511', end: '#14532d', accent: '#4ade80', chip: 'RIFLE' },
        smg: { start: '#0d1222', end: '#5b21b6', accent: '#c084fc', chip: 'SMG' },
        hangnang: { start: '#160f10', end: '#8f1d1d', accent: '#f87171', chip: 'HEAVY' },
        danduoc: { start: '#1b140b', end: '#8a4b0e', accent: '#fbbf24', chip: 'AMMO' },
        phongve: { start: '#071519', end: '#0f766e', accent: '#2dd4bf', chip: 'DEFENSE' },
        phukien: { start: '#0b1120', end: '#3730a3', accent: '#818cf8', chip: 'ACCESSORY' }
    };
    return paletteMap[category] || paletteMap.phukien;
}

function buildCategorySilhouette(product = {}, palette) {
    const productId = String(product.id || '').trim().toUpperCase();
    const category = String(product.category || product.subcategory || 'phukien').trim().toLowerCase();
    const accent = palette.accent;

    if (category === 'danduoc') {
        return `
        <g transform="translate(118 92)">
          <ellipse cx="204" cy="222" rx="176" ry="20" fill="rgba(5, 9, 18, 0.28)" />
          <rect x="74" y="112" width="224" height="122" rx="24" fill="url(#bodyDark)" />
          <rect x="88" y="126" width="196" height="22" rx="11" fill="rgba(255,255,255,0.08)" />
          <rect x="154" y="92" width="64" height="24" rx="12" fill="url(#steelSoft)" />
          <g transform="translate(108 144)">
            <rect x="0" y="0" width="18" height="54" rx="8" fill="url(#accentSheen)" />
            <rect x="30" y="0" width="18" height="54" rx="8" fill="url(#accentSheen)" />
            <rect x="60" y="0" width="18" height="54" rx="8" fill="url(#accentSheen)" />
            <rect x="90" y="0" width="18" height="54" rx="8" fill="url(#accentSheen)" />
            <rect x="120" y="0" width="18" height="54" rx="8" fill="url(#accentSheen)" />
            <rect x="150" y="0" width="18" height="54" rx="8" fill="url(#accentSheen)" />
          </g>
        </g>`;
    }

    if (category === 'phongve') {
        return `
        <g transform="translate(148 76)">
          <ellipse cx="170" cy="246" rx="150" ry="20" fill="rgba(5, 9, 18, 0.26)" />
          <path d="M90 72 H250 L288 122 L264 238 H200 V168 H140 V238 H76 L52 122 Z" fill="url(#bodyDark)" />
          <path d="M134 72 L170 114 L206 72" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="10" stroke-linecap="round" />
          <rect x="92" y="136" width="64" height="54" rx="14" fill="rgba(255,255,255,0.08)" />
          <rect x="184" y="136" width="64" height="54" rx="14" fill="rgba(255,255,255,0.08)" />
          <rect x="134" y="178" width="72" height="60" rx="16" fill="rgba(255,255,255,0.1)" />
          <path d="M166 138 V220" stroke="${accent}" stroke-width="8" stroke-linecap="round" />
        </g>`;
    }

    if (category === 'phukien') {
        return `
        <g transform="translate(126 116)">
          <ellipse cx="194" cy="180" rx="174" ry="20" fill="rgba(5, 9, 18, 0.26)" />
          <rect x="88" y="70" width="180" height="80" rx="34" fill="url(#steelSoft)" />
          <circle cx="104" cy="110" r="42" fill="url(#steelHard)" />
          <circle cx="252" cy="110" r="42" fill="url(#steelHard)" />
          <circle cx="104" cy="110" r="26" fill="rgba(129, 140, 248, 0.26)" stroke="${accent}" stroke-width="4" />
          <circle cx="252" cy="110" r="26" fill="rgba(129, 140, 248, 0.18)" stroke="rgba(255,255,255,0.34)" stroke-width="4" />
          <rect x="152" y="126" width="70" height="18" rx="9" fill="url(#bodyDark)" />
          <rect x="150" y="150" width="74" height="22" rx="11" fill="url(#steelHard)" />
          <path d="M172 92 H184 M178 86 V98" stroke="${accent}" stroke-width="4" stroke-linecap="round" />
        </g>`;
    }

    if (category === 'hangnang' && productId === 'HWP05') {
        return `
        <g transform="translate(62 98)">
          <ellipse cx="248" cy="214" rx="216" ry="22" fill="rgba(5, 9, 18, 0.36)" />
          <rect x="138" y="116" width="188" height="22" rx="11" fill="url(#steelSoft)" />
          <rect x="324" y="122" width="118" height="14" rx="7" fill="url(#steelHard)" />
          <path d="M128 138 L194 138 L160 194 H118 Z" fill="url(#bodyDark)" />
          <path d="M264 138 L328 138 L354 192 H308 Z" fill="url(#bodyDark)" />
          <circle cx="164" cy="202" r="28" fill="url(#steelHard)" />
          <circle cx="164" cy="202" r="14" fill="rgba(255,255,255,0.14)" />
          <circle cx="308" cy="202" r="22" fill="url(#steelHard)" />
          <circle cx="308" cy="202" r="10" fill="rgba(255,255,255,0.14)" />
        </g>`;
    }

    if (category === 'hangnang' && productId === 'HWP01') {
        return `
        <g transform="translate(56 84)">
          <ellipse cx="258" cy="216" rx="210" ry="24" fill="rgba(5, 9, 18, 0.38)" />
          <rect x="164" y="124" width="180" height="18" rx="9" fill="url(#steelSoft)" />
          <rect x="326" y="128" width="130" height="10" rx="5" fill="url(#steelHard)" />
          <path d="M130 120 H164 L176 134 H154 L134 148 Z" fill="url(#gripDark)" />
          <path d="M208 142 L236 142 L254 198 L220 198 Z" fill="url(#bodyDark)" />
          <rect x="76" y="98" width="52" height="108" rx="22" fill="url(#steelHard)" />
          <rect x="132" y="104" width="34" height="94" rx="16" fill="url(#bodyDark)" />
          <path d="M164 126 C142 118 124 118 104 126" stroke="${accent}" stroke-width="6" stroke-linecap="round" />
          <path d="M454 132 C470 124 494 126 508 138 C490 150 466 152 454 142 Z" fill="url(#accentSheen)" />
        </g>`;
    }

    if (category === 'hangnang' && (productId === 'HWP02' || productId === 'HWP03' || productId === 'HWP04')) {
        return `
        <g transform="translate(42 100)">
          <ellipse cx="278" cy="200" rx="246" ry="24" fill="rgba(5, 9, 18, 0.38)" />
          <rect x="156" y="106" width="282" height="24" rx="12" fill="url(#steelSoft)" />
          <rect x="122" y="102" width="38" height="32" rx="10" fill="url(#bodyDark)" />
          <rect x="434" y="102" width="48" height="32" rx="10" fill="url(#bodyDark)" />
          <rect x="246" y="88" width="66" height="12" rx="6" fill="url(#steelHard)" />
          <path d="M180 130 H236 L264 192 H220 L196 154 Z" fill="url(#gripDark)" />
        </g>`;
    }

    if (category === 'hangnang') {
        return `
        <g transform="translate(18 92)">
          <ellipse cx="308" cy="210" rx="286" ry="24" fill="rgba(5, 9, 18, 0.4)" />
          <rect x="154" y="112" width="286" height="22" rx="11" fill="url(#steelSoft)" />
          <rect x="204" y="88" width="152" height="26" rx="12" fill="url(#bodyDark)" />
          <rect x="356" y="96" width="82" height="22" rx="11" fill="url(#steelHard)" />
          <rect x="436" y="110" width="148" height="12" rx="6" fill="url(#steelSoft)" />
          <path d="M96 100 H156 L172 114 H130 L102 132 Z" fill="url(#gripDark)" />
          <rect x="252" y="132" width="92" height="42" rx="12" fill="url(#steelHard)" />
          <path d="M234 134 L276 134 L296 196 L250 196 Z" fill="url(#bodyDark)" />
          <rect x="194" y="198" width="6" height="38" rx="3" fill="url(#steelHard)" />
          <rect x="458" y="198" width="6" height="38" rx="3" fill="url(#steelHard)" />
        </g>`;
    }

    if (category === 'sungngan' && productId === 'PST01') {
        return `
        <g transform="translate(92 104)">
          <ellipse cx="236" cy="190" rx="192" ry="24" fill="rgba(5, 9, 18, 0.38)" />
          <rect x="118" y="84" width="146" height="34" rx="12" fill="url(#steelSoft)" />
          <rect x="144" y="64" width="80" height="22" rx="9" fill="url(#steelHard)" />
          <circle cx="282" cy="118" r="34" fill="url(#steelSoft)" />
          <circle cx="282" cy="118" r="19" fill="rgba(255,255,255,0.12)" stroke="${accent}" stroke-width="4" />
          <rect x="310" y="110" width="118" height="12" rx="6" fill="url(#steelHard)" />
          <path d="M210 120 C198 152 204 180 232 212 L275 212 C260 176 262 144 274 120 Z" fill="url(#bodyDark)" />
          <path d="M225 153 C219 183 229 206 247 226 L283 226 C269 192 268 172 274 152 Z" fill="url(#gripWarm)" />
        </g>`;
    }

    if (category === 'sungngan') {
        return `
        <g transform="translate(88 98)">
          <ellipse cx="240" cy="196" rx="202" ry="24" fill="rgba(5, 9, 18, 0.36)" />
          <rect x="118" y="80" width="210" height="38" rx="14" fill="url(#steelSoft)" />
          <path d="M136 80 L178 54 H304 C322 54 332 66 332 80 Z" fill="url(#steelHard)" />
          <rect x="326" y="91" width="96" height="10" rx="5" fill="url(#steelSoft)" />
          <rect x="258" y="96" width="52" height="58" rx="12" fill="url(#bodyDark)" />
          <path d="M234 112 C224 156 234 194 260 232 L318 232 C300 192 302 148 316 118 Z" fill="url(#gripDark)" />
          <path d="M212 120 C208 146 216 168 230 184" stroke="${accent}" stroke-width="8" stroke-linecap="round" />
          <rect x="166" y="118" width="62" height="14" rx="7" fill="rgba(255,255,255,0.72)" />
        </g>`;
    }

    if (category === 'shotgun') {
        return `
        <g transform="translate(28 100)">
          <ellipse cx="294" cy="198" rx="270" ry="24" fill="rgba(5, 9, 18, 0.36)" />
          <rect x="146" y="114" width="246" height="14" rx="7" fill="url(#steelSoft)" />
          <rect x="164" y="96" width="168" height="18" rx="9" fill="url(#bodyDark)" />
          <rect x="336" y="108" width="198" height="8" rx="4" fill="url(#steelSoft)" />
          <path d="M78 96 H150 L174 114 H126 L92 134 Z" fill="url(#gripWarm)" />
          <rect x="340" y="114" width="76" height="16" rx="8" fill="url(#gripWarm)" />
          <path d="M184 128 H276 L314 194 H270 L230 150 H194 Z" fill="url(#gripDark)" />
        </g>`;
    }

    if (category === 'smg') {
        return `
        <g transform="translate(56 100)">
          <ellipse cx="258" cy="198" rx="214" ry="24" fill="rgba(5, 9, 18, 0.36)" />
          <rect x="132" y="98" width="178" height="32" rx="14" fill="url(#bodyDark)" />
          <rect x="176" y="78" width="84" height="18" rx="9" fill="url(#steelHard)" />
          <rect x="308" y="104" width="82" height="12" rx="6" fill="url(#steelSoft)" />
          <path d="M102 92 H134 L148 110 H126 L106 122 Z" fill="url(#gripDark)" />
          <path d="M220 130 L246 130 L270 196 L238 196 Z" fill="url(#gripDark)" />
          <path d="M190 130 C194 150 202 174 214 194 H178 C166 176 168 152 178 130 Z" fill="url(#steelSoft)" />
        </g>`;
    }

    return `
    <g transform="translate(28 94)">
      <ellipse cx="294" cy="204" rx="270" ry="24" fill="rgba(5, 9, 18, 0.36)" />
      <rect x="136" y="118" width="268" height="18" rx="9" fill="url(#steelSoft)" />
      <rect x="250" y="96" width="136" height="18" rx="9" fill="url(#bodyDark)" />
      <rect x="286" y="80" width="88" height="14" rx="7" fill="url(#steelHard)" />
      <rect x="396" y="116" width="176" height="10" rx="5" fill="url(#steelSoft)" />
      <path d="M80 108 H138 L148 118 H112 L82 136 Z" fill="url(#bodyDark)" />
      <path d="M148 136 H242 L286 198 H228 L196 160 H164 Z" fill="url(#gripWarm)" />
      <path d="M258 134 L294 134 L314 190 L274 190 Z" fill="url(#bodyDark)" />
      <rect x="194" y="200" width="6" height="34" rx="3" fill="url(#steelHard)" />
      <rect x="430" y="194" width="6" height="40" rx="3" fill="url(#steelHard)" />
    </g>`;
}

function buildProductPlaceholderImage(product = {}) {
    const palette = getProductIllustrationPalette(product);
    const productId = escapeSvgText(String(product.id || 'ITEM').trim().toUpperCase());
    const safeTitle = escapeSvgText(truncateSvgText(product.name || 'Sản phẩm mới', 30));
    const collection = escapeSvgText(truncateSvgText(product.collection || 'Danh mục', 18));
    const safeTagline = escapeSvgText(truncateSvgText(product.tagline || 'Ảnh dựng nội bộ', 52));
    const chipOne = escapeSvgText(truncateSvgText(product.ammo && product.ammo !== '-' ? product.ammo : (product.mag || 'Danh mục'), 26));
    const chipTwo = escapeSvgText(truncateSvgText(product.acc && product.acc !== '-' ? product.acc : (product.subcategory || product.category || 'Thiết lập'), 26));
    const silhouette = buildCategorySilhouette(product, palette);
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" role="img" aria-label="${productId}" data-origin="dngear-local-art-v2">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.start}" />
      <stop offset="100%" stop-color="${palette.end}" />
    </linearGradient>
    <radialGradient id="spot" cx="70%" cy="18%" r="60%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
    <linearGradient id="steelSoft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="35%" stop-color="#dbe5f0" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
    <linearGradient id="steelHard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9fb0c5" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="bodyDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3c4a5c" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="gripDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2b3544" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="gripWarm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5a2b" />
      <stop offset="100%" stop-color="#5b3713" />
    </linearGradient>
    <linearGradient id="accentSheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${palette.accent}" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.92)" />
    </linearGradient>
  </defs>
  <rect width="640" height="480" rx="36" fill="url(#bg)" />
  <rect width="640" height="480" rx="36" fill="url(#spot)" />
  <rect x="24" y="24" width="592" height="432" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
  <circle cx="92" cy="78" r="86" fill="rgba(255,255,255,0.04)" />
  <circle cx="558" cy="388" r="138" fill="rgba(255,255,255,0.05)" />
  <rect x="42" y="42" width="168" height="38" rx="19" fill="rgba(255,255,255,0.1)" />
  <text x="126" y="66" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="700" fill="#ffffff">${palette.chip}</text>
  <text x="42" y="112" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="700" fill="${palette.accent}">${productId}</text>
  <text x="42" y="146" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="600" fill="rgba(255,255,255,0.8)">${collection}</text>
  <text x="598" y="62" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" fill="rgba(255,255,255,0.76)">ẢNH DỰNG NỘI BỘ</text>
  ${silhouette}
  <rect x="40" y="350" width="560" height="90" rx="22" fill="rgba(9, 15, 28, 0.46)" stroke="rgba(255,255,255,0.1)" />
  <text x="68" y="386" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="800" fill="#ffffff">${safeTitle}</text>
  <text x="68" y="412" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="600" fill="rgba(255,255,255,0.72)">${safeTagline}</text>
  <rect x="376" y="370" width="214" height="28" rx="14" fill="rgba(255,255,255,0.1)" />
  <rect x="376" y="406" width="214" height="28" rx="14" fill="rgba(255,255,255,0.1)" />
  <text x="483" y="389" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="rgba(255,255,255,0.88)">${chipOne}</text>
  <text x="483" y="425" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="rgba(255,255,255,0.88)">${chipTwo}</text>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function isGeneratedProductIllustration(rawImage) {
    if (!/data:image\/svg\+xml/i.test(rawImage)) return false;
    return /dngear-local-art/i.test(rawImage)
        || /No%20external%20image%20required/i.test(rawImage)
        || /generated%20locally/i.test(rawImage);
}

function isTemporaryProductImage(rawImage) {
    const normalizedImage = String(rawImage || '').trim();
    return !normalizedImage
        || normalizedImage === productFallbackImage
        || /via\.placeholder\.com/i.test(normalizedImage)
        || isGeneratedProductIllustration(normalizedImage);
}

function resolveProductImage(product = {}) {
    const rawImage = String(product.img || '').trim();
    const shouldGeneratePlaceholder = isTemporaryProductImage(rawImage);

    return shouldGeneratePlaceholder ? buildProductPlaceholderImage(product) : rawImage;
}

// BỘ DỮ LIỆU MỚI: Đầy đủ dấu, chuẩn thông tin, bao quát mọi chỉ mục
const defaultProductSeed = [
    // --- NHÓM SÚNG NGẮN ---
    {
        id: 'PST01', name: 'Súng ngắn ổ xoay ZP-5', category: 'sungngan', subcategory: 'sungngan-xoay',
        price: 420, stock: 15, ammo: 'Đạn xốp Short Dart', mag: 'Ổ xoay 6 viên', acc: 'Vỏ kim loại, văng shell',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Colt-python.jpg',
        collection: 'Cổ điển', tagline: 'Phong cách revolver cổ điển, nạp shell từng viên.', salePercent: 0, featured: true, searchTags: ['revolver', 'ổ xoay']
    },
    {
        id: 'PST02', name: 'Glock 17 Gen 5', category: 'sungngan', subcategory: 'sungngan-banauto',
        price: 480, stock: 20, ammo: 'Gel ball 7-8mm', mag: 'Băng đạn 15 viên', acc: 'Khung polymer, khóa nòng nhôm',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Glock%2017%20Gen%205%20Gun%20%2852953524644%29.jpg',
        collection: 'Bán chạy', tagline: 'Dòng súng ngắn quốc dân, dễ chơi dễ bảo dưỡng.', salePercent: 10, featured: true, searchTags: ['glock', 'bán tự động']
    },
    {
        id: 'PST03', name: 'Glock 18C Liên thanh', category: 'sungngan', subcategory: 'sungngan-auto',
        price: 520, stock: 12, ammo: 'Gel ball 7-8mm', mag: 'Băng dài 30 viên', acc: 'Chế độ Auto, pin Lipo',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Glock%2018C.jpg',
        collection: 'Tốc độ cao', tagline: 'Chế độ xả đạn liên thanh cực rát, phù hợp càn quét.', salePercent: 0, featured: false, searchTags: ['glock 18', 'tự động', 'auto']
    },
    {
        id: 'PST04', name: 'Desert Eagle .50 Magnum', category: 'sungngan', subcategory: 'sungngan-magnum',
        price: 650, stock: 8, ammo: 'Đạn xốp Mega', mag: 'Băng đạn 7 viên', acc: 'Blowback giật mạnh',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Desert%20Eagle.JPG',
        collection: 'Premium', tagline: 'Sức mạnh tuyệt đối, ngoại hình hầm hố cho góc trưng bày.', salePercent: 15, featured: true, searchTags: ['deagle', 'magnum', 'đại bàng sa mạc']
    },

    // --- NHÓM SÚNG TRƯỜNG & BẮN TỈA ---
    {
        id: 'RFL01', name: 'M4A1 Carbine Semi-Auto', category: 'sungtruong', subcategory: 'sungtruong-banauto',
        price: 850, stock: 10, ammo: 'Đạn xốp Elite', mag: 'Băng đạn 30 viên', acc: 'Ray Picatinny, báng rút',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/M4A1_ACOG.png',
        collection: 'Quân sự', tagline: 'Mẫu súng trường tiêu chuẩn, tương thích nhiều phụ kiện.', salePercent: 0, featured: false, searchTags: ['m4a1', 'carbine', 'bán tự động']
    },
    {
        id: 'RFL02', name: 'AK-47 Tactical Auto', category: 'sungtruong', subcategory: 'sungtruong-auto',
        price: 920, stock: 14, ammo: 'Gel ball 7-8mm', mag: 'Băng cong 35 viên', acc: 'Ốp tay M-LOK, báng gấp',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/My_AK-47.jpg',
        collection: 'Huyền thoại', tagline: 'Phiên bản độ Tactical hiện đại của huyền thoại AK-47.', salePercent: 12, featured: true, searchTags: ['ak47', 'tactical', 'tự động']
    },
    {
        id: 'SNP01', name: 'AWM Sniper Rifle', category: 'sungtruong', subcategory: 'sungbantia',
        price: 1150, stock: 5, ammo: 'Đạn xốp + Shell eject', mag: 'Băng đạn 5 viên', acc: 'Ống ngắm 8x, chân chống bipod',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/AWM-338-white.jpg',
        collection: 'Bắn tỉa', tagline: 'Trải nghiệm lên đạn bolt-action và văng shell cực chân thực.', salePercent: 20, featured: true, searchTags: ['awm', 'sniper', 'bắn tỉa']
    },

    // --- NHÓM SHOTGUN & TIỂU LIÊN ---
    {
        id: 'SHT01', name: 'Remington M870 Pump-Action', category: 'shotgun', subcategory: 'shotgun',
        price: 680, stock: 9, ammo: 'Đạn xốp loại to', mag: 'Nạp ống 5 shell', acc: 'Lên đạn cơ học, văng vỏ',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Remington%20Model%20870.png',
        collection: 'Cận chiến', tagline: 'Tiếng lên đạn rắc rắc cực đã tai, phù hợp cận chiến.', salePercent: 0, featured: true, searchTags: ['m870', 'shotgun', 'pump']
    },
    {
        id: 'SMG01', name: 'MP5 Tactical CQB', category: 'smg', subcategory: 'smg-banauto',
        price: 750, stock: 11, ammo: 'Gel ball 7-8mm', mag: 'Băng đạn 25 viên', acc: 'Đèn pin tích hợp, báng trượt',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/MP5A3.jpg',
        collection: 'Đột kích', tagline: 'Nhỏ gọn, độ chính xác cao cho các không gian hẹp.', salePercent: 0, featured: false, searchTags: ['mp5', 'cqb', 'smg']
    },
    {
        id: 'SMG02', name: 'Vector Kriss V2 Liên thanh', category: 'smg', subcategory: 'smg-auto',
        price: 890, stock: 7, ammo: 'Gel ball 7-8mm', mag: 'Băng đạn 30 viên', acc: 'Cơ chế xả đạn nhanh, giảm thanh giả',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kriss%20Vector%20left.JPG',
        collection: 'Công nghệ', tagline: 'Thiết kế tương lai, tốc độ nhả đạn kinh hoàng.', salePercent: 15, featured: true, searchTags: ['vector', 'kriss', 'auto']
    },

    // --- NHÓM HẠNG NẶNG ---
    {
        id: 'HMG01', name: 'Súng máy hạng nhẹ M249', category: 'hangnang', subcategory: 'sungmay-nhe',
        price: 1450, stock: 4, ammo: 'Gel ball 7-8mm', mag: 'Hộp đạn tròn 1000 viên', acc: 'Chân chống, dây đeo chịu lực',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/FN%20MINIMI%20Standard.jpg',
        collection: 'Hỏa lực', tagline: 'Duy trì hỏa lực đàn áp cực mạnh cho đội hình.', salePercent: 0, featured: false, searchTags: ['m249', 'súng máy', 'lmg']
    },
    {
        id: 'HMG02', name: 'Súng máy hạng trung M60', category: 'hangnang', subcategory: 'sungmay-trung',
        price: 1600, stock: 3, ammo: 'Đạn xốp chuỗi', mag: 'Dây tiếp đạn 50 viên', acc: 'Mô phỏng dây đạn chạy liên tục',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Machine%20Gun%2C%20M60.jpg',
        collection: 'Hỏa lực', tagline: 'Cỗ máy cày nát mọi rào cản trong trận giả chiến.', salePercent: 0, featured: false, searchTags: ['m60', 'súng máy', 'mmg']
    },
    {
        id: 'HMG03', name: 'Browning M2 Heavy', category: 'hangnang', subcategory: 'sungmay-nang',
        price: 2200, stock: 2, ammo: 'Đạn xốp cỡ đại', mag: 'Hộp đạn 30 viên', acc: 'Giá đỡ ba chân, tay cầm đôi',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/M2%20machine%20gun.jpg',
        collection: 'Phòng thủ', tagline: 'Vũ khí cố định bảo vệ cứ điểm tuyệt đối.', salePercent: 5, featured: true, searchTags: ['m2 browning', 'súng máy hạng nặng']
    },
    {
        id: 'HMG04', name: 'Súng máy đa chức năng PKM', category: 'hangnang', subcategory: 'sungmay-danang',
        price: 1750, stock: 3, ammo: 'Gel ball 7-8mm', mag: 'Hộp đạn thép 800 viên', acc: 'Báng gỗ mô phỏng, nòng dài',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Soviet%20PKM%20machine%20gun.%20%2849193089981%29.jpg',
        collection: 'Hỏa lực', tagline: 'Dòng súng máy danh tiếng với độ bền bỉ cao.', salePercent: 0, featured: false, searchTags: ['pkm', 'đa chức năng']
    },
    {
        id: 'HWP01', name: 'Súng phun lửa M2 Replica', category: 'hangnang', subcategory: 'phunlua',
        price: 850, stock: 5, ammo: 'Nước (phun sương tạo khói)', mag: 'Bình chứa sau lưng', acc: 'Đèn LED tạo hiệu ứng lửa',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/M2FlamethrowerVWM02.jpg',
        collection: 'Độc lạ', tagline: 'Tạo khói sương mô phỏng lửa an toàn tuyệt đối.', salePercent: 10, featured: false, searchTags: ['phun lửa', 'flamethrower']
    },
    {
        id: 'HWP02', name: 'Súng không giật Carl Gustaf', category: 'hangnang', subcategory: 'khonggiat',
        price: 950, stock: 4, ammo: 'Đầu đạn xốp cỡ lớn', mag: 'Nạp từng quả', acc: 'Ống ngắm quang học mô phỏng',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carl%20Gustav%20recoilless%20rifle.jpg',
        collection: 'Chống tăng', tagline: 'Khai hỏa cực êm, đường đạn bay thẳng tắp.', salePercent: 0, featured: false, searchTags: ['carl gustaf', 'không giật']
    },
    {
        id: 'HWP03', name: 'Súng phóng tên lửa RPG-7', category: 'hangnang', subcategory: 'phongtenlua',
        price: 1100, stock: 6, ammo: 'Tên lửa xốp an toàn', mag: 'Nạp từ đầu nòng', acc: 'Âm thanh khai hỏa giả lập',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/40mm%20RPG-7.JPG',
        collection: 'Chống tăng', tagline: 'Đậm chất biểu tượng, quả rocket xốp an toàn.', salePercent: 0, featured: true, searchTags: ['rpg7', 'phóng tên lửa', 'bazooka']
    },
    {
        id: 'HWP04', name: 'Súng phóng lựu M320', category: 'hangnang', subcategory: 'phongluu',
        price: 550, stock: 8, ammo: 'Lựu đạn xốp 40mm', mag: 'Nạp từng quả', acc: 'Gắn kèm ray súng trường hoặc bắn độc lập',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/PEO%20M320%20Grenade%20Launcher.jpg',
        collection: 'Hỗ trợ', tagline: 'Phá vỡ góc nấp của đối phương bằng đạn nổ diện rộng.', salePercent: 0, featured: false, searchTags: ['m320', 'phóng lựu']
    },
    {
        id: 'HWP05', name: 'Mô hình Pháo M777', category: 'hangnang', subcategory: 'phao',
        price: 3500, stock: 1, ammo: 'Đạn xốp pháo binh', mag: 'Nạp thủ công', acc: 'Bánh xe di chuyển, thước ngắm cơ',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/US%20Army%20-%20M777%20howitzer.jpg',
        collection: 'Trưng bày lớn', tagline: 'Mô hình tỷ lệ lớn, phù hợp decor sân bãi.', salePercent: 0, featured: false, searchTags: ['m777', 'pháo', 'howitzer']
    },

    // --- NHÓM ĐẠN DƯỢC, TỰ VỆ, PHỤ KIỆN ---
    {
        id: 'AMO01', name: 'Hộp Đạn Xốp Soft Bullet', category: 'danduoc', subcategory: 'danduoc',
        price: 45, stock: 150, ammo: 'Đạn xốp đầu hít / đầu mềm', mag: '-', acc: 'Hộp nhựa 100 viên',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/X-Shot%20Excel%20Foam%20Darts.jpg',
        collection: 'Tiêu hao', tagline: 'Tương thích hầu hết các súng Nerf và đồ chơi đạn xốp.', salePercent: 5, featured: false, searchTags: ['đạn xốp', 'soft bullet']
    },
    {
        id: 'DEF01', name: 'Áo giáp chiến thuật Tactical', category: 'phongve', subcategory: 'phongve',
        price: 250, stock: 35, ammo: '-', mag: '-', acc: 'Nhiều túi đựng đạn, chống va đập xốp',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/ModularTacticalVest.jpg',
        collection: 'Bảo hộ', tagline: 'Bảo vệ cơ thể và tăng vẻ ngầu khi ra sân.', salePercent: 0, featured: false, searchTags: ['áo giáp', 'tactical vest', 'đồ tự vệ']
    },
    {
        id: 'ACC01', name: 'Ống ngắm Red Dot Sight', category: 'phukien', subcategory: 'phukien',
        price: 180, stock: 40, ammo: '-', mag: '-', acc: 'Gắn ray 20mm tiêu chuẩn',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/AIMPOINT%20COMP%20M2%20Red-dot.png',
        collection: 'Nâng cấp', tagline: 'Hỗ trợ ngắm bắn mục tiêu nhanh và chuẩn xác.', salePercent: 10, featured: false, searchTags: ['red dot', 'ống ngắm', 'phụ kiện']
    },
    {
        id: 'AMO02', name: 'Gel Ball Pro Pack 5000', category: 'danduoc', subcategory: 'danduoc',
        price: 65, stock: 110, ammo: 'Gel ball 7-8mm', mag: '-', acc: 'Túi zip chống ẩm 5.000 viên',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gel%20balls.jpg',
        collection: 'Tiêu hao', tagline: 'Gói refill số lượng lớn dành cho nhóm chơi field hoặc CLB.', salePercent: 0, featured: false, searchTags: ['gel ball', 'đạn gel', 'refill']
    },
    {
        id: 'DEF02', name: 'Kính bảo hộ Clear Shield', category: 'phongve', subcategory: 'phongve',
        price: 120, stock: 48, ammo: '-', mag: '-', acc: 'Tròng chống mờ, dây đeo co giãn',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Goggles%20%2810740310615%29.jpg',
        collection: 'Bảo hộ', tagline: 'Kính ôm mặt gọn, phù hợp cả indoor lẫn outdoor.', salePercent: 0, featured: false, searchTags: ['kính bảo hộ', 'clear shield', 'eye protection']
    },
    {
        id: 'ACC02', name: 'Đèn pin gắn rail Tactical Light', category: 'phukien', subcategory: 'phukien',
        price: 210, stock: 28, ammo: '-', mag: '-', acc: '3 mức sáng, chân gắn quick-release',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Surefire%20Flashlight.JPG',
        collection: 'Nâng cấp', tagline: 'Tăng khả năng nhận diện mục tiêu trong không gian tối.', salePercent: 8, featured: false, searchTags: ['đèn pin rail', 'tactical light', 'flashlight']
    }
];

const seedSupplierByProductId = {
    PST01: 'NCC04',
    PST02: 'NCC02',
    PST03: 'NCC03',
    PST04: 'NCC04',
    RFL01: 'NCC01',
    RFL02: 'NCC03',
    SNP01: 'NCC01',
    SHT01: 'NCC02',
    SMG01: 'NCC01',
    SMG02: 'NCC03',
    HMG01: 'NCC06',
    HMG02: 'NCC06',
    HMG03: 'NCC06',
    HMG04: 'NCC06',
    HWP01: 'NCC06',
    HWP02: 'NCC06',
    HWP03: 'NCC06',
    HWP04: 'NCC06',
    HWP05: 'NCC06',
    AMO01: 'NCC02',
    AMO02: 'NCC03',
    DEF01: 'NCC05',
    DEF02: 'NCC05',
    ACC01: 'NCC07',
    ACC02: 'NCC07'
};

let currentSelectedProduct = null;
let dbProducts = [];

function normalizeSearchTags(value) {
    if (Array.isArray(value)) {
        return value.map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
    }
    return [];
}

function normalizeProduct(product, fallback = {}) {
    const merged = { ...fallback, ...product };
    const price = Number(merged.price);
    const stock = Number(merged.stock);
    const salePercent = Number(merged.salePercent);
    const normalizedId = String(merged.id || '').trim().toUpperCase();
    const preferredImage = isTemporaryProductImage(product?.img) ? fallback.img : product?.img;
    const imageCandidate = String(preferredImage || merged.img || '').trim();

    return {
        id: normalizedId,
        name: String(merged.name || 'Sản phẩm mới').trim(),
        category: String(merged.category || 'phukien').trim().toLowerCase(),
        subcategory: String(merged.subcategory || merged.category || 'phukien').trim().toLowerCase(),
        price: Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0,
        stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
        ammo: String(merged.ammo || '').trim(),
        mag: String(merged.mag || '').trim(),
        acc: String(merged.acc || '').trim(),
        img: resolveProductImage({ ...merged, img: imageCandidate }),
        collection: String(merged.collection || 'Hàng mới về').trim(),
        tagline: String(merged.tagline || 'Sản phẩm đang được cập nhật thông tin.').trim(),
        salePercent: Number.isFinite(salePercent) ? Math.max(0, Math.min(95, Math.round(salePercent))) : 0,
        featured: Boolean(merged.featured),
        supplierId: String(merged.supplierId || seedSupplierByProductId[normalizedId] || '').trim(),
        searchTags: normalizeSearchTags(merged.searchTags),
        createdAt: merged.createdAt || new Date().toISOString()
    };
}

function sanitizeStoredProducts(products) {
    return (Array.isArray(products) ? products : [])
        .map(item => normalizeProduct(item))
        .filter(item => item.id);
}

function hydrateProductCatalog() {
    const seedFallbackById = new Map(defaultProductSeed.map(item => [String(item.id || '').trim().toUpperCase(), item]));
    const rawStoredProducts = JSON.parse(localStorage.getItem(productStorageKey)) || [];
    let storedProducts = (Array.isArray(rawStoredProducts) ? rawStoredProducts : [])
        .map(item => normalizeProduct(item, seedFallbackById.get(String(item?.id || '').trim().toUpperCase()) || {}))
        .filter(item => item.id);
    const seededProducts = defaultProductSeed.map(item => normalizeProduct(item, item));

    // Thuật toán "Xóa đi làm lại": Nếu rỗng hoặc khác version, ta ép lấy thẳng bộ Seed mới để làm sạch rác
    if (storedProducts.length === 0 || localStorage.getItem(productSeedVersionKey) !== productSeedVersion) {
        storedProducts = seededProducts;
        localStorage.setItem(productSeedVersionKey, productSeedVersion);
    }

    const existingIds = new Set(storedProducts.map(product => product.id));
    seededProducts.forEach(product => {
        if (!existingIds.has(product.id)) {
            storedProducts.push(product);
        }
    });

    // Sắp xếp ưu tiên hàng nổi bật lên đầu, sau đó theo tên A-Z
    const nextProducts = storedProducts.sort((left, right) => {
        const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
        if (featuredDelta !== 0) return featuredDelta;
        return left.name.localeCompare(right.name, 'vi');
    });

    dbProducts.splice(0, dbProducts.length, ...nextProducts);
    localStorage.setItem(productStorageKey, JSON.stringify(dbProducts));
}

function persistProducts(nextProducts = dbProducts) {
    const normalizedProducts = sanitizeStoredProducts(nextProducts);
    dbProducts.splice(0, dbProducts.length, ...normalizedProducts);
    localStorage.setItem(productStorageKey, JSON.stringify(dbProducts));
    return dbProducts;
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (error) {
        return null;
    }
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUserCartKey() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 'cart:guest';
    return `cart:${currentUser.email || currentUser.username || currentUser.name || 'guest'}`;
}

function normalizeProductId(id) {
    const rawId = String(id || '').trim().toUpperCase();
    const shortCodeMatch = rawId.match(/^([A-Z]+)(\d)$/);
    if (shortCodeMatch) {
        return `${shortCodeMatch[1]}0${shortCodeMatch[2]}`;
    }
    return rawId;
}

function inferVoucherRewardMeta(voucher = {}) {
    const valueLabel = String(voucher.valueLabel || '').trim();
    const percentMatch = valueLabel.match(/(\d+)\s*%/);
    if (percentMatch) {
        return {
            rankValue: Number(percentMatch[1]) || 0,
            rankUnit: '%'
        };
    }

    const cashMatch = valueLabel.match(/(\d+)\s*\$/);
    if (cashMatch) {
        return {
            rankValue: Number(cashMatch[1]) || 0,
            rankUnit: '$'
        };
    }

    if (/combo|tặng|quà/i.test(valueLabel)) {
        return {
            rankValue: 1,
            rankUnit: 'combo'
        };
    }

    return {
        rankValue: 0,
        rankUnit: ''
    };
}

function normalizeVoucherRecord(voucher, source = 'promotion') {
    if (!voucher || typeof voucher !== 'object') return null;

    const inferredReward = inferVoucherRewardMeta(voucher);
    const rawRankValue = Number(voucher.rankValue);
    const rawUsageLimit = Number(voucher.usageLimit);
    const rawUses = Number(voucher.uses);

    return {
        ...voucher,
        id: String(voucher.id || '').trim(),
        code: String(voucher.code || '').trim().toUpperCase(),
        title: String(voucher.title || voucher.valueLabel || 'Khuyến mãi').trim(),
        valueLabel: String(voucher.valueLabel || '').trim(),
        condition: String(voucher.condition || '').trim(),
        rankValue: Number.isFinite(rawRankValue) ? Math.max(0, rawRankValue) : inferredReward.rankValue,
        rankUnit: String(voucher.rankUnit || inferredReward.rankUnit || '').trim(),
        usageLimit: Number.isFinite(rawUsageLimit) ? Math.max(0, Math.round(rawUsageLimit)) : 0,
        uses: Number.isFinite(rawUses) ? Math.max(0, Math.round(rawUses)) : 0,
        status: String(voucher.status || 'Đang áp dụng').trim(),
        email: String(voucher.email || '').trim(),
        source
    };
}

function getProductSellingPrice(product, salePercentOverride = null) {
    const basePrice = Number(product && product.price);
    const rawSalePercent = salePercentOverride === null
        ? Number(product && product.salePercent)
        : Number(salePercentOverride);

    const normalizedPrice = Number.isFinite(basePrice) ? Math.max(0, Math.round(basePrice)) : 0;
    const normalizedSalePercent = Number.isFinite(rawSalePercent)
        ? Math.max(0, Math.min(95, Math.round(rawSalePercent)))
        : 0;

    if (normalizedSalePercent <= 0) {
        return normalizedPrice;
    }

    return Math.max(0, Math.round((normalizedPrice * (100 - normalizedSalePercent)) / 100));
}

function calculateVoucherDiscount(subtotal, voucher) {
    const normalizedSubtotal = Number.isFinite(Number(subtotal)) ? Math.max(0, Math.round(Number(subtotal))) : 0;
    const normalizedVoucher = normalizeVoucherRecord(voucher, voucher && voucher.source ? voucher.source : 'promotion');
    if (!normalizedVoucher || normalizedSubtotal <= 0) return 0;

    if (normalizedVoucher.rankUnit === '%') {
        return Math.min(normalizedSubtotal, Math.round((normalizedSubtotal * normalizedVoucher.rankValue) / 100));
    }

    if (normalizedVoucher.rankUnit === '$') {
        return Math.min(normalizedSubtotal, Math.max(0, Math.round(normalizedVoucher.rankValue)));
    }

    return 0;
}

function calculateCartTotals(items, voucher = null) {
    const normalizedItems = Array.isArray(items) ? items : [];
    const totalItems = normalizedItems.reduce((sum, item) => sum + Math.max(0, Number(item && item.quantity) || 0), 0);
    const subtotal = normalizedItems.reduce((sum, item) => {
        const quantity = Math.max(0, Number(item && item.quantity) || 0);
        if (quantity <= 0) return sum;

        const unitPrice = item && item.product
            ? getProductSellingPrice(item.product)
            : Math.max(0, Math.round(Number(item && item.price) || 0));

        return sum + (unitPrice * quantity);
    }, 0);

    const normalizedVoucher = normalizeVoucherRecord(voucher, voucher && voucher.source ? voucher.source : 'promotion');
    const discount = calculateVoucherDiscount(subtotal, normalizedVoucher);

    return {
        totalItems,
        subtotal,
        discount,
        finalTotal: Math.max(0, subtotal - discount)
    };
}

function initAccountsData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!Array.isArray(users) || users.length === 0) {
        users = [...initAccounts];
    } else {
        initAccounts.forEach(seedAccount => {
            const existingIndex = users.findIndex(user => user.username === seedAccount.username || user.email === seedAccount.email);
            if (existingIndex > -1) {
                const existingUser = users[existingIndex] || {};
                users[existingIndex] = {
                    ...seedAccount,
                    ...existingUser
                };
            } else {
                users.push(seedAccount);
            }
        });
    }
    localStorage.setItem('users', JSON.stringify(users));
}

function initApp() {
    initAccountsData();
    hydrateProductCatalog();
}

window.persistProducts = persistProducts;
window.getCurrentUser = getCurrentUser;
window.saveCurrentUser = saveCurrentUser;
window.getCurrentUserCartKey = getCurrentUserCartKey;
window.productFallbackImage = productFallbackImage;
window.normalizeVoucherRecord = normalizeVoucherRecord;
window.getProductSellingPrice = getProductSellingPrice;
window.calculateVoucherDiscount = calculateVoucherDiscount;
window.calculateCartTotals = calculateCartTotals;
window.buildProductPlaceholderImage = buildProductPlaceholderImage;
window.findProductById = function(id) {
    const normalizedId = normalizeProductId(id);
    return dbProducts.find(product => product.id === normalizedId) || null;
};

initApp();
