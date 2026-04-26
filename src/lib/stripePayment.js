export function initPayment({
  formId,
  submitId,
  errorId,
  item,
  successItem,
  collectData,
  submitLabel,
  payLabel,
  appearance = {},
}) {
  const form = document.getElementById(formId);
  const errorEl = document.getElementById(errorId);
  const modal = document.getElementById('payment-modal');
  const modalClose = document.getElementById('modal-close');
  const paymentForm = document.getElementById('payment-form');

  let session = null;

  function tearDown() {
    if (!session) return;
    try { session.paymentEl.unmount(); } catch (_) {}
    paymentForm.removeEventListener('submit', session.payHandler);
    session = null;
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    tearDown();
    localStorage.removeItem('otsp_member');
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById(submitId);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing…';
    errorEl.classList.add('hidden');

    tearDown();

    const data = { ...collectData(form), item };

    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Payment setup failed.');
      const { clientSecret, metadata } = await res.json();

      localStorage.setItem('otsp_member', JSON.stringify({ ...data, amount: metadata.amount }));

      const stripe = Stripe(import.meta.env.PUBLIC_STRIPE_PK);
      const elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorBackground: '#161b2e',
            colorPrimary: '#4a90c4',
            colorText: '#f0ece4',
            colorTextSecondary: '#9ea3b0',
            borderRadius: '6px',
            ...appearance,
          },
        },
      });
      const paymentEl = elements.create('payment');

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      paymentEl.mount('#payment-element');
      paymentEl.on('ready', () => paymentEl.focus());

      const payHandler = async (ev) => {
        ev.preventDefault();
        const paySubmit = document.getElementById('payment-submit');
        paySubmit.disabled = true;
        paySubmit.textContent = 'Processing…';
        document.getElementById('payment-error').classList.add('hidden');

        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success?item=${successItem}`,
          },
        });
        if (error) {
          const errEl = document.getElementById('payment-error');
          errEl.textContent = error.message;
          errEl.classList.remove('hidden');
          paySubmit.disabled = false;
          paySubmit.textContent = payLabel;
        }
      };

      paymentForm.addEventListener('submit', payHandler);
      session = { paymentEl, payHandler };
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });

  modalClose?.addEventListener('click', closeModal);
}
