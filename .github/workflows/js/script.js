document.addEventListener('DOMContentLoaded', () => {
    const mangaDataUrl = '/data/manga-data.json'; // Шлях до JSON файлу з даними

    fetch(mangaDataUrl)
        .then(response => response.json())
        .then(mangaList => {
            populateHomePage(mangaList);
            populateCatalogPage(mangaList);
            populateWorkDetailPage(mangaList);
        })
        .catch(error => console.error('Error fetching manga data:', error));

    function createBookItemHTML(manga) {
        return `
            <div class="book-item">
                <a href="work-page.html?title=${encodeURIComponent(manga.Title)}">
                    <img src="${manga.CoverImage}" alt="${manga.Title} Cover" class="cover-image">
                    <h3>${manga.Title}</h3>
                    <p>${manga.Author}</p>
                </a>
            </div>
        `;
    }

    function populateHomePage(mangaData) {
        const nowReadingCarousel = document.querySelector('.now-reading .book-carousel');
        const forYouCarousel = document.querySelector('.for-you .book-carousel');
        const allBooksPreviewGrid = document.querySelector('.all-books-preview .book-grid');

        if (nowReadingCarousel) {
            const nowReadingManga = mangaData.filter(manga => manga.NowReading === true).slice(0, 5);
            let carouselHTML = '';
            nowReadingManga.forEach(manga => {
                carouselHTML += createBookItemHTML(manga);
            });
            nowReadingCarousel.innerHTML = carouselHTML;
        }

        if (forYouCarousel) {
            const featuredManga = mangaData.filter(manga => manga.Featured === true).slice(0, 5);
             let carouselHTML = '';
            featuredManga.forEach(manga => {
                carouselHTML += createBookItemHTML(manga);
            });
            forYouCarousel.innerHTML = carouselHTML;
        }

        if (allBooksPreviewGrid) {
            const previewManga = mangaData.slice(0, 8);
            let gridHTML = '';
            previewManga.forEach(manga => {
                gridHTML += createBookItemHTML(manga);
            });
            allBooksPreviewGrid.innerHTML = gridHTML;
        }
    }

    function populateCatalogPage(mangaData) {
        const catalogGrid = document.querySelector('.catalog-page .book-grid');
        if (catalogGrid) {
            let gridHTML = '';
            mangaData.forEach(manga => {
                gridHTML += createBookItemHTML(manga);
            });
            catalogGrid.innerHTML = gridHTML;
        }
    }


    function populateWorkDetailPage(mangaData) {
        const workDetailPage = document.querySelector('.work-detail-page main');
        if (!workDetailPage) return;

        const urlParams = new URLSearchParams(window.location.search);
        const mangaTitle = urlParams.get('title');
        if (!mangaTitle) return;

        const manga = mangaData.find(item => item.Title === mangaTitle);
        if (!manga) return;

        workDetailPage.querySelector('h1').textContent = manga.Title;
        workDetailPage.querySelector('.large-cover').src = manga.CoverImage;
        workDetailPage.querySelector('.large-cover').alt = manga.Title + ' Cover';
        workDetailPage.querySelector('.synopsis').textContent = manga.Synopsis;

        const chapterListUL = workDetailPage.querySelector('.chapter-list ul');
        if (manga.ChapterList) {
            const chapters = manga.ChapterList; // ChapterList тепер масив об'єктів
            let chapterListHTML = '';
            chapters.forEach(chapter => {
                chapterListHTML += `<li><a href="chapter-page.html?title=${encodeURIComponent(manga.Title)}&chapter=${encodeURIComponent(chapter.title)}">${chapter.title}</a></li>`; // Використовуємо chapter.title для назви розділу
            });
            chapterListUL.innerHTML = chapterListHTML;
        }
    }

});