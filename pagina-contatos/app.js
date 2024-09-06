document.addEventListener('DOMContentLoaded', () => {
    fetch('../Footer/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      });

});