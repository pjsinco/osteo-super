//$(document).ready(function() {
//  $('#super').on('load', function(evt) {
//    console.log('okimagerloaded');
//    $('.super-fig__fig').css('opacity', 1);
//  });
//});
(function() {
    const superImage = document.getElementById('superImage');
    //if (superImage) {
    //superImage.addEventListener('load', function(evt) {
    //console.log('okimageloaded');
    //});
    //}
    document.addEventListener('DOMContentLoaded', function() {
        const superToReveal = document.getElementById('superFigFig');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(superToReveal);
        function handleIntersect(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) entry.target.classList.add('on');
            });
            document.getElementById('superFig').classList.add('loaded');
        }
    }, false);
})();

//# sourceMappingURL=index.c36f364e.js.map
