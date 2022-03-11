var khTravelDataArray = khTravelData.data.XML_Head.Infos.Info;
var weatherLocation = weatherData.cwbopendata.dataset.locations.location;
var weatherLocationLen = weatherLocation.length;
var khDataLen = khTravelDataArray.length;
var areaTemp = [];
var randomAreaTemp = []
var formBox = document.querySelector('.form');
var boxContainer = document.querySelector('.boxcontainer');
var boxContainerBody = document.querySelector('.boxcontainer .body');
var boxContainerFoot = document.querySelector('.boxcontainer .foot');
var scenicKHItem = document.querySelector('.scenic').querySelectorAll('.scenic_item');
var scenicItem = document.querySelector('.scenic');
var newItem = document.querySelector('.newItem')
var navArea = document.querySelector('.navArea');
var popularAreas = document.querySelector('.hotItem .box');
var pageBox = document.querySelector('.pagebox');
var pagePre = document.querySelector('.page_pre');
var pageNext = document.querySelector('.page_next');
var pageBoxNum = document.querySelector('.page_num');
var pageItem = document.querySelector('.page_num').querySelectorAll('li');
var KHtravel = document.querySelector('.KH_travel');
var pagesAll = [];
var weatherBox = document.querySelector('.weather')
// [變數]顯示的筆數
var pageitem = 8;
// [變數]顯示頁
var pagnum = 1;
// [變數]前後頁暫存的顯示頁
var currentPage = 1;
var popularAreaArray =[]


// nav展開
var navExpand = document.querySelector('.nav').querySelectorAll('.item');
var navExpandLen = navExpand.length;
toggleExpand(navExpand[0]);
for (var i = 0; i < navExpandLen; i++) {
	navExpand[i].addEventListener('click', function(e) {
		e.preventDefault();
		toggleExpand(this);
		
	});
};

function toggleExpand(activePanel) {
	for (var i = 0; i < navExpandLen; i++) {
		// 當資料點擊A回傳的時候
		if(navExpand[i] == activePanel){
			navExpand[i].classList.toggle("actived")
			if(navExpand[i].childNodes[3] == null){
			}
			else if(navExpand[i].childNodes[3] !== "actived"){
				navExpand[i].children[1].classList.toggle("expand");
			}
		}
		// 當非資料本身 及 有收合box的時候
		else if(navExpand[i] !== activePanel && navExpand[i].childNodes.length>3){
			navExpand[i].children[1].classList.remove("expand");
			navExpand[i].classList.remove("actived");
		}
		// 當非資料A本身
		else{
			navExpand[i].classList.remove("actived");
		}
	}
}

//區域篩選
function areaFilter () {
	// 回傳printData印出所有資料
	// areaTemp = khTravelDataArray;
	
	// 區域篩選
	var areafilter = [];
	for (var i = 0; i < khDataLen; i++) {
		// console.log(area)
		var area = khTravelDataArray[i].Add.substr(6,3);
		if(area.charAt(2) !== '區'){
			area = area + '區';
			
		}
		// Class1
		// if(khTravelDataArray[i].Class1 == 6){
		// 	console.log(khTravelDataArray[i].Name + khTravelDataArray[i].Class1)
		// }

		// 將篩選的資料推上陣列
		areafilter.push(area);
		// 新增資料回陣列
		khTravelDataArray[i]['Area'] = area;
		
		// [ES6刪除重複項目]
		// var areaArray = [...new Set(areafilter)];

		// [js Array.filter() 陣列中刪除重複的內容]
		var areaArray = areafilter.filter(function(ele , pos){
			return areafilter.indexOf(ele) == pos;
		})
		
	}
	var printArea = '';
	// 當篩選的區域沒有資料
	if(areafilter.length == 0){
		navArea.innerHTML = `<li class="nodata">無資料</li>`;
		boxContainer.innerHTML = `<div class="scenic_warp">無資料</div>`;
	// 當篩選的區域有資料
	}else {
		for(var i = 0;i < areaArray.length; i++){
			printArea += `<li><a href="#">${areaArray[i]}</a></li>`;
		}
		navArea.innerHTML = printArea;
		for(var i = 0;i < areaArray.length; i++){
			popularAreaArray.push({area:areaArray[i],frequency:0})
		}
	}
	
	
}
areaFilter();

newItem.addEventListener('click', newKH, false);

//TODO:公告
function newKH(){
	var scenicItem_area = document.querySelector('.box_area .scenic');
	// 在表頭的部分印出
	formBox.classList.add('newBox');
	formBox.classList.remove('areaBox','scenicBox');
	var newbox_area = document.querySelector('.boxcontainer.box_area')
	// 區域
	newbox_area.children[0].textContent = '區域觀光遊高雄'
	weatherBox.style.display = 'block'

	if(boxContainerFoot.style.display !== 'none'){
		boxContainerFoot.style.display = 'none';
	}
	if(boxContainerBody.children[0].nodeName !== 'UL'){
		return reBoxprint()
	}

	

	var weatherprint = '';
	//夏至時間：以2021/7/21為今天
	var date = new Date(2021,6,21,23,59);
	var monthDate = date.getMonth()+1;
	//補零
	function monthDateLen(monthDate){
		return monthDate< 10 ? '0' + monthDate:monthDate
	}
	var getdateDate = date.getDate();
	var daystr = ['日', '一', '二', '三', '四', '五', '六'];
	var todayDate = '星期' + daystr[date.getDay()]
	var tomorrowDate = '星期' + daystr[date.getDay()+1]
	var acquiredDate = '星期' + daystr[date.getDay()+2]
	var today = monthDateLen(monthDate) +'-'+ getdateDate;
	var tomorrow = monthDateLen(monthDate) +'-'+ (getdateDate+1);
	var acquired = monthDateLen(monthDate) +'-'+ (getdateDate+2);
	
	for(var i=0;i<weatherLocationLen;i ++){
		// var khWeather =  
		var MinTodayTprint='';
		var MinTomorrowTprint='';
		var MinAcquiredTprint='';
		var MaxTodayTprint='';
		var MaxTomorrowTprint='';
		var MaxAcquiredTprint='';
		var UVITodayTprint='';
		var ExposureTodayTprint='';
		var ComplexTitleprint='';
		var ComplexTodayTprint='';

		var weatherIcon = []
		var IconTodayprint ='';
		var IconTomorrowprint ='';
		var IconAcquiredprint ='';

		// 天氣條件
		if(weatherLocation[i].locationName == '高雄市'){
			weatherBox.innerHTML = weatherprint;
			var weatkh = weatherLocation[i].weatherElement
			var weatkhLen = weatkh.length
			for(var j = 0 ;j<weatkhLen;j++){
				if(weatkh[j].elementName == 'MinT'){
					var weatDay = weatkh[j].time
					var weatDayTLen = weatDay.length
					
					for(var k = 0 ;k<weatDayTLen;k++){
						var weatDayTime = weatDay[k].endTime.substr(5,5);
						if(weatDayTime == today){var MinTToday = weatDay[k]}
						if(weatDayTime == tomorrow){var MinTTomorrow = weatDay[k]}
						if(weatDayTime == acquired){var MinTAcquired = weatDay[k]}
						
					}
					MinTodayTprint += `${MinTToday.elementValue.value}`
					MinTomorrowTprint += `${MinTTomorrow.elementValue.value}`
					MinAcquiredTprint += `${MinTAcquired.elementValue.value}`
				}
				
				if(weatkh[j].elementName == 'MaxT'){
					var weatDay = weatkh[j].time
					var weatDayTLen = weatDay.length
					
					for(var k = 0 ;k<weatDayTLen;k++){
						// var weatDayTime = weatDay[k].endTime<weatDay[k].endTime  ? + weatDay[k].endTime :weatDay[k].endTime 
						
						var weatDayTime = weatDay[k].endTime.substr(5,5);
						if(weatDayTime == today){var MaxTToday = weatDay[k];}
						if(weatDayTime == tomorrow){var MaxTTomorrow = weatDay[k]}
						if(weatDayTime == acquired){var MaxTAcquired = weatDay[k];}
					}
					MaxTodayTprint += `${MaxTToday.elementValue.value}`
					MaxTomorrowTprint += `${MaxTTomorrow.elementValue.value}`
					MaxAcquiredTprint += `${MaxTAcquired.elementValue.value}`

				}

				if(weatkh[j].elementName == 'UVI'){
					var weatDay = weatkh[j].time
					var weatDayTLen = weatDay.length
					
					for(var k = 0 ;k<weatDayTLen;k++){
						var weatDayTime = weatDay[k].endTime.substr(5,5);
						if(weatDayTime == today){
							var UVIValue = weatDay[k].elementValue;
						}
					}
					UVITodayTprint += `${UVIValue[0].measures}`
					ExposureTodayTprint += `${UVIValue[1].value}`
				}

				if(weatkh[j].elementName == 'WeatherDescription'){
					var weatDay = weatkh[j].time
					var weatDayTLen = weatDay.length
					ComplexTitleprint += `${ weatkh[j].description}`

					for(var k = 0 ;k<weatDayTLen;k++){
						
						var weatDayTime = weatDay[k].endTime.substr(5,5);
						var complex = weatDay[k]

						var weatherIcon = complex
						// (es7)includes 則不需要 判斷 !==-1
						
						// 假設狀態有100
						// Overcast 陰天
						// Cloudy 多雲的
						// Showers 陣雨
						// Thunderstorms 雷暴
						var keyword = complex.elementValue.value
						var pushKeyWord = weatherIcon.elementValue
						var weather1=['晴天']
						var weather2=['多雲時晴','晴時多雲']
						var weather3=['多雲']
						var weather5=['多雲時陰']
						var weather7=['陰天']
						var weather10=['陰時多雲短暫雨','陰時多雲短暫陣雨','晴午後陰短暫雨','晴午後陰短暫陣雨','陰午後短暫陣雨','陰短暫陣雨','陰短暫雨','雨天']
						var weather11=['多雲陣雨','多雲短暫雨','多雲短暫陣雨','午後短暫陣雨','短暫陣雨','多雲時晴短暫陣雨','多雲時晴短暫雨','晴時多雲短暫陣雨','晴短暫陣雨','短暫雨','多雲']
						var weather12=['多雲時陰短暫雨','多雲時陰短暫陣雨']
						var weather14=['陰有陣雨','陰有雨','陰陣雨','陣雨','陰雨','午後陣雨','有雨']
						var weather17=['陰短暫陣雨或雷雨']
						var weather19=['晴午後多雲局部雨']
						var weather20=['多雲午後局部雨']
						var weather24=['晴時多雲']
						var weather33 =['多雲陣雨或雷雨','多雲短暫陣雨或雷雨']
						var weather34=['多雲時陰陣雨或雷雨']
						// 假設關鍵字在10個內
						for (b=0;b<10;b++) {
							// console.log(keyword.indexOf(status[b]) !== -1)
							if (keyword.indexOf(weather34[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_34'
							}
							else if (keyword.indexOf(weather33[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_33'
							}
							else if (keyword.indexOf(weather24[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_24'
							}
							else if (keyword.indexOf(weather20[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_20'
							}
							else if (keyword.indexOf(weather19[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_19'
							}
							else if (keyword.indexOf(weather17[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_17'
							}
							else if (keyword.indexOf(weather14[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_14'
							}
							else if (keyword.indexOf(weather12[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_12'
							}
							else if (keyword.indexOf(weather11[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_11'
							}
							else if (keyword.indexOf(weather10[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_10'
							}
							else if (keyword.indexOf(weather7[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_7'
							}
							else if (keyword.indexOf(weather5[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_5'
							}
							else if (keyword.indexOf(weather3[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_3'
							}
							else if (keyword.indexOf(weather2[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_2'
							}
							else if (keyword.indexOf(weather1[b]) !== -1) {
								pushKeyWord['wticons'] ='wt_1'
							}


						}
						var complexValue = weatDay[k].elementValue;
						if(weatDayTime == today){
							IconTodayprint = complexValue.wticons
						}
						if(weatDayTime == tomorrow){
							IconTomorrowprint = complexValue.wticons
						}
						if(weatDayTime == acquired){
							IconAcquiredprint = complexValue.wticons
						}
					}
					var lenstr = 150;
					if(complexValue.value.length >= lenstr){
						ComplexTodayTprint += `${complexValue.value.substring(0, lenstr)}` + '...<a class="alink" href="#">more</a>'
						
					
					}else{
						ComplexTodayTprint = complexValue.value
					}
					
					
				}
			}

			weatherprint =
			`
			<div class="title">${weatherLocation[i].locationName}天氣預報</div>
			<ul>
				<li>
					<dl>
						<dt><span>${today}</span><span>${todayDate}</span></dt>
						<dd>${MinTodayTprint}~${MaxTodayTprint}°C</dd>
						<dd><span class="wticons ${IconTodayprint}"></span></dd>
					</dl>
					<dl>
						<dt><span>${tomorrow}</span><span>${tomorrowDate}</span></dt>
						<dd>${MinTomorrowTprint}~${MaxTomorrowTprint}°C</dd>
						<dd><span class="wticons ${IconTomorrowprint}"></span></dd>
					</dl>
					<dl>
						<dt><span>${acquired}</span><span>${acquiredDate}</span></dt>
						<dd>${MinAcquiredTprint}~${MaxAcquiredTprint}°C</dd>
						<dd><span class="wticons ${IconAcquiredprint}"></span></dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt><i class="fas fa-umbrella-beach"></i>今日${UVITodayTprint}</dt>
						<dd>${ExposureTodayTprint}</dd>
					</dl>
				</li>
			</ul>
			<dl class="Complex">
				<dt><i class="fas fa-temperature-low"></i>今日${ComplexTitleprint}</dt>
				<dd>${ComplexTodayTprint}</dd>
			</dl>`
			weatherBox.innerHTML = weatherprint;
			var alinkMore = document.querySelector('.weather .alink')
			var ComplexTodayTtext = document.querySelector('.weather>ul+dl>dd')
			if(ComplexTodayTtext.textContent.length >= 100){
				// console.log(alinkMore)
				alinkMore.addEventListener('click', alinkMoreExpand, false);
				function alinkMoreExpand(){
					ComplexTodayTtext.innerHTML = `${complexValue.value}`
					ComplexTodayTtext.parentNode.classList.remove('Complex')
					ComplexTodayTtext.parentNode.style.cssText = 'height:auto'
				}
			}
		}
		
	}
	
	if(khDataLen === 0){
		return
	}else if(scenicItem == scenicItem_area){
		
		// 給新的陣列
		var randomKh = []
		for(var i = 0;i < khDataLen;i++){
			randomKh.push(khTravelDataArray[i])
			
		}
		// 亂數
		for(var i = 0;i < randomKh.length;i++){
			randomKh.sort( function(){ return Math.round( Math.random() ) - 0.5 ; } );
		}
		// 不重複區域
		var set = new Set();
		var randomKhResult = randomKh.filter(item => !set.has(item.Area) ? set.add(item.Area) : false);

		// 印出
		var print = '';
		var randomKhLen = randomKhResult.length;
		for(var i = 0;i < randomKhLen && i<12;i++){
			print += 
			`<li class="scenic_item randomKh_item">
				<a href="#">
					<div class="scenic_warp">
						<figure>
							<figcaption>${randomKhResult[i].Area}</figcaption>
							<img src="${randomKhResult[i].Picture1}" alt="${randomKhResult[i].Picdescribe1}" title="${randomKhResult[i].Name}">
						</figure>
					</div>
				</a>
			</li>`
			scenicItem_area.innerHTML = print;
		}
		randomKharea();
	}else if(scenicItem == scenicItem_KH){
		
		popuprint();
		
	}else{
		
	}
}
newKH()

// 亂數對應的區域
function randomKharea(){
	var randomscenicItem = document.querySelector('.scenic').querySelectorAll('.randomKh_item');
	for(var i = 0;i<randomscenicItem.length;i++){
		randomscenicItem[i].addEventListener('click',function (e) {
			e.preventDefault();
			var randomarea = this.innerText
			areaKH(randomarea)
		})
	}
}
function areaKH(randomarea){
	areaTemp = [];
	// 點擊完判斷區域回傳
	for(var i = 0;i < khDataLen;i++){
		var area = khTravelDataArray[i].Area;
		if(area == randomarea){
			areaTemp.push(khTravelDataArray[i]);
		}
	}
	boxContainer.children[0].textContent = randomarea;
	formBox.classList.add('areaBox');
	formBox.classList.remove('newBox');

	populararea(randomarea)
	// // 點擊區域渲染
	changePage(1);
	pageAverage(areaTemp);
	
}
//點擊區域累加次數
function populararea(popo){
	// 假設點擊率
	var frequency = 0;
	popularAreaArray[0].frequency = 0;
	popularAreaArray[1].frequency = 815;
	popularAreaArray[2].frequency = 10;
	popularAreaArray[3].frequency = 30;
	popularAreaArray[9].frequency = 8030;
	popularAreaArray[12].frequency = 5630;
	popularAreaArray[15].frequency = 88;
	popularAreaArray[23].frequency = 50;
	popularAreaArray[25].frequency = 588;
	popularAreaArray[28].frequency = 25;
	popularAreaArray[32].frequency = 65;
	popularAreaArray[35].frequency = 45;
	popularAreaArray[37].frequency = 888;

	// 針對名字排序
	// popularAreaArray = popularAreaArray.sort(function(a, b){
	// 	var nameA = a.area.toUpperCase(); // ignore upper and lowercase
	// 	var nameB = b.area.toUpperCase(); // ignore upper and lowercase

	// 	if (nameA < nameB) {
	// 	return -1;
	// 	}
	// 	if (nameA > nameB) {
	// 	return 1;
	// 	}
	// })
	// 針對數字大小
	
	frequency++;
	popularAreaArray = popularAreaArray.sort(function(a, b){
		return b.frequency - a.frequency;
	})
	for(var i = 0; i<popularAreaArray.length;i++){
		// console.log(popo === popularAreaArray[i].area)
		if(popo === popularAreaArray[i].area){
			popularAreaArray[i]['frequency'] = frequency
			// console.log(popularAreaArray)
		}
		
	}
}
// TODO:熱門行政區
//點擊率高的區域印出
function popuprint(){
	var popuprintArea = '';
	for(var i = 0;i < popularAreaArray.length && i < 12; i++){
		popuprintArea += `<li><a href="#">${popularAreaArray[i].area}</a></li>`;
	}
	popularAreas.innerHTML = popuprintArea;
}
popuprint();

// 點擊區域
function areaAlinkClick(){
	var areaLiAlink = document.querySelector('.nav').querySelectorAll('li');
	// 針對每一個區域宣告
	for(var i = 0;i < areaLiAlink.length;i++){
		
		areaLiAlink[i].addEventListener('click',function (e) {
			// 判斷DOM的結構
			if (e.target.nodeName !== "A") {
				return
			}
			e.preventDefault();
			
			// 在表頭的部分印出
			formBox.classList.add('areaBox');
			formBox.classList.remove('newBox');

			boxContainer = document.querySelector('.areaBox .boxcontainer');
			boxContainer.children[0].textContent = e.target.textContent;
			areaTemp = [];
			// 點擊完判斷區域回傳
			for(var i = 0;i < khDataLen;i++){
				var area = khTravelDataArray[i].Area;
				if(area === e.target.textContent){
					areaTemp.push(khTravelDataArray[i]);
				}
			}
			var popo = e.target.textContent;
			populararea(popo)
			// 點擊區域渲染
			changePage(1);
			pageAverage(areaTemp);
		});
		
	}
}
areaAlinkClick();



// TODO:判斷結構
function reBoxprint(){
	if(boxContainerBody.children[0].nodeName !== 'UL'){
		boxContainerBody.innerHTML = `<ul class="scenic"></ul>`
	}
	boxContainerFoot.innerHTML = 
	`<div class="pagebox">
	<div class="page_pre"><a href="#"><i class="fas fa-angle-left"></i></a></div>
	<ul class="page_num"></ul>
	<div class="page_next"><a href="#"><i class="fas fa-angle-right"></i></a></div>
	</div>`
	
	// 判斷結構回傳function
	if(boxContainer.classList[1] == 'newbox'){
		newKH()
	}else if(scenicItem.nodeName == 'UL' ){
		changePage(1)
	}else if(pageBox.nodeName == 'DIV'){
		pageAverage(areaTemp)
	}
	
}
// 印出區域資料
function printData(pageitemPint){
	if(boxContainerBody.children[0].nodeName !== 'UL'){
		reBoxprint();
	}
	var scenicItem = document.querySelector('.scenic');
	var print = '';
	for(var i = 0;i < pageitemPint.length;i++){
		var ketwordTimg = pageitemPint[i].Opentime
		// 關鍵字取代
		var ketword1 = ['全天候開放']
		for(var j = 0;j< 10;j++){
			if(ketwordTimg.indexOf(ketword1[j]) !== -1){
				ketwordTimg = ketword1[0]
			}else if(ketwordTimg.length>40){
				ketwordTimg = '詳請景點內介紹'
			}
		}
		var ketwordName = pageitemPint[i].Name;
		ketwordName = ketwordName.replace(/[\ |\~|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\,|\<|\.|\>|\/|\?]/g,"");
		// 點擊回傳
		print += 
		`<li class="scenic_item">
			<a href="#" data-name='${pageitemPint[i].Name}'>
				<div class="scenic_warp">
					<figure>
						<figcaption><div class="scenic_title"><div class="title">${ketwordName}</div></div><span class="scenic_area">${pageitemPint[i].Area}</span></figcaption>
						<img src="${pageitemPint[i].Picture1}" alt="${pageitemPint[i].Picdescribe1}" title="${pageitemPint[i].Name}">
					</figure>
					<div class="box">
						<div class="head"><i class="fas fa-crosshairs"></i>${pageitemPint[i].Name}</div>
						<div class="body">
							<ul>
								<li>${ketwordTimg}</li>
								<li class="toldescribe">${pageitemPint[i].Toldescribe}</li>
							</ul>
						</div>
					</div>
				</div>
			</a>
		</li>`
		
	}
	
	scenicItem.innerHTML = print;
	
	// TODO:scenicKHItem
	var scenicKHItem = document.querySelector('.scenic').querySelectorAll('.scenic_item');
	for(var i = 0;i<scenicKHItem.length;i++){
		scenicKHItem[i].addEventListener('click',function (e) {
			console.log(this.children[0].dataset.name)
			var scenicName = this.children[0].dataset.name;
			scenicKH(scenicName)
		})
		
	}
}
// 單個景點資料
function scenicKH(scenicName){
	formBox.classList.add('scenicBox');
	formBox.classList.remove('areaBox','scenicBox');
	formBox.classList.remove('foot')
	boxContainerFoot.style.display = 'none';
	var print = '';
	for(var i = 0;i < khDataLen;i++){
		var name = khTravelDataArray[i].Name;
		if(name == scenicName){
			var bartool = document.createElement("div");
			boxContainer.append(bartool);
			console.log(bartool.classList.add('bartool'))
			bartool.innerHTML = `<span class="btn btn-back">上一頁</span>`;
			boxContainer.children[0].textContent = khTravelDataArray[i].Name;
			print +=
			`<div class="info_box img_box">
				<figure>
					<img src="${khTravelDataArray[i].Picture1}" alt="${khTravelDataArray[i].Picdescribe1}" title="${khTravelDataArray[i].Name}">
					<figcaption><i class="fas fa-images"></i>${khTravelDataArray[i].Picdescribe1}</figcaption>
				</figure>
				<div class="head"><i class="fas fa-info-circle"></i>景點介紹</div>
				<div class="body"><p>${khTravelDataArray[i].Toldescribe}</p></div>
			</div>
			<div class="info_box">
				<div class="area_box">
					<a href="#"><i class="fas fa-chevron-circle-left"></i><span class="title">${khTravelDataArray[i].Area}</span></a>
					<div class="info_box img_box"><img class="khTravelDataArray" src="https://khh.travel/content/images/content/region/region-map-${khTravelDataArray[i].Zipcode}.png" alt="${khTravelDataArray[i].Area}" title="${khTravelDataArray[i].Area}"></div>
				</div>
				
				<div class="head">相關資訊</div>
				<div class="body">
					<dl class="info">
						<dt><i class="fas fa-clock"></i>營業時間</dt>
						<dd>${khTravelDataArray[i].Opentime}</dd>
					</dl>
					<dl class="info">
						<dt><i class="fas fa-map-marker-alt"></i>地址</dt>
						<dd><a href="https://www.google.com.tw/maps/place/${khTravelDataArray[i].Py},${khTravelDataArray[i].Px}" target="_blank"><i class="fas fa-location-arrow"></i>${khTravelDataArray[i].Add}</a></dd>
					</dl>
					<dl class="info">
						<dt><i class="fas fa-phone-alt"></i>電話</dt>
						<dd>+${khTravelDataArray[i].Tel}</dd>
					</dl>
					<dl class="info">
						<dt><i class="fas fa-link"></i>相關連結</dt>
						<dd><a href="https://www.google.com.tw/search?q=${khTravelDataArray[i].Name}" target="_blank"><i class="fas fa-link"></i>相關連結</a></dd>
					</dl>
					<dl class="info">
						<dt><i class="fas fa-bullhorn"></i>備註</dt>
						<dd>${khTravelDataArray[i].Remarks}</dd>
					</dl>
				</div>
				<div class="head">交通</div>
				<div class="body">
				<p>${khTravelDataArray[i].Travellinginfo}</p>
				<a href="https://maps.google.com/maps?daddr=${khTravelDataArray[i].Py},${khTravelDataArray[i].Px}&amp;hl=zh-tw" target="_blank"><i class="fas fa-location-arrow"></i>可依您的出發地，選擇適合的交通方式 </a>
				</div>
			</div>`
		}
	}
	boxContainerBody.innerHTML = print;
	var titleAreaClick = document.querySelector('.title')
	var titleArea = titleAreaClick.textContent
	titleAreaClick.addEventListener('click',function(e){
		e.preventDefault();
		areaKH(titleArea)
	})
}
// [操作]頁數
function numPage(pagnum){
	
	var pageItem = document.querySelector('.page_num').querySelectorAll('li');
	// [頁數]樣式
	for(var i = 0;i < pageItem.length;i++){
		if(pagnum == parseFloat(pageItem[i].childNodes[0].innerHTML)){
			pageItem[i].classList.add('now')
		}else if(pagnum === parseFloat(pageItem[i].childNodes[0].innerHTML)){
			pageItem[i].classList.add('now')
		}else{
			pageItem[i].classList.remove('now')
		}
		pageItem[i].addEventListener('click',function(e){
			if (e.target.nodeName !== "A") {
				return
			}
			e.preventDefault();
			var pagnum = parseInt(e.target.innerHTML)
			// if(e.target.nodeName == 'A')
			
			changePage(pagnum)
			
		})
	}
}

// 總數／頁數
function pageAverage(){
	return Math.ceil(areaTemp.length / pageitem);
}
// TODO:[操作]首頁
KHtravel.addEventListener('click',indexHome,false);
function indexHome(){
	boxContainer.classList.remove('box_area')
	areaTemp = khTravelDataArray
	pageAverage(areaTemp)
	boxContainer.children[0].textContent = '高雄市';
	formBox.classList.add('areaBox');
	formBox.classList.remove('newBox','scenicBox');
	
	if(boxContainerBody.children[0].nodeName !== 'UL'){
		reBoxprint()
	}
	changePage(1);
}
// [操作]上一頁
function prevPage(){
	currentPage--;
	if(currentPage < 1){
		currentPage = 1
	}changePage(currentPage);
}
// [操作]下一頁
function nextPage(){
	currentPage++;
	if(currentPage > pageAverage()){
		currentPage = pageAverage()
	}changePage(currentPage);
}
// 頁面顯示
function changePage(pagnum){
	var pagePre = document.querySelector('.page_pre');
	var pageNext = document.querySelector('.page_next');
	var pageBoxNum = document.querySelector('.page_num');

	if(boxContainerFoot.style.display == 'none'){
		boxContainerFoot.style.display = 'block';
	}
	weatherBox.style.display = 'none';
	boxContainer.children[0].style.display = 'inline-block'
	currentPage = pagnum;
	
	// pageitem列出
	var pageitemPint = []
	for (var i = (pagnum-1) * pageitem; i < (pagnum * pageitem) && i < areaTemp.length; i++) {
		pageitemPint.push(areaTemp[i])
	}
	printData(pageitemPint);
	// pagePre disabled樣式
	if(pagnum == 1){
		pagePre.childNodes[0].classList.add('disabled')
	}else{
		pagePre.childNodes[0].classList.remove('disabled')
	}
	// pageNext disabled樣式
	if(pagnum === pageAverage()){
		pageNext.childNodes[0].classList.add('disabled')
	}else{
		pageNext.childNodes[0].classList.remove('disabled')
	}
	
	//頁數
	var stepPage = 3;
	var stempPage = pageAverage();
	var pageNumAll = areaTemp.length;
	pageNumTotal = stempPage>pageNumAll ? pageNumAll : stempPage;

	if(stempPage < stepPage * 2 + 6){
		pageAdd(1,pageNumTotal + 1)
		pageBoxNum.innerHTML = pagesAll.pageAdd ;
	}
	else if(pagnum < stepPage * 2 + 1)
	{
		pageAdd(1,stepPage * 2 +4);
		pageAddLast()
		pageBoxNum.innerHTML = pagesAll.pageAdd + pagesAll.pageAddLast;
	}
	else if(pagnum >= stempPage - stepPage * 2){
		pageAdd(stempPage - stepPage * 2 - 2,stempPage + 1);
		pageAddFirst()
		pageBoxNum.innerHTML = pagesAll.pageAddFirst + pagesAll.pageAdd;
	}
	else{
		pageAddFirst()
		pageAdd(pagnum - stepPage* 2 +3,pagnum + stepPage * 2 - 2);
		pageAddLast()
		pageBoxNum.innerHTML = pagesAll.pageAddFirst + pagesAll.pageAdd + pagesAll.pageAddLast;
	}
	numPage(pagnum)
	// pagePre(pagnum)
	// pageNext(pagnum)

	pagePre.addEventListener('click',prevPage,false);
	pageNext.addEventListener('click',nextPage,false);
	
}

function pageAdd(startPage,endPage){
	var pagetabs = '';
	for(var i = startPage; i < endPage;i++){
		pagetabs += '<li><a href="#">' + i + '</a></li>';
	}
	pagesAll['pageAdd'] = pagetabs;
}
function pageAddFirst(){
	var pagetabs = '';
	pagetabs +=  '<li><a href="#">1</a></li><li>...</li>';
	pagesAll['pageAddFirst'] = pagetabs;
}
function pageAddLast(){
	var pagetabs= '';
	pagetabs +=  '<li>...</li><li><a href="#">'+ pageAverage() +'</a></li>';
	pagesAll['pageAddLast'] = pagetabs;
	
}
function pagefinish(){
	pageBoxNum.innerHTML = pagesAll.pageAddFirst + pagesAll.pageAdd + pagesAll.pageAddLast;
}