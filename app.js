import { propertyData } from "./mall-data.js";

const heroMetrics = document.querySelector("#hero-metrics");
const proofGrid = document.querySelector("#proof-grid");
const destinationGrid = document.querySelector("#destination-grid");
const timelineGrid = document.querySelector("#timeline-grid");
const venueStats = document.querySelector("#venue-stats");
const opportunityTabs = document.querySelector("#opportunity-tabs");
const opportunityBody = document.querySelector("#opportunity-body");
const moduleGrid = document.querySelector("#module-grid");
const sourceList = document.querySelector("#source-list");
const sideNav = document.querySelector("#side-nav");
const audienceButtons = document.querySelector("#audience-buttons");
const audiencePanel = document.querySelector("#audience-panel");
const currentYear = document.querySelector("#current-year");

const audienceMap = new Map(propertyData.audiences.map((item) => [item.id, item]));
const pathMap = new Map(propertyData.opportunityPaths.map((item) => [item.id, item]));

function createList(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderHero() {
  document.querySelector("#property-name").textContent = propertyData.property.name;
  document.querySelector("#property-location").textContent = propertyData.property.location;
  document.querySelector("#hero-title").textContent = propertyData.property.heroTitle;
  document.querySelector("#hero-intro").textContent = propertyData.property.intro;
  document.querySelector("#hero-position").textContent = propertyData.property.deckPosition;

  heroMetrics.innerHTML = propertyData.heroMetrics
    .map(
      (metric) => `
        <article class="metric-card reveal">
          <p class="metric-value">${metric.value}</p>
          <p class="metric-label">${metric.label}</p>
          <p class="metric-note">${metric.note}</p>
        </article>
      `
    )
    .join("");
}

function renderAudience(id) {
  const audience = audienceMap.get(id);
  if (!audience) {
    return;
  }

  [...audienceButtons.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.audience === id);
  });

  audiencePanel.innerHTML = `
    <p class="panel-eyebrow">${audience.eyebrow}</p>
    <h3>${audience.headline}</h3>
    <p>${audience.copy}</p>
    <ul class="panel-list">${createList(audience.bullets)}</ul>
    <div class="panel-footer">
      <span>${audience.signal}</span>
      <a href="#paths">${audience.cta}</a>
    </div>
  `;
}

function renderProof() {
  proofGrid.innerHTML = propertyData.proofPoints
    .map(
      (item) => `
        <article class="proof-card reveal">
          <p class="section-tag">${item.eyebrow}</p>
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
          <ul class="compact-list">${createList(item.stats)}</ul>
        </article>
      `
    )
    .join("");
}

function renderDestinations() {
  destinationGrid.innerHTML = propertyData.destinationLayers
    .map(
      (item) => `
        <article class="destination-card reveal">
          <div class="destination-orb orb-${item.id}"></div>
          <p class="section-tag">${item.label}</p>
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
          <ul class="compact-list">${createList(item.bullets)}</ul>
        </article>
      `
    )
    .join("");
}

function renderEventPlatform() {
  document.querySelector("#event-platform-title").textContent = propertyData.eventPlatform.title;
  document.querySelector("#event-platform-copy").textContent = propertyData.eventPlatform.copy;

  timelineGrid.innerHTML = propertyData.eventPlatform.timeline
    .map(
      (item) => `
        <article class="timeline-card reveal">
          <span class="timeline-step">${item.step}</span>
          <h3>${item.title}</h3>
          <p>${item.detail}</p>
        </article>
      `
    )
    .join("");

  venueStats.innerHTML = createList(propertyData.eventPlatform.venueStats);
}

function renderOpportunityBody(id) {
  const path = pathMap.get(id);
  if (!path) {
    return;
  }

  [...opportunityTabs.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.path === id);
  });

  opportunityBody.innerHTML = `
    <article class="path-panel reveal reveal-visible">
      <p class="section-tag">${path.label}</p>
      <h3>${path.headline}</h3>
      <p>${path.copy}</p>
      <div class="path-grid">
        <div>
          <p class="mini-heading">Pitch Sequence</p>
          <ul class="compact-list">${createList(path.pillars)}</ul>
        </div>
        <div>
          <p class="mini-heading">Commercial Outcome</p>
          <ul class="compact-list">${createList(path.outcomes)}</ul>
        </div>
      </div>
    </article>
  `;
}

function renderModules() {
  moduleGrid.innerHTML = propertyData.modules
    .map(
      (module, index) => `
        <article class="module-card reveal">
          <span class="module-index">0${index + 1}</span>
          <h3>${module.title}</h3>
          <p>${module.copy}</p>
        </article>
      `
    )
    .join("");
}

function renderSources() {
  sourceList.innerHTML = propertyData.sources
    .map(
      (source) => `
        <li>
          <a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>
          <span>${source.note}</span>
        </li>
      `
    )
    .join("");
}

function renderSideNav() {
  const sections = [...document.querySelectorAll("[data-label]")];
  sideNav.innerHTML = sections
    .map(
      (section) => `
        <a href="#${section.id}" data-target="${section.id}">
          <span></span>
          ${section.dataset.label}
        </a>
      `
    )
    .join("");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        [...sideNav.querySelectorAll("a")].forEach((link) => {
          link.classList.toggle("is-active", link.dataset.target === entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupRevealAnimations() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

function setupStageMotion() {
  const stage = document.querySelector(".hero-stage");
  if (!stage) {
    return;
  }

  stage.addEventListener("pointermove", (event) => {
    const bounds = stage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    stage.style.setProperty("--pointer-x", `${x}%`);
    stage.style.setProperty("--pointer-y", `${y}%`);
  });

  stage.addEventListener("pointerleave", () => {
    stage.style.setProperty("--pointer-x", "50%");
    stage.style.setProperty("--pointer-y", "50%");
  });
}

function setupEvents() {
  audienceButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-audience]");
    if (button) {
      renderAudience(button.dataset.audience);
    }
  });

  opportunityTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-path]");
    if (button) {
      renderOpportunityBody(button.dataset.path);
    }
  });
}

function init() {
  renderHero();
  renderAudience("leasing");
  renderProof();
  renderDestinations();
  renderEventPlatform();
  renderOpportunityBody("leasing");
  renderModules();
  renderSources();
  renderSideNav();
  setupRevealAnimations();
  setupStageMotion();
  setupEvents();
  currentYear.textContent = new Date().getFullYear();
}

init();
