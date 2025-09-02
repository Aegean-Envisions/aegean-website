// Microsoft Authentication Library (MSAL) Configuration
const msalConfig = {
    auth: {
        clientId: "fa7f4d5e-34d3-4bbb-b582-daf3bd5309c5", // Aegean Envisions Portal Azure AD App
        authority: "https://login.microsoftonline.com/common", // Works with any Microsoft account
        redirectUri: window.location.origin + "/portal.html"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    }
};

// Initialize MSAL
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Login request configuration
const loginRequest = {
    scopes: ["User.Read", "email", "profile"]
};

// Sign in function
async function login() {
    try {
        // Use proper Microsoft 365 authentication via MSAL
        const response = await msalInstance.loginPopup(loginRequest);
        handleResponse(response);
        
    } catch (error) {
        console.error("Login failed:", error);
        if (error.errorCode === "user_cancelled") {
            // User cancelled the login
            return;
        } else if (error.errorCode === "popup_window_error") {
            // Try redirect instead of popup
            try {
                await msalInstance.loginRedirect(loginRequest);
            } catch (redirectError) {
                console.error("Redirect login failed:", redirectError);
                alert("Authentication failed. Please ensure you have access to Aegean Envisions Microsoft 365.");
            }
        } else {
            alert("Authentication failed. Please try again or contact support.");
        }
    }
}

// Handle authentication response
function handleResponse(response) {
    if (response !== null && response.account) {
        const userEmail = response.account.username;
        
        // Check if user is from the Aegean Envisions organization
        const aegeanDomain = "@aegean-envisions.com";
        
        if (userEmail && userEmail.endsWith(aegeanDomain)) {
            // Store authentication data
            sessionStorage.setItem("isAuthenticated", "true");
            sessionStorage.setItem("userEmail", userEmail);
            sessionStorage.setItem("msalAccount", JSON.stringify(response.account));
            
            // Redirect to portal
            window.location.href = "/portal.html";
        } else {
            alert("Access denied. Only Aegean Envisions email addresses are allowed.");
            signOut();
        }
    } else {
        console.error("No account information received from authentication");
    }
}

// Check if user is already signed in
async function checkAuth() {
    try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            const account = accounts[0];
            
            // Verify the account is from the correct domain
            const aegeanDomain = "@aegean-envisions.com";
            
            if (account.username && account.username.endsWith(aegeanDomain)) {
                msalInstance.setActiveAccount(account);
                sessionStorage.setItem("isAuthenticated", "true");
                sessionStorage.setItem("userEmail", account.username);
                return true;
            } else {
                // Clear invalid account
                await msalInstance.clearCache();
                sessionStorage.clear();
            }
        }
    } catch (error) {
        console.error("Error checking authentication:", error);
    }
    return false;
}

// Sign out function
async function signOut() {
    try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            await msalInstance.logoutPopup({
                account: accounts[0]
            });
        }
    } catch (error) {
        console.error("Sign out error:", error);
    } finally {
        sessionStorage.clear();
        window.location.href = "/";
    }
}