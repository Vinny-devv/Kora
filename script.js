// التوكن والرابط الجديد الذي جلبته للدول والدوريات
const API_TOKEN = "lvnUVJP5tqFRD2x3F2QKgyVeDeNcTzQ0bGr6JBb7FXEtrrAStfxPK0LaSN7W";
const PROXY = "https://api.allorigins.win/raw?url=";
const COUNTRIES_URL = `https://cricket.sportmonks.com/api/v2.0/countries?api_token=${API_TOKEN}&include=leagues,continent`;

const FULL_URL = PROXY + encodeURIComponent(COUNTRIES_URL);

async function fetchCountriesAndLeagues() {
    const container = document.getElementById('matchesContainer');
    if (!container) return;

    // شاشة تحميل أنيقة متوافقة مع الثيم المظلم
    container.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 30px; color: var(--accent-color); margin-bottom: 10px;"></i>
            <br>جاري جلب الدول والبطولات المتوفرة من حسابك...
        </div>`;

    try {
        const response = await fetch(FULL_URL);
        if (!response.ok) throw new Error('Network response error');
        
        const jsonResult = await response.json();
        const countries = jsonResult.data;

        if (!countries || countries.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">لا توجد بيانات دول أو دوريات متوفرة حالياً.</div>`;
            return;
        }

        container.innerHTML = ""; // تنظيف شاشة التحميل

        // المرور على الدول المجلوبة لعرضها وعرض دورياتها
        countries.forEach(country => {
            // جلب الدوريات التابعة للدولة إن وجدت، وإلا نضع تنبيه بعدم وجود دوريات نشطة
            const leagues = country.leagues && country.leagues.data ? country.leagues.data : [];
            let leaguesListHtml = "";

            if (leagues.length > 0) {
                leagues.forEach(league => {
                    leaguesListHtml += `
                        <div style="background: #1e2635; padding: 10px; border-radius: 6px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; border-right: 3px solid var(--accent-color);">
                            <span style="font-size: 13px; font-weight: bold; color: #fff;"><i class="fa-solid fa-trophy" style="color: #ffd700; margin-left: 6px;"></i> ${league.name}</span>
                            <span style="font-size: 11px; color: var(--text-muted);">معرف: ${league.id}</span>
                        </div>
                    `;
                });
            } else {
                leaguesListHtml = `<div style="font-size: 11px; color: var(--text-muted); margin-top: 8px; padding-right: 10px;"><i class="fa-solid fa-info-circle"></i> لا توجد دوريات نشطة مضافة حالياً تحت هذه الدولة.</div>`;
            }

            // اسم القارة التابعة لها الدولة
            const continentName = country.continent && country.continent.data ? country.continent.data.name : "غير محدد";

            // بناء بطاقة الدولة والدوريات التابعة لها
            const cardHtml = `
                <div class="match-card" style="flex-direction: column; align-items: flex-start; gap: 10px; border-left: 4px solid var(--accent-color); padding: 18px; text-decoration: none; cursor: default;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; border-bottom: 1px solid #1e2635; padding-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-earth-americas" style="color: var(--accent-color); font-size: 18px;"></i>
                            <span style="font-size: 16px; font-weight: 700; color: #fff;">${country.name}</span>
                        </div>
                        <span style="font-size: 11px; background: rgba(0, 255, 117, 0.1); color: var(--accent-color); padding: 3px 8px; border-radius: 4px;">
                            <i class="fa-solid fa-map-marker-alt"></i> ${continentName}
                        </span>
                    </div>
                    
                    <div style="width: 100%; margin-top: 5px;">
                        <span style="font-size: 12px; color: var(--text-muted); font-weight: bold;"><i class="fa-solid fa-list-ul"></i> الدوريات والمسابقات المتوفرة:</span>
                        <div style="display: flex; flex-direction: column; gap: 2px;">
                            ${leaguesListHtml}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `
            <div style="text-align:center; padding:30px; color:#ff3838;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:24px;"></i>
                <br><br>فشل الاتصال بـ Sportmonks. تأكد من صحة رابط الـ API أو صلاحيات التوكن الخاص بك.
            </div>`;
    }
}

// تشغيل السكربت فور جاهزية الصفحة
document.addEventListener('DOMContentLoaded', fetchCountriesAndLeagues);
