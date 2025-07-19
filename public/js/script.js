// /public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const messageEl = document.getElementById('newsletter-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            messageEl.textContent = ''; // Clear previous messages
            messageEl.classList.remove('success', 'error');

            try {
                const response = await fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                const result = await response.json();

                if (response.ok) {
                    messageEl.textContent = result.message;
                    messageEl.classList.add('success');
                    emailInput.value = ''; // Clear input on success
                } else {
                    messageEl.textContent = result.message;
                    messageEl.classList.add('error');
                }
            } catch (error) {
                console.error('Submission error:', error);
                messageEl.textContent = 'A network error occurred. Please try again.';
                messageEl.classList.add('error');
            }
        });
    }
});