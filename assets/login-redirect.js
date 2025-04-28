// Redirect users after login to the homepage instead of the account page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the login page
  if (window.location.pathname.includes('/account/login')) {
    // Find the login form
    const loginForm = document.querySelector('form[action*="/account/login"]');
    
    if (loginForm) {
      // Add a hidden input field to redirect to the homepage after login
      const redirectInput = document.createElement('input');
      redirectInput.setAttribute('type', 'hidden');
      redirectInput.setAttribute('name', 'checkout_url');
      redirectInput.setAttribute('value', '/');
      loginForm.appendChild(redirectInput);
      
      console.log('Added redirect to homepage after login');
    }
  }
  
  // Check if we're on the account page and it's the first load after login
  if (window.location.pathname.includes('/account') && !window.location.pathname.includes('/login')) {
    // Check if this is the first time loading the account page (using session storage)
    const hasVisitedAccount = sessionStorage.getItem('hasVisitedAccount');
    
    if (!hasVisitedAccount) {
      // Set the flag so we don't redirect again during this session
      sessionStorage.setItem('hasVisitedAccount', 'true');
      
      // Redirect to the homepage
      window.location.href = '/';
    }
  }
});
