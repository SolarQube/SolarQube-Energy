/**
 * SolarQube Energy - Shared Header & Footer Template Logic & Utilities
 * Ensures 100% brand consistency, identical navigation, mega-menus, drawers,
 * and unified 4-column footer across all sub-pages and index.html.
 */

(function () {
  'use strict';

  // Helper to determine the active page from the current URL path
  function detectCurrentPage() {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('residential-solar')) return 'residential';
    if (pathname.includes('commercial-industrial-solar')) return 'commercial';
    if (pathname.includes('solar-canopies-carports')) return 'canopies';
    if (pathname.includes('open-access-solar')) return 'open-access';
    if (pathname.includes('utility-scale-solar')) return 'utility';
    if (pathname.includes('projects')) return 'projects';
    if (pathname.includes('about')) return 'about';
    if (pathname.includes('contact')) return 'contact';
    return 'home';
  }

  /**
   * Generates the standardized Header markup
   * @param {Object} options 
   * @param {string} options.activePage - 'home' | 'about' | 'residential' | 'commercial' | 'canopies' | 'open-access' | 'utility' | 'projects' | 'contact'
   * @param {boolean} options.showBanner - Whether to include the PM Surya Ghar top announcement banner
   */
  function getHeaderHTML(options = {}) {
    const active = options.activePage || detectCurrentPage();
    const showBanner = options.showBanner !== undefined ? options.showBanner : (active === 'home' || active === 'residential');

    const isHome = active === 'home';
    const isAbout = active === 'about';
    const isProjects = active === 'projects';
    const isContact = active === 'contact';
    const isSolutions = ['residential', 'commercial', 'canopies', 'open-access', 'utility'].includes(active);

    const homeClass = isHome 
      ? 'text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md px-3.5 py-2.5 min-h-[44px] inline-flex items-center transition-all' 
      : 'text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg';
    
    const aboutClass = isAbout
      ? 'text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md px-3.5 py-2.5 min-h-[44px] inline-flex items-center transition-all'
      : 'text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg';

    const projectsClass = isProjects
      ? 'text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md px-3.5 py-2.5 min-h-[44px] inline-flex items-center transition-all'
      : 'text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg';

    const contactClass = isContact
      ? 'text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md px-3.5 py-2.5 min-h-[44px] inline-flex items-center transition-all'
      : 'text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg';

    const solutionsBtnClass = isSolutions
      ? 'flex items-center gap-1 text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg focus:outline-none group-hover:text-secondary group-hover:bg-surface-container-low'
      : 'flex items-center gap-1 text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg focus:outline-none group-hover:text-secondary group-hover:bg-surface-container-low';

    return `
<!-- TopNavBar -->
<nav class="bg-surface-container-lowest full-width top-0 sticky z-50 border-b border-outline-variant shadow-sm transition-colors duration-300" id="navbar">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-2.5 sm:py-3 max-w-container-max mx-auto">
  <a class="flex items-center gap-2 flex-shrink-0 min-h-[44px] py-1" href="index.html" aria-label="SolarQube Home">
    <img alt="SolarQube Energy" class="h-10 sm:h-11 w-auto object-contain" src="/assets/logo/solarqube-logo.png"/>
  </a>

  <!-- Desktop Navigation -->
  <div class="hidden lg:flex items-center gap-1 xl:gap-2">
    <a class="${homeClass}" href="index.html">Home</a>
    <a class="${aboutClass}" href="about.html">About</a>

    <!-- Solutions Mega-Menu Dropdown -->
    <div class="relative group">
      <button class="${solutionsBtnClass}" aria-expanded="false" aria-haspopup="true">
        <span>Solutions</span>
        <span class="material-symbols-outlined text-base transition-transform duration-200 group-hover:rotate-180">expand_more</span>
      </button>
      <div class="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/60 p-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
        <div class="text-[11px] font-bold text-secondary uppercase tracking-wider px-3 py-1 mb-1">Our Solar Verticals</div>
        <div class="space-y-1">
          <a href="residential-solar.html" class="flex items-center gap-3 p-2.5 min-h-[44px] rounded-xl ${active === 'residential' ? 'bg-surface-container-low font-bold' : 'hover:bg-surface-container-low'} transition group/item">
            <div class="w-9 h-9 rounded-lg ${active === 'residential' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-white'} flex items-center justify-center flex-shrink-0 transition-colors">
              <span class="material-symbols-outlined text-lg">solar_power</span>
            </div>
            <div class="font-label-md text-label-md ${active === 'residential' ? 'text-secondary font-bold' : 'font-semibold text-primary group-hover/item:text-secondary'} transition-colors">Residential Rooftop</div>
          </a>
          <a href="commercial-industrial-solar.html" class="flex items-center gap-3 p-2.5 min-h-[44px] rounded-xl ${active === 'commercial' ? 'bg-surface-container-low font-bold' : 'hover:bg-surface-container-low'} transition group/item">
            <div class="w-9 h-9 rounded-lg ${active === 'commercial' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-white'} flex items-center justify-center flex-shrink-0 transition-colors">
              <span class="material-symbols-outlined text-lg">factory</span>
            </div>
            <div class="font-label-md text-label-md ${active === 'commercial' ? 'text-secondary font-bold' : 'font-semibold text-primary group-hover/item:text-secondary'} transition-colors">Commercial & Industrial</div>
          </a>
          <a href="solar-canopies-carports.html" class="flex items-center gap-3 p-2.5 min-h-[44px] rounded-xl ${active === 'canopies' ? 'bg-surface-container-low font-bold' : 'hover:bg-surface-container-low'} transition group/item">
            <div class="w-9 h-9 rounded-lg ${active === 'canopies' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-white'} flex items-center justify-center flex-shrink-0 transition-colors">
              <span class="material-symbols-outlined text-lg">directions_car</span>
            </div>
            <div class="font-label-md text-label-md ${active === 'canopies' ? 'text-secondary font-bold' : 'font-semibold text-primary group-hover/item:text-secondary'} transition-colors">Solar Canopies & Carports</div>
          </a>
          <a href="open-access-solar.html" class="flex items-center gap-3 p-2.5 min-h-[44px] rounded-xl ${active === 'open-access' ? 'bg-surface-container-low font-bold' : 'hover:bg-surface-container-low'} transition group/item">
            <div class="w-9 h-9 rounded-lg ${active === 'open-access' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-white'} flex items-center justify-center flex-shrink-0 transition-colors">
              <span class="material-symbols-outlined text-lg">bolt</span>
            </div>
            <div class="font-label-md text-label-md ${active === 'open-access' ? 'text-secondary font-bold' : 'font-semibold text-primary group-hover/item:text-secondary'} transition-colors">Power Trading (PPA & Open Access)</div>
          </a>
          <a href="utility-scale-solar.html" class="flex items-center gap-3 p-2.5 min-h-[44px] rounded-xl ${active === 'utility' ? 'bg-surface-container-low font-bold' : 'hover:bg-surface-container-low'} transition group/item">
            <div class="w-9 h-9 rounded-lg ${active === 'utility' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-white'} flex items-center justify-center flex-shrink-0 transition-colors">
              <span class="material-symbols-outlined text-lg">grid_view</span>
            </div>
            <div class="font-label-md text-label-md ${active === 'utility' ? 'text-secondary font-bold' : 'font-semibold text-primary group-hover/item:text-secondary'} transition-colors">Utility Scale (MW Projects)</div>
          </a>
        </div>
      </div>
    </div>

    <a class="${projectsClass}" href="projects.html">Projects</a>

    <!-- Resources Dropdown -->
    <div class="relative group">
      <button class="flex items-center gap-1 text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg focus:outline-none group-hover:text-secondary group-hover:bg-surface-container-low" aria-expanded="false" aria-haspopup="true">
        <span>Resources</span>
        <span class="material-symbols-outlined text-base transition-transform duration-200 group-hover:rotate-180">expand_more</span>
      </button>
      <div class="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/60 p-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
        <div class="text-[11px] font-bold text-secondary uppercase tracking-wider px-3 py-1 mb-1">Knowledge & Guides</div>
        <div class="space-y-1">
          <a href="index.html#news" class="flex items-start gap-3 p-2.5 min-h-[44px] rounded-xl hover:bg-surface-container-low transition group/item">
            <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
              <span class="material-symbols-outlined text-base">newspaper</span>
            </div>
            <div>
              <div class="font-label-md text-label-md font-semibold text-primary group-hover/item:text-secondary transition-colors">Blog / News</div>
              <div class="text-[11px] text-on-surface-variant leading-tight mt-0.5">Industry insights, policy updates & announcements.</div>
            </div>
          </a>
          <a href="commercial-industrial-solar.html#tax-benefits" class="flex items-start gap-3 p-2.5 min-h-[44px] rounded-xl hover:bg-surface-container-low transition group/item">
            <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
              <span class="material-symbols-outlined text-base">request_quote</span>
            </div>
            <div>
              <div class="font-label-md text-label-md font-semibold text-primary group-hover/item:text-secondary transition-colors">Income Tax Benefits Guide</div>
              <div class="text-[11px] text-on-surface-variant leading-tight mt-0.5">40% Accelerated Depreciation under Section 32.</div>
            </div>
          </a>
          <a href="residential-solar.html#subsidy" class="flex items-start gap-3 p-2.5 min-h-[44px] rounded-xl hover:bg-surface-container-low transition group/item">
            <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
              <span class="material-symbols-outlined text-base">verified</span>
            </div>
            <div>
              <div class="font-label-md text-label-md font-semibold text-primary group-hover/item:text-secondary transition-colors">Subsidy Scheme Info</div>
              <div class="text-[11px] text-on-surface-variant leading-tight mt-0.5">PM Surya Ghar Muft Bijli Yojana subsidy slabs.</div>
            </div>
          </a>
          <a href="contact.html#faq" class="flex items-start gap-3 p-2.5 min-h-[44px] rounded-xl hover:bg-surface-container-low transition group/item">
            <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
              <span class="material-symbols-outlined text-base">quiz</span>
            </div>
            <div>
              <div class="font-label-md text-label-md font-semibold text-primary group-hover/item:text-secondary transition-colors">FAQs</div>
              <div class="text-[11px] text-on-surface-variant leading-tight mt-0.5">Warranties, net-metering & DISCOM permit details.</div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <a class="text-on-surface-variant hover:text-secondary font-label-md text-label-md transition-all hover:bg-surface-container-low px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg" href="careers.html">Careers</a>
    <a class="${contactClass}" href="contact.html">Contact</a>
  </div>

  <!-- Right CTA Button -->
  <div class="hidden lg:flex items-center gap-3">
    <a href="contact.html" class="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 min-h-[44px] rounded-full hover:bg-primary-container transition-all active:scale-95 btn-shimmer shadow-sm text-center font-semibold">
      <span>Get a Quote</span>
      <span class="material-symbols-outlined text-base">arrow_forward</span>
    </a>
  </div>

  <!-- Mobile Menu Button (Guaranteed 44x44px minimum tap target) -->
  <button class="lg:hidden min-w-[44px] min-h-[44px] p-2.5 text-primary rounded-xl hover:bg-surface-container-low active:bg-surface-container flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-secondary/40" id="mobile-nav-toggle-btn" onclick="const m = document.getElementById('mobile-nav-panel'); if(m) m.classList.toggle('hidden');" aria-label="Toggle navigation menu">
    <span class="material-symbols-outlined text-3xl">menu</span>
  </button>
</div>

<!-- Mobile Navigation Drawer (WCAG 44x44px Tap Target Optimized) -->
<div id="mobile-nav-panel" class="hidden lg:hidden px-4 sm:px-6 py-4 bg-surface-container-lowest border-t border-outline-variant max-h-[85vh] overflow-y-auto space-y-2 shadow-xl">
  <a class="min-h-[48px] flex items-center px-4 py-3 rounded-xl ${isHome ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-base border-b border-outline-variant/20" href="index.html">
    <span class="material-symbols-outlined text-xl mr-3 text-secondary">home</span>
    <span>Home</span>
  </a>
  <a class="min-h-[48px] flex items-center px-4 py-3 rounded-xl ${isAbout ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-base border-b border-outline-variant/20" href="about.html">
    <span class="material-symbols-outlined text-xl mr-3 text-secondary">info</span>
    <span>About</span>
  </a>
  
  <!-- Mobile Solutions Section -->
  <div class="py-2 border-b border-outline-variant/20">
    <div class="text-xs font-bold text-secondary uppercase tracking-wider px-3 py-1.5 mb-1">Solutions</div>
    <div class="space-y-1">
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl ${active === 'residential' ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-sm" href="residential-solar.html">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">solar_power</span>
        <span>Residential Rooftop</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl ${active === 'commercial' ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-sm" href="commercial-industrial-solar.html">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">factory</span>
        <span>Commercial & Industrial (EPC + AMC)</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl ${active === 'canopies' ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-sm" href="solar-canopies-carports.html">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">directions_car</span>
        <span>Solar Canopies & Carports</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl ${active === 'open-access' ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-sm" href="open-access-solar.html">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">bolt</span>
        <span>Power Trading (PPA & Open Access)</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl ${active === 'utility' ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-sm" href="utility-scale-solar.html">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">grid_view</span>
        <span>Utility Scale (MW Projects)</span>
      </a>
    </div>
  </div>

  <a class="min-h-[48px] flex items-center px-4 py-3 rounded-xl ${isProjects ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-base border-b border-outline-variant/20" href="projects.html">
    <span class="material-symbols-outlined text-xl mr-3 text-secondary">work</span>
    <span>Projects</span>
  </a>

  <!-- Mobile Resources Section -->
  <div class="py-2 border-b border-outline-variant/20">
    <div class="text-xs font-bold text-secondary uppercase tracking-wider px-3 py-1.5 mb-1">Resources</div>
    <div class="space-y-1">
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-secondary active:bg-surface-container-low transition-all text-sm" href="index.html#news">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">newspaper</span>
        <span>Blog / News</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-secondary active:bg-surface-container-low transition-all text-sm" href="commercial-industrial-solar.html#tax-benefits">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">request_quote</span>
        <span>Income Tax Benefits Guide</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-secondary active:bg-surface-container-low transition-all text-sm" href="residential-solar.html#subsidy">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">verified</span>
        <span>Subsidy Scheme Info</span>
      </a>
      <a class="min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-secondary active:bg-surface-container-low transition-all text-sm" href="contact.html#faq">
        <span class="material-symbols-outlined text-lg text-secondary flex-shrink-0">quiz</span>
        <span>FAQs</span>
      </a>
    </div>
  </div>

  <a class="min-h-[48px] flex items-center px-4 py-3 rounded-xl text-on-surface-variant hover:text-secondary active:bg-surface-container-low transition-all text-base border-b border-outline-variant/20" href="careers.html">
    <span class="material-symbols-outlined text-xl mr-3 text-secondary">badge</span>
    <span>Careers</span>
  </a>
  <a class="min-h-[48px] flex items-center px-4 py-3 rounded-xl ${isContact ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary active:bg-surface-container-low'} transition-all text-base border-b border-outline-variant/20" href="contact.html">
    <span class="material-symbols-outlined text-xl mr-3 text-secondary">mail</span>
    <span>Contact</span>
  </a>

  <!-- Mobile High-Visibility CTA Button -->
  <div class="pt-3 pb-2">
    <a href="contact.html" class="flex items-center justify-center gap-2 w-full bg-primary text-on-primary font-bold text-base min-h-[48px] py-3.5 px-6 rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-md">
      <span>Get a Quote</span>
      <span class="material-symbols-outlined text-lg">arrow_forward</span>
    </a>
  </div>
</div>
</nav>

${showBanner ? `
<div class="bg-tertiary-fixed text-on-tertiary-fixed py-2.5 px-margin-mobile md:px-margin-desktop border-b border-outline-variant/30">
  <a class="flex items-center justify-center gap-2 group hover:opacity-90 transition-all text-center min-h-[44px]" href="residential-solar.html#subsidy">
    <span class="material-symbols-outlined text-body-md font-bold">info</span>
    <p class="font-label-md text-label-md font-bold">
      PM Surya Ghar Subsidy Scheme — <span class="underline decoration-2 underline-offset-2 animate-subtle-pulse">Check Your Eligibility &amp; Calculate Savings (Up to ₹78,000)</span>
      <span class="material-symbols-outlined text-sm inline-block align-middle group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </p>
  </a>
</div>
` : ''}
`;
  }

  /**
   * Generates the standardized 4-Column Footer markup
   * @param {Object} options
   */
  function getFooterHTML(options = {}) {
    const active = options.activePage || detectCurrentPage();
    const currentYear = new Date().getFullYear() || 2026;

    return `
<!-- Unified SolarQube Footer -->
<footer class="bg-primary w-full border-t border-outline-variant/20 text-on-primary" id="site-footer">
  <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
    <!-- Brand Info & Social -->
    <div class="lg:w-1/3">
      <a class="flex items-center gap-2 mb-4 inline-block min-h-[44px]" href="index.html" aria-label="SolarQube Home">
        <img alt="SolarQube Energy" class="h-12 w-auto object-contain" src="/assets/logo/solarqube-logo.png"/>
      </a>
      <p class="font-body-md text-body-md text-on-primary/80 max-w-sm mb-6 leading-relaxed">
        SolarQube Energy delivers complete solar EPC solutions for homes, businesses, and industrial facilities across Jalakandapuram, Salem, Erode, Tharamangalam, and surrounding areas.
      </p>
      
      <!-- Social Media Links (Icons with 44x44px minimum tap targets) -->
      <div class="flex items-center gap-3 mb-6">
        <a class="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-[#7b7dff] hover:text-[#1b1d3a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm" href="https://www.instagram.com/solarqubeenergy.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a class="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-[#7b7dff] hover:text-[#1b1d3a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm" href="https://www.facebook.com/profile.php?id=61590748341959" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a class="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-[#7b7dff] hover:text-[#1b1d3a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm" href="https://www.linkedin.com/company/115253981/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>
        <a class="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-[#7b7dff] hover:text-[#1b1d3a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm" href="https://www.youtube.com/channel/UCpQ6kf_7mincGOXFvaDRvvA" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      </div>
      <p class="font-caption text-caption text-on-primary/60">© <span class="copyright-year">${currentYear}</span> SolarQube Energy. All Rights Reserved.</p>
    </div>

    <!-- Links Columns -->
    <div class="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
      <!-- Quick Links -->
      <div>
        <h4 class="font-label-md text-label-md font-bold mb-4 text-[#8f91d8] uppercase tracking-wider text-sm">Quick Links</h4>
        <ul class="space-y-1">
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'about' ? 'text-white font-bold' : ''}" href="about.html">About Us</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'careers' ? 'text-white font-bold' : ''}" href="careers.html">Careers</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'residential' ? 'text-white font-bold' : ''}" href="residential-solar.html">Residential Solar</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'commercial' ? 'text-white font-bold' : ''}" href="commercial-industrial-solar.html">Commercial & Industrial</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'canopies' ? 'text-white font-bold' : ''}" href="solar-canopies-carports.html">Solar Canopies</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'open-access' ? 'text-white font-bold' : ''}" href="open-access-solar.html">Open Access & PPA</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'utility' ? 'text-white font-bold' : ''}" href="utility-scale-solar.html">Utility Scale</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'projects' ? 'text-white font-bold' : ''}" href="projects.html">Projects</a></li>
          <li><a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors min-h-[44px] inline-flex items-center py-2 ${active === 'contact' ? 'text-white font-bold' : ''}" href="contact.html">Contact Us</a></li>
        </ul>
      </div>

      <!-- Contact Us -->
      <div>
        <h4 class="font-label-md text-label-md font-bold mb-4 text-[#8f91d8] uppercase tracking-wider text-sm">Contact Us</h4>
        <ul class="space-y-1">
          <li class="flex items-start gap-3 py-2 min-h-[44px]">
            <span class="material-symbols-outlined text-[#7b7dff] text-lg mt-0.5 flex-shrink-0">location_on</span>
            <span class="font-body-md text-body-md text-on-primary/80 leading-snug text-sm">58/15-57-1, Bus Stand Road, Jalakandapuram, Salem - 636501, Tamil Nadu</span>
          </li>
          <li>
            <a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors text-sm min-h-[44px] flex items-center gap-3 py-1.5" href="tel:+918883663001">
              <span class="material-symbols-outlined text-[#7b7dff] text-lg flex-shrink-0">call</span>
              <span>+91 8883663001</span>
            </a>
          </li>
          <li>
            <a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors text-sm min-h-[44px] flex items-center gap-3 py-1.5" href="mailto:info@solarqubeenergy.in">
              <span class="material-symbols-outlined text-[#7b7dff] text-lg flex-shrink-0">mail</span>
              <span>info@solarqubeenergy.in</span>
            </a>
          </li>
          <li class="flex items-start gap-3 pt-2">
            <span class="material-symbols-outlined text-[#7b7dff] text-lg mt-0.5 flex-shrink-0">apartment</span>
            <span class="font-body-md text-body-md text-on-primary/70 text-xs leading-relaxed">Head Office: Jalakandapuram, Salem</span>
          </li>
        </ul>
      </div>

      <!-- Follow Us -->
      <div>
        <h4 class="font-label-md text-label-md font-bold mb-4 text-[#8f91d8] uppercase tracking-wider text-sm">Follow Us</h4>
        <ul class="space-y-1">
          <li>
            <a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors flex items-center gap-3 group text-sm min-h-[44px] py-1.5" href="https://www.instagram.com/solarqubeenergy.in/" target="_blank" rel="noopener noreferrer">
              <svg class="w-5 h-5 fill-current text-[#7b7dff] group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors flex items-center gap-3 group text-sm min-h-[44px] py-1.5" href="https://www.facebook.com/profile.php?id=61590748341959" target="_blank" rel="noopener noreferrer">
              <svg class="w-5 h-5 fill-current text-[#7b7dff] group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors flex items-center gap-3 group text-sm min-h-[44px] py-1.5" href="https://www.linkedin.com/company/115253981/" target="_blank" rel="noopener noreferrer">
              <svg class="w-5 h-5 fill-current text-[#7b7dff] group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a class="font-body-md text-body-md text-on-primary/80 hover:text-[#7b7dff] transition-colors flex items-center gap-3 group text-sm min-h-[44px] py-1.5" href="https://www.youtube.com/channel/UCpQ6kf_7mincGOXFvaDRvvA" target="_blank" rel="noopener noreferrer">
              <svg class="w-5 h-5 fill-current text-[#7b7dff] group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YouTube</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
`;
  }

  // Dynamic Copyright Year Updater
  function updateCopyrightYear() {
    const currentYear = (new Date().getFullYear() || 2026).toString();
    const yearSpans = document.querySelectorAll('.copyright-year, #copyright-year, [data-copyright-year]');
    yearSpans.forEach(el => {
      el.textContent = currentYear;
    });

    // Also scan footer copyright paragraphs to replace hardcoded years with dynamic span
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

  // Attach navbar sticky scroll effect
  function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    function handleScroll() {
      if (window.scrollY > 10) {
        nav.classList.add('shadow-md', 'bg-surface-container-lowest/95', 'backdrop-blur-md');
        nav.classList.remove('bg-surface-container-lowest');
      } else {
        nav.classList.remove('shadow-md', 'bg-surface-container-lowest/95', 'backdrop-blur-md');
        nav.classList.add('bg-surface-container-lowest');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mount components if container elements exist
  function mountComponents() {
    const headerContainer = document.querySelector('[data-sq-header], #site-header-container');
    if (headerContainer) {
      headerContainer.innerHTML = getHeaderHTML();
    }

    const footerContainer = document.querySelector('[data-sq-footer], #site-footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = getFooterHTML();
    }

    updateCopyrightYear();
    initNavbarScroll();
  }

  // Register Custom Web Components <solarqube-header> and <solarqube-footer>
  if (typeof customElements !== 'undefined') {
    if (!customElements.get('solarqube-header')) {
      customElements.define('solarqube-header', class extends HTMLElement {
        connectedCallback() {
          const active = this.getAttribute('active') || detectCurrentPage();
          const showBanner = this.hasAttribute('banner') ? this.getAttribute('banner') === 'true' : undefined;
          this.innerHTML = getHeaderHTML({ activePage: active, showBanner });
          initNavbarScroll();
        }
      });
    }

    if (!customElements.get('solarqube-footer')) {
      customElements.define('solarqube-footer', class extends HTMLElement {
        connectedCallback() {
          const active = this.getAttribute('active') || detectCurrentPage();
          this.innerHTML = getFooterHTML({ activePage: active });
          updateCopyrightYear();
        }
      });
    }
  }

  // Expose global API
  window.updateCopyrightYear = updateCopyrightYear;
  window.SolarQubeComponents = {
    detectCurrentPage,
    getHeaderHTML,
    getFooterHTML,
    mountComponents,
    initNavbarScroll,
    updateCopyrightYear
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountComponents();
      updateCopyrightYear();
    });
  } else {
    mountComponents();
    updateCopyrightYear();
  }

})();
