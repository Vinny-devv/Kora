const ANIME_API_URL = "https://api.jikan.moe/v4/top/anime";

async function fetchGlobalAnime() {
    const container = document.getElementById('animeContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align:center; grid-column: 1 / -1; padding:40px; color:#8a99ad;">
            <div class="spinner" style="border: 4px solid rgba(255, 71, 87, 0.1); border-left-color: #ff4757; border-radius: 50%; width: 30px; height: 30px; margin: 0 auto 10px auto; animation: spin 1s linear infinite;"></div>
            جاري جلب مكتبة الأنمي تلقائياً...
        </div>`;

    try {
        const response = await fetch(ANIME_API_URL);
        const jsonResult = await response.json();
        const animeList = jsonResult.data;

        if (!animeList || animeList.length === 0) {
            container.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; color:#8a99ad;">لم يتم العثور على أنميات.</div>`;
            return;
        }

        container.innerHTML = ""; 

        animeList.forEach(anime => {
            const animeTitle = anime.title_english || anime.title;
            const animeImage = anime.images.jpg.image_url;
            const score = anime.score ? `⭐ ${anime.score}` : "⭐ N/A";
            
            // التعديل السحري: نقل الزائر لصفحتك الداخلية watch.html مع إرسال الـ ID والاسم والصورة
            const localWatchUrl = `watch.html?id=${anime.mal_id}&title=${encodeURIComponent(animeTitle)}&img=${encodeURIComponent(animeImage)}`; 

            const cardHtml = `
                <a href="${localWatchUrl}" class="anime-card" style="position: relative;">
                    <span style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.8); color: #ffd700; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${score}</span>
                    <img src="${animeImage}" alt="${animeTitle}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
                    <h3 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size:12px; padding:6px;">${animeTitle}</h3>
                </a>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Anime Fetch Error:", error);
        container.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; color:#ff4757;">حدث خطأ أثناء جلب الأنمي.</div>`;
    }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', fetchGlobalAnime);
