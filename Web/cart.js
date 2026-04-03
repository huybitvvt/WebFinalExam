let currentCart = [];
window.currentCart = currentCart;
let appliedVoucher = null;
window.appliedVoucher = appliedVoucher;

function setAppliedVoucher(voucher) {
    appliedVoucher = voucher;
    window.appliedVoucher = appliedVoucher;
}

function getCartStorageKey() {
    return typeof getCurrentUserCartKey === 'function' ? getCurrentUserCartKey() : 'cart:guest';
}

function getCurrentCartTotals(voucher = appliedVoucher) {
    if (typeof calculateCartTotals === 'function') {
        return calculateCartTotals(currentCart, voucher);
    }

    const totalItems = currentCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = currentCart.reduce((sum, item) => sum + (((item.product && item.product.price) || 0) * (item.quantity || 0)), 0);

    return {
        totalItems,
        subtotal,
        discount: 0,
        finalTotal: subtotal
    };
}

function getVoucherByCode(code) {
    const normalizedCode = String(code || '').trim().toUpperCase();
    if (!normalizedCode) return null;

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const issuedVouchers = (JSON.parse(localStorage.getItem('issuedVoucherData')) || [])
        .map(voucher => typeof normalizeVoucherRecord === 'function' ? normalizeVoucherRecord(voucher, 'issued') : { ...voucher, source: 'issued' })
        .filter(voucher => voucher && currentUser && voucher.email === currentUser.email);
    const promotions = (JSON.parse(localStorage.getItem('promotionData')) || [])
        .map(voucher => typeof normalizeVoucherRecord === 'function' ? normalizeVoucherRecord(voucher, 'promotion') : { ...voucher, source: 'promotion' });

    return [...issuedVouchers, ...promotions].find(voucher =>
        voucher
        && voucher.code === normalizedCode
        && voucher.status === 'Đang áp dụng'
    ) || null;
}

function normalizeCartItems(items) {
    return (Array.isArray(items) ? items : [])
        .map(item => {
            const productId = item.productId || (item.product && item.product.id);
            const product = typeof findProductById === 'function' ? findProductById(productId) : null;
            const quantity = Number(item.quantity || 0);

            if (!product || quantity <= 0) return null;

            return {
                product,
                quantity: Math.min(quantity, product.stock || quantity)
            };
        })
        .filter(Boolean)
        .filter(item => item.quantity > 0);
}

function persistCartState(shouldRender = true) {
    const serialized = currentCart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
    }));

    localStorage.setItem(getCartStorageKey(), JSON.stringify(serialized));

    if (shouldRender) {
        renderCart();
    }

    if (typeof renderStoreInsights === 'function') {
        renderStoreInsights();
    }
}

function hydrateCartFromStorage() {
    const stored = JSON.parse(localStorage.getItem(getCartStorageKey())) || [];
    const normalizedItems = normalizeCartItems(stored);

    currentCart.splice(0, currentCart.length, ...normalizedItems);
    persistCartState(false);

    if (typeof renderStoreInsights === 'function') {
        renderStoreInsights();
    }

    return currentCart;
}

function addCartItem(product, quantity) {
    if (!product || quantity <= 0) return false;

    const existingItem = currentCart.find(item => item.product.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const nextQty = currentQty + quantity;

    if (nextQty > product.stock) {
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
        return false;
    }

    if (existingItem) {
        existingItem.quantity = nextQty;
    } else {
        currentCart.push({ product, quantity });
    }

    persistCartState(false);
    return true;
}

function updateCartSummary(cartTotals) {
    const totalItems = cartTotals && Number(cartTotals.totalItems) || 0;
    const subtotal = cartTotals && Number(cartTotals.subtotal) || 0;
    const discount = cartTotals && Number(cartTotals.discount) || 0;
    const finalTotal = cartTotals && Number(cartTotals.finalTotal) || 0;
    const totalEl = document.getElementById('cartTotalSum');
    const itemsEl = document.getElementById('cartTotalItems');
    const metaEl = document.getElementById('cartMetaCopy');

    if (totalEl) totalEl.innerText = typeof formatStorePrice === 'function' ? formatStorePrice(subtotal) : `${subtotal}$`;
    if (itemsEl) itemsEl.innerText = `${totalItems} món`;
    if (metaEl) {
        metaEl.innerText = totalItems > 0
            ? 'Sẵn sàng gửi yêu cầu mua hàng cho admin xác nhận.'
            : 'Thêm sản phẩm để nhận tư vấn và xác nhận đơn nhanh hơn.';
    }

    const discountRow = document.getElementById('cartDiscountRow');
    const discountVal = document.getElementById('cartDiscountValue');
    const discountLbl = document.getElementById('cartDiscountLabel');
    const finalRow = document.getElementById('cartFinalTotalRow');
    const finalSum = document.getElementById('cartFinalTotalSum');

    if (discountRow && finalRow && appliedVoucher && totalItems > 0 && discount > 0) {
        discountRow.classList.remove('hide-menu');
        finalRow.classList.remove('hide-menu');
        if (discountLbl) discountLbl.innerText = appliedVoucher.code;
        if (discountVal) discountVal.innerText = `-${typeof formatStorePrice === 'function' ? formatStorePrice(discount) : discount + '$'}`;
        if (finalSum) finalSum.innerText = typeof formatStorePrice === 'function' ? formatStorePrice(finalTotal) : `${finalTotal}$`;
    } else {
        if (discountRow) discountRow.classList.add('hide-menu');
        if (finalRow) finalRow.classList.add('hide-menu');
    }
}

window.applyVoucher = function() {
    const codeInput = document.getElementById('voucherInput');
    const msgEl = document.getElementById('voucherMessage');
    if (!codeInput || !msgEl) return;

    const code = codeInput.value.trim().toUpperCase();
    if (!code) {
        msgEl.innerText = 'Vui lòng nhập mã giảm giá!';
        msgEl.style.color = 'rgb(239, 68, 68)';
        return;
    }

    const validPromo = getVoucherByCode(code);

    if (!validPromo) {
        msgEl.innerText = 'Mã giảm giá không hợp lệ hoặc đã hết hạn!';
        msgEl.style.color = 'rgb(239, 68, 68)';
        setAppliedVoucher(null);
        renderCart();
        return;
    }

    if (validPromo.usageLimit && validPromo.usageLimit > 0 && validPromo.uses >= validPromo.usageLimit) {
        msgEl.innerText = 'Mã giảm giá đã hết lượt, không thể sử dụng!';
        msgEl.style.color = 'rgb(239, 68, 68)';
        setAppliedVoucher(null);
        renderCart();
        return;
    }

    msgEl.innerText = `Đã áp dụng: ${validPromo.title}`;
    msgEl.style.color = 'rgb(34, 197, 94)';
    setAppliedVoucher(validPromo);
    renderCart();
};

function buildCartItemMarkup(item) {
    const sellingPrice = typeof getProductSellingPrice === 'function'
        ? getProductSellingPrice(item.product)
        : Number(item.product.price || 0);
    const hasSale = sellingPrice < Number(item.product.price || 0);
    const priceMarkup = hasSale
        ? `${typeof formatStorePrice === 'function' ? formatStorePrice(sellingPrice) : `${sellingPrice}$`} <span class="store-modal-old-price">${typeof formatStorePrice === 'function' ? formatStorePrice(item.product.price) : `${item.product.price}$`}</span>`
        : `${typeof formatStorePrice === 'function' ? formatStorePrice(sellingPrice) : `${sellingPrice}$`}`;

    return `
        <article class="cart-item-card">
            <img src="${item.product.img}" alt="${item.product.name}" onerror="this.onerror=null;this.src='${window.productFallbackImage || 'product-fallback.svg'}';">
            <div class="cart-item-copy">
                <h4>${item.product.name}</h4>
                <p>${item.product.collection || 'Sản phẩm đang có sẵn'} · ${priceMarkup}</p>
                <div class="cart-item-subline">${item.product.tagline || 'Sản phẩm sẵn sàng để chốt đơn.'}</div>
            </div>
            <div class="cart-item-side">
                <div class="cart-item-qty">
                    <button type="button" onclick="updateCartQuantity('${item.product.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateCartQuantity('${item.product.id}', 1)">+</button>
                </div>
                <button type="button" class="cart-remove-btn" onclick="removeFromCart('${item.product.id}')">Bỏ khỏi giỏ</button>
            </div>
        </article>
    `;
}

function addToCart() {
    if (!currentSelectedProduct) return;

    const qtyInput = document.getElementById('buyQty');
    const quantity = qtyInput ? Math.max(1, Number(qtyInput.value) || 1) : 1;

    if (!addCartItem(currentSelectedProduct, quantity)) {
        return;
    }

    showToast(`Đã thêm ${quantity} x ${currentSelectedProduct.name} vào giỏ hàng!`);
    closeModal();
    renderCart();
}

window.addToCart = addToCart;

window.quickAddToCart = function(productId) {
    const product = typeof findProductById === 'function' ? findProductById(productId) : null;
    if (!product) {
        showToast('Không tìm thấy sản phẩm để thêm nhanh.');
        return;
    }

    if (product.stock <= 0) {
        showToast('Sản phẩm này đã hết hàng.');
        return;
    }

    if (!addCartItem(product, 1)) {
        return;
    }

    showToast(`Đã thêm nhanh ${product.name} vào giỏ hàng.`);
    renderCart();
};

window.addProductToCart = function(productId, quantity = 1) {
    const product = typeof findProductById === 'function' ? findProductById(productId) : null;
    if (!product) return false;
    return addCartItem(product, quantity);
};

function openCart() {
    hydrateCartFromStorage();
    renderCart();

    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.classList.remove('hide-menu');
}

window.openCart = openCart;

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.classList.add('hide-menu');
}

window.closeCart = closeCart;

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    hydrateCartFromStorage();

    if (currentCart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-state">
                <strong>Giỏ hàng đang trống</strong>
                <p>Thử thêm vài mẫu đang sale hoặc phụ kiện để bắt đầu tạo đơn.</p>
            </div>
        `;
        updateCartSummary({
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            finalTotal: 0
        });
        return;
    }

    container.innerHTML = currentCart.map(buildCartItemMarkup).join('');
    updateCartSummary(getCurrentCartTotals());
}

window.renderCart = renderCart;

window.updateCartQuantity = function(productId, delta) {
    const item = currentCart.find(cartItem => cartItem.product.id === productId);
    if (!item) return;

    const nextQuantity = item.quantity + delta;
    if (nextQuantity <= 0) {
        currentCart.splice(currentCart.indexOf(item), 1);
        persistCartState();
        return;
    }

    if (nextQuantity > item.product.stock) {
        showToast(`Kho chỉ còn ${item.product.stock} sản phẩm.`);
        return;
    }

    item.quantity = nextQuantity;
    persistCartState();
};

window.removeFromCart = function(productId) {
    const nextCart = currentCart.filter(item => item.product.id !== productId);
    currentCart.splice(0, currentCart.length, ...nextCart);
    persistCartState();
    showToast('Đã bỏ sản phẩm khỏi giỏ hàng.');
};

function checkout() {
    if (currentCart.length === 0) {
        showToast('Giỏ hàng đang trống!');
        return;
    }

    showToast('Đang gửi yêu cầu mua hàng đến admin...');

    window.setTimeout(() => {
        const order = typeof window.recordCheckoutOrder === 'function'
            ? window.recordCheckoutOrder(currentCart, appliedVoucher)
            : null;

        if (!order) {
            showToast('Không tạo được yêu cầu mua hàng. Thử lại sau.');
            return;
        }

        if (appliedVoucher) {
            if (appliedVoucher.source === 'issued') {
                const issuedVouchers = JSON.parse(localStorage.getItem('issuedVoucherData')) || [];
                const voucherIndex = issuedVouchers.findIndex(voucher => String(voucher.code || '').trim().toUpperCase() === appliedVoucher.code);
                if (voucherIndex !== -1) {
                    const nextUses = (Number(issuedVouchers[voucherIndex].uses) || 0) + 1;
                    issuedVouchers[voucherIndex] = {
                        ...issuedVouchers[voucherIndex],
                        uses: nextUses,
                        status: 'Đã sử dụng',
                        usedAt: new Date().toISOString()
                    };
                    localStorage.setItem('issuedVoucherData', JSON.stringify(issuedVouchers));
                }
            } else {
                const promotions = JSON.parse(localStorage.getItem('promotionData')) || [];
                const promoIndex = promotions.findIndex(p => p.id === appliedVoucher.id);
                if (promoIndex !== -1) {
                    promotions[promoIndex].uses = (promotions[promoIndex].uses || 0) + 1;
                    localStorage.setItem('promotionData', JSON.stringify(promotions));
                    if (typeof renderAdminPromotions === 'function') {
                        const searchInput = document.getElementById('adminPromotionSearchInput');
                        renderAdminPromotions(searchInput ? searchInput.value : '');
                    }
                }
            }
            setAppliedVoucher(null);
            const codeInput = document.getElementById('voucherInput');
            if (codeInput) codeInput.value = '';
            const msgEl = document.getElementById('voucherMessage');
            if (msgEl) msgEl.innerText = '';
            if (typeof renderStorePromoStrip === 'function') {
                renderStorePromoStrip();
            }
        }

        currentCart.splice(0, currentCart.length);
        persistCartState(false);
        closeCart();
        renderCart();

        if (typeof renderOrderHistory === 'function') {
            renderOrderHistory();
        }

        if (typeof renderSidebar === 'function') {
            renderSidebar();
        }

        if (typeof renderStoreInsights === 'function') {
            renderStoreInsights();
        }

        showToast(`Đã gửi yêu cầu mua hàng ${order.id} thành công!`);
    }, 800);
}

window.checkout = checkout;
window.hydrateCartFromStorage = hydrateCartFromStorage;

hydrateCartFromStorage();
