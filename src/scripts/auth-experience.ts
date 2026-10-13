type AuthExpression = 'welcome' | 'curious' | 'private' | 'working';

function initializeAuthExperience() {
  document.querySelectorAll<HTMLElement>('[data-auth-experience]').forEach((root) => {
    const mode = root.dataset.authMode === 'register' ? 'register' : 'login';
    const email = root.querySelector<HTMLInputElement>('#email');
    const password = root.querySelector<HTMLInputElement>('#password');
    const passwordToggle = root.querySelector<HTMLButtonElement>('#togglePassword');
    const form = root.querySelector<HTMLFormElement>('form');
    const switchLink = root.querySelector<HTMLAnchorElement>('[data-auth-switch]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reactionTimer = 0;

    const setExpression = (expression: AuthExpression) => {
      root.setAttribute('data-auth-expression', expression);
    };
    const react = (expression: AuthExpression) => {
      setExpression(expression);
      window.clearTimeout(reactionTimer);
      if (!reducedMotion.matches) {
        root.classList.remove('is-reacting');
        window.requestAnimationFrame(() => root.classList.add('is-reacting'));
        reactionTimer = window.setTimeout(() => root.classList.remove('is-reacting'), 320);
      }
    };
    const settleExpression = () => {
      window.setTimeout(() => {
        if (document.activeElement === password || document.activeElement === passwordToggle) setExpression('private');
        else if (document.activeElement === email) setExpression('curious');
        else setExpression('welcome');
      }, 0);
    };

    setExpression('welcome');
    email?.addEventListener('focus', () => react('curious'));
    email?.addEventListener('input', () => react('curious'));
    email?.addEventListener('blur', settleExpression);
    password?.addEventListener('focus', () => react('private'));
    password?.addEventListener('input', () => react('private'));
    password?.addEventListener('blur', settleExpression);
    passwordToggle?.addEventListener('focus', () => setExpression('private'));
    passwordToggle?.addEventListener('blur', settleExpression);
    form?.addEventListener('submit', () => react('working'));
    root.querySelectorAll('[data-oauth-provider]').forEach((button) => button.addEventListener('click', () => react('working')));

    const arrivedFrom = sessionStorage.getItem('onnoy_auth_transition');
    sessionStorage.removeItem('onnoy_auth_transition');
    if (arrivedFrom && arrivedFrom !== mode) {
      root.dataset.authArrivedFrom = arrivedFrom;
      window.requestAnimationFrame(() => root.classList.add('is-arrived'));
    }

    switchLink?.addEventListener('click', (event) => {
      if (reducedMotion.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const targetMode = switchLink.dataset.targetMode || '';
      root.dataset.authSwitching = targetMode;
      sessionStorage.setItem('onnoy_auth_transition', mode);
      window.setTimeout(() => window.location.assign(switchLink.href), 460);
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAuthExperience, { once: true });
else initializeAuthExperience();