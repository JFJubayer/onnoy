import { supabase } from '@lib/supabase';
import { translations } from '@data/translations';
import type { PublicRequestKind } from '../../supabase/functions/_shared/public-forms';

type RequestStatus = 'new' | 'in_progress' | 'resolved' | 'archived';
type GuideStatus = 'subscribed' | 'notified' | 'archived';
type RequestRow = { id: string; kind: PublicRequestKind; name: string | null; email: string | null; phone: string | null; status: RequestStatus; assigned_to: string | null; notification_status: string; created_at: string; updated_at: string; details?: Record<string, string>; admin_notes?: string };
type GuideRow = { id: string; email: string; status: GuideStatus; notification_status: string; created_at: string; updated_at: string };
const requestColumns = 'id, kind, name, email, phone, status, assigned_to, notification_status, created_at, updated_at';
const guideColumns = 'id, email, status, notification_status, created_at, updated_at';
const pageSize = 25;

function text(key: string) {
  return (translations[key] || translations['inbox-unavailable'])[document.documentElement.lang === 'bn' ? 'bn' : 'en'];
}

function date(value: string) {
  return new Intl.DateTimeFormat(document.documentElement.lang === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dhaka' }).format(new Date(value));
}

function message(element: HTMLElement, key: string, error = false) {
  element.dataset.i18n = key;
  element.dataset.error = String(error);
  element.textContent = text(key);
}

function cell(row: HTMLTableRowElement, value: string) {
  const element = document.createElement('td');
  element.textContent = value;
  row.appendChild(element);
  return element;
}

function badge(row: HTMLTableRowElement, status: string) {
  const element = document.createElement('span');
  element.className = 'admin-inbox-badge';
  element.dataset.status = status;
  element.textContent = text(`inbox-status-${status}`);
  cell(row, '').appendChild(element);
}

function csv(headers: string[], rows: (string | null)[][], filename: string) {
  const escape = (value: string | null) => {
    const content = value || '';
    const safe = /^[=+\-@\t\r]/.test(content) ? `'${content}` : content;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const content = '\uFEFF' + [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function initializeInbox() {
  const requestPanel = document.getElementById('requestsTabContent');
  const subscriberPanel = document.getElementById('subscribersTabContent');
  if (!requestPanel || !subscriberPanel || !supabase) return;
  const client = supabase;
  const element = <ElementType extends HTMLElement>(id: string) => document.getElementById(id) as ElementType;
  const requestSearch = element<HTMLInputElement>('requestSearch');
  const requestKind = element<HTMLSelectElement>('requestKind');
  const requestStatus = element<HTMLSelectElement>('requestStatus');
  const subscriberSearch = element<HTMLInputElement>('subscriberSearch');
  const subscriberStatus = element<HTMLSelectElement>('subscriberStatus');
  const requestRows = element<HTMLTableSectionElement>('requestRows');
  const subscriberRows = element<HTMLTableSectionElement>('subscriberRows');
  const requestMessage = element<HTMLElement>('requestMessage');
  const subscriberMessage = element<HTMLElement>('subscriberMessage');
  const dialog = element<HTMLDialogElement>('adminRequestDialog');
  const detailMessage = element<HTMLElement>('adminRequestMessage');
  const details = element<HTMLDListElement>('adminRequestDetails');
  const contactActions = element<HTMLElement>('adminRequestContactActions');
  const detailAssignee = element<HTMLSelectElement>('adminRequestAssignee');
  const detailStatus = element<HTMLSelectElement>('adminRequestStatus');
  const detailNotes = element<HTMLTextAreaElement>('adminRequestNotes');
  const detailSave = element<HTMLButtonElement>('adminRequestSave');
  const detailClose = element<HTMLButtonElement>('adminRequestClose');
  let current: RequestRow | null = null;
  let requestPage = 0;
  let subscriberPage = 0;
  let requestSequence = 0;
  let subscriberSequence = 0;
  let detailSequence = 0;

  const requestFilters = () => ({ search: requestSearch.value.trim(), kind: requestKind.value, status: requestStatus.value });
  const subscriberFilters = () => ({ search: subscriberSearch.value.trim(), status: subscriberStatus.value });
  const requestsQuery = (filters: ReturnType<typeof requestFilters>) => {
    let query = client.from('public_requests').select(requestColumns, { count: 'exact' }).order('created_at', { ascending: false }).order('id', { ascending: false });
    if (filters.search) query = query.ilike('search_text', `%${filters.search}%`);
    if (filters.kind) query = query.eq('kind', filters.kind);
    if (filters.status) query = query.eq('status', filters.status);
    return query;
  };
  const subscribersQuery = (filters: ReturnType<typeof subscriberFilters>) => {
    let query = client.from('guide_subscribers').select(guideColumns, { count: 'exact' }).order('created_at', { ascending: false }).order('id', { ascending: false });
    if (filters.search) query = query.ilike('email', `%${filters.search}%`);
    if (filters.status) query = query.eq('status', filters.status);
    return query;
  };
  const pager = (prefix: string, page: number, total: number) => {
    element<HTMLButtonElement>(`${prefix}Previous`).disabled = page === 0;
    element<HTMLButtonElement>(`${prefix}Next`).disabled = (page + 1) * pageSize >= total;
    element<HTMLElement>(`${prefix}Page`).textContent = total ? `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, total)} / ${total}` : '0 / 0';
    element<HTMLElement>(`${prefix}Count`).textContent = `${total} ${text(prefix === 'request' ? 'inbox-records' : 'inbox-signups')}`;
  };
  const openRequest = async (id: string) => {
    const sequence = ++detailSequence;
    current = null;
    details.replaceChildren();
    contactActions.replaceChildren();
    detailNotes.value = '';
    detailNotes.disabled = true;
    detailStatus.disabled = true;
    detailAssignee.disabled = true;
    detailSave.disabled = true;
    message(detailMessage, 'inbox-loading');
    dialog.showModal();
    const [record, team] = await Promise.all([
      client.from('public_requests').select(`${requestColumns}, details, admin_notes`).eq('id', id).maybeSingle(),
      client.from('profiles').select('id, full_name, email').eq('role', 'admin').order('full_name'),
    ]);
    if (!dialog.open || sequence !== detailSequence) return;
    const { data, error } = record;
    if (error || !data || team.error) { message(detailMessage, 'inbox-unavailable', true); return; }
    current = data as RequestRow;
    const values: [string, string][] = [
      ['inbox-type', text(`inbox-kind-${current.kind}`)], ['inbox-received', date(current.created_at)],
      ['inbox-name', current.name || text('inbox-unnamed')], ['inbox-email', current.email || '-'], ['inbox-phone', current.phone || '-'],
      ...Object.entries(current.details || {}).map(([key, value]): [string, string] => [`inbox-field-${key}`, value || '-']),
    ];
    for (const [key, value] of values) {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = text(key);
      description.textContent = value;
      details.append(term, description);
    }
    for (const [key, href] of [
      ['inbox-email-action', current.email ? `mailto:${encodeURIComponent(current.email)}` : ''],
      ['inbox-call-action', current.phone ? `tel:${encodeURIComponent(current.phone)}` : ''],
    ]) {
      if (!href) continue;
      const link = document.createElement('a');
      link.className = 'btn btn-secondary';
      link.href = href;
      link.textContent = text(key);
      contactActions.appendChild(link);
    }
    const unassigned = document.createElement('option');
    unassigned.value = '';
    unassigned.textContent = text('inbox-unassigned');
    detailAssignee.replaceChildren(unassigned);
    for (const member of team.data || []) {
      const option = document.createElement('option');
      option.value = member.id;
      option.textContent = member.full_name || member.email || member.id;
      detailAssignee.appendChild(option);
    }
    detailAssignee.value = current.assigned_to || '';
    if (detailAssignee.selectedIndex === -1) detailAssignee.value = '';
    detailStatus.value = current.status;
    detailNotes.value = current.admin_notes || '';
    detailAssignee.disabled = false;
    detailStatus.disabled = false;
    detailNotes.disabled = false;
    detailSave.disabled = false;
    detailMessage.textContent = '';
    delete detailMessage.dataset.i18n;
  };
  const loadRequests = async () => {
    const sequence = ++requestSequence;
    requestRows.replaceChildren();
    message(requestMessage, 'inbox-loading');
    const { data, error, count } = await requestsQuery(requestFilters()).range(requestPage * pageSize, (requestPage + 1) * pageSize - 1);
    if (sequence !== requestSequence || requestPanel.hidden) return;
    if (error) { message(requestMessage, 'inbox-unavailable', true); pager('request', 0, 0); return; }
    const rows = (data || []) as RequestRow[];
    pager('request', requestPage, count || 0);
    message(requestMessage, rows.length ? 'inbox-ready' : 'inbox-empty');
    for (const record of rows) {
      const row = document.createElement('tr');
      cell(row, date(record.created_at));
      cell(row, text(`inbox-kind-${record.kind}`));
      cell(row, record.name || text('inbox-unnamed'));
      cell(row, [record.email, record.phone].filter(Boolean).join('\n')).className = 'admin-inbox-contact';
      badge(row, record.status);
      badge(row, record.notification_status);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      button.textContent = text('inbox-open');
      button.addEventListener('click', () => { void openRequest(record.id); });
      cell(row, '').appendChild(button);
      requestRows.appendChild(row);
    }
  };
  const loadSubscribers = async () => {
    const sequence = ++subscriberSequence;
    subscriberRows.replaceChildren();
    message(subscriberMessage, 'inbox-loading');
    const { data, error, count } = await subscribersQuery(subscriberFilters()).range(subscriberPage * pageSize, (subscriberPage + 1) * pageSize - 1);
    if (sequence !== subscriberSequence || subscriberPanel.hidden) return;
    if (error) { message(subscriberMessage, 'inbox-unavailable', true); pager('subscriber', 0, 0); return; }
    const rows = (data || []) as GuideRow[];
    pager('subscriber', subscriberPage, count || 0);
    message(subscriberMessage, rows.length ? 'inbox-ready' : 'inbox-empty');
    for (const record of rows) {
      const row = document.createElement('tr');
      cell(row, date(record.created_at));
      cell(row, record.email);
      const status = document.createElement('select');
      status.className = 'admin-input';
      status.setAttribute('aria-label', text('inbox-status'));
      for (const value of ['subscribed', 'notified', 'archived']) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text(`inbox-status-${value}`);
        status.appendChild(option);
      }
      status.value = record.status;
      cell(row, '').appendChild(status);
      badge(row, record.notification_status);
      const save = document.createElement('button');
      save.type = 'button';
      save.className = 'btn btn-secondary';
      save.textContent = text('inbox-save');
      save.addEventListener('click', async () => {
        save.disabled = true;
        status.disabled = true;
        const { data: updated, error: updateError } = await client.from('guide_subscribers').update({ status: status.value })
          .eq('id', record.id).eq('updated_at', record.updated_at).select('id').maybeSingle();
        if (updateError || !updated) {
          message(subscriberMessage, updateError ? 'inbox-save-error' : 'inbox-stale', true);
          save.disabled = false;
          status.disabled = false;
        } else await loadSubscribers();
      });
      cell(row, '').appendChild(save);
      subscriberRows.appendChild(row);
    }
  };

  element<HTMLFormElement>('adminRequestForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!current || detailSave.disabled) return;
    detailSave.disabled = true;
    detailClose.disabled = true;
    detailStatus.disabled = true;
    detailNotes.disabled = true;
    detailAssignee.disabled = true;
    message(detailMessage, 'inbox-saving');
    const { data, error } = await client.from('public_requests').update({ status: detailStatus.value, assigned_to: detailAssignee.value || null, admin_notes: detailNotes.value.trim() })
      .eq('id', current.id).eq('updated_at', current.updated_at).select('id').maybeSingle();
    detailClose.disabled = false;
    detailSave.disabled = false;
    detailStatus.disabled = false;
    detailNotes.disabled = false;
    detailAssignee.disabled = false;
    if (error || !data) { message(detailMessage, error ? 'inbox-save-error' : 'inbox-stale', true); return; }
    dialog.close();
    await loadRequests();
  });
  detailClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', (event) => { if (detailSave.disabled && current) event.preventDefault(); });
  dialog.addEventListener('close', () => { detailSequence += 1; current = null; details.replaceChildren(); contactActions.replaceChildren(); detailNotes.value = ''; });

  element<HTMLButtonElement>('requestRefresh').addEventListener('click', () => { void loadRequests(); });
  element<HTMLButtonElement>('subscriberRefresh').addEventListener('click', () => { void loadSubscribers(); });
  for (const [prefix, load] of [['request', loadRequests], ['subscriber', loadSubscribers]] as const) {
    element<HTMLButtonElement>(`${prefix}Previous`).addEventListener('click', () => { if (prefix === 'request') requestPage = Math.max(0, requestPage - 1); else subscriberPage = Math.max(0, subscriberPage - 1); void load(); });
    element<HTMLButtonElement>(`${prefix}Next`).addEventListener('click', () => { if (prefix === 'request') requestPage += 1; else subscriberPage += 1; void load(); });
    let debounce = 0;
    element<HTMLFormElement>(`${prefix}Filters`).addEventListener('submit', (event) => { event.preventDefault(); if (prefix === 'request') requestPage = 0; else subscriberPage = 0; void load(); });
    element<HTMLFormElement>(`${prefix}Filters`).addEventListener('input', () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => { if (prefix === 'request') requestPage = 0; else subscriberPage = 0; void load(); }, 250);
    });
  }

  element<HTMLButtonElement>('requestExport').addEventListener('click', async (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true;
    const filters = requestFilters();
    const records: RequestRow[] = [];
    try {
      for (let offset = 0; ; offset += 500) {
        const { data, error, count } = await requestsQuery(filters).range(offset, offset + 499);
        if (error) throw error;
        if ((count || 0) > 5000) { message(requestMessage, 'inbox-export-limit', true); return; }
        records.push(...(data || []) as RequestRow[]);
        if (records.length >= (count || 0)) break;
        if (!data?.length) throw new Error('incomplete_export');
      }
      if (!records.length) { message(requestMessage, 'inbox-empty'); return; }
      csv(['ID', 'Received', 'Type', 'Name', 'Email', 'Phone', 'Status', 'Staff Alert'], records.map((record) => [record.id, record.created_at, record.kind, record.name, record.email, record.phone, record.status, record.notification_status]), 'onnoy_requests.csv');
    } catch { message(requestMessage, 'inbox-export-error', true); }
    finally { button.disabled = false; }
  });
  element<HTMLButtonElement>('subscriberExport').addEventListener('click', async (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true;
    const filters = subscriberFilters();
    const records: GuideRow[] = [];
    try {
      for (let offset = 0; ; offset += 500) {
        const { data, error, count } = await subscribersQuery(filters).range(offset, offset + 499);
        if (error) throw error;
        if ((count || 0) > 5000) { message(subscriberMessage, 'inbox-export-limit', true); return; }
        records.push(...(data || []) as GuideRow[]);
        if (records.length >= (count || 0)) break;
        if (!data?.length) throw new Error('incomplete_export');
      }
      if (!records.length) { message(subscriberMessage, 'inbox-empty'); return; }
      csv(['ID', 'Email', 'Status', 'Staff Alert', 'Signed Up'], records.map((record) => [record.id, record.email, record.status, record.notification_status, record.created_at]), 'onnoy_guide_signups.csv');
    } catch { message(subscriberMessage, 'inbox-export-error', true); }
    finally { button.disabled = false; }
  });

  document.addEventListener('onnoy:admin-tab', (event) => {
    const tab = (event as CustomEvent<{ tab: string }>).detail.tab;
    if (tab === 'requests') { requestPage = 0; void loadRequests(); }
    if (tab === 'subscribers') { subscriberPage = 0; void loadSubscribers(); }
  });
  document.addEventListener('onnoy:langchange', () => { if (!requestPanel.hidden) void loadRequests(); if (!subscriberPanel.hidden) void loadSubscribers(); });
  client.auth.onAuthStateChange((_event, session) => {
    if (session) return;
    requestSequence += 1;
    subscriberSequence += 1;
    requestRows.replaceChildren();
    subscriberRows.replaceChildren();
    if (dialog.open) dialog.close();
  });
  if (!requestPanel.hidden) void loadRequests();
  if (!subscriberPanel.hidden) void loadSubscribers();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeInbox, { once: true });
else initializeInbox();