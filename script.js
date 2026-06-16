// رابط السيرفر المفتوح لجلب الأنميات الأكثر شهرة تلقائياً
const ANIME_API_URL = "https://api.jikan.moe/v4/top/anime";

async function fetchGlobalAnime() {
    const container = document.getElementById('animeContainer');
    if (!container) return;

    // شاشة تحميل متحركة وأنيقة لحين جلب البيانات
    container.innerHTML = `
        <div style="text-align:center; grid-column: 1 / -1; padding:40px; color:#8a99ad;">
            <div class="spinner" style="border: 4px solid rgba(255, 71, 87, 0.1); border-left-color: #ff4757; border-radius: 50%; width: 30px; height: 30px; margin: 0 auto 10px auto; animation: spin 1s linear infinite;"></div>
            جاري جلب أحدث وأقوى الأنميات في العالم تلقائياً...
        </div>`;

    try {
        // الاتصال بالسيرفر وجلب البيانات
        const response = await fetch(ANIME_API_URL);
        const jsonResult = await response.json();
        const animeList = jsonResult.data;

        if (!animeList || animeList.length === 0) {
            container.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; color:#8a99ad;">لم يتم العثور على أنميات حالياً.</div>`;
            return;
        }

        container.innerHTML = ""; // تنظيف شاشة التحميل

        // عرض الأنميات المجلوبة داخل الواجهة تلقائياً
        animeList.forEach(anime => {
            // جلب الاسم العربي أو الإنجليزي الافتراضي
            const animeTitle = anime.title_japanese || anime.title;
            const animeImage = anime.images.jpg.image_url;
            const score = anime.score ? `⭐ ${anime.score}` : "⭐ N/A";
            
            // رابط صفحة الأنمي الرسمية أو يمكنك توجيهه لصفحة مشغل خاصة بك
            const detailsUrl = anime.url; 

            const cardHtml = `
                <a href="${detailsUrl}" class="anime-card" target="_blank" style="position: relative;">
                    <span style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.8); color: #ffd700; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${score}</span>
                    <img src="${animeImage}" alt="${animeTitle}" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
                    <h3 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${animeTitle}</h3>
                </a>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Anime Fetch Error:", error);
        container.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; color:#ff4757;">فشل جلب الأنميات تلقائياً، يرجى تحديث الصفحة.</div>`;
    }
}

// إضافة ستايل حركة الدوران لشاشة التحميل برمجياً
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// تشغيل السكربت فور فتح الموقع
document.addEventListener('DOMContentLoaded', fetchGlobalAnime);
