import { translations } from '@data/translations';

function initializeDirectDonation() {
  const root = document.querySelector<HTMLElement>('#direct-donation');
  const amountInput = document.querySelector<HTMLInputElement>('#directDonationAmount');
  const status = document.querySelector<HTMLElement>('#directDonationStatus');
  if (!root || !amountInput || !status) return;

  const text = (key: string) => translations[key]?.[document.documentElement.lang === 'bn' ? 'bn' : 'en'] ?? '';
  const presets = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-donation-amount]'));
  const trackedOptions = new Set<string>();
  let statusKey = '';

  const trackOption = (option: string) => {
    if (trackedOptions.has(option)) return;
    trackedOptions.add(option);
    window.onnoyTrack?.('donation_option_select', { donation_option: option });
  };

  const refreshPreset = () => {
    presets.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.donationAmount === amountInput.value)));
  };

  const copyText = async (value: string) => {
    if (!navigator.clipboard?.writeText) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  };

  document.querySelectorAll<HTMLElement>('[data-donation-option]').forEach((element) => element.addEventListener('click', () => {
    const option = element.dataset.donationOption;
    if (option) trackOption(option);
  }));

  presets.forEach((button) => button.addEventListener('click', () => {
    trackOption('manual');
    amountInput.value = button.dataset.donationAmount || '';
    refreshPreset();
    amountInput.focus();
  }));
  amountInput.addEventListener('input', () => {
    trackOption('manual');
    refreshPreset();
  });

  root.querySelectorAll<HTMLButtonElement>('[data-donation-copy]').forEach((button) => button.addEventListener('click', async () => {
    trackOption('manual');
    const copyingAmount = button.dataset.donationCopy === 'amount';
    const value = copyingAmount ? amountInput.value.trim() : button.dataset.copyValue || '';
    const validAmount = !copyingAmount || (Number.isInteger(Number(value)) && Number(value) > 0);
    const copied = !!value && validAmount && await copyText(value);
    statusKey = copied ? (copyingAmount ? 'donation-amount-copied' : 'donation-number-copied') : 'donation-copy-failed';
    status.textContent = text(statusKey);
    if (copied) window.onnoyTrack?.('donation_helper_copy', { copy_type: copyingAmount ? 'amount' : 'number' });
  }));

  document.addEventListener('onnoy:langchange', () => {
    if (statusKey) status.textContent = text(statusKey);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeDirectDonation, { once: true });
else initializeDirectDonation();