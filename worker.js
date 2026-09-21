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
.itinerary-table{width:100%;border-collapse:collapse;table-layout:fixed;min-width:760px}
.itinerary-table th,.itinerary-table td{border-bottom:1px solid var(--line);padding:10px 10px;vertical-align:top;text-align:left}
.itinerary-table th{font-size:11px;color:var(--muted);font-weight:900;background:#f3ecde;letter-spacing:.06em}
body.night .itinerary-table th{background:#29333d}
.itinerary-table tr:last-child td{border-bottom:0}
.itinerary-table .it-time{width:74px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ink)}
.itinerary-table .it-tool{width:78px;color:var(--muted);font-size:12px;font-weight:800;white-space:normal}
.itinerary-table .it-place{width:185px;font-weight:850}
.itinerary-table .it-place a{font-weight:850}
.itinerary-table .it-detail{font-size:13px;line-height:1.65;color:#4f5a53}
body.night .itinerary-table .it-detail{color:#c2cbc7}
.itinerary-table .it-detail b{color:var(--ink)}
.day-source-note{margin:9px 2px 0;color:var(--muted);font-size:10px;line-height:1.55}
@media(max-width:720px){.itinerary-table{min-width:680px}.itinerary-table .it-place{width:155px}.itinerary-table .it-tool{width:68px}.itinerary-table .it-time{width:64px}.itinerary-table th,.itinerary-table td{padding:8px}}
</style>`, {html:true});
        }
      })
      .on("body", {
        element(el) {
          el.append(`<script>
(function(){
  const maps={
    '高松机场':'https://www.google.com/maps/search/?api=1&query=Takamatsu+Airport,+Kagawa,+Japan','栗林公园':'https://www.google.com/maps/search/?api=1&query=Ritsurin+Garden,+Takamatsu,+Kagawa,+Japan','JR高松站':'https://www.google.com/maps/search/?api=1&query=JR+Takamatsu+Station,+Takamatsu,+Kagawa,+Japan','HOTEL LIVEMAX':'https://www.google.com/maps/search/?api=1&query=Hotel+Livemax+Takamatsu+Kagawa+Japan','四国水族馆':'https://www.google.com/maps/search/?api=1&query=Shikoku+Aquarium,+Utazu,+Kagawa,+Japan','JR观音寺站':'https://www.google.com/maps/search/?api=1&query=JR+Kanonji+Station,+Kanonji,+Kagawa,+Japan','高屋神社下宫':'https://www.google.com/maps/search/?api=1&query=Takaya+Shrine+Lower+Shrine,+Kanonji,+Kagawa,+Japan','高屋神社本宫':'https://www.google.com/maps/search/?api=1&query=Takaya+Shrine,+Kanonji,+Kagawa,+Japan','今治站':'https://www.google.com/maps/search/?api=1&query=JR+Imabari+Station,+Imabari,+Ehime,+Japan','i.i.imabari! Cycle Station':'https://www.google.com/maps/search/?api=1&query=i.i.imabari!+Cycle+Station,+Imabari,+Ehime,+Japan','瀬戸田観光案内所':'https://www.google.com/maps/search/?api=1&query=Setoda+Tourist+Information+Center,+Onomichi,+Hiroshima,+Japan','瀬戸田PA':'https://www.google.com/maps/search/?api=1&query=Setoda+PA,+Onomichi,+Hiroshima,+Japan','松山':'https://www.google.com/maps/search/?api=1&query=Matsuyama+Station,+Ehime,+Japan','terminal hotel':'https://www.google.com/maps/search/?api=1&query=Terminal+Hotel+Matsuyama,+Matsuyama,+Ehime,+Japan','KOKO HOTEL Takamatsu':'https://www.google.com/maps/search/?api=1&query=KOKO+HOTEL+Takamatsu,+Takamatsu,+Kagawa,+Japan','高松市内':'https://www.google.com/maps/search/?api=1&query=Takamatsu,+Kagawa,+Japan','大步危':'https://www.google.com/maps/search/?api=1&query=Oboke+Station,+Tokushima,+Japan','ひの字渓谷展望所':'https://www.google.com/maps/search/?api=1&query=Hi-no-ji+Valley+Viewpoint,+Tokushima,+Japan','西祖谷そば処':'https://www.google.com/maps/search/?api=1&query=Nishi-Iya+Soba,+Tokushima,+Japan','祖谷かずら橋':'https://www.google.com/maps/search/?api=1&query=Iya+Kazura+Bridge,+Tokushima,+Japan','高松港':'https://www.google.com/maps/search/?api=1&query=Takamatsu+Port,+Takamatsu,+Kagawa,+Japan','男木岛':'https://www.google.com/maps/search/?api=1&query=Ogijima,+Kagawa,+Japan','土庄港':'https://www.google.com/maps/search/?api=1&query=Tonosho+Port,+Shodoshima,+Kagawa,+Japan','小豆岛':'https://www.google.com/maps/search/?api=1&query=Shodoshima,+Kagawa,+Japan','天使之路':'https://www.google.com/maps/search/?api=1&query=Angel+Road,+Shodoshima,+Kagawa,+Japan','福田港':'https://www.google.com/maps/search/?api=1&query=Fukuda+Port,+Shodoshima,+Kagawa,+Japan','姬路港':'https://www.google.com/maps/search/?api=1&query=Himeji+Port,+Himeji,+Hyogo,+Japan','姬路城':'https://www.google.com/maps/search/?api=1&query=Himeji+Castle,+Himeji,+Hyogo,+Japan','圆教寺':'https://www.google.com/maps/search/?api=1&query=Engyoji+Temple,+Himeji,+Hyogo,+Japan','神户':'https://www.google.com/maps/search/?api=1&query=Kobe,+Hyogo,+Japan','摩耶山·掬星台':'https://www.google.com/maps/search/?api=1&query=Maya+Mount+Kikuseidai,+Kobe,+Hyogo,+Japan','神户机场':'https://www.google.com/maps/search/?api=1&query=Kobe+Airport,+Kobe,+Hyogo,+Japan','KIX T1':'https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+1,+Osaka,+Japan'
  };
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
  const linkPlace=name=>maps[name]?'<a class="place-link" target="_blank" rel="noopener" href="'+maps[name]+'">'+esc(name)+'</a>':esc(name);
  const row=(time,tool,place,detail)=>'<tr><td class="it-time">'+esc(time)+'</td><td class="it-tool">'+esc(tool||'—')+'</td><td class="it-place">'+linkPlace(place)+'</td><td class="it-detail">'+detail+'</td></tr>';
  const data={
    day1:[['14:45','步行','高松机场','入境、取票。前往 <b>12号发车台</b>。'],['15:45','巴士','栗林公园','下车站：<b>栗林公園前</b>【16:13】；<b>1000円/人</b>。机场利木津巴士直接到公园附近。'],['16:30','步行','栗林公园','<b>500円/人</b>；<b>东门寄行李</b>，18:30闭园。具体游览路线现场看图。'],['18:30','巴士','JR高松站','① 先兑换 <b>JR PASS</b>，明天启用；② 去 <b>Sunport Hall</b> 8号等看香川内海夜景 / 休息；③ 可以顺手看高松夜景。'],['—','步行','HOTEL LIVEMAX','去住宿处寄放行李并办理入住。']],
    day2:[['7:40','JR','JR宇多津站 → 水族馆','<b>JR宇多津站【8:17到】</b>；步行楼上按提示前往水族馆，留出约10分钟找入口。'],['9:00','步行','四国水族馆','【9:00开】；<b>2600円/人</b>；目标约2小时，走完再出发。'],['12:14','JR','JR观音寺站','提前拿卡、短暂停留观音寺；<b>高屋神社下宫【13:14】</b>前后考虑出租车。'],['12:37','出租车','高屋神社下宫','【13:30】前到；下宫 → 本宫徒步约50分钟；路线有较陡石阶。'],['16:10','出租车','高屋神社本宫','接 <b>sunset shuttle</b> 的出发档下山。'],['16:25','步行','JR观音寺站','在观音寺站休整、寄存 / 取行李，准备下一段。'],['17:40','JR','观音寺 → 今治','【18:51到】；今晚入住，准备第二天骑行。'],['—','步行','今治住宿','<b>3000円</b>。']],
    day3:[['8:30','步行','i.i.imabari! Cycle Station','取车：电助力 + 城市车；先在站前补给。住宿步行约100米可到。'],['9:30','骑行','しまなみ海道','正式出发；目标约 <b>44km</b>。具体路线按骑行体力调整，保留撤退方案。'],['17:00','骑行','瀬戸田観光案内所','目标还车 / 抵达瀬戸田；<b>需要在17:00前后完成衔接</b>，再走观光案内所→巴士。'],['17:21','巴士','耕三寺站','先看巴士站；<b>17:33</b> 到站方向用于回今治。'],['17:52','巴士','瀬戸田PA','高速巴士：<b>瀬戸田→今治</b>，约 <b>1300円/人</b>；可从PA上车，继续前往今治。'],['19:48','JR','今治 → 松山','抵达松山后转酒店；注意后续市内交通。'],['—','住宿','terminal hotel','今晚住这里；先放行李、吃饭。']],
    day4:[['随时','步行','松山','今天没有专门安排的行程；早上先去松山城，再一下散步上山。可以按天气调整。'],['18:39','JR','松山 → 高松','【21:11到】；到高松后前往住宿。'],['—','住宿','KOKO HOTEL Takamatsu','住3晚，继续以高松为基地。']],
    day5:[['随时','JR','高松市内','高松市内行程。比较轻松，适合在前一天的安排后休整；晚上按天使之路潮汐 / 后续船班调整。']],
    day6:[['8:25','JR','高松站 → 大步危','确保按早班 JR 出发；<b>大步危【9:42到】</b>。'],['10:07','巴士','大步危','JR大步危站到达后换巴士；此段按当地巴士时间衔接。'],['10:44','步行','ひの字渓谷展望所 / 西祖谷方面','沿途观景约 <b>40min</b>；继续往祖谷方向。'],['12:15','巴士','祖谷系景点','【回程参考 12:59】；安排祖谷区域景点。'],['14:15','巴士','祖谷方向 → 大步危','【巴士参考】；完成祖谷一带游览后回撤。'],['14:50','步行','大步危 / 小步危','在大步危、小步危之间散步看峡谷。'],['16:02 / 17:02','JR','大步危 → 高松','可以选择两班回程；回程班次越晚越灵活，但以当天实际衔接为准。'],['—','住宿','KOKO HOTEL Takamatsu','返回一晚住宿。']],
    day7:[['10:00','船','高松港 → 男木岛','【10:40到】；男木岛散步。'],['13:00','船','男木岛 → 高松港','【13:40到】；回高松港换乘下一段。'],['14:20','船','高松港 → 小豆岛','【14:55】上岸；转岛上交通。'],['16:35','步行','小豆岛','安排岛上轻量活动。'],['17:50','步行','国道 / 住宿附近','回住宿、吃饭。']],
    day8:[['—','步行','天使之路','早上走天使之路看涨落潮。'],['—','巴士','小豆岛 → 福田港','接着坐车去福田港。'],['—','步行','福田港','在港口等待登船。'],['—','船','福田港 → 姬路港','坐船；图中标注 <b>13:15–14:55</b>，姬路方向。'],['—','步行','姬路','下午下船后安排轻量活动，<b>17:00</b>左右步行 / 前往住宿。']],
    day9:[['—','步行','圆教寺','上午圆教寺。'],['—','步行','姬路城','希望不要再绕远路；正式参观姬路城。'],['—','JR','姬路 → 神户','去神户，晚上上摩耶山看夜景。']],
    day10:[['—','步行','神户市区','上午安排神户市区活动。'],['—','步行','北野 / 神户景点','上网查看当天可行路线；不要为了景点影响机场时间。'],['—','交通','神户 → 神户机场 → KIX','回程航班当天以 KIX 17:00 为绝对硬锚点。']]
  };

  document.querySelectorAll('.day[id^="day"]').forEach(day=>{
    const n=Number(day.id.replace('day',''));
    const rows=data['day'+n];
    if(!rows) return;
    const old=day.querySelector('.timeline');
    if(!old) return;
    const wrap=document.createElement('div'); wrap.className='itinerary-table-wrap';
    const table=document.createElement('table'); table.className='itinerary-table';
    table.innerHTML='<thead><tr><th>时间</th><th>工具</th><th>地点</th><th>详细说明</th></tr></thead><tbody>'+rows.map(r=>row(r[0],r[1],r[2],r[3])).join('')+'</tbody>';
    wrap.appendChild(table); old.replaceWith(wrap);
    const note=document.createElement('div'); note.className='day-source-note'; note.textContent='已按你的原始行程表整理；地点名称可直接打开 Google Maps。详细说明尽量保留原表中的时间、费用、班次与备注。';
    wrap.parentNode.insertBefore(note,wrap.nextSibling);
  });
})();
</script>`, {html:true});
        }
      })
      .transform(response);
  }
};