import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const businessId = searchParams.get("businessId");
    
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    
    // Get business and active sales funnel
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        siteConfig: true,
      },
    });
    
    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }
    
    // Get active sales funnel
    const activeFunnel = await prisma.salesFunnel.findFirst({
      where: { 
        businessId,
        isActive: true 
      },
      include: {
        coupon: true,
      },
    });
    
    if (!activeFunnel) {
      return NextResponse.json(
        { error: "No active sales funnel found" },
        { status: 404 }
      );
    }
    
    // Generate HTML for the embedded funnel
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special Offer</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    body {
      background-color: white;
      color: #333;
      overflow: hidden;
    }
    
    .funnel-container {
      width: 100%;
      height: 100%;
      padding: 16px;
      position: relative;
    }
    
    .close-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .close-button:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    .popup-image {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .popup-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .popup-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }
    
    .form-container {
      margin-top: 16px;
    }
    
    .form-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .form-group {
      margin-bottom: 12px;
    }
    
    .form-label {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
      font-weight: 500;
    }
    
    .form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-input:focus {
      outline: none;
      border-color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
    }
    
    .form-textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      min-height: 80px;
      resize: vertical;
    }
    
    .form-textarea:focus {
      outline: none;
      border-color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
    }
    
    .form-error {
      color: #e11d48;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .submit-button {
      width: 100%;
      padding: 10px 16px;
      background-color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 8px;
    }
    
    .submit-button:hover {
      opacity: 0.9;
    }
    
    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .thank-you-container {
      text-align: center;
      padding: 16px;
    }
    
    .thank-you-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      background-color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .thank-you-message {
      font-size: 16px;
      margin-bottom: 16px;
    }
    
    .coupon-container {
      margin: 16px 0;
      padding: 12px;
      border: 1px dashed #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    
    .coupon-code {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
    }
    
    .copy-button {
      margin-top: 8px;
      padding: 6px 12px;
      background-color: transparent;
      border: 1px solid ${business.siteConfig?.colors?.primary || '#3b82f6'};
      color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    
    .copy-button:hover {
      background-color: rgba(59, 130, 246, 0.05);
    }
    
    .close-thank-you {
      margin-top: 16px;
      padding: 8px 16px;
      background-color: ${business.siteConfig?.colors?.primary || '#3b82f6'};
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    
    .close-thank-you:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div id="funnel-app"></div>
  
  <script>
    // Main app state
    const state = {
      view: 'popup', // 'popup', 'form', 'thankYou'
      formData: {
        name: '',
        email: '',
        phone: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      couponCode: null
    };
    
    // Business and funnel data
    const businessId = "${business.id}";
    const funnel = ${JSON.stringify(activeFunnel)};
    
    // DOM elements
    const app = document.getElementById('funnel-app');
    
    // Render the current view
    function render() {
      if (state.view === 'popup') {
        renderPopup();
      } else if (state.view === 'form') {
        renderForm();
      } else if (state.view === 'thankYou') {
        renderThankYou();
      }
      
      // Notify parent about height changes
      setTimeout(() => {
        window.parent.postMessage({
          type: 'RESIZE_FUNNEL',
          height: document.body.scrollHeight
        }, '*');
      }, 100);
    }
    
    // Render the initial popup
    function renderPopup() {
      app.innerHTML = \`
        <div class="funnel-container">
          <button class="close-button" id="close-popup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          \${funnel.popupImage ? \`<img src="\${funnel.popupImage}" alt="\${funnel.name}" class="popup-image">\` : ''}
          
          <h2 class="popup-title">\${funnel.popupTitle}</h2>
          <p class="popup-text">\${funnel.popupText}</p>
          
          <button class="submit-button" id="show-form-button">Get Discount</button>
        </div>
      \`;
      
      // Add event listeners
      document.getElementById('close-popup').addEventListener('click', closePopup);
      document.getElementById('show-form-button').addEventListener('click', showForm);
    }
    
    // Render the lead capture form
    function renderForm() {
      app.innerHTML = \`
        <div class="funnel-container">
          <button class="close-button" id="close-popup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h2 class="form-title">\${funnel.formTitle}</h2>
          
          <form id="lead-form" class="form-container">
            <div class="form-group">
              <label class="form-label" for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-input" 
                value="\${state.formData.name}" 
                required
              />
              \${state.errors.name ? \`<div class="form-error">\${state.errors.name}</div>\` : ''}
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                value="\${state.formData.email}" 
                required
              />
              \${state.errors.email ? \`<div class="form-error">\${state.errors.email}</div>\` : ''}
            </div>
            
            <div class="form-group">
              <label class="form-label" for="phone">Phone (optional)</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                class="form-input" 
                value="\${state.formData.phone}"
              />
              \${state.errors.phone ? \`<div class="form-error">\${state.errors.phone}</div>\` : ''}
            </div>
            
            <div class="form-group">
              <label class="form-label" for="message">Message (optional)</label>
              <textarea 
                id="message" 
                name="message" 
                class="form-textarea"
              >\${state.formData.message}</textarea>
              \${state.errors.message ? \`<div class="form-error">\${state.errors.message}</div>\` : ''}
            </div>
            
            <button 
              type="submit" 
              class="submit-button" 
              id="submit-form-button"
              \${state.isSubmitting ? 'disabled' : ''}
            >
              \${state.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      \`;
      
      // Add event listeners
      document.getElementById('close-popup').addEventListener('click', closePopup);
      document.getElementById('lead-form').addEventListener('submit', submitForm);
      
      // Add input listeners
      document.getElementById('name').addEventListener('input', handleInput);
      document.getElementById('email').addEventListener('input', handleInput);
      document.getElementById('phone').addEventListener('input', handleInput);
      document.getElementById('message').addEventListener('input', handleInput);
    }
    
    // Render the thank you message
    function renderThankYou() {
      app.innerHTML = \`
        <div class="funnel-container">
          <div class="thank-you-container">
            <div class="thank-you-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <p class="thank-you-message">\${funnel.thankYouMessage}</p>
            
            \${state.couponCode ? \`
              <div class="coupon-container">
                <p>Your discount code:</p>
                <div class="coupon-code">\${state.couponCode}</div>
                <button class="copy-button" id="copy-code-button">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy Code
                </button>
              </div>
            \` : ''}
            
            <button class="close-thank-you" id="close-thank-you">Close</button>
          </div>
        </div>
      \`;
      
      // Add event listeners
      document.getElementById('close-thank-you').addEventListener('click', closePopup);
      
      if (state.couponCode) {
        document.getElementById('copy-code-button').addEventListener('click', copyCode);
      }
    }
    
    // Event handlers
    function closePopup() {
      // Notify parent to hide the popup
      window.parent.postMessage({ type: 'HIDE_FUNNEL' }, '*');
      
      // Mark as shown in local storage
      try {
        localStorage.setItem(\`funnel-\${funnel.id}-shown\`, 'true');
      } catch (e) {
        console.error('Could not access localStorage', e);
      }
    }
    
    function showForm() {
      state.view = 'form';
      render();
    }
    
    function handleInput(e) {
      const { name, value } = e.target;
      state.formData[name] = value;
      
      // Clear error when user types
      if (state.errors[name]) {
        state.errors[name] = '';
      }
    }
    
    function validateForm() {
      const errors = {};
      
      if (!state.formData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!state.formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(state.formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      state.errors = errors;
      return Object.keys(errors).length === 0;
    }
    
    async function submitForm(e) {
      e.preventDefault();
      
      if (!validateForm()) {
        render();
        return;
      }
      
      state.isSubmitting = true;
      render();
      
      try {
        const response = await fetch(\`/api/businesses/\${businessId}/leads\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...state.formData,
            source: 'sales_funnel',
            funnelId: funnel.id
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          state.couponCode = data.couponCode || null;
          state.view = 'thankYou';
        } else {
          state.errors = data.errors || { form: data.error || 'Something went wrong' };
        }
      } catch (error) {
        state.errors = { form: 'Failed to submit form. Please try again.' };
      } finally {
        state.isSubmitting = false;
        render();
      }
    }
    
    function copyCode() {
      if (!state.couponCode) return;
      
      navigator.clipboard.writeText(state.couponCode)
        .then(() => {
          const button = document.getElementById('copy-code-button');
          button.innerHTML = \`
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          \`;
          
          setTimeout(() => {
            button.innerHTML = \`
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Code
            \`;
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
    
    // Initialize the app
    function init() {
      // Show the popup
      window.parent.postMessage({ type: 'SHOW_FUNNEL' }, '*');
      render();
    }
    
    // Start the app
    init();
  </script>
</body>
</html>
    `.trim();
    
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error serving embedded funnel:", error);
    return NextResponse.json(
      { error: "Failed to serve embedded funnel" },
      { status: 500 }
    );
  }
} 