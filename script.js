// الرابط الخاص بك مع الـ API Key لجلب المباريات الحية الحقيقية لجميع فرق العالم
const API_URL = "https://api.isportsapi.com/sport/football/livescores?api_key=bM0FDTbtFBDGriGS";

async function fetchLiveMatches() {
    const container = document.getElementById('matchesContainer');
    if (!container) return;

    // شاشة تحميل ذكية ومتحركة أثناء جلب المباريات الحقيقية
    container.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 30px; color: var(--accent-color); margin-bottom: 10px;"></i>
            <br>جاري الاتصال بـ iSportsAPI وجلب جميع مباريات العالم الحية...
        </div>`;

    try {
        // الاتصال بالـ API الحقيقي الخاص بك
        const response = await fetch(API_URL);
        const jsonResult = await response.json();

        // التمكين من قراءة البيانات (تعتمد iSportsAPI على مصفوفة داخل الـ data عادةً)
        const liveMatches = jsonResult.data || jsonResult;

        if (!liveMatches || liveMatches.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);"><i class="fa-regular fa-calendar-times"></i> لا توجد مباريات جارية حالياً في هذه اللحظة.</div>`;
            return;
        }

        container.innerHTML = ""; // تنظيف شاشة التحميل

        // عرض أول 15 مباراة حية ومهمة في العالم لتفادي بطء الشاشة على الهاتف
        liveMatches.slice(0, 15).forEach(match => {
            
            // استخراج البيانات المحددة من السيرفر (أسماء الفرق، الأهداف، البطولات)
            const homeTeam = match.homeName || "فريق مستضيف";
            const awayTeam = match.awayName || "فريق ضيف";
            const homeScore = match.homeScore !== undefined ? match.homeScore : 0;
            const awayScore = match.awayScore !== undefined ? match.awayScore : 0;
            const leagueName = match.leagueName || "بطولة عالمية";
            
            // توليد شعارات فرق ذكية تلقائياً بناءً على معرف الفريق من السيرفر أو علم افتراضي بديل
            const homeLogo = match.homeIcon ? match.homeIcon : `https://flagcdn.com/w160/un.png`;
            const awayLogo = match.awayIcon ? match.awayIcon : `https://flagcdn.com/w160/un.png`;

            // تحديد حالة المباراة المباشرة والوقت الحقيقي (مثلاً: الشوط الأول، الدقيقة 65)
            let matchStatusText = "مباشر الآن";
            if (match.status === 1) matchStatusText = "الشوط 1";
            if (match.status === 2) matchStatusText = "استراحة";
            if (match.status === 3) matchStatusText = "الشوط 2";
            
            const cardHtml = `
                <a href="watch.html?id=${match.matchId || match.id}&home=${encodeURIComponent(homeTeam)}&away=${encodeURIComponent(awayTeam)}" class="match-card" style="border-left: 4px solid #ff3838;">
                    <div class="team">
                        <img src="${homeLogo}" alt="${homeTeam}" class="team-logo" onerror="this.src='https://flagcdn.com/w160/un.png'">
                        <span class="team-name">${homeTeam}</span>
                    </div>
                    
                    <div class="match-details">
                        <span class="match-time" style="background: rgba(255, 56, 56, 0.15); color: #ff3838; border: 1px solid rgba(255, 56, 56, 0.4); font-size: 13px; font-weight: bold; padding: 6px 14px;">
                            ${homeScore} - ${awayScore}
                            <br>
                            <span style="font-size: 10px; font-weight: normal; display: block; margin-top: 2px;"><i class="fa-solid fa-clock"></i> ${matchStatusText}</span>
                        </span>
                        <span class="league-name" style="margin-top: 6px;"><i class="fa-solid fa-trophy" style="color:#ffd700; font-size:10px;"></i> ${leagueName}</span>
                    </div>
                    
                    <div class="team">
                        <img src="${awayLogo}" alt="${awayTeam}" class="team-logo" onerror="this.src='https://flagcdn.com/w160/un.png'">
                        <span class="team-name">${awayTeam}</span>
                    </div>
                </a>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("API Fetch Error:", error);
        container.innerHTML = `
            <div style="text-align:center; padding:30px; color:#ff3838;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:24px;"></i>
                <br><br>السيرفر لا يزال يقوم بتفعيل الـ API Key الجديد الخاص بك...
                <br><span style="font-size:11px; color:var(--text-muted);">تأكد من تفعيل الحساب أو انتظر بضع دقائق ليشتغل تلقائياً.</span>
            </div>`;
    }
}

// بدء التشغيل فور فتح الصفحة
document.addEventListener('DOMContentLoaded', fetchLiveMatches);
