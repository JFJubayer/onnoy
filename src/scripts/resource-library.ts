function initializeResourceLibrary() {
  const tools = document.querySelector<HTMLElement>('[data-resource-tools]');
  const search = document.querySelector<HTMLInputElement>('#resourceSearch');
  const status = document.querySelector<HTMLElement>('#resourceResultsStatus');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-resource-section]'));
  const filters = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-resource-filter]'));
  if (!tools || !search || !status || sections.length === 0 || filters.length === 0) return;

  let activeFilter = 'all';
  const normalize = (value: string) => value.trim().toLocaleLowerCase();

  const applyFilters = () => {
    const query = normalize(search.value);
    let visibleCount = 0;

    sections.forEach((section) => {
      const categoryMatches = activeFilter === 'all' || section.dataset.resourceSection === activeFilter;
      let sectionCount = 0;
      section.querySelectorAll<HTMLElement>('.resource-card').forEach((card) => {
        const queryMatches = !query || normalize(card.textContent || '').includes(query);
        const visible = categoryMatches && queryMatches;
        card.hidden = !visible;
        if (visible) sectionCount++;
      });
      section.hidden = sectionCount === 0;
      visibleCount += sectionCount;
    });

    status.textContent = visibleCount === 0
      ? 'No matching resources. Try another keyword or category.'
      : `Showing ${visibleCount} resource${visibleCount === 1 ? '' : 's'}.`;
  };

  search.addEventListener('input', applyFilters);
  filters.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.resourceFilter || 'all';
    filters.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
    applyFilters();
  }));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeResourceLibrary, { once: true });
else initializeResourceLibrary();