document.addEventListener('DOMContentLoaded', () => {
    const mangaDataUrl = '/data/manga-data.json';

    const chapterTitleElement = document.getElementById('chapter-title');
    const chapterContentElement = document.getElementById('chapter-content');
    const prevChapterLink = document.getElementById('prev-chapter-link');
    const nextChapterLink = document.getElementById('next-chapter-link');

    let mangaList = []; // Зберігаємо дані манги тут
    let currentManga = null;
    let currentChapterName = null;
    let currentChapterIndex = -1;

    // 1. Завантаження даних манги
    function loadMangaDataAndChapter() {
        fetch(mangaDataUrl)
            .then(response => response.json())
            .then(data => {
                mangaList = data; // Зберігаємо дані манги
                loadChapterContent(); // Завантажуємо контент розділу після завантаження даних манги
            })
            .catch(error => console.error('Error fetching manga data:', error));
    }

    // 2. Завантаження контенту розділу
     function loadChapterContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const mangaTitle = urlParams.get('title');
        currentChapterName = urlParams.get('chapter');

        if (!mangaTitle || !currentChapterName) {
            chapterContentElement.innerHTML = '<p>Error: Manga Title or Chapter not specified.</p>';
            return;
        }

        currentManga = mangaList.find(manga => manga.Title === mangaTitle);
        if (!currentManga) {
            chapterContentElement.innerHTML = '<p>Error: Manga not found.</p>';
            return;
        }

        chapterTitleElement.textContent = `${currentManga.Title} - ${currentChapterName}`;

        currentChapterIndex = -1;
        for (let i = 0; i < currentManga.ChapterList.length; i++) { // Знаходимо індекс розділу за назвою
            if (currentManga.ChapterList[i].title === currentChapterName) {
                currentChapterIndex = i;
                break;
            }
        }


        if (currentChapterIndex === -1) {
            chapterContentElement.innerHTML = '<p>Error: Chapter not found.</p>';
            return;
        }

        const chapter = currentManga.ChapterList[currentChapterIndex]; // Отримуємо об'єкт розділу

        // **Відображення контенту розділу на основі типу контенту (текст або зображення)**
        if (Array.isArray(chapter.content) && chapter.content.every(item => item.startsWith('http'))) { // Перевірка, чи контент - масив URL-ів зображень
            displayMangaChapterContent(chapter.content); // Передаємо масив URL-ів зображень
        } else {
            displayTextChapterContent(chapter.content.join('\n')); // Якщо не масив URL-ів, вважаємо текстом (з'єднуємо рядки назад в текст)
        }


        updateNavigationLinks();
    }

    // 3. Функція для відображення контенту манги (зображення) - оновлено для прийому масиву URL-ів
    function displayMangaChapterContent(imageUrls) {
        let chapterHTML = '';
        imageUrls.forEach(imageUrl => {
            chapterHTML += `<img src="${imageUrl}" alt="Page of ${currentManga.Title} - ${currentChapterName}">`;
        });
        chapterContentElement.innerHTML = chapterHTML;
    }

    // 4. Функція для відображення текстового контенту роману - оновлено для прийому текстового контенту
    function displayTextChapterContent(textContent) {
        chapterContentElement.innerHTML = `<div class="chapter-text">${textContent}</div>`;
    }
    // 5. Оновлення посилань навігації "Previous" та "Next"
    function updateNavigationLinks() {
        const prevChapterName = (currentChapterIndex > 0) ? currentManga.ChapterList[currentChapterIndex - 1] : null;
        const nextChapterName = (currentChapterIndex < currentManga.ChapterList.length - 1) ? currentManga.ChapterList[currentChapterIndex + 1] : null;

        prevChapterLink.style.display = prevChapterName ? 'inline-block' : 'none'; // Показуємо/ховаємо кнопку "Previous"
        nextChapterLink.style.display = nextChapterName ? 'inline-block' : 'none'; // Показуємо/ховаємо кнопку "Next"

        if (prevChapterName) {
            prevChapterLink.href = `chapter-page.html?title=${encodeURIComponent(currentManga.Title)}&chapter=${encodeURIComponent(prevChapterName)}`;
            prevChapterLink.textContent = `Previous Chapter (${prevChapterName})`;
        }
        if (nextChapterName) {
            nextChapterLink.href = `chapter-page.html?title=${encodeURIComponent(currentManga.Title)}&chapter=${encodeURIComponent(nextChapterName)}`;
            nextChapterLink.textContent = `Next Chapter (${nextChapterName})`;
        }
    }

    loadMangaDataAndChapter(); // Завантажуємо дані та контент при завантаженні сторінки
});