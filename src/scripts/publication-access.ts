import { supabase } from '@lib/supabase';
import { translations } from '@data/translations';

type AccessMode = 'read' | 'download';
type NextStep = 'file' | 'donate';
type ReaderDetails = { name: string; school: string; age: number; district: string };
type Publication = { pdf: string; url: string; title: string; cover: string };
type AccessRequest = { publication: Publication; action: AccessMode; next: NextStep };

function readStored(key: string, storage: 'localStorage' | 'sessionStorage'): unknown {
  try {
    const value = window[storage].getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: unknown, storage: 'localStorage' | 'sessionStorage') {
  try {
    window[storage].setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function text(key: string) {
  return translations[key][document.documentElement.lang === 'bn' ? 'bn' : 'en'];
}

function ageGroup(age: number) {
  if (age < 10) return 'Under 10';
  if (age <= 18) return '10-18';
  if (age <= 26) return '19-26';
  if (age <= 34) return '27-34';
  return '35+';
}

function initializeReaderAccess() {
  const dialog = document.querySelector<HTMLDialogElement>('#readerAccessDialog');
  const form = document.querySelector<HTMLFormElement>('#readerAccessForm');
  const nameInput = document.querySelector<HTMLInputElement>('#readerFullName');
  const schoolInput = document.querySelector<HTMLInputElement>('#readerSchool');
  const ageInput = document.querySelector<HTMLInputElement>('#readerAge');
  const districtInput = document.querySelector<HTMLInputElement>('#readerDistrict');
  const submitButton = document.querySelector<HTMLButtonElement>('#readerAccessSubmit');
  const closeButton = document.querySelector<HTMLButtonElement>('#readerAccessClose');
  const cover = document.querySelector<HTMLImageElement>('#readerAccessCover');
  const publicationTitle = document.getElementById('readerAccessPublication');
  if (!dialog || !form || !nameInput || !schoolInput || !ageInput || !districtInput || !submitButton || !closeButton || !cover || !publicationTitle) return;

  const publications = new Map<string, Publication>();
  document.querySelectorAll<HTMLElement>('[data-reader-publication]').forEach((item) => {
    const { readerPublication, readerUrl, readerTitle, readerCover } = item.dataset;
    if (readerPublication && readerUrl && readerTitle && readerCover) {
      publications.set(readerPublication, { pdf: readerPublication, url: readerUrl, title: readerTitle, cover: readerCover });
    }
  });
  const storedReceipts = readStored('onnoy_reader_access', 'sessionStorage');
  const receipts = new Set<string>(Array.isArray(storedReceipts) ? storedReceipts.filter((receipt): receipt is string => typeof receipt === 'string') : []);
  let activeRequest: AccessRequest | null = null;
  let busy = false;

  function receiptKey(request: AccessRequest) {
    return `${request.publication.url}|${request.action}`;
  }

  const openForm = (request: AccessRequest) => {
    activeRequest = request;
    publicationTitle.textContent = request.publication.title;
    cover.src = request.publication.cover;
    cover.alt = request.publication.title;
    submitButton.dataset.i18n = request.action === 'read' ? 'reader-continue-read' : 'reader-continue-download';
    submitButton.textContent = text(submitButton.dataset.i18n);
    const saved = readStored('onnoy_reader_details', 'sessionStorage');
    if (saved && typeof saved === 'object') {
      const details = saved as Partial<ReaderDetails>;
      if (typeof details.name === 'string') nameInput.value = details.name;
      if (typeof details.school === 'string') schoolInput.value = details.school;
      if (typeof details.age === 'number') ageInput.value = String(details.age);
      if (typeof details.district === 'string') districtInput.value = details.district;
    }
    [nameInput, schoolInput, ageInput, districtInput].forEach((input) => input.setCustomValidity(''));
    dialog.showModal();
    nameInput.focus({ preventScroll: true });
  };

  function continueAccess(request: AccessRequest) {
    if (request.next === 'donate') {
      const destination = new URL('/donate', window.location.origin);
      destination.searchParams.set('resource', request.publication.pdf);
      window.location.assign(destination.href);
    } else if (request.action === 'read') {
      window.location.assign(request.publication.url);
    } else {
      const link = document.createElement('a');
      link.href = request.publication.url;
      link.download = request.publication.pdf.split('/').pop() || 'Onnoy.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      document.dispatchEvent(new CustomEvent('publication:download'));
    }
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-reader-resource]') : null;
    if (!trigger) return;
    const publication = publications.get(trigger.dataset.readerResource || '');
    if (!publication || busy) {
      event.preventDefault();
      return;
    }
    const request: AccessRequest = {
      publication,
      action: trigger.dataset.readerAction === 'read' ? 'read' : 'download',
      next: trigger.dataset.readerNext === 'donate' ? 'donate' : 'file',
    };
    if (window.location.pathname === '/donate' && receipts.has(receiptKey(request)) && trigger instanceof HTMLAnchorElement) {
      trigger.href = publication.url;
      if (request.action === 'download') {
        trigger.download = publication.pdf.split('/').pop() || 'Onnoy.pdf';
        document.dispatchEvent(new CustomEvent('publication:download'));
      }
      return;
    }
    event.preventDefault();
    openForm(request);
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', (event) => {
    if (busy) event.preventDefault();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog || busy) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  [nameInput, schoolInput, ageInput, districtInput].forEach((input) => {
    input.addEventListener('input', () => input.setCustomValidity(''));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!activeRequest || busy) return;
    const request = activeRequest;
    [nameInput, schoolInput, districtInput].forEach((input) => {
      input.value = input.value.trim();
      input.setCustomValidity(input.value ? '' : text('reader-required'));
    });
    const age = Number(ageInput.value);
    ageInput.setCustomValidity(Number.isInteger(age) && age >= 1 && age <= 120 ? '' : text('reader-age-invalid'));
    if (!form.reportValidity()) return;
    const details: ReaderDetails = { name: nameInput.value, school: schoolInput.value, age, district: districtInput.value };
    const lead = {
      ...details,
      age_group: ageGroup(age),
      booklet: request.publication.title,
      booklet_url: request.publication.url,
      access_mode: request.action,
      regular_price: '৳49',
      price_charged: '৳0',
      source: window.location.pathname === '/donate' ? 'donation-page' : 'workbooks-page',
    };
    busy = true;
    submitButton.disabled = true;
    closeButton.disabled = true;
    submitButton.textContent = text('reader-preparing');
    form.setAttribute('aria-busy', 'true');
    writeStored('onnoy_reader_details', details, 'sessionStorage');
    const existing = readStored('onnoy_workbook_downloads', 'localStorage');
    writeStored('onnoy_workbook_downloads', [{ ...lead, id: `DL-${Date.now()}`, downloaded_at: new Date().toISOString() }, ...(Array.isArray(existing) ? existing : [])], 'localStorage');

    if (supabase) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 2500);
      try {
        const { error } = await supabase.from('download_leads').insert(lead).abortSignal(controller.signal);
        if (error) console.warn('Reader lead sync skipped:', error.message);
      } catch (error) {
        console.warn('Reader lead sync skipped:', error);
      } finally {
        window.clearTimeout(timeout);
      }
    }

    receipts.add(receiptKey(request));
    writeStored('onnoy_reader_access', [...receipts], 'sessionStorage');
    busy = false;
    submitButton.disabled = false;
    closeButton.disabled = false;
    submitButton.textContent = text(submitButton.dataset.i18n || 'reader-continue-download');
    form.removeAttribute('aria-busy');
    dialog.close();
    continueAccess(request);
  });

  if (window.location.pathname === '/workbooks') {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('resource');
    const legacyRequest = params.get('download') === '1' || params.get('modal') === '1';
    const publication = requested ? publications.get(requested) : legacyRequest ? publications.values().next().value : undefined;
    if (publication) {
      const action = params.get('action') === 'read' ? 'read' : 'download';
      openForm({ publication, action, next: action === 'read' ? 'file' : 'donate' });
    }
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeReaderAccess, { once: true });
else initializeReaderAccess();