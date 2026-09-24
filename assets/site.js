// SolarQube Energy - Shared Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressIndicator();
  initDynamicCopyright();
  initMobileMenu();
  initDropdowns();
  initSmoothScroll();
  initScrollReveal();
  initQuoteModal();
  initFaqAccordions();
  initSavingsCalculator();
  initProjectFilters();
  initProjectCaseStudyModal();
  initSectorTabs();
  initContactForms();
  initProjectCarousel();
});

// Dynamic Copyright Year Updater - sets the current year dynamically in .copyright-year spans
function initDynamicCopyright() {
  const currentYear = (new Date().getFullYear() || 2026).toString();
  const yearSpans = document.querySelectorAll('.copyright-year, #copyright-year, [data-copyright-year]');
  yearSpans.forEach(el => {
    el.textContent = currentYear;
  });

  // Scan footer paragraphs to ensure copyright text is up-to-date across all pages
  const footerParagraphs = document.querySelectorAll('footer p, .footer-copyright, #site-footer p');
  footerParagraphs.forEach(p => {
    if (p.textContent.includes('©') || p.textContent.includes('All Rights Reserved')) {
      const yearSpan = p.querySelector('.copyright-year');
      if (!yearSpan) {
        p.innerHTML = p.innerHTML.replace(/©\s*\d{4}/g, `© <span class="copyright-year">${currentYear}</span>`);
      } else {
        yearSpan.textContent = currentYear;
      }
    }
  });
}

// Make globally accessible
window.updateCopyrightYear = initDynamicCopyright;
window.initDynamicCopyright = initDynamicCopyright;

// 0. Top Viewport Scroll Progress Indicator
function initScrollProgressIndicator() {
  let progressContainer = document.getElementById('sq-scroll-progress-container');
  let progressBar = document.getElementById('sq-scroll-progress-bar');

  if (!progressContainer) {
    progressContainer = document.createElement('div');
    progressContainer.id = 'sq-scroll-progress-container';
    progressContainer.setAttribute('aria-hidden', 'true');

    progressBar = document.createElement('div');
    progressBar.id = 'sq-scroll-progress-bar';
    progressContainer.appendChild(progressBar);

    document.body.prepend(progressContainer);
  }

  let ticking = false;

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = scrollPercent + '%';
    } else {
      progressBar.style.width = '0%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateScrollProgress();
}

// 1. Mobile Menu Drawer & Dropdown Panel
function initMobileMenu() {
  // Support standard dropdown panel (#mobile-nav-panel)
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const mobileToggleBtns = document.querySelectorAll('#mobile-nav-toggle-btn, [aria-label="Toggle navigation menu"]');

  if (mobileNavPanel) {
    mobileToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNavPanel.classList.toggle('hidden');
      });
    });

    // Close when clicking any link inside the mobile panel
    const panelLinks = mobileNavPanel.querySelectorAll('a');
    panelLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavPanel.classList.add('hidden');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNavPanel.contains(e.target) && !Array.from(mobileToggleBtns).some(btn => btn.contains(e.target))) {
        mobileNavPanel.classList.add('hidden');
      }
    });
  }

  // Support side drawer if present (#mobile-menu-drawer)
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (toggleBtn && drawer) {
    function openMenu() {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
      if (backdrop) backdrop.classList.remove('hidden', 'opacity-0');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('translate-x-0');
      drawer.classList.add('translate-x-full');
      if (backdrop) backdrop.classList.add('opacity-0', 'hidden');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Auto-close mobile drawer when any navigation link inside it is clicked
    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Mobile submenu accordion
  const mobileSolutionsToggle = document.getElementById('mobile-solutions-toggle');
  const mobileSolutionsMenu = document.getElementById('mobile-solutions-menu');
  const mobileSolutionsIcon = document.getElementById('mobile-solutions-icon');

  if (mobileSolutionsToggle && mobileSolutionsMenu) {
    mobileSolutionsToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileSolutionsMenu.classList.toggle('hidden');
      if (mobileSolutionsIcon) {
        mobileSolutionsIcon.classList.toggle('rotate-180');
      }
    });
  }
}

// In-Page Smooth Scrolling with Fixed Header Offset
function initSmoothScroll() {
  // Handle in-page anchor clicks
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;

      // Extract path and hash
      const url = new URL(href, window.location.href);
      const isSamePage = url.pathname === window.location.pathname || 
        (url.pathname.endsWith('/') && window.location.pathname.endsWith('/index.html')) ||
        (url.pathname.endsWith('/index.html') && window.location.pathname.endsWith('/'));

      if (isSamePage && url.hash) {
        const targetId = url.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 90;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without instant jump
          history.pushState(null, '', url.hash);
        }
      }
    });
  });

  // Handle direct hash navigation on page load
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetEl = document.getElementById(hash);
    if (targetEl) {
      setTimeout(() => {
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 150);
    }
  }
}

// 2. Desktop Dropdowns
function initDropdowns() {
  const dropdownTrigger = document.getElementById('nav-solutions-trigger');
  const dropdownMenu = document.getElementById('nav-solutions-menu');

  if (!dropdownTrigger || !dropdownMenu) return;

  let timeoutId = null;

  function show() {
    clearTimeout(timeoutId);
    dropdownMenu.classList.remove('opacity-0', 'invisible', 'translate-y-2');
    dropdownMenu.classList.add('opacity-100', 'visible', 'translate-y-0');
  }

  function hide() {
    timeoutId = setTimeout(() => {
      dropdownMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
      dropdownMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
    }, 180);
  }

  dropdownTrigger.addEventListener('mouseenter', show);
  dropdownTrigger.addEventListener('mouseleave', hide);
  dropdownMenu.addEventListener('mouseenter', show);
  dropdownMenu.addEventListener('mouseleave', hide);
}

// 3. Scroll Reveal Animations (fade + lift, ~80ms stagger)
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// 4. Quote Modal
function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const backdrop = document.getElementById('quote-modal-backdrop');
  const closeBtns = document.querySelectorAll('.close-quote-modal');
  const triggerBtns = document.querySelectorAll('[data-open-quote]');
  const form = document.getElementById('global-quote-form');
  const successBox = document.getElementById('quote-modal-success');

  if (!modal) return;

  window.openQuoteModal = (segment = 'Residential Rooftop Solar') => {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      const dialog = modal.querySelector('.modal-dialog');
      if (dialog) dialog.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';

    // Preselect segment
    const segmentSelect = document.getElementById('quote-segment');
    if (segmentSelect && segment) {
      segmentSelect.value = segment;
    }
  };

  window.closeQuoteModal = () => {
    modal.classList.add('opacity-0');
    const dialog = modal.querySelector('.modal-dialog');
    if (dialog) dialog.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (form) form.classList.remove('hidden');
      if (successBox) successBox.classList.add('hidden');
    }, 250);
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const segment = btn.getAttribute('data-segment') || 'Residential Rooftop Solar';
      window.openQuoteModal(segment);
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', window.closeQuoteModal));
  if (backdrop) backdrop.addEventListener('click', window.closeQuoteModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Engineering Assessment...
        `;
      }

      setTimeout(() => {
        if (form) form.classList.add('hidden');
        if (successBox) successBox.classList.remove('hidden');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 700);
    });
  }
}

// 5. FAQ Accordions
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others in the same group if requested
      const parent = item.closest('.faq-group');
      if (parent) {
        parent.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherContent) otherContent.classList.add('hidden');
            if (otherIcon) otherIcon.classList.remove('rotate-180');
          }
        });
      }

      if (isOpen) {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
      } else {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

// 6. Interactive Residential Savings Calculator (Calculation Logic v2 with PM Surya Ghar Subsidy)
function initSavingsCalculator() {
  const billSlider = document.getElementById('calc-bill-slider');
  const billDisplay = document.getElementById('calc-bill-display');
  
  if (!billSlider) return;

  const kwOutput = document.getElementById('calc-system-size');
  const roofAreaOutput = document.getElementById('calc-roof-area');
  const monthlySavingsOutput = document.getElementById('calc-monthly-savings');
  const annualSavingsOutput = document.getElementById('calc-annual-savings');
  const grossCostOutput = document.getElementById('calc-gross-cost');
  const subsidyCentralOutput = document.getElementById('calc-subsidy-central');
  const subsidyStateOutput = document.getElementById('calc-subsidy-state');
  const subsidyTotalOutput = document.getElementById('calc-subsidy-total');
  const netCostOutput = document.getElementById('calc-net-cost');
  const paybackOutput = document.getElementById('calc-payback-years');
  const billCutBadge = document.getElementById('calc-bill-cut-badge');
  const roiBadge = document.getElementById('calc-roi-badge');
  
  const shadingDropdown = document.getElementById('calc-shading-dropdown');
  const shadingFactorLabel = document.getElementById('calc-shading-factor-label');
  const shadingInputs = document.querySelectorAll('input[name="shadingLevel"]');
  const shadingCards = document.querySelectorAll('.shading-card');

  let currentShading = 'minimal';

  function updateShadingUI(val) {
    currentShading = val;
    if (shadingDropdown && shadingDropdown.value !== val) {
      shadingDropdown.value = val;
    }
    if (shadingFactorLabel) {
      if (val === 'minimal') shadingFactorLabel.textContent = '100% Solar Yield (1.00)';
      else if (val === 'some') shadingFactorLabel.textContent = '90% Solar Yield (0.90)';
      else if (val === 'heavy') shadingFactorLabel.textContent = '75% Solar Yield (0.75)';
    }
    shadingCards.forEach(card => {
      if (card.dataset.shade === currentShading) {
        card.classList.remove('border-outline-variant/40', 'bg-white');
        card.classList.add('border-secondary', 'bg-secondary/5');
      } else {
        card.classList.remove('border-secondary', 'bg-secondary/5');
        card.classList.add('border-outline-variant/40', 'bg-white');
      }
    });
  }

  function calculate() {
    // Basic input validation: Handle non-numeric, negative, or undefined values gracefully
    const rawVal = billSlider ? billSlider.value : 0;
    let monthlyBill = parseFloat(rawVal);
    if (isNaN(monthlyBill) || monthlyBill < 0) {
      monthlyBill = 0;
    }

    // Step 1: Determine system size and gross cost (lookup table)
    let systemSizeKw = 1;
    let grossCost = 70000;

    if (monthlyBill <= 2000) {
      systemSizeKw = 1;
      grossCost = 70000;
    } else if (monthlyBill < 4000) {
      systemSizeKw = 2;
      grossCost = 150000;
    } else if (monthlyBill <= 7000) {
      systemSizeKw = 3;
      grossCost = 220000;
    } else if (monthlyBill <= 9000) {
      systemSizeKw = 4;
      grossCost = 250000;
    } else if (monthlyBill <= 12000) {
      systemSizeKw = 5;
      grossCost = 300000;
    } else {
      // Extrapolation beyond ₹12,000
      const stepsAbove = Math.ceil((monthlyBill - 12000) / 2500);
      systemSizeKw = 5 + stepsAbove;
      grossCost = 300000 + (stepsAbove * 50000);
    }

    // Step 2: Apply government subsidy — PM Surya Ghar (Central) + Tamil Nadu State top-up (TN Solar Homes Portal)
    // Slabs per official scheme: 1kW ₹30k+₹5k | 2kW ₹60k+₹10k | 3kW & above ₹78k+₹22k (both capped at 3kW)
    let centralSubsidy = 0;
    let stateSubsidy = 0;
    if (systemSizeKw === 1) {
      centralSubsidy = 30000;
      stateSubsidy = 5000;
    } else if (systemSizeKw === 2) {
      centralSubsidy = 60000;
      stateSubsidy = 10000;
    } else {
      centralSubsidy = 78000; // Capped at ₹78,000 for 3 kW and above
      stateSubsidy = 22000;   // Capped at ₹22,000 for 3 kW and above
    }
    const subsidyAmount = centralSubsidy + stateSubsidy;

    const netCost = Math.max(0, grossCost - subsidyAmount);

    // Step 3: Shading factor
    let shadingFactor = 1.00;
    if (currentShading === 'some') {
      shadingFactor = 0.90;
    } else if (currentShading === 'heavy') {
      shadingFactor = 0.75;
    }

    // Step 4: Monthly & Annual savings (safeguarded against zero bills)
    const offsetFactor = 0.85;
    let monthlySavings = 0;
    let annualSavings = 0;

    if (monthlyBill > 0) {
      monthlySavings = Math.round(monthlyBill * offsetFactor * shadingFactor);
      annualSavings = Math.round(monthlySavings * 12);
    }

    const effectiveCutPercent = Math.round(offsetFactor * shadingFactor * 100);

    // Step 5: Payback period calculation with strict divide-by-zero & NaN / Infinity validation
    let paybackYearsDisplay = 'N/A (Bill is ₹0)';
    let paybackYearsNumeric = null;
    if (monthlyBill > 0 && annualSavings > 0 && netCost > 0) {
      const rawPayback = netCost / annualSavings;
      if (Number.isFinite(rawPayback) && !isNaN(rawPayback) && rawPayback > 0) {
        paybackYearsDisplay = `~${rawPayback.toFixed(1)} Years`;
        paybackYearsNumeric = rawPayback;
      } else {
        paybackYearsDisplay = 'N/A';
      }
    } else if (monthlyBill <= 0) {
      paybackYearsDisplay = 'N/A (Bill is ₹0)';
    }

    const roofAreaSqFt = Math.round(systemSizeKw * 85); // ~85 sq.ft shade-free per kW

    // Update UI DOM Elements
    if (billDisplay) {
      billDisplay.textContent = `₹${monthlyBill.toLocaleString('en-IN')}${monthlyBill >= 20000 ? '+' : ''}`;
    }
    if (kwOutput) {
      kwOutput.textContent = `${systemSizeKw} kW`;
    }
    if (roofAreaOutput) {
      roofAreaOutput.textContent = `~${roofAreaSqFt} sq. ft. shade-free`;
    }
    if (monthlySavingsOutput) {
      monthlySavingsOutput.textContent = `₹${monthlySavings.toLocaleString('en-IN')}`;
    }
    if (annualSavingsOutput) {
      annualSavingsOutput.textContent = `₹${annualSavings.toLocaleString('en-IN')} / year`;
    }
    if (grossCostOutput) {
      grossCostOutput.textContent = `₹${grossCost.toLocaleString('en-IN')}`;
    }
    if (subsidyCentralOutput) {
      subsidyCentralOutput.textContent = `- ₹${centralSubsidy.toLocaleString('en-IN')}`;
    }
    if (subsidyStateOutput) {
      subsidyStateOutput.textContent = `- ₹${stateSubsidy.toLocaleString('en-IN')}`;
    }
    if (subsidyTotalOutput) {
      subsidyTotalOutput.textContent = `- ₹${subsidyAmount.toLocaleString('en-IN')}`;
    }
    if (netCostOutput) {
      netCostOutput.textContent = `₹${netCost.toLocaleString('en-IN')}`;
    }
    if (paybackOutput) {
      paybackOutput.textContent = paybackYearsDisplay;
    }
    if (billCutBadge) {
      billCutBadge.textContent = monthlyBill > 0 ? `~${effectiveCutPercent}% Bill Cut` : 'N/A';
    }
    if (roiBadge) {
      roiBadge.classList.remove(
        'bg-secondary/10', 'text-secondary',
        'bg-emerald-100', 'text-emerald-700',
        'bg-amber-100', 'text-amber-800'
      );
      if (paybackYearsNumeric === null) {
        roiBadge.textContent = 'N/A';
        roiBadge.classList.add('bg-amber-100', 'text-amber-800');
      } else if (paybackYearsNumeric <= 4) {
        roiBadge.textContent = 'Fast ROI';
        roiBadge.classList.add('bg-emerald-100', 'text-emerald-700');
      } else if (paybackYearsNumeric <= 6) {
        roiBadge.textContent = 'Good ROI';
        roiBadge.classList.add('bg-secondary/10', 'text-secondary');
      } else {
        roiBadge.textContent = 'Standard ROI';
        roiBadge.classList.add('bg-amber-100', 'text-amber-800');
      }
    }
  }

  // Shading Level dropdown & inputs event listeners
  if (shadingDropdown) {
    shadingDropdown.addEventListener('change', (e) => {
      updateShadingUI(e.target.value);
      calculate();
    });
  }

  shadingInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      updateShadingUI(e.target.value);
      calculate();
    });
  });

  billSlider.addEventListener('input', calculate);

  // Run initial calculation
  updateShadingUI('minimal');
  calculate();
}

// 7. Projects Filter Grid with Search & Location Support
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const locationChips = document.querySelectorAll('.project-location-chip');
  const searchInput = document.getElementById('project-search-input');
  const projectCards = document.querySelectorAll('.project-card');
  const resultsCount = document.getElementById('project-results-count');
  const noResultsBox = document.getElementById('project-no-results');
  const clearFiltersBtn = document.getElementById('project-clear-filters');

  if (!projectCards.length) return;

  let activeCategory = 'all';
  let activeLocation = 'all';
  let activeSearch = '';

  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardLocation = (card.getAttribute('data-location') || '').toLowerCase();
      const cardTitle = (card.getAttribute('data-title') || card.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesLocation = activeLocation === 'all' || cardLocation.includes(activeLocation.toLowerCase());
      const matchesSearch = !activeSearch || cardTitle.includes(activeSearch) || cardLocation.includes(activeSearch);

      if (matchesCategory && matchesLocation && matchesSearch) {
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.classList.add('hidden');
        }, 180);
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} of ${projectCards.length} installations`;
    }

    if (noResultsBox) {
      if (visibleCount === 0) {
        noResultsBox.classList.remove('hidden');
      } else {
        noResultsBox.classList.add('hidden');
      }
    }
  }

  // Category Tab Click Listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-filter') || 'all';

      filterBtns.forEach(b => {
        b.classList.remove('bg-[#29C5F0]', 'bg-primary', 'bg-sq-navy', 'text-white', 'text-on-primary', 'border-secondary', 'shadow-sm');
        b.classList.add('bg-surface-container', 'bg-white', 'text-on-surface', 'text-slate-700', 'hover:bg-surface-variant');
      });

      btn.classList.remove('bg-surface-container', 'bg-white', 'text-on-surface', 'text-slate-700', 'hover:bg-surface-variant');
      btn.classList.add('bg-primary', 'text-white', 'shadow-sm');

      applyFilters();
    });
  });

  // Location Chip Listeners
  locationChips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeLocation = chip.getAttribute('data-location') || 'all';

      locationChips.forEach(c => {
        c.classList.remove('bg-secondary', 'text-white', 'border-secondary');
        c.classList.add('bg-surface-container-low', 'text-on-surface-variant', 'border-outline-variant/50');
      });

      chip.classList.remove('bg-surface-container-low', 'text-on-surface-variant', 'border-outline-variant/50');
      chip.classList.add('bg-secondary', 'text-white', 'border-secondary');

      applyFilters();
    });
  });

  // Live Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearch = (e.target.value || '').trim().toLowerCase();
      applyFilters();
    });
  }

  // Clear Filters Button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      activeCategory = 'all';
      activeLocation = 'all';
      activeSearch = '';

      if (searchInput) searchInput.value = '';

      filterBtns.forEach(b => {
        const isAll = b.getAttribute('data-filter') === 'all';
        if (isAll) {
          b.classList.add('bg-primary', 'text-white', 'shadow-sm');
          b.classList.remove('bg-surface-container', 'bg-white', 'text-on-surface', 'text-slate-700');
        } else {
          b.classList.remove('bg-primary', 'text-white', 'shadow-sm');
          b.classList.add('bg-surface-container', 'text-on-surface');
        }
      });

      locationChips.forEach(c => {
        const isAll = c.getAttribute('data-location') === 'all';
        if (isAll) {
          c.classList.add('bg-secondary', 'text-white', 'border-secondary');
          c.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
        } else {
          c.classList.remove('bg-secondary', 'text-white', 'border-secondary');
          c.classList.add('bg-surface-container-low', 'text-on-surface-variant');
        }
      });

      applyFilters();
    });
  }

  // Run initial state
  applyFilters();
}

// 7b. Project Case Study Modal Handler
function initProjectCaseStudyModal() {
  const modal = document.getElementById('project-case-modal');
  const backdrop = document.getElementById('project-case-backdrop');
  const closeBtns = document.querySelectorAll('.close-project-modal');
  const triggerBtns = document.querySelectorAll('[data-open-case-study], .view-case-study-btn');

  if (!modal) return;

  // Project Detailed Repository Database
  const projectDatabase = {
    'proj-1': {
      title: '5.5 kW Residential Rooftop Solar Plant',
      category: 'Residential Rooftop',
      badge: '5.5 kW Grid-Tied',
      location: 'Fairlands, Salem, Tamil Nadu',
      district: 'Salem',
      capacity: '5.5 kWp DC / 5.0 kW AC',
      annualUnits: '7,800 Units (kWh) / Year',
      annualSavings: '₹62,400 / Year (90% Bill Reduction)',
      co2Offset: '6.5 Metric Tonnes / Year',
      payback: '~3.2 Years',
      subsidy: '₹78,000 Direct DBT (PM Surya Ghar Scheme)',
      modules: '10 × 550W Tier-1 Mono PERC Half-Cut Glass-Backsheet Modules',
      inverter: '5 kW Single-Phase String Inverter with Integrated Wi-Fi App Monitoring',
      structure: '9.5ft High-Clearance Hot-Dip Galvanized Pergola (Walkable Terrace Layout)',
      discom: 'TANGEDCO Salem Distribution Circle (Net-Metered)',
      challenge: 'The homeowner wanted to maintain complete unhindered access to their 850 sq. ft. terrace for family gatherings, evening walks, and clothes drying without low ground-mount shadows.',
      solution: 'Custom engineered a 9.5-foot high elevated hot-dip galvanized steel pergola frame with 150 km/h wind certification. Panels act as a heat-shielding roof canopy that cools the top floor by 3.5°C while leaving 100% floor area usable.',
      testimonial: '"SolarQube handled everything from DISCOM net-metering to the ₹78,000 subsidy credit directly deposited in my bank. Our bi-monthly TANGEDCO bill dropped from ₹12,000 to basic meter charges!"',
      clientName: 'Dr. S. Karthikeyan',
      clientRole: 'Homeowner, Fairlands, Salem',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1Xe8_v7orJqyj3V7P79l_kPrdBuCkeIIPXFraDxEmGpA9dNvNCtZkRCdD0EKsp7oZFTxIlemDLevliyOxJ2A6EOpr7qFL8vYzla056h_SfoIEF3wiwTRVIkNhL2Z3IOgNy1FaBwQ--hT_rCkQhhETLNBKDu5dBrlKleGBzRGZF391KL9YyBTv0IzwQgw2Btvs0ROBBTMdkys3WyXuzxVD-fI-ByLPmOsb6HAAXrUhNuVbCZTzVj3uCa0A'
    },
    'proj-2': {
      title: '45 kW Commercial Solar EPC for Textile Processing Facility',
      category: 'Commercial & Industrial',
      badge: '45 kW Industrial EPC',
      location: 'Perundurai Industrial Estate, Erode, Tamil Nadu',
      district: 'Erode',
      capacity: '45 kWp DC / 40 kW AC',
      annualUnits: '66,000 Units (kWh) / Year',
      annualSavings: '₹5,80,000 / Year',
      co2Offset: '54.5 Metric Tonnes / Year',
      payback: '~2.8 Years (accelerated with 40% Sec 32 Tax Depreciation)',
      subsidy: 'Commercial Accelerated Depreciation under Income Tax Section 32',
      modules: 'N-Type TOPCon 580W High-Efficiency Dual-Glass Photovoltaic Panels',
      inverter: '40 kW Three-Phase Commercial String Inverter with Dual MPPT Tracking',
      structure: 'Non-Penetrating Aluminum Seam Clamps with EPDM Weatherproof Seals on Metal Deck',
      discom: 'TANGEDCO Erode Industrial Circle (HT Tariff Net-Feed)',
      challenge: 'High daytime energy consumption driven by textile dyeing and winding machinery, coupled with extreme summer roof ambient temperatures reaching 58°C on the metal shed.',
      solution: 'Deployed N-Type TOPCon panels with low temperature coefficients (-0.30%/°C) mounted on raised aluminum rail fixtures to create natural convection cooling underneath, boosting energy harvest by 7.2%.',
      testimonial: '"Energy cost is our 2nd largest operating expense. SolarQube’s 45 kW system stabilized our daytime power costs and yielded substantial corporate tax benefits in Year 1."',
      clientName: 'M. Sundaram',
      clientRole: 'Managing Director, Sri Krishna Textiles, Erode',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1XTZK5rKeDzm2vJufWl9Oser-a1uEop1hw0Oozv42lV-9aLlvLXANccfkr9mTW_jyjwh9eny6xhQug5nBX1pzDBL89vjGNe3JjCzh4XVZgwY_fPvi-zqIFjY62EX-UkIpIQUEi-GYgIL7_wyWRxEaYMdcajYk8a8lavKYLLTbqG5yKuDpObatRj4WyJU1XcGwPagrIaGzdNbv5GUuJfaAqhdbfSNgzOak1Mw0gWdWXuouHveRdBRywjLdg'
    },
    'proj-3': {
      title: '3.3 kW Zero-Electricity-Bill Residential Solar System',
      category: 'Residential Rooftop',
      badge: '3.3 kW Net-Metered',
      location: 'Bus Stand Road, Jalakandapuram, Salem Dist.',
      district: 'Jalakandapuram',
      capacity: '3.3 kWp DC / 3.0 kW AC',
      annualUnits: '4,900 Units (kWh) / Year',
      annualSavings: '₹41,200 / Year',
      co2Offset: '4.1 Metric Tonnes / Year',
      payback: '~3.0 Years',
      subsidy: '₹78,000 PM Surya Ghar Direct Subsidy Sanctioned',
      modules: '6 × 550W Tier-1 Mono PERC Bifacial Solar Panels',
      inverter: '3.3 kW Micro-String Inverter with Type-II DC/AC Surge Protection',
      structure: 'Modular Hot-Dip Galvanized C-Channel Roof Mounting Structure',
      discom: 'TANGEDCO Mettur / Jalakandapuram Section',
      challenge: 'Nearby residential building created seasonal afternoon shading in the southwest corner of the terrace.',
      solution: 'Utilized independent dual-MPPT input configuration and optimized string division so shaded panels do not drag down generation across the remaining active modules.',
      testimonial: '"Prompt response from SolarQube’s local Jalakandapuram team. System was installed in 3 days and commissioned with bidirectional net-meter within 2 weeks."',
      clientName: 'R. Venkatesh',
      clientRole: 'Resident, Jalakandapuram',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1U8Qy5PIl1z55RwfAdjpDzYgoghWgaqJSVU2ehKIlYu6cUvkO81pmnZKBGD6QbuXXpfHGrTuNbFWbZFq93ij-jXCTWKtbTwpfw6dXxlU51BINKcu_TP0pX3OlQikSL4fnSQUKPdmQ1io_3_-4o0KKU4pJdPi0G7p_IhZ8WY2TVJ4P9AN7yhdxTlNd5eku7fTmamFpvzLdTjZqCeQpfaOuYHs2zMUZ8PqBkVDO7K8sjU4Pz7NnRdo57Rjjw'
    },
    'proj-4': {
      title: '5 kW Elevated Terrace Domestic Solar Plant',
      category: 'Residential Rooftop',
      badge: '5 kW Rooftop',
      location: 'Tharamangalam, Salem Dist., Tamil Nadu',
      district: 'Tharamangalam',
      capacity: '5.0 kWp DC / 5.0 kW AC',
      annualUnits: '7,400 Units (kWh) / Year',
      annualSavings: '₹58,500 / Year',
      co2Offset: '6.1 Metric Tonnes / Year',
      payback: '~3.3 Years',
      subsidy: '₹78,000 Central DBT Subsidy Approved',
      modules: '9 × 550W High-Efficiency Monocrystalline Panels',
      inverter: '5 kW On-Grid Inverter with Mobile Cloud Diagnostics',
      structure: 'High-Strength Hot-Dip Galvanized Steel Frame with Chemical Anchoring',
      discom: 'TANGEDCO Tharamangalam Section (Net-Metered)',
      challenge: 'Site is located in an open terrain exposed to heavy monsoon winds requiring strict structural safety compliance.',
      solution: 'Engineered chemical anchor bolting embedded into concrete roof beams with reinforced cross-bracing rated to withstand 150 km/h gust speeds.',
      testimonial: '"The build quality is exceptional. Heavy galvanized steel frame that doubles as a sheltered terrace canopy for our family."',
      clientName: 'P. Shanmugam',
      clientRole: 'Homeowner, Tharamangalam',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1WWW3jVmxJj2Hbr0BWCcWrSUqMWwxYA3NL06qetxahetAfBjXtgWwHjbNPuoovk0CRfMaweITCAWVpHw4T7f8pw6uocYJfKYCiJv0-tjyOWXMfImDHEtvV673rt4vx8C6O-uc0JvM0Rv9DeeSHVjaQc6_cQU8K7lJuPi0iJUcmwaCrhfWtFf75r8vmXOxkT9vCf7KrMAS3DguCrwrGINf9Mfyb73A3VY3l0LmdTZI34Us0mTvN7mipDUA'
    },
    'proj-5': {
      title: '35 kW Commercial Solar Carport & EV-Ready Canopy',
      category: 'Solar Canopies & Carports',
      badge: '35 kW Solar Carport',
      location: 'Junction Main Road, Salem, Tamil Nadu',
      district: 'Salem',
      capacity: '35 kWp DC / 30 kW AC + 7.4 kW Level-2 EV Charger',
      annualUnits: '52,000 Units (kWh) / Year',
      annualSavings: '₹4,40,000 / Year',
      co2Offset: '43.0 Metric Tonnes / Year',
      payback: '~3.4 Years',
      subsidy: 'Commercial Tax Depreciation Benefit + Accelerated Write-off',
      modules: '60 × 580W Bifacial Glass-to-Glass Panels Harvesting Ground Reflection',
      inverter: '30 kW Commercial Inverter with Dynamic Zero-Export Power Controller',
      structure: 'Architectural Cantilever Steel Structure with Integrated Rain Drainage Channels',
      discom: 'TANGEDCO Salem Metro Circle',
      challenge: 'Transforming executive surface parking into renewable power generation while keeping vehicles shielded from direct sun and heavy rain.',
      solution: 'Constructed custom dual-cantilever parking shelters with internal guttering channels. Bifacial modules capture ground-reflected light, generating 9% additional energy compared to monofacial panels.',
      testimonial: '"Our clients and staff love parking under the solar shelter, and it generates over 140 units of clean electricity every single day for our office building."',
      clientName: 'A. Natarajan',
      clientRole: 'Facility Director, Salem',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1GscOdX7RzIBUmKWq8kWdXf5TJCt9Ij53QNNPI6kSN0Trb7zURAX6SUvw4jE4KP3q53ENmwjS9z_eXMy-KJMxhwnuPZIpvV9jAv_7_qf6e5CFh6DCUn7721bbOdalEqvWFmhrDJoWSKPDVyG-S52LJZy-7-2pNepnsXTVDDjleYi2vgQCedHl9X0SHDjYUwjm8ncI76qysH07SekLbnJIxh0MiAFt7zjaQM7WfpwO1aXkEaAYF-hA'
    },
    'proj-6': {
      title: '120 kW Industrial Solar Installation for Manufacturing Plant',
      category: 'Commercial & Industrial',
      badge: '120 kW Industrial HT',
      location: 'Steel Plant Road, Salem, Tamil Nadu',
      district: 'Salem',
      capacity: '120 kWp DC / 100 kW AC',
      annualUnits: '1,80,000 Units (kWh) / Year',
      annualSavings: '₹15,20,000 / Year',
      co2Offset: '148.0 Metric Tonnes / Year',
      payback: '~2.6 Years',
      subsidy: 'Section 32 Tax Advantage + Commercial Peak Load Tariff Savings',
      modules: '210 × 575W TOPCon Bifacial High-Efficiency Modules',
      inverter: '100 kW High-Yield Multi-MPPT Inverter with Cloud SCADA Telemetry',
      structure: 'Heavy-Duty Elevated Structural Framework with Walkways and Safety Lifelines',
      discom: 'CEIG (Chief Electrical Inspector to Govt.) Clearance & TANGEDCO HT Grid Sync',
      challenge: 'High inductive motor start-up surges and stringent CEIG safety inspection compliance requirements for HT industrial connections.',
      solution: 'Engineered Class-A electrical protection panels with fast-acting surge arrestors, harmonics filters, and complete turnkey handling of CEIG documentation and on-site testing.',
      testimonial: '"Flawless execution from initial electrical drawing approvals to final commissioning. The solar plant operates seamlessly alongside our heavy machinery."',
      clientName: 'K. Rajendran',
      clientRole: 'Plant Head, Precision Engineering Works, Salem',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1WOSCNDl7z1xYvR20dxHPbf-3iyjUoWeUtVGA7ZhzXrmlzlDqb5-UZ25LPhaBLHBqVpT9_SmNZfe1r5Gqy1vXv0KAInBWcMLqcHMD-GRlBuev_RtY8DXvhtx1pZQFqSx81ef8-NLnhQrWQNL7MJ7I8q8_YymEPvDWOhPhq9G-5EVCDNKYnSJI7MnwzSHd8G_VqKNz4vbxbyKkpbjVxJYyopfHN2jy5dQfQdQ9jRbG4J2Pny8CrbPELJNrM'
    },
    'proj-7': {
      title: '1.2 MW Utility-Scale Ground-Mounted Solar Park',
      category: 'Utility Scale',
      badge: '1.2 MW Solar Park',
      location: 'Namakkal - Salem Highway Belt, Tamil Nadu',
      district: 'Namakkal',
      capacity: '1.2 MWp DC / 1.0 MW AC Grid Export',
      annualUnits: '18,50,000 Units (kWh) / Year',
      annualSavings: '₹1.48 Crore / Year (Captive Energy Valuation)',
      co2Offset: '1,520 Metric Tonnes / Year',
      payback: '~3.8 Years',
      subsidy: 'Group Captive Open Access Renewable Energy Certificate (REC) Eligible',
      modules: '2,150 × 580W Bifacial Solar Modules with Seasonal Tilt Configuration',
      inverter: 'Central Inverter Skids with Step-Up 22 kV Transformer Station',
      structure: 'Rammed-Post Driven Foundations with Anti-Corrosion Zinc-Aluminium Magnesium (ZAM) Coating',
      discom: 'TANTRANSCO / TANGEDCO 22 kV Substation Interconnection',
      challenge: 'Rocky undulating terrain with varying geotechnical soil layers and strict transmission line right-of-way synchronization.',
      solution: 'Utilized hydraulic ramming technology for foundation posts with terrain-following structural design, avoiding costly earth leveling while preserving optimal row spacing.',
      testimonial: '"SolarQube delivered the entire 1.2 MW project on schedule, including land civil works, 22kV dedicated feeder line construction, and grid synchronization."',
      clientName: 'S. Loganathan',
      clientRole: 'Portfolio Asset Manager, CleanTech Energy Investors',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAROzA7L-pLNjl4dSs4sbaaDpKPo732yvwVwOvLkY3G8OGFrCPcsly0LMzmBN9iiiJRgne-gYbAhNFYn1PYvUsXJRzSr0Z6Sbif9A5HEZfEWf_31Is35iQpa_a9Hve8Xuw2YUOC8S3V7Jc9YqgEkm1wblS6t967whWkkJvCCZCCwKzIE2TvPXj_sS_Jh5-eJP34isk0pN-u1sPP8-Jsx_RPZ0M4iRyM1JQt-GkAvIcLZ9xRLFffzsn'
    },
    'proj-8': {
      title: '15 kW Rooftop Solar Canopy for Healthcare Center',
      category: 'Solar Canopies & Carports',
      badge: '15 kW Hospital Canopy',
      location: 'EVN Road, Erode, Tamil Nadu',
      district: 'Erode',
      capacity: '15 kWp DC / 15 kW AC',
      annualUnits: '22,500 Units (kWh) / Year',
      annualSavings: '₹1,95,000 / Year',
      co2Offset: '18.6 Metric Tonnes / Year',
      payback: '~3.1 Years',
      subsidy: 'Commercial Accelerated Depreciation under Section 32',
      modules: '27 × 550W Tier-1 Monocrystalline Solar Panels',
      inverter: '15 kW Three-Phase Inverter with Lithium Battery Storage Synchronization',
      structure: '11ft Elevated Cantilever Canopy Built Above Rooftop HVAC Chillers',
      discom: 'TANGEDCO Erode Town Division',
      challenge: 'Critical healthcare equipment requiring pure continuous power, with zero rooftop floor space due to air handling units and chillers.',
      solution: 'Erected an 11-foot cantilevered elevated canopy spanning directly over the HVAC chiller bank, providing natural shading that lowers chiller operating temps by 4°C while delivering clean power.',
      testimonial: '"Our hospital has reliable green power, reduced chiller energy consumption due to roof shading, and zero diesel generator run-time during day power cuts."',
      clientName: 'Dr. Meenakshi Sundaram',
      clientRole: 'Chief Medical Administrator, Erode',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1UxbemV2s5AcksiF6bF4-Kls2d94JXhOxrPOxVZ5rYc3AAlXqvuZ-C9un7vum8hkbiuZZiHyoTXz46Pan-rIMcSvVdBxRJk_ktuEWuLoUGEvhp9zIFMFpknMC5IftuomhizIhagdX9mcUQs27-ca2FbXLmPjNhh79WuQqsl4NUeZJN5kWriV7iCg3HEYZaFfE06pIXr9qvwbiM14ulyXJH1tVUlj6eQwVC8b9NL4OWjczFdbqDGv-b4Hg'
    },
    'proj-9': {
      title: '10 kW Residential Three-Phase Solar System',
      category: 'Residential Rooftop',
      badge: '10 kW Three-Phase',
      location: 'Alagapuram, Salem, Tamil Nadu',
      district: 'Salem',
      capacity: '10 kWp DC / 10 kW AC',
      annualUnits: '15,000 Units (kWh) / Year',
      annualSavings: '₹1,25,000 / Year',
      co2Offset: '12.4 Metric Tonnes / Year',
      payback: '~3.1 Years',
      subsidy: '₹78,000 PM Surya Ghar Maximum Subsidy Slab Claimed',
      modules: '18 × 550W High-Efficiency Monocrystalline Panels',
      inverter: '10 kW Three-Phase Inverter with Active Phase Balancing & Smart Export Limiter',
      structure: 'Hot-Dip Galvanized Elevated Structure with Stainless Steel Fasteners',
      discom: 'TANGEDCO Salem North Section',
      challenge: 'Joint family villa with heavy simultaneous air conditioner and electric water heater loads across multiple sub-distribution boards.',
      solution: 'Balanced three-phase distribution architecture with active load balancing and smart remote monitoring that allows the family to track solar generation per phase.',
      testimonial: '"We run four 1.5-ton ACs during hot afternoons without worrying about huge power bills. SolarQube’s post-commissioning support has been outstanding."',
      clientName: 'V. Anand',
      clientRole: 'Homeowner, Alagapuram, Salem',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1Xe8_v7orJqyj3V7P79l_kPrdBuCkeIIPXFraDxEmGpA9dNvNCtZkRCdD0EKsp7oZFTxIlemDLevliyOxJ2A6EOpr7qFL8vYzla056h_SfoIEF3wiwTRVIkNhL2Z3IOgNy1FaBwQ--hT_rCkQhhETLNBKDu5dBrlKleGBzRGZF391KL9YyBTv0IzwQgw2Btvs0ROBBTMdkys3WyXuzxVD-fI-ByLPmOsb6HAAXrUhNuVbCZTzVj3uCa0A'
    }
  };

  window.openProjectCaseStudy = (projectId) => {
    const data = projectDatabase[projectId] || projectDatabase['proj-1'];
    if (!data) return;

    // Populate modal elements
    const titleEl = document.getElementById('modal-project-title');
    const categoryEl = document.getElementById('modal-project-category');
    const badgeEl = document.getElementById('modal-project-badge');
    const locationEl = document.getElementById('modal-project-location');
    const imgEl = document.getElementById('modal-project-img');
    const capacityEl = document.getElementById('modal-project-capacity');
    const annualUnitsEl = document.getElementById('modal-project-units');
    const annualSavingsEl = document.getElementById('modal-project-savings');
    const paybackEl = document.getElementById('modal-project-payback');
    const subsidyEl = document.getElementById('modal-project-subsidy');
    const co2El = document.getElementById('modal-project-co2');
    const modulesEl = document.getElementById('modal-project-modules');
    const inverterEl = document.getElementById('modal-project-inverter');
    const structureEl = document.getElementById('modal-project-structure');
    const discomEl = document.getElementById('modal-project-discom');
    const challengeEl = document.getElementById('modal-project-challenge');
    const solutionEl = document.getElementById('modal-project-solution');
    const testimonialEl = document.getElementById('modal-project-testimonial');
    const clientNameEl = document.getElementById('modal-project-client-name');
    const clientRoleEl = document.getElementById('modal-project-client-role');
    const quoteTriggerBtn = document.getElementById('modal-project-quote-btn');

    if (titleEl) titleEl.textContent = data.title;
    if (categoryEl) categoryEl.textContent = data.category;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (locationEl) locationEl.textContent = data.location;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }
    if (capacityEl) capacityEl.textContent = data.capacity;
    if (annualUnitsEl) annualUnitsEl.textContent = data.annualUnits;
    if (annualSavingsEl) annualSavingsEl.textContent = data.annualSavings;
    if (paybackEl) paybackEl.textContent = data.payback;
    if (subsidyEl) subsidyEl.textContent = data.subsidy;
    if (co2El) co2El.textContent = data.co2Offset;
    if (modulesEl) modulesEl.textContent = data.modules;
    if (inverterEl) inverterEl.textContent = data.inverter;
    if (structureEl) structureEl.textContent = data.structure;
    if (discomEl) discomEl.textContent = data.discom;
    if (challengeEl) challengeEl.textContent = data.challenge;
    if (solutionEl) solutionEl.textContent = data.solution;
    if (testimonialEl) testimonialEl.textContent = data.testimonial;
    if (clientNameEl) clientNameEl.textContent = data.clientName;
    if (clientRoleEl) clientRoleEl.textContent = data.clientRole;

    if (quoteTriggerBtn) {
      quoteTriggerBtn.onclick = () => {
        window.closeProjectCaseStudy();
        if (typeof window.openQuoteModal === 'function') {
          window.openQuoteModal(data.category);
        }
      };
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      const dialog = modal.querySelector('.modal-dialog');
      if (dialog) dialog.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectCaseStudy = () => {
    modal.classList.add('opacity-0');
    const dialog = modal.querySelector('.modal-dialog');
    if (dialog) dialog.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 220);
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-id') || btn.closest('.project-card')?.getAttribute('data-project-id') || 'proj-1';
      window.openProjectCaseStudy(projId);
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', window.closeProjectCaseStudy));
  if (backdrop) backdrop.addEventListener('click', window.closeProjectCaseStudy);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      window.closeProjectCaseStudy();
    }
  });
}

// 8. Sector Tabs (Commercial Page)
function initSectorTabs() {
  const tabBtns = document.querySelectorAll('.sector-tab-btn');
  const tabPanels = document.querySelectorAll('.sector-tab-panel');

  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => {
        b.classList.remove('bg-sq-navy', 'text-white', 'border-sq-cyan', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-600', 'border-transparent');
      });

      btn.classList.remove('bg-slate-100', 'text-slate-600', 'border-transparent');
      btn.classList.add('bg-sq-navy', 'text-white', 'border-sq-cyan', 'shadow-md');

      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}

// 9. Contact Forms Handler
function initContactForms() {
  const contactForms = document.querySelectorAll('.sq-contact-form');

  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Transmitting to Salem Engineering Team...
        `;
      }

      setTimeout(() => {
        // Show success alert inside form or replace
        const alertBox = document.createElement('div');
        alertBox.className = 'p-5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 mt-4 text-sm font-medium';
        alertBox.innerHTML = `
          <div class="flex items-center space-x-3 mb-1">
            <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-bold text-emerald-950 font-heading">Inquiry Received Successfully!</span>
          </div>
          <p class="text-xs text-emerald-800 leading-relaxed">
            Our solar engineers will review your site specifications and contact you at the provided phone/email within 1 business day with a detailed feasibility estimate.
          </p>
        `;
        form.appendChild(alertBox);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Inquiry Sent ✓';
          submitBtn.classList.remove('bg-sq-navy', 'hover:bg-sq-navy-light');
          submitBtn.classList.add('bg-emerald-700', 'text-white');
        }

        form.reset();
      }, 750);
    });
  });
}

// 10. Horizontal Project Carousel (Commercial & Industrial Showcase)
function initProjectCarousel() {
  const carousels = document.querySelectorAll('[data-carousel="project-showcase"]');
  if (!carousels.length) return;

  carousels.forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = carousel.querySelectorAll('[data-carousel-slide]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dots = carousel.querySelectorAll('[data-carousel-dot]');
    const counterCurrent = carousel.querySelector('[data-carousel-current]');
    const counterTotal = carousel.querySelector('[data-carousel-total]');
    const thumbnails = carousel.querySelectorAll('[data-carousel-thumb]');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval = null;

    if (counterTotal) {
      counterTotal.textContent = String(totalSlides).padStart(2, '0');
    }

    function updateCarousel(newIndex) {
      if (newIndex < 0) {
        currentIndex = totalSlides - 1;
      } else if (newIndex >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = newIndex;
      }

      // Update slide position
      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.remove('opacity-0', 'pointer-events-none', 'absolute');
          slide.classList.add('opacity-100', 'relative', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'relative', 'z-10');
          slide.classList.add('opacity-0', 'pointer-events-none', 'absolute');
        }
      });

      // Update dots
      if (dots.length) {
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.remove('bg-slate-300', 'w-2.5');
            dot.classList.add('bg-sq-cyan', 'w-8');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('bg-sq-cyan', 'w-8');
            dot.classList.add('bg-slate-300', 'w-2.5');
            dot.removeAttribute('aria-current');
          }
        });
      }

      // Update thumbnails
      if (thumbnails.length) {
        thumbnails.forEach((thumb, idx) => {
          if (idx === currentIndex) {
            thumb.classList.remove('border-transparent', 'opacity-60');
            thumb.classList.add('border-sq-cyan', 'opacity-100', 'ring-2', 'ring-sq-cyan/30');
          } else {
            thumb.classList.remove('border-sq-cyan', 'opacity-100', 'ring-2', 'ring-sq-cyan/30');
            thumb.classList.add('border-transparent', 'opacity-60');
          }
        });
      }

      // Update counter
      if (counterCurrent) {
        counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      }
    }

    // Navigation triggers
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(currentIndex - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(currentIndex + 1);
        resetAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
        resetAutoplay();
      });
    });

    thumbnails.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        updateCarousel(idx);
        resetAutoplay();
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        updateCarousel(currentIndex + 1);
        resetAutoplay();
      } else if (touchEndX > touchStartX + threshold) {
        updateCarousel(currentIndex - 1);
        resetAutoplay();
      }
    }

    // Autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        updateCarousel(currentIndex + 1);
      }, 5500);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    function resetAutoplay() {
      startAutoplay();
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Initial setup
    updateCarousel(0);
    startAutoplay();
  });
}

