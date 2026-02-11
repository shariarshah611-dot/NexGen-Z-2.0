document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loader-wrapper');
    const authSection = document.getElementById('auth-section');
    const mainApp = document.getElementById('main-app');
    const authForm = document.getElementById('auth-form');
    const toggleAuth = document.getElementById('toggle-auth');
    const authTitle = document.getElementById('auth-title');
    const submitBtn = document.getElementById('submit-btn');
    const message = document.getElementById('message');
    const displayUser = document.getElementById('display-user');
    const userPfpNav = document.getElementById('user-pfp-nav');
    const postCreatorAvatar = document.getElementById('post-creator-avatar');
    
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.getElementById('menu-icon');
    const closeSidebar = document.getElementById('close-sidebar');
    const logoutBtnSidebar = document.getElementById('logout-btn-sidebar');

    let isLoginMode = true;

    // ১. স্ট্যাটাস চেক ও প্রোফাইল সেটআপ
    const checkStatus = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const currentUser = localStorage.getItem('currentUser');

        if (isLoggedIn === 'true' && currentUser) {
            const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
            loader.classList.add('hidden');
            mainApp.classList.remove('hidden');
            displayUser.innerText = currentUser;
            
            // প্রোফাইল পিকচার সেট করা
            if (userData && userData.profilePic) {
                userPfpNav.style.backgroundImage = `url(${userData.profilePic})`;
                postCreatorAvatar.style.backgroundImage = `url(${userData.profilePic})`;
            }
        } else {
            setTimeout(() => {
                loader.classList.add('hidden');
                authSection.classList.remove('hidden');
            }, 3000);
        }
    };
    checkStatus();

// প্রোফাইল পেজ দেখানোর ফাংশন
window.openProfile = function() {
    const currentUser = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
    
    // মেইন ফিড লুকিয়ে প্রোফাইল দেখানো
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('profile-page').classList.remove('hidden');
    
    // তথ্য সেট করা
    document.getElementById('profile-name-display').innerText = currentUser;
    if (userData && userData.profilePic) {
        document.getElementById('profile-pfp-large').style.backgroundImage = `url(${userData.profilePic})`;
    }
    
    // সাইডবার খোলা থাকলে বন্ধ করে দেওয়া
    document.getElementById('sidebar').classList.remove('active');
};

// প্রোফাইল পেজ বন্ধ করার ফাংশন
window.closeProfilePage = function() {
    document.getElementById('profile-page').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');
};

    // ৩. সাইন-আপ ও লগইন টগল
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        document.getElementById('signup-extra-fields').classList.toggle('hidden');
        authTitle.innerText = isLoginMode ? "NexGen Social" : "Join NexGen";
        submitBtn.innerText = isLoginMode ? "প্রবেশ করুন" : "সাইন আপ ও প্রবেশ করুন";
        toggleAuth.innerText = isLoginMode ? "নতুন তৈরি করুন" : "লগইন করুন";
    });

    // ৪. ফর্ম সাবমিট লজিক
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();

        if (!isLoginMode) {
            const contact = document.getElementById('contact-info').value.trim();
            const picInput = document.getElementById('profile-pic-input');
            
            if (picInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    registerAndLogin(user, pass, contact, event.target.result);
                };
                reader.readAsDataURL(picInput.files[0]);
            } else {
                registerAndLogin(user, pass, contact, "");
            }
        } else {
            const storedData = localStorage.getItem('user_' + user);
            if (storedData) {
                const userData = JSON.parse(storedData);
                if (userData.password === pass) {
                    performLogin(user);
                } else {
                    message.innerText = "ভুল পাসওয়ার্ড!";
                }
            } else {
                message.innerText = "ইউজার পাওয়া যায়নি!";
            }
        }
    });

    function registerAndLogin(user, pass, contact, pic) {
        const userData = { username: user, password: pass, contact: contact, profilePic: pic };
        localStorage.setItem('user_' + user, JSON.stringify(userData));
        performLogin(user); 
    }

    function performLogin(user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', user);
        message.style.color = "#10b981";
        message.innerText = "সফলভাবে প্রবেশ করা হচ্ছে...";
        setTimeout(() => location.reload(), 1000);
    }

    // ৫. মেনু ও লগআউট
    menuIcon.addEventListener('click', () => sidebar.classList.add('active'));
    closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));
    logoutBtnSidebar.addEventListener('click', () => {
        if (confirm("Logout করতে চান?")) {
            localStorage.setItem('isLoggedIn', 'false');
            location.reload();
        }
    });
});