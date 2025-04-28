// Disable direct checkout and ensure customers go through the cart page
document.addEventListener('DOMContentLoaded', function() {
  // Function to modify all checkout links to go to cart instead
  function redirectCheckoutToCart() {
    // Skip if we're already on the cart page
    if (window.location.pathname === '/cart') {
      // Update the prescription summary before checkout
      updatePrescriptionSummary();
      return;
    }

    // Find all links that go to checkout
    const checkoutLinks = document.querySelectorAll('a[href*="/checkout"]');

    // Modify each link to go to cart instead
    checkoutLinks.forEach(link => {
      link.setAttribute('href', '/cart');
      link.setAttribute('data-original-href', link.getAttribute('href'));
    });

    // Find all forms that submit to checkout (except the cart form)
    const checkoutForms = document.querySelectorAll('form[action*="/checkout"]:not(#cart)');

    // Modify each form to submit to cart instead
    checkoutForms.forEach(form => {
      form.setAttribute('action', '/cart');
      form.setAttribute('data-original-action', form.getAttribute('action'));
    });
  }

  // Run the function on page load
  redirectCheckoutToCart();

  // Also run the function when the page changes (for SPAs)
  document.addEventListener('page:load', redirectCheckoutToCart);
  document.addEventListener('shopify:section:load', redirectCheckoutToCart);

  // Intercept any dynamic checkout buttons that might be added later
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1) { // Only process Element nodes
            // Check for checkout links within the new node
            const newCheckoutLinks = node.querySelectorAll ? node.querySelectorAll('a[href*="/checkout"]') : [];
            if (newCheckoutLinks.length > 0) {
              redirectCheckoutToCart();
            }

            // Check if the node itself is a checkout link
            if (node.href && node.href.includes('/checkout')) {
              node.href = '/cart';
              node.setAttribute('data-original-href', node.href);
            }
          }
        }
      }
    });
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Intercept the Shopify payment buttons
  function disableShopifyPaymentButtons() {
    // Find all Shopify payment buttons
    const paymentButtons = document.querySelectorAll('.shopify-payment-button, .shopify-payment-button__button');

    // Hide or disable them
    paymentButtons.forEach(button => {
      button.style.display = 'none';
    });
  }

  // Run the function on page load
  disableShopifyPaymentButtons();

  // Also run the function when the page changes
  document.addEventListener('page:load', disableShopifyPaymentButtons);
  document.addEventListener('shopify:section:load', disableShopifyPaymentButtons);

  // Function to update the prescription summary before checkout
  function updatePrescriptionSummary() {
    // Only run on the cart page
    if (window.location.pathname !== '/cart') return;

    // Get the prescription type
    const prescriptionTypeRadios = document.querySelectorAll('input[name="prescription_type"]');
    let selectedType = 'no_prescription'; // Default

    prescriptionTypeRadios.forEach(radio => {
      if (radio.checked) {
        selectedType = radio.value;
      }
    });

    // Update the prescription type display
    const prescriptionTypeDisplay = document.getElementById('prescription-type-display');
    if (prescriptionTypeDisplay) {
      let displayText = 'No prescription (default glasses)';

      if (selectedType === 'single_prescription') {
        displayText = 'Using one prescription for all items';
      } else if (selectedType === 'multiple_prescription') {
        displayText = 'Using different prescriptions for each item';
      } else if (selectedType === 'prescription_image') {
        displayText = 'Using uploaded prescription image';
      }

      prescriptionTypeDisplay.textContent = displayText;
    }

    // Hide all summary sections first
    const singlePrescriptionSummary = document.getElementById('single-prescription-summary');
    const prescriptionImageSummary = document.getElementById('prescription-image-summary');
    const multiplePrescriptionSummary = document.getElementById('multiple-prescription-summary');

    if (singlePrescriptionSummary) singlePrescriptionSummary.style.display = 'none';
    if (prescriptionImageSummary) prescriptionImageSummary.style.display = 'none';
    if (multiplePrescriptionSummary) multiplePrescriptionSummary.style.display = 'none';

    // Show the relevant summary section based on the selected type
    if (selectedType === 'single_prescription' && singlePrescriptionSummary) {
      singlePrescriptionSummary.style.display = 'block';

      // Update the prescription details
      document.getElementById('right-sph-summary').textContent = document.querySelector('input[name="cart[right_sph]"]')?.value || '-';
      document.getElementById('right-cyl-summary').textContent = document.querySelector('input[name="cart[right_cyl]"]')?.value || '-';
      document.getElementById('right-axis-summary').textContent = document.querySelector('input[name="cart[right_axis]"]')?.value || '-';
      document.getElementById('right-add-summary').textContent = document.querySelector('input[name="cart[right_add]"]')?.value || '-';
      document.getElementById('left-sph-summary').textContent = document.querySelector('input[name="cart[left_sph]"]')?.value || '-';
      document.getElementById('left-cyl-summary').textContent = document.querySelector('input[name="cart[left_cyl]"]')?.value || '-';
      document.getElementById('left-axis-summary').textContent = document.querySelector('input[name="cart[left_axis]"]')?.value || '-';
      document.getElementById('left-add-summary').textContent = document.querySelector('input[name="cart[left_add]"]')?.value || '-';
      document.getElementById('pd-summary').textContent = document.querySelector('input[name="cart[pd]"]')?.value || '-';

      // Update notes
      const notesElement = document.getElementById('prescription-notes-summary').querySelector('span');
      if (notesElement) {
        const notes = document.querySelector('textarea[name="cart[prescription_notes]"]')?.value;
        notesElement.textContent = notes && notes.trim() !== '' ? notes : 'No additional notes';
      }
    } else if (selectedType === 'prescription_image' && prescriptionImageSummary) {
      prescriptionImageSummary.style.display = 'block';

      // Update the image name
      const fileInput = document.getElementById('prescription_image');
      const imageNameElement = document.getElementById('prescription-image-name');

      if (fileInput && imageNameElement) {
        if (fileInput.files && fileInput.files.length > 0) {
          imageNameElement.textContent = fileInput.files[0].name;
        } else {
          imageNameElement.textContent = 'No image uploaded';
        }
      }

      // Update notes
      const notesElement = document.getElementById('prescription-image-notes-summary').querySelector('span');
      if (notesElement) {
        const notes = document.querySelector('textarea[name="cart[prescription_image_notes]"]')?.value;
        notesElement.textContent = notes && notes.trim() !== '' ? notes : 'No additional notes';
      }

      // Check if manual prescription details were also provided
      const showPrescriptionFormWithImage = document.getElementById('show-prescription-form-with-image');
      if (showPrescriptionFormWithImage && showPrescriptionFormWithImage.checked) {
        // Create a new element to show that manual details were also provided
        const manualDetailsElement = document.createElement('p');
        manualDetailsElement.innerHTML = '<strong>Additional Information:</strong> Manual prescription details also provided';
        prescriptionImageSummary.appendChild(manualDetailsElement);
      }
    } else if (selectedType === 'multiple_prescription' && multiplePrescriptionSummary) {
      multiplePrescriptionSummary.style.display = 'block';

      // You could add more detailed information about each item's prescription here if needed
    }
  }

  // Add event listeners for prescription form changes
  if (window.location.pathname === '/cart') {
    // Listen for changes to the prescription type
    const prescriptionTypeRadios = document.querySelectorAll('input[name="prescription_type"]');
    prescriptionTypeRadios.forEach(radio => {
      radio.addEventListener('change', updatePrescriptionSummary);
    });

    // Listen for changes to prescription form inputs
    const prescriptionInputs = document.querySelectorAll('.prescription-form-container input, .prescription-form-container textarea');
    prescriptionInputs.forEach(input => {
      input.addEventListener('change', updatePrescriptionSummary);
    });

    // Listen for changes to the file input
    const fileInput = document.getElementById('prescription_image');
    if (fileInput) {
      fileInput.addEventListener('change', updatePrescriptionSummary);
    }

    // Listen for changes to the checkbox for showing prescription form with image
    const showPrescriptionFormWithImage = document.getElementById('show-prescription-form-with-image');
    if (showPrescriptionFormWithImage) {
      showPrescriptionFormWithImage.addEventListener('change', updatePrescriptionSummary);
    }

    // Initial update
    updatePrescriptionSummary();

    // Add event listener to the checkout button
    const checkoutButton = document.getElementById('checkout');
    const cartForm = document.querySelector('form[data-cart-form]');

    if (checkoutButton && cartForm) {
      checkoutButton.addEventListener('click', function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Check if prescription is required but not provided
        const prescriptionTypeRadios = document.querySelectorAll('input[name="prescription_type"]');
        let selectedType = null;

        prescriptionTypeRadios.forEach(radio => {
          if (radio.checked) {
            selectedType = radio.value;
          }
        });

        if (selectedType === 'single_prescription') {
          // Check if at least one prescription field is filled
          const rightSph = document.querySelector('input[name="cart[right_sph]"]')?.value;
          const leftSph = document.querySelector('input[name="cart[left_sph]"]')?.value;

          if ((!rightSph || rightSph.trim() === '') && (!leftSph || leftSph.trim() === '')) {
            // No prescription details provided
            alert('Please provide at least some prescription details or select a different option.');
            return false;
          }
        } else if (selectedType === 'prescription_image') {
          // Check if an image is uploaded
          const fileInput = document.getElementById('prescription_image');

          if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            // No image uploaded
            alert('Please upload a prescription image or select a different option.');
            return false;
          }
        }

        // Update the prescription summary one last time before checkout
        updatePrescriptionSummary();

        // Change the form action to checkout
        cartForm.setAttribute('action', '/checkout');

        // Submit the form
        cartForm.submit();
      });
    }
  }
});
