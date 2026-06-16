// الرابط الخاص بك مضافاً إليه السيرفر الوسيط (CORS Proxy) لتخطي حظر المتصفح مجاناً
const PROXY_URL = "https://api.allorigins.win/raw?url=";
const REAL_API_URL = "https://api.isportsapi.com/sport/football/livescores?api_key=bM0FDTbtFBDGriGS";
const FULL_API_URL = PROXY_URL + encodeURIComponent(REAL_API_URL);

async function fetchLiveMatches() {
    const container = document.getElementById('matchesContainer');
    if (!container) return;

    // شاشة تحميل متحركة وأنيقة
    container.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 30px; color: var(--accent-color); margin-bottom: 10px;"></i>
            <br>جاري كسر حماية CORS وجلب مباريات العالم الحية الحقيقية...
        </div>`;

    try {
        // الاتصال عبر السيرفر الوسيط المفتوح
        const response = await fetch(FULL_API_URL);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const jsonResult = await response.json();

        // استخراج مصفوفة المباريات (تأتي عادةً في حقل data في iSportsAPI)
        const liveMatches = jsonResult.data || jsonResult;

        if (!liveMatches || liveMatches.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);"><i class="fa-regular fa-calendar-times"></i> لا توجد مباريات جارية حالياً في هذه اللحظة بالعالم.</div>`;
            return;
        }

        container.innerHTML = ""; // تنظيف شاشة التحميل

        // عرض أول 15 مباراة حية جارية الآن
        liveMatches.slice(0, 15).forEach(match => {
            
            const homeTeam = match.homeName || "فريق مستضيف";
            const awayTeam = match.awayName || "فريق ضيف";
            const homeScore = match.homeScore !== undefined ? match.homeScore : 0;
            const awayScore = match.awayScore !== undefined ? match.awayScore : 0;
            const leagueName = match.leagueName || "بطولة عالمية";
            
            // استخدام أعلام الدول أو شعارات افتراضية ذكية في حال لم يوفر الـ API شعاراً سريعاً
            const homeLogo = match.homeIcon ? match.homeIcon : `https://flagcdn.com/w160/un.png`;
            const awayLogo = match.awayIcon ? match.awayIcon : `https://flagcdn.com/w160/un.png`;

            // تحديد توقيت وحالة الشوط الحالي حياً
            let matchStatusText = "مباشر الآن";
            if (match.status === 1) matchStatusText = "الشوط الأول";
            if (match.status === 2) matchStatusText = "إستراحة";
            if (match.status === 3) matchStatusText = "الشوط الثاني";
            
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
                <br><br>عذراً، الـ API Key المجاني قد يكون في مرحلة المراجعة والتنشيط من موقع iSportsAPI.
                <br><span style="font-size:11px; color:var(--text-muted);">تأكد من تفعيل بريدك الإلكتروني في حساب iSportsAPI الخاص بك ليفتح السيرفر البيانات فوراً.</span>
            </div>`;
    }
}

// بدء التشغيل
document.addEventListener('DOMContentLoaded', fetchLiveMatches);
