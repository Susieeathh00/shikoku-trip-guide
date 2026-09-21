export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname !== "/index.html") return new Response("Not found", { status: 404 });

    const response = await env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(`<style>
.itinerary-table-wrap{margin-top:16px;overflow-x:auto;border:1px solid var(--line);border-radius:16px;background:var(--paper)}
.itinerary-table{width:100%;border-collapse:collapse;table-layout:fixed;min-width:820px}
.itinerary-table th,.itinerary-table td{border-bottom:1px solid var(--line);padding:9px 10px;vertical-align:top;text-align:left}
.itinerary-table th{font-size:11px;color:var(--muted);font-weight:900;background:#f3ecde;letter-spacing:.06em}
body.night .itinerary-table th{background:#29333d}
.itinerary-table tr:last-child td{border-bottom:0}
.itinerary-table .it-time{width:70px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ink);font-size:13px}
.itinerary-table .it-tool{width:72px;color:var(--muted);font-size:11.5px;font-weight:800;white-space:normal}
.itinerary-table .it-place{width:175px;font-weight:850;font-size:12.5px;line-height:1.45}
.itinerary-table .it-place a{font-weight:850}
.itinerary-table .it-detail{font-size:12.5px;line-height:1.65;color:#4f5a53;word-break:break-word}
body.night .itinerary-table .it-detail{color:#c2cbc7}
.itinerary-table .it-detail b{color:var(--ink)}
.day-source-note{margin:9px 2px 0;color:var(--muted);font-size:10px;line-height:1.55}
@media(max-width:720px){.itinerary-table{min-width:760px}.itinerary-table .it-place{width:155px}.itinerary-table .it-tool{width:64px}.itinerary-table .it-time{width:62px}.itinerary-table th,.itinerary-table td{padding:8px 8px}.itinerary-table .it-detail{font-size:11.5px;line-height:1.6}}
</style>`, {html:true});
        }
      })
      .on("body", {
        element(el) {
          el.append(`<script>
(function(){
  const maps={
    '高松机场':'https://www.google.com/maps/search/?api=1&query=Takamatsu+Airport,+Kagawa,+Japan','栗林公园':'https://www.google.com/maps/search/?api=1&query=Ritsurin+Garden,+Takamatsu,+Kagawa,+Japan','JR高松站':'https://www.google.com/maps/search/?api=1&query=JR+Takamatsu+Station,+Takamatsu,+Kagawa,+Japan','HOTEL LIVEMAX':'https://www.google.com/maps/search/?api=1&query=Hotel+Livemax+Takamatsu+Kagawa+Japan','四国水族馆':'https://www.google.com/maps/search/?api=1&query=Shikoku+Aquarium,+Utazu,+Kagawa,+Japan','JR观音寺站':'https://www.google.com/maps/search/?api=1&query=JR+Kanonji+Station,+Kanonji,+Kagawa,+Japan','JR宇多津站':'https://www.google.com/maps/search/?api=1&query=JR+Utazu+Station,+Utazu,+Kagawa,+Japan','高松站':'https://www.google.com/maps/search/?api=1&query=JR+Takamatsu+Station,+Takamatsu,+Kagawa,+Japan','高屋神社下宫':'https://www.google.com/maps/search/?api=1&query=Takaya+Shrine+Lower+Shrine,+Kanonji,+Kagawa,+Japan','高屋神社本宫':'https://www.google.com/maps/search/?api=1&query=Takaya+Shrine,+Kanonji,+Kagawa,+Japan','今治站':'https://www.google.com/maps/search/?api=1&query=JR+Imabari+Station,+Imabari,+Ehime,+Japan','i.i.imabari! Cycle Station':'https://www.google.com/maps/search/?api=1&query=i.i.imabari!+Cycle+Station,+Imabari,+Ehime,+Japan','瀬戸田観光案内所':'https://www.google.com/maps/search/?api=1&query=Setoda+Tourist+Information+Center,+Onomichi,+Hiroshima,+Japan','瀬戸田PA':'https://www.google.com/maps/search/?api=1&query=Setoda+PA,+Onomichi,+Hiroshima,+Japan','耕三寺站':'https://www.google.com/maps/search/?api=1&query=Kosanji+Temple+Bus+Stop,+Onomichi,+Hiroshima,+Japan','松山':'https://www.google.com/maps/search/?api=1&query=Matsuyama+Station,+Ehime,+Japan','terminal hotel':'https://www.google.com/maps/search/?api=1&query=Terminal+Hotel+Matsuyama,+Matsuyama,+Ehime,+Japan','KOKO HOTEL Takamatsu':'https://www.google.com/maps/search/?api=1&query=KOKO+HOTEL+Takamatsu,+Takamatsu,+Kagawa,+Japan','高松市内':'https://www.google.com/maps/search/?api=1&query=Takamatsu,+Kagawa,+Japan','大步危':'https://www.google.com/maps/search/?api=1&query=Oboke+Station,+Tokushima,+Japan','小步危':'https://www.google.com/maps/search/?api=1&query=Koboke+Station,+Tokushima,+Japan','ひの字渓谷展望所':'https://www.google.com/maps/search/?api=1&query=Hi-no-ji+Valley+Viewpoint,+Tokushima,+Japan','西祖谷そば処':'https://www.google.com/maps/search/?api=1&query=Nishi-Iya+Soba,+Tokushima,+Japan','祖谷かずら橋':'https://www.google.com/maps/search/?api=1&query=Iya+Kazura+Bridge,+Tokushima,+Japan','高松港':'https://www.google.com/maps/search/?api=1&query=Takamatsu+Port,+Takamatsu,+Kagawa,+Japan','男木岛':'https://www.google.com/maps/search/?api=1&query=Ogijima,+Kagawa,+Japan','土庄港':'https://www.google.com/maps/search/?api=1&query=Tonosho+Port,+Shodoshima,+Kagawa,+Japan','小豆岛':'https://www.google.com/maps/search/?api=1&query=Shodoshima,+Kagawa,+Japan','天使之路':'https://www.google.com/maps/search/?api=1&query=Angel+Road,+Shodoshima,+Kagawa,+Japan','福田港':'https://www.google.com/maps/search/?api=1&query=Fukuda+Port,+Shodoshima,+Kagawa,+Japan','姬路港':'https://www.google.com/maps/search/?api=1&query=Himeji+Port,+Himeji,+Hyogo,+Japan','姬路城':'https://www.google.com/maps/search/?api=1&query=Himeji+Castle,+Himeji,+Hyogo,+Japan','圆教寺':'https://www.google.com/maps/search/?api=1&query=Engyoji+Temple,+Himeji,+Hyogo,+Japan','神户':'https://www.google.com/maps/search/?api=1&query=Kobe,+Hyogo,+Japan','摩耶山·掬星台':'https://www.google.com/maps/search/?api=1&query=Maya+Mount+Kikuseidai,+Kobe,+Hyogo,+Japan','神户机场':'https://www.google.com/maps/search/?api=1&query=Kobe+Airport,+Kobe,+Hyogo,+Japan','KIX T1':'https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+1,+Osaka,+Japan'
  };
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
  const linkPlace=name=>maps[name]?'<a class="place-link" target="_blank" rel="noopener" href="'+maps[name]+'">'+esc(name)+'</a>':esc(name);
  const row=(time,tool,place,detail)=>'<tr><td class="it-time">'+esc(time)+'</td><td class="it-tool">'+esc(tool||'—')+'</td><td class="it-place">'+linkPlace(place)+'</td><td class="it-detail">'+detail+'</td></tr>';
  const data={
    day1:[['14:45','步行','高松机场','入境、取票，前往 <b>12号站台</b>。'],['15:45','巴士','高松机场 → 栗林公园','下车站：<b>栗林公園前</b>【16:13】；<b>1000円/人</b>。手提行李下车后步行到门口。'],['16:30','步行','栗林公园','<b>500円/人</b>；<b>东门寄存行李</b>，18:30闭园。具体游览路线现场看图。'],['18:30','巴士','JR高松站','① 先兑换 <b>JR PASS</b>，明天启用。② 去 <b>Sunport Hall 8号平台</b>看香川内海夜景。③ 还可以顺手看 <b>高松梦灯り/高松夜景</b>。'],['—','步行','HOTEL LIVEMAX','去住宿处寄放行李并办理入住。']],
    day2:[['7:40','JR','JR宇多津站 → 水族馆','<b>JR宇多津站【8:17到】</b>；步行楼上按提示前往水族馆入口【约9:15】；时间务必留足。'],['9:00','步行','四国水族馆','<b>【9:00开】2600円/人</b>；目标约2小时，逛完再出发。'],['12:14','JR','JR观音寺站','提前拿井盖卡、短暂停留观音寺；继续接 <b>高屋神社下宫【13:14】</b> 前后的出租车。'],['12:37','出租车','高屋神社下宫','<b>【13:30】前到达</b>；约1小时【15:00】前后徒步登顶，参拜、拍照、看天空鸟居。'],['16:10','出租车','高屋神社本宫','接 <b>sunset shuttle</b> 的出发车下山。'],['16:25','步行','JR观音寺站','在观音寺站休整、游览、领取井盖卡，准备下一段。'],['17:40','JR','观音寺 → 今治','<b>【18:51到】</b>；办理入住、放行李，为第二天骑行补给。'],['—','步行','しまなみ PRIMEHOTEL','距离约 <b>300米</b>。']],
    day3:[['8:30','步行','i.i.imabari! Cycle Station','取车、骑行前先吃早饭；住宿步行约100米可到。'],['9:30–17:00','骑行','しまなみ海道','无敌了！海峡骑行！<b>44km</b>；具体路线与撤退方案看 Tips；目标在 <b>瀬戸田観光案内所</b> 还车。'],['17:21','巴士','耕三寺站','【17:33】到站方向；还车后前往巴士站，接回今治的高速巴士。'],['17:52','巴士','瀬戸田PA','高速巴士：<b>瀬戸田→今治</b>，约 <b>1300円/人</b>；可从 PA 上车，提前候车，继续前往今治。'],['19:48','JR','今治 → 松山','抵达松山后转酒店；为第二天松山行程留出时间。'],['—','住宿','terminal hotel','车站约步行10分，先放行李、吃饭。']],
    day4:[['随时','步行','松山','今天没有专门的固定行程；早上先去松山城，坐缆车/步行上山，逛一下天守阁；下来后去道后温泉附近散步。根据天气灵活调整，不再强塞过多景点。'],['18:39','JR','松山 → 高松','<b>【21:11到】</b>；抵达高松后直接回住宿。'],['—','住宿','KOKO HOTEL Takamatsu','住3晚，继续以高松为基地。']],
    day5:[['随时','JR','高松市内','高松市内行程，比较轻松；适合前一天松山往返后休整。当天结合天气与后续安排调整，提前关注 <b>天使之路潮汐</b>。']],
    day6:[['8:25','JR','高松 → 大步危','确保早班 JR 出发；<b>8:25发车，大步危【9:42到】</b>。'],['10:07','巴士','大步危','JR大步危站到达后换巴士；坐一段当地巴士，按当日站点衔接前往祖谷方向。'],['10:44','步行','ひの字渓谷展望所 / 西祖谷方向','沿途观景、步行约 <b>40min</b>；以看峡谷与山景为主。'],['12:15','巴士','祖谷かずら橋 / 祖谷方向','【回程参考 <b>12:59</b>】；可安排 <b>祖谷かずら橋 550円</b>；不必把路线拉得太深，留出回程余量。'],['14:15','巴士','祖谷 → 大步危','【西祖谷方向巴士】约 <b>34分钟</b>；完成祖谷一带游览后回撤。'],['14:50','步行','大步危峡 / 小步危峡','在大步危、小步危之间散步看峡谷，作为回程前的轻量活动。'],['16:02 / 17:02','JR','大步危 → 高松','可以选择两班回程；回程时间越晚越灵活，可视当天体力与实际衔接决定。'],['—','住宿','KOKO HOTEL Takamatsu','返回一晚住宿。']],
    day7:[['10:00','船','高松港 → 男木岛','<b>【10:40到】</b>；男木岛散步。'],['13:00','船','男木岛 → 高松港','<b>【13:40到】</b>；回高松港换乘下一段。'],['14:20','船','高松港 → 小豆岛','<b>【14:55】上岸</b>；继续岛上交通。'],['16:35','步行','小豆岛','安排岛上轻量活动，按当天实际体力与时间取舍。'],['17:50','步行','国道 / 住宿附近','回住宿、吃饭；晚上不再安排硬性项目。'],['备用','船','高松港 → 男木岛 → 高松港 → 小豆岛','备用船班：<b>08:00→08:40</b>、<b>11:00→11:40</b>；如需压缩男木岛停留，可用这一组。']],
    day8:[['—','步行','天使之路','早上走天使之路看涨落潮；出发前再次核对当天潮汐窗口。'],['—','巴士','福田港','从住宿/岛上交通接着去福田港，预留港口候船时间。'],['—','步行','福田港','在港口等待登船，提前确认当天船班。'],['—','船','姬路港','坐船；本次安排按 <b>13:15–14:55</b> 的姬路方向船班。'],['—','步行','姬路城','下船后安排轻量活动；姬路城正式参观放到第二天，傍晚约 <b>17:00</b> 后步行/转车去住宿。']],
    day9:[['—','步行','圆教寺','上午安排圆教寺，按当日体力与交通衔接游览。'],['—','步行','姬路城','希望不要再绕远路；中午后正式参观姬路城。'],['—','JR','神户','下午前往神户；晚上上摩耶山看夜景，按实际天气与上山交通调整。']],
    day10:[['—','步行','神户市区','上午安排神户市区活动。'],['—','步行','神户','上午路线可结合当天状态轻量调整。'],['—','交通','KIX T1','回程当天以 <b>KIX 17:00 起飞</b> 为绝对硬锚点；提前离开神户前往机场。']]
  };
  document.querySelectorAll('.day[id^="day"]').forEach(day=>{
    const n=Number(day.id.replace('day','')); const rows=data['day'+n]; if(!rows) return;
    const old=day.querySelector('.timeline'); if(!old) return;
    const wrap=document.createElement('div'); wrap.className='itinerary-table-wrap';
    const table=document.createElement('table'); table.className='itinerary-table';
    table.innerHTML='<thead><tr><th>时间</th><th>工具</th><th>地点</th><th>详细说明</th></tr></thead><tbody>'+rows.map(r=>row(r[0],r[1],r[2],r[3])).join('')+'</tbody>';
    wrap.appendChild(table); old.replaceWith(wrap);
    const note=document.createElement('div'); note.className='day-source-note'; note.textContent='已按你的原始行程表整理；地点名称可直接打开 Google Maps。详细说明保留原表中的时间、费用、班次与备注，并在窄屏下自动换行/横向滚动。';
    wrap.parentNode.insertBefore(note,wrap.nextSibling);
    const titles={1:'🛬 高松机场 → 栗林公园 → 高松',2:'🌊 宇多津 → 高屋神社 → 今治',3:'🚲 今治 → しまなみ海道 → 瀬戸田 → 松山',4:'♨️ 松山 → 高松',5:'🏙️ 高松市内',6:'🏞️ 大步危・祖谷',7:'⛴️ 高松港 → 男木岛 → 小豆岛',8:'🚢 小豆岛 → 福田港 → 姬路',9:'🏯 圆教寺 → 姬路城 → 神户',10:'✈️ 神户 → KIX → 香港'};
    const h2=day.querySelector('.dayhead h2'); if(h2 && titles[n]) h2.textContent=titles[n];
  });
})();
</script>`, {html:true});
        }
      })
      .transform(response);
  }
};