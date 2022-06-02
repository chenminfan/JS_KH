// TODO:出現許多重複宣告的變數，調整宣告變數，建議使用 let、const 來取代 var，雙等號改成三等號。
let khTravelDataArray = khTravelData.data.XML_Head.Infos.Info;
let weatherLocation = weatherData.cwbopendata.dataset.locations.location;
let weatherLocationLen = weatherLocation.length;
let khDataLen = khTravelDataArray.length;
let areaTemp = [];
let randomAreaTemp = [];
let formBox = document.querySelector(".form");
let formBoxContent = document.querySelector(".form .content");
let boxContainer = document.querySelector(".boxcontainer");
let boxContainerBody = document.querySelector(".boxcontainer .body");
let boxContainerFoot = document.querySelector(".boxcontainer .foot");
let scenicItem = document.querySelector(".scenic");
let newItem = document.querySelector(".newItem");
let navArea = document.querySelector(".navArea");
let hotArea = document.querySelector(".hotAreaBox");
let pageBox = document.querySelector(".pagebox");
let pagePre = document.querySelector(".page_pre");
let pageNext = document.querySelector(".page_next");
let pageBoxNum = document.querySelector(".page_num");
let pageItem = document.querySelectorAll(".page_num li");
let KHtravel = document.querySelector(".KH_travel");
let pagesAll = [];
let weatherBox = document.querySelector(".weather");
// [變數]顯示的筆數
let pageitem = 8;
// [變數]顯示頁
let pagnum = 1;
// [變數]前後頁暫存的顯示頁
let currentPage = 1;
let popularAreaArray = [];

// nav展開
let navExpand = document.querySelectorAll(".nav .item");
let navExpandLen = navExpand.length;
toggleExpand(navExpand[0]);
for (let i = 0; i < navExpandLen; i++) {
	navExpand[i].addEventListener('click', function (e) {
		e.preventDefault();
		toggleExpand(this);
	});
}

function toggleExpand(activePanel) {
	for (let i = 0; i < navExpandLen; i++) {
		// 當資料點擊A回傳的時候
		if (navExpand[i] == activePanel) {
			navExpand[i].classList.toggle("actived");
			if (navExpand[i].children.length >= 2) {
			navExpand[i].children[1].classList.toggle("expand");
			}
		}else if (
			// 當非資料本身 及 有收合box的時候
			navExpand[i] !== activePanel &&
			navExpand[i].childNodes.length > 3
		) {
			navExpand[i].children[1].classList.remove("expand");
			navExpand[i].classList.remove("actived");
		}else {
			// 當非資料A本身
			navExpand[i].classList.remove("actived");
		}
	}
}

//區域篩選
function areaFilter() {
	// 回傳printData印出所有資料
	// areaTemp = khTravelDataArray;

	// 區域篩選
	let areafilterArray = [];
	for (let i = 0; i < khDataLen; i++) {
		// console.log(area)
		let area = khTravelDataArray[i].Add.substr(6, 3);
		if (area.charAt(2) !== "區") {
			area = area + "區";
		}
		// 將篩選的資料推上陣列
		areafilterArray.push(area);
		// 新增資料回陣列
		khTravelDataArray[i]["Area"] = area;
	}
	// TODO:拉出for迴圈
	// [ES6刪除重複項目]，let areaArray = [...new Set(areafilterArray)];
	// [js Array.filter() 陣列中刪除重複的內容]
	let areaArray = areafilterArray.filter(function (ele, pos) {
		return areafilterArray.indexOf(ele) === pos;
	});
	let printArea = "";
	for (let i = 0; i < areaArray.length; i++) {
		printArea += `<div class="areaItem"><a class="btn btn-area" href="#">${areaArray[i]}</a></div>`;
		popularAreaArray.push({ area: areaArray[i], frequency: 0 });
	}
	navArea.innerHTML = printArea;

}
areaFilter();

newItem.addEventListener('click', newKH);

//公告
// TODO:已調整，變數 boxContainer 等同於變數 newbox_area
function newKH() {
	// 在表頭的部分印出
	formBox.classList.add("newBox");
	formBox.classList.remove("areaBox", "scenicBox");
	// 區域
	boxContainer .children[0].textContent = "區域觀光遊高雄";
	weatherBox.style.display = "block";

	if (boxContainerFoot.style.display !== "none") {
		boxContainerFoot.style.display = "none";
	}
	if (boxContainerBody.children[0].nodeName !== "UL") {
		return reBoxprint();
	}

	if (scenicItem === scenicItem) {
		// 給新的陣列
		let randomKh = [];
		for (let i = 0; i < khDataLen; i++) {
			randomKh.push(khTravelDataArray[i]);
		}
		// 亂數
		for (let i = 0; i < randomKh.length; i++) {
			randomKh.sort(function () {
				return Math.round(Math.random()) - 0.5;
			});
		}
		// 不重複區域
		let set = new Set();
		let randomKhResult = randomKh.filter((item) =>
		!set.has(item.Area) ? set.add(item.Area) : false
		);

		// 印出
		let print = "";
		let randomKhLen = randomKhResult.length;
		for (let i = 0; i < randomKhLen && i < 12; i++) {
			print += `<li class="scenic_item randomKh_item">
				<a href="#">
					<div class="scenic_warp">
						<figure>
							<figcaption>${randomKhResult[i].Area}</figcaption>
							<img src="${randomKhResult[i].Picture1}" alt="${randomKhResult[i].Picdescribe1}" title="${randomKhResult[i].Name}">
						</figure>
					</div>
				</a>
			</li>`;
			// TODO:拉出for迴圈
			scenicItem.innerHTML = print;
		}
		onScenicItem();

	}
}
newKH();

//區域切換class
function areaKH(randomarea) {
	areaTemp = [];
	// 點擊完判斷區域回傳
	for (let i = 0; i < khDataLen; i++) {
		let area = khTravelDataArray[i].Area;
		if (area === randomarea) {
			areaTemp.push(khTravelDataArray[i]);
		}
	}
	boxContainer.children[0].textContent = randomarea;
	formBox.classList.add("areaBox");
	formBox.classList.remove("newBox");
	// // 點擊區域渲染
	changePage(1);
	pageAverage(areaTemp);

}

//點擊區域累加次數
function popularHotArea(popo) {
	// 假設點擊率
	// console.log(popo)
	// popularAreaArray[1].frequency = 15;
	// popularAreaArray[2].frequency = 10;
	// popularAreaArray[3].frequency = 830;
	popularAreaArray[9].frequency = 90;
	popularAreaArray[10].frequency = 530;
	popularAreaArray[12].frequency = 5630;
	popularAreaArray[14].frequency = 20;
	popularAreaArray[15].frequency = 88;
	popularAreaArray[23].frequency = 750;
	popularAreaArray[25].frequency = 588;
	popularAreaArray[28].frequency = 25;
	// popularAreaArray[32].frequency = 65;
	// popularAreaArray[35].frequency = 45;
	popularAreaArray[37].frequency = 888;

	// 針對名字排序
	let frequencyAdd = 0;
	frequencyAdd++;
	// console.log(popularAreaArray)
	for (let i = 0; i < popularAreaArray.length; i++) {
		// console.log(popo === popularAreaArray[i].area)
		// console.log(popularAreaArray)
		if (popo === popularAreaArray[i].area) {
			popularAreaArray[i]["frequency"] += frequencyAdd;
		}

	}
}

// 熱門行政區，點擊率高的區域印出
function hotPrint() {
	popularHotArea();
	// console.log(popularAreaArray)
	let hotprintArea = "";
	for (let i = 0; i < popularAreaArray.length && i < 5; i++) {
		popularAreaArray = popularAreaArray.sort(function (a, b) {
			// 針對顯示前八筆的點擊數，依名字排序
			// if(popularAreaArray.length && i < 6){
			// 	var nameA = a.area.toUpperCase(); // ignore upper and lowercase
			// 	var nameB = b.area.toUpperCase(); // ignore upper and lowercase

			// 	if (nameA < nameB) {
			// 	return -1;
			// 	}
			// 	if (nameA > nameB) {
			// 	return 1;
			// 	}
			// }
			// 針對數字大小
			return b.frequency - a.frequency;
		});

		hotprintArea += `<div class="areaItem hotAreaItem"><a class="btn btn-hot" href="#">${popularAreaArray[i].area}</a></div>`;
	}
	hotArea.innerHTML = hotprintArea;
}
hotPrint();

// 點擊區域
function areaAlinkClick() {
	// 針對每一個區域宣告
	let areaLiAlink = document.querySelectorAll(".areaItem");
	// console.log(areaLiAlink)
	for (let i = 0; i < areaLiAlink.length; i++) {
		areaLiAlink[i].addEventListener('click', function (e) {
			// 判斷DOM的結構
			if (e.target.nodeName !== "A") {
				return;
			}
			e.preventDefault();


			// 在表頭的部分印出
			formBox.classList.add("areaBox");
			formBox.classList.remove("newBox");

			boxContainer = document.querySelector(".areaBox .boxcontainer");
			boxContainer.children[0].textContent = e.target.textContent;
			areaTemp = [];
			// 點擊完判斷區域回傳
			for (let i = 0; i < khDataLen; i++) {
				let area = khTravelDataArray[i].Area;
				if (area === e.target.textContent) {
					areaTemp.push(khTravelDataArray[i]);
				}
			}
			let popo = e.target.textContent;
			popularHotArea(popo);
			// 點擊區域渲染
			changePage(1);

			pageAverage(areaTemp);

		});
	}

}
areaAlinkClick();

// 判斷結構
function reBoxprint() {
	// 判斷結構回傳function
	// if (boxContainerBody.children[0].nodeName !== "UL"){
	// 	boxContainerBody.innerHTML = `<ul class="scenic"></ul>`;
	// }else
	if (boxContainer.classList[1] === "newbox") {
		newKH();
	} else if (scenicItem.nodeName === "UL") {
		changePage(1);
	} else if (pageBox.nodeName === "DIV") {
		pageAverage(areaTemp);
	}
	boxContainerFoot.innerHTML = `<div class="pagebox">
		<div class="page_pre"><a href="#"><i class="fas fa-angle-left"></i></a></div>
		<ul class="page_num"></ul>
		<div class="page_next"><a href="#"><i class="fas fa-angle-right"></i></a></div>
	</div>`;


}

// 點擊區域
// TODO:不建議函式、變數、參數使用相同名稱，導致增加維護上的困難度。
function onScenicItem(){

	let scenicKHItem = document.querySelectorAll(".scenic .scenic_item");
	scenicKHItem.forEach(scenicKHItem => scenicKHItem.addEventListener('click',function(e){
		e.preventDefault();
		if(this.classList[1] === 'randomKh_item'){
			let randomarea = this.innerText;
			areaKH(randomarea);
		}else{
			// console.log(this.children[0].dataset.name);
			let scenicName = this.children[0].dataset.name;
			scenicKH(scenicName);
		}
	}))
}

// 印出區域資料
function printData(pageitemPint) {
	if (boxContainerBody.children[0].nodeName !== "UL") {
		reBoxprint();
	}
	let print = "";
	for (let i = 0; i < pageitemPint.length; i++) {
		let ketwordTimg = pageitemPint[i].Opentime;
		// 關鍵字取代
		let ketword1 = ["全天候開放"];
		for (let j = 0; j < 10; j++) {
			if (ketwordTimg.indexOf(ketword1[j]) !== -1) {
				ketwordTimg = ketword1[0];
			} else if (ketwordTimg.length > 40) {
				ketwordTimg = "詳請景點內介紹";
			}
		}
		let ketwordName = pageitemPint[i].Name;
		// console.log(ketwordName)
		ketwordName = ketwordName.replace(
			/[\ |\~|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\,|\<|\.|\>|\/|\?]/g,
			""
		);
		// 點擊回傳
		print +=
		`<li class="scenic_item">
			<a href="#" data-name='${pageitemPint[i].Name}'>
				<div class="scenic_warp">
					<figure>
						<figcaption><div class="scenic_title">${ketwordName}</div><span class="scenic_area">${pageitemPint[i].Area}</span></figcaption>
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
		</li>`;
	}

	scenicItem.innerHTML = print;
	onScenicItem();
}

// 印出景點資料
function scenicKH(scenicName) {
	formBox.classList.add("scenicBox");
	formBox.classList.remove("areaBox", "scenicBox");
	formBox.classList.remove("foot");
	boxContainerFoot.style.display = "none";
	let print = "";
	for (let i = 0; i < khDataLen; i++) {
		let name = khTravelDataArray[i].Name;
		if (name === scenicName) {
			boxContainer.children[0].textContent = khTravelDataArray[i].Name;
			print += `<div class="info_box img_box">
				<div class="head"><i class="fas fa-info-circle"></i>景點介紹</div>
				<div class="body">
					<p>${khTravelDataArray[i].Toldescribe}</p>
					<figure>
						<img src="${khTravelDataArray[i].Picture1}" alt="${khTravelDataArray[i].Picdescribe1}" title="${khTravelDataArray[i].Name}">
						<figcaption><i class="fas fa-images"></i>${khTravelDataArray[i].Picdescribe1}</figcaption>
					</figure>
				</div>

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
			</div>`;
		}
	}
	boxContainerBody.innerHTML = print;
	// areaAlinkClick()
	// onScenicItem();
}
// 天氣資料
function weather() {
	let weatherprint = "";
	//夏至時間：以2021/7/21為今天
	let date = new Date(2021, 6, 21, 23, 59);
	let monthDate = date.getMonth() + 1;
	//補零
	function monthDateLen(monthDate) {
		return monthDate < 10 ? "0" + monthDate : monthDate;
	}
	let getdateDate = date.getDate();
	let daystr = ["日", "一", "二", "三", "四", "五", "六"];
	let todayDate = "星期" + daystr[date.getDay()];
	let tomorrowDate = "星期" + daystr[date.getDay() + 1];
	let acquiredDate = "星期" + daystr[date.getDay() + 2];
	let today = monthDateLen(monthDate) + "-" + getdateDate;
	let tomorrow = monthDateLen(monthDate) + "-" + (getdateDate + 1);
	let acquired = monthDateLen(monthDate) + "-" + (getdateDate + 2);

	for (let i = 0; i < weatherLocationLen; i++) {
		// let khWeather =
		let MinTodayTprint = "";
		let MinTomorrowTprint = "";
		let MinAcquiredTprint = "";
		let MaxTodayTprint = "";
		let MaxTomorrowTprint = "";
		let MaxAcquiredTprint = "";
		let UVITodayTprint = "";
		let ExposureTodayTprint = "";
		let ComplexTitleprint = "";
		let ComplexTodayTprint = "";
		let IconTodayprint = "";
		let IconTomorrowprint = "";
		let IconAcquiredprint = "";
		let ElementValueToday = "";

		// 天氣條件
		if (weatherLocation[i].locationName === "高雄市") {
			weatherBox.innerHTML = weatherprint;
			let weatkh = weatherLocation[i].weatherElement;
			let weatkhLen = weatkh.length;

			for (let j = 0; j < weatkhLen; j++) {
				if (weatkh[j].elementName === "MinT") {
					let weatDay = weatkh[j].time;
					let weatDayTLen = weatDay.length;


					for (let k = 0; k < weatDayTLen; k++) {
						let weatDayTime = weatDay[k].endTime.substr(5, 5);
						if (weatDayTime === today) {
							let MinTToday = weatDay[k];
							MinTodayTprint += `${MinTToday.elementValue.value}`;
						}
						if (weatDayTime === tomorrow) {
							let MinTTomorrow = weatDay[k];
							MinTomorrowTprint += `${MinTTomorrow.elementValue.value}`;
						}
						if (weatDayTime === acquired) {
							let MinTAcquired = weatDay[k];
							MinAcquiredTprint += `${MinTAcquired.elementValue.value}`;
						}
					}
				}

				if (weatkh[j].elementName === "MaxT") {
					let weatDay = weatkh[j].time;
					let weatDayTLen = weatDay.length;


					for (let k = 0; k < weatDayTLen; k++) {
						// let weatDayTime = weatDay[k].endTime<weatDay[k].endTime  ? + weatDay[k].endTime :weatDay[k].endTime

						let weatDayTime = weatDay[k].endTime.substr(5, 5);
						if (weatDayTime === today) {
							let MaxTToday = weatDay[k];
							MaxTodayTprint += `${MaxTToday.elementValue.value}`;
						}
						if (weatDayTime === tomorrow) {
							let MaxTTomorrow = weatDay[k];
							MaxTomorrowTprint += `${MaxTTomorrow.elementValue.value}`;
						}
						if (weatDayTime === acquired) {
							let MaxTAcquired = weatDay[k];
							MaxAcquiredTprint += `${MaxTAcquired.elementValue.value}`;
						}
					}
				}

				if (weatkh[j].elementName === "UVI") {
					let weatDay = weatkh[j].time;
					let weatDayTLen = weatDay.length;



					for (let k = 0; k < weatDayTLen; k++) {
						let weatDayTime = weatDay[k].endTime.substr(5, 5);
						if (weatDayTime === today) {
							let UVIValue = weatDay[k].elementValue;
							UVITodayTprint += `${UVIValue[0].measures}`;
							ExposureTodayTprint += `${UVIValue[1].value}`;
						}
					}

				}

				if (weatkh[j].elementName === "WeatherDescription") {
					let weatDay = weatkh[j].time;
					let weatDayTLen = weatDay.length;


					ComplexTitleprint += `${weatkh[j].description}`;

					for (let k = 0; k < weatDayTLen; k++) {
						let complexValue = weatDay[k].elementValue;
						let weatDayTime = weatDay[k].endTime.substr(5, 5);
						let complex = weatDay[k];
						let weatherIcon = complex;
						// (es7)includes 則不需要 判斷 !==-1

						// 假設狀態有100
						// Overcast 陰天
						// Cloudy 多雲的
						// Showers 陣雨
						// Thunderstorms 雷暴
						let keyword = complex.elementValue.value;
						let pushKeyWord = weatherIcon.elementValue;
						let weather1 = ["晴天"];
						let weather2 = ["多雲時晴", "晴時多雲"];
						let weather3 = ["多雲"];
						let weather5 = ["多雲時陰"];
						let weather7 = ["陰天"];
						let weather10 = [
							"陰時多雲短暫雨",
							"陰時多雲短暫陣雨",
							"晴午後陰短暫雨",
							"晴午後陰短暫陣雨",
							"陰午後短暫陣雨",
							"陰短暫陣雨",
							"陰短暫雨",
							"雨天",
						];
						let weather11 = [
							"多雲陣雨",
							"多雲短暫雨",
							"多雲短暫陣雨",
							"午後短暫陣雨",
							"短暫陣雨",
							"多雲時晴短暫陣雨",
							"多雲時晴短暫雨",
							"晴時多雲短暫陣雨",
							"晴短暫陣雨",
							"短暫雨",
							"多雲",
						];
						let weather12 = ["多雲時陰短暫雨", "多雲時陰短暫陣雨"];
						let weather14 = [
							"陰有陣雨",
							"陰有雨",
							"陰陣雨",
							"陣雨",
							"陰雨",
							"午後陣雨",
							"有雨",
						];
						let weather17 = ["陰短暫陣雨或雷雨"];
						let weather19 = ["晴午後多雲局部雨"];
						let weather20 = ["多雲午後局部雨"];
						let weather24 = ["晴時多雲"];
						let weather33 = ["多雲陣雨或雷雨", "多雲短暫陣雨或雷雨"];
						let weather34 = ["多雲時陰陣雨或雷雨"];
						// 假設關鍵字在10個內
						for (b = 0; b < 10; b++) {
							// console.log(keyword.indexOf(status[b]) !== -1)
							if (keyword.indexOf(weather34[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_34";
							} else if (keyword.indexOf(weather33[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_33";
							} else if (keyword.indexOf(weather24[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_24";
							} else if (keyword.indexOf(weather20[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_20";
							} else if (keyword.indexOf(weather19[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_19";
							} else if (keyword.indexOf(weather17[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_17";
							} else if (keyword.indexOf(weather14[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_14";
							} else if (keyword.indexOf(weather12[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_12";
							} else if (keyword.indexOf(weather11[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_11";
							} else if (keyword.indexOf(weather10[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_10";
							} else if (keyword.indexOf(weather7[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_7";
							} else if (keyword.indexOf(weather5[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_5";
							} else if (keyword.indexOf(weather3[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_3";
							} else if (keyword.indexOf(weather2[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_2";
							} else if (keyword.indexOf(weather1[b]) !== -1) {
								pushKeyWord["wticons"] = "wt_1";
							}
						}
						if (weatDayTime === today) {
							IconTodayprint = complexValue.wticons;
							ElementValueToday = complexValue.value
							// console.log(complexValue.value.length)
							let lenstr = 40;
							if (complexValue.value.length > lenstr) {
								ComplexTodayTprint =`${complexValue.value.substring(0, lenstr)} ...<a class="alink" href="#">more</a>`;
							}
							// TODO:ComplexTodayTprint 建議使用樣板字面值的寫法。
							// console.log(ElementValueToday)
						}
						if (weatDayTime === tomorrow) {
							IconTomorrowprint = complexValue.wticons;
						}
						if (weatDayTime === acquired) {
							IconAcquiredprint = complexValue.wticons;
						}

						weatherprint = `
							<div class="title">${weatherLocation[i].locationName}天氣預報</div>
							<div class="container">
								<ul>
									<li>
										<dl>
											<dt><span>${today}</span><span>${todayDate}</span></dt>
											<dd>${MinTodayTprint}~${MaxTodayTprint}°C</dd>
											<dd><span class="wticons ${IconTodayprint}"></span></dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt><span>${tomorrow}</span><span>${tomorrowDate}</span></dt>
											<dd>${MinTomorrowTprint}~${MaxTomorrowTprint}°C</dd>
											<dd><span class="wticons ${IconTomorrowprint}"></span></dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt><span>${acquired}</span><span>${acquiredDate}</span></dt>
											<dd>${MinAcquiredTprint}~${MaxAcquiredTprint}°C</dd>
											<dd><span class="wticons ${IconAcquiredprint}"></span></dd>
										</dl>
									</li>
								</ul>
								<dl class="Exposure">
									<dt><i class="fas fa-umbrella-beach"></i>今日${UVITodayTprint}</dt>
									<dd>${ExposureTodayTprint}</dd>
								</dl>
								<dl class="Complex">
									<dt><i class="fas fa-temperature-low"></i>今日${ComplexTitleprint}</dt>
									<dd>${ComplexTodayTprint}</dd>
								</dl>
							</div>`;
							weatherBox.innerHTML = weatherprint;
							// console.log(ElementValueToday)
							let alinkMore = document.querySelector(".weather .alink");
							let ComplexTodayTtext = document.querySelector(".weather .Complex dd");
							alinkMore.addEventListener('click', function(){
								ComplexTodayTtext.innerHTML = ElementValueToday;
								ComplexTodayTtext.parentNode.classList.remove("Complex");
								ComplexTodayTtext.parentNode.style.cssText = "height:auto";
							}, false);
					}
				}
			}


		}
	}
}
weather();

// [操作]頁數
function numPage(pagnum) {
	let pageItem = document.querySelectorAll(".page_num li");
	// [頁數]樣式
	for (let i = 0; i < pageItem.length; i++) {
		if (pagnum === parseFloat(pageItem[i].childNodes[0].innerHTML)) {
			pageItem[i].classList.add("now");
		} else if (pagnum === parseFloat(pageItem[i].childNodes[0].innerHTML)) {
			pageItem[i].classList.add("now");
		} else {
			pageItem[i].classList.remove("now");
		}
		pageItem[i].addEventListener('click', function (e) {
			if (e.target.nodeName !== "A") {
				return;
			}
			e.preventDefault();
			let pagnum = parseInt(e.target.innerHTML);
			// if(e.target.nodeName === 'A')

			changePage(pagnum);
		});
	}
}

// 總數／頁數
function pageAverage() {
	return Math.ceil(areaTemp.length / pageitem);
}
// [操作]首頁
KHtravel.addEventListener('click', indexHome, false);
function indexHome() {
	boxContainer.classList.remove("box_area");
	areaTemp = khTravelDataArray;
	pageAverage(areaTemp);
	boxContainer.children[0].textContent = "高雄市";
	formBox.classList.add("areaBox");
	formBox.classList.remove("newBox", "scenicBox");

	if (boxContainerBody.children[0].nodeName !== "UL") {
		reBoxprint();
	}
	changePage(1);
}
// TODO:changePage(currentPage)已換行。
// [操作]上一頁
function prevPage() {
	currentPage--;
	if (currentPage < 1) {
		currentPage = 1;
	}
	changePage(currentPage);
}
// [操作]下一頁
function nextPage() {
	currentPage++;
	if (currentPage > pageAverage()) {
		currentPage = pageAverage();
	}
	changePage(currentPage);
}
// 頁面顯示
function changePage(pagnum) {
	let pagePre = document.querySelector(".page_pre");
	let pageNext = document.querySelector(".page_next");
	let pageBoxNum = document.querySelector(".page_num");

	if (boxContainerFoot.style.display === "none") {
		boxContainerFoot.style.display = "block";
	}
	weatherBox.style.display = "none";
	boxContainer.children[0].style.display = "inline-block";
	currentPage = pagnum;

	// pageitem列出
	let pageitemPint = [];
	for (
		let i = (pagnum - 1) * pageitem;
		i < pagnum * pageitem && i < areaTemp.length;
		i++
	) {
		pageitemPint.push(areaTemp[i]);
	}
	printData(pageitemPint);
	// pagePre disabled樣式
	if (pagnum === 1) {
		pagePre.childNodes[0].classList.add("disabled");
	} else {
		pagePre.childNodes[0].classList.remove("disabled");
	}
	// pageNext disabled樣式
	if (pagnum === pageAverage()) {
		pageNext.childNodes[0].classList.add("disabled");
	} else {
		pageNext.childNodes[0].classList.remove("disabled");
	}

	//頁數
	let stepPage = 3;
	let stempPage = pageAverage();
	let pageNumAll = areaTemp.length;
	pageNumTotal = stempPage > pageNumAll ? pageNumAll : stempPage;

	if (stempPage < stepPage * 2 + 6) {
		pageAdd(1, pageNumTotal + 1);
		pageBoxNum.innerHTML = pagesAll.pageAdd;
	} else if (pagnum < stepPage * 2 + 1) {
		pageAdd(1, stepPage * 2 + 4);
		pageAddLast();
		pageBoxNum.innerHTML = pagesAll.pageAdd + pagesAll.pageAddLast;
	} else if (pagnum >= stempPage - stepPage * 2) {
		pageAdd(stempPage - stepPage * 2 - 2, stempPage + 1);
		pageAddFirst();
		pageBoxNum.innerHTML = pagesAll.pageAddFirst + pagesAll.pageAdd;
	} else {
		pageAddFirst();
		pageAdd(pagnum - stepPage * 2 + 3, pagnum + stepPage * 2 - 2);
		pageAddLast();
		pageBoxNum.innerHTML =
			pagesAll.pageAddFirst + pagesAll.pageAdd + pagesAll.pageAddLast;
	}
	numPage(pagnum);
	pagePre.addEventListener('click', prevPage, false);
	pageNext.addEventListener('click', nextPage, false);
}
// TODO:函式 pageAdd、pageAddFirst、pageAddLast 的變數 pagetabs 建議使用樣板字面值的寫法。
function pageAdd(startPage, endPage) {
	let pagetabs = "";
	for (let i = startPage; i < endPage; i++) {
		pagetabs += `<li><a href="#">${i}</a></li>`;
	}
	pagesAll["pageAdd"] = pagetabs;
}
function pageAddFirst() {
	let pagetabs = "";
	pagetabs += `<li><a href="#">1</a></li><li>...</li>`;
	pagesAll["pageAddFirst"] = pagetabs;
}
function pageAddLast() {
	let pagetabs = "";
	pagetabs += `<li>...</li><li><a href="#">${pageAverage()}</a></li>`;
	pagesAll["pageAddLast"] = pagetabs;
}
function pagefinish() {
	pageBoxNum.innerHTML =
		pagesAll.pageAddFirst + pagesAll.pageAdd + pagesAll.pageAddLast;
}
