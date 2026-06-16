// مصفوفة تحتوي على بيانات وشعارات وتوقيت المباريات الظاهرة في الموقع
const matches = [
    {
        id: 1,
        team1Name: "برشلونة",
        team1Logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_(crest).svg/1200px-FC_Barcelona_(crest).svg.png",
        team2Name: "ريال مدريد",
        team2Logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
        time: "20:00",
        league: "الدوري الإسباني - الجولة 30"
    },
    {
        id: 2,
        team1Name: "مانشستر سيتي",
        team1Logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png",
        team2Name: "ليفربول",
        team2Logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png",
        time: "22:00",
        league: "الدوري الإنجليزي الممتاز"
    },
    {
        id: 3,
        team1Name: "المغرب",
        team1Logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/FRMF_logo.png",
        team2Name: "البرازيل",
        team2Logo: "https://upload.wikimedia.org/wikipedia/commons/9/99/CBF_logo.png",
        time: "مباشر الآن",
        league: "مباراة ودية دولية"
    }
];

// دالة سحب وعرض المباريات وبناء العناصر داخل واجهة الموبايل المستهدفة
function displayMatches() {
    const container = document.getElementById('matchesContainer');
    if (!container) return; // الحماية في حال عدم وجود المربع في الشاشة المفتوحة
    
    container.innerHTML = ""; // تصفير المحتوى القديم

    matches.forEach(match => {
        const cardHtml = `
            <a href="watch.html?id=${match.id}" class="match-card">
                <div class="team">
                    <img src="${match.team1Logo}" alt="${match.team1Name}" class="team-logo">
                    <span class="team-name">${match.team1Name}</span>
                </div>
                
                <div class="match-details">
                    <span class="match-time">${match.time}</span>
                    <span class="league-name">${match.league}</span>
                </div>
                
                <div class="team">
                    <img src="${match.team2Logo}" alt="${match.team2Name}" class="team-logo">
                    <span class="team-name">${match.team2Name}</span>
                </div>
            </a>
        `;
        container.innerHTML += cardHtml;
    });
}

// تنفيذ حقن وتوليد جدول المباريات بمجرد جاهزية مستندات الويب للعمل
document.addEventListener('DOMContentLoaded', displayMatches);
