document.addEventListener('DOMContentLoaded', () => {
    fetch('/Components/Header/header.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-placeholder').innerHTML = data;

                    // Adiciona a funcionalidade de busca ao carregar o header
                    const script = document.createElement('script');
                    script.src = '/Components/Header/search.js';
                    document.body.appendChild(script);
                });

    fetch('../Footer/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      });

});