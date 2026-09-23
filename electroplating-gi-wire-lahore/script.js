/**
 * Electroplating GI Wire — Wholesale & Supply
 * Official JavaScript Controller
 * WhatsApp Ordering, Dynamic Messaging, Gauge Filtering & Calculator
 */

(function () {
  'use strict';

  // Constants
  const WHATSAPP_PHONE = '923221817463';
  const PRICE_PER_KG = 385;

  /**
   * Helper to build wa.me URL with pre-filled message
   * @param {string} message
   * @returns {string}
   */
  function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message.trim())}`;
  }

  // 1. Mobile Drawer Navigation
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobileToggleBtn');
    const drawer = document.getElementById('mobileDrawer');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', function () {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Header Scroll Effect
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. Gauge Filter Bar
  function initGaugeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const selectedGauge = this.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardGauge = card.getAttribute('data-gauge-num');
          if (selectedGauge === 'all' || cardGauge === selectedGauge) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Product Card WhatsApp Dynamic Order Buttons
  function initProductOrderButtons() {
    const orderButtons = document.querySelectorAll('.btn-card-order');

    orderButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const gaugeName = this.getAttribute('data-gauge-name') || 'GI Wire';
        const msg = `Hello, I want to order ${gaugeName}. Please share availability and order details.`;
        window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
      });
    });
  }

  // 5. Quantity & Order Calculator
  function initCalculator() {
    const gaugeSelect = document.getElementById('calcGaugeSelect');
    const weightInput = document.getElementById('calcWeightInput');
    const totalEl = document.getElementById('calcTotalEstimate');
    const calcOrderBtn = document.getElementById('calcOrderBtn');

    if (!gaugeSelect || !weightInput || !totalEl || !calcOrderBtn) return;

    function recalculate() {
      const weight = parseFloat(weightInput.value) || 0;
      const total = weight * PRICE_PER_KG;
      totalEl.textContent = `Rs. ${total.toLocaleString()}`;
    }

    weightInput.addEventListener('input', recalculate);
    gaugeSelect.addEventListener('change', recalculate);

    calcOrderBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const gauge = gaugeSelect.value;
      const weight = parseFloat(weightInput.value) || 0;
      const total = (weight * PRICE_PER_KG).toLocaleString();

      if (weight <= 0) {
        weightInput.style.borderColor = '#dc2626';
        weightInput.focus();
        setTimeout(() => {
          weightInput.style.borderColor = '';
        }, 2000);
        return;
      }

      const msg = `Hello, I want to order ${gauge} GI Wire.\nApproximate quantity: ${weight} kg\nEstimated total at Rs. ${PRICE_PER_KG}/kg: Rs. ${total}\nPlease confirm availability, delivery/pickup and payment details.`;
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    });

    // Run initial calculation
    recalculate();
  }

  // 6. Interactive Contact / Quick WhatsApp Inquiry Form
  function initContactForm() {
    const form = document.getElementById('whatsappInquiryForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (document.getElementById('inquiryName')?.value || '').trim();
      const gauge = document.getElementById('inquiryGauge')?.value || '16-22 Gauge';
      const quantity = (document.getElementById('inquiryQuantity')?.value || '').trim();
      const note = (document.getElementById('inquiryNote')?.value || '').trim();

      let msg = `Hello, I want to inquire about GI Wire supply.\n`;
      if (name) msg += `Name: ${name}\n`;
      msg += `Required Gauge: ${gauge}\n`;
      if (quantity) msg += `Estimated Quantity: ${quantity}\n`;
      if (note) msg += `Note: ${note}\n`;
      msg += `Listed rate: Rs. 385/kg. Please confirm availability and order details.`;

      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    });
  }

  // 7. FAQ Accordion with Accessibility
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!questionBtn || !answer) return;

      const answerId = `faq-answer-${index}`;
      answer.id = answerId;
      questionBtn.setAttribute('aria-controls', answerId);
      questionBtn.setAttribute('aria-expanded', 'false');

      questionBtn.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Optional: close other open items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // DOM Content Loaded Handler
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initHeaderScroll();
    initGaugeFilters();
    initProductOrderButtons();
    initCalculator();
    initContactForm();
    initFAQ();
  });
})();
