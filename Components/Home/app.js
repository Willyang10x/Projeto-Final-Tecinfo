document.addEventListener('DOMContentLoaded', () => {
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    fetch('../Footer/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      });

});

document.addEventListener('DOMContentLoaded', () => {
    let indiceAtual = 0;
    const banners = document.querySelectorAll('.banner');
    const totalBanners = banners.length;
    const wrapperBanner = document.querySelector('.wrapper-banner');

    function mostrarBanner(indice) {
        const deslocamento = -indice * 100;
        wrapperBanner.style.transform = `translateX(${deslocamento}%)`;
    }

    function proximoBanner() {
        indiceAtual = (indiceAtual + 1) % totalBanners;
        mostrarBanner(indiceAtual);
    }

    mostrarBanner(indiceAtual);
    setInterval(proximoBanner, 3000);
});

