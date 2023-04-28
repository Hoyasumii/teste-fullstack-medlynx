let navbarItems = document.querySelectorAll('.nav-link');

navbarItems.forEach(item => {
    if (window.location.href.endsWith(item.getAttribute('href'))) {
        item.classList.add('active');
    }
});