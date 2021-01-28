// "http:"===window.location.protocol&&(window.location="https://"+window.location.host+window.location.pathname)

var fromCity = document.getElementById('fromCity'),
    toCity = document.getElementById('toCity'),
    fromVal = '',
    toVal = '',
    currentCity = '',
    currentCityVal = '',
    outFrom = document.getElementById('outFrom'),
    inFrom = document.getElementById('inFrom'),
    inTo = document.getElementById('inTo'),
    outTo = document.getElementById('outTo'),
    fromCode = document.getElementById('fromCode'),
    toCode = document.getElementById('toCode'),
    from_info = '',
    to_info = '',
    fromCodeDes = '',
    fromCodeImg = '',
    toCodeDes = '',
    toCodeImg = '',
    fromCovidInfo = '',
    currentCovidInfo = '',
    toCovidInfo = '',
    resultInfo = null,
    appKey = 'fa7914d4eec67d44499d2eca5eaea6e1';
var urlJson = 'https://apis.juhe.cn/springTravel/current?key='+appKey+'&nid='+getQueryVariable("nid");

getCurrent(urlJson);

// 城市切换
$('.changeCity').click(function(){
  var fromValue = $('.fromVal').html();
  var toValue = $('.toVal').html();
  if(fromValue === '出发地' && toValue === '目的地') {
    return;
  } else if (fromValue === '出发地' && toValue !== '目的地') {
    $('.fromVal').html(toValue);
    $('.toVal').html('目的地');
    $('.fromVal').addClass('city-select-color');
    $('.toVal').removeClass('city-select-color');
    fromVal = toVal;
    toVal = '';
  } else if (fromValue !== '出发地' && toValue === '目的地') {
    $('.fromVal').html('出发地');
    $('.toVal').html(fromValue);
    $('.fromVal').removeClass('city-select-color');
    $('.toVal').addClass('city-select-color');
    toVal = fromVal;
    fromVal = '';
  } else {
    $('.fromVal').html(toValue);
    $('.toVal').html(fromValue);
    var fromVal1 = fromVal;
    var toVal1 = toVal;
    fromVal = toVal1;
    toVal = fromVal1;
    getData();
  }
})

// 选择城市
fromCity.onclick = function () {
  weui.picker(
    cityData, {
      defaultValue: [2, 1],
      onConfirm: function (result) {
        $('.fromVal').html(result[1].label);
        fromVal = result[1].value;
        if (toVal) {
          getData()
        } else {
          getCurrent(urlJson+'&city_id='+fromVal)
        }
        if(!$('.fromVal').hasClass('city-select-color')) {
          $('.fromVal').addClass('city-select-color')
        }
      }
    }
  );
}

toCity.onclick = function () {
  weui.picker(
    cityData, {
      defaultValue: [2, 1],
      onConfirm: function (result) {
        $('.toVal').html(result[1].label);
        toVal = result[1].value;
        if (fromVal) {
          getData()
        }
        if(!$('.toVal').hasClass('city-select-color')) {
          $('.toVal').addClass('city-select-color')
        }
      }
    }
  );
}

// 健康码弹窗
$('.wrapper').on('click', '.from-health-code, #fromCode', function(){
  codeFn(fromCodeDes, fromCodeImg)
})
$('.wrapper').on('click', '.to-health-code, #toCode', function(){
  codeFn(toCodeDes, toCodeImg)
})

function codeFn(codeDes, codeImg) {
  weui.dialog({
    content: `
    <div class="dialog-title">${codeDes}</div>
    <div class="code-img">
      <img src="${codeImg}">
    </div>
    `,
    className: 'custom-classname',
    buttons: [{
        label: '我知道了',
        type: 'primary'
    }]
  });
}

//选择城市防疫政策
function getData() {
  $('.loading').show();

  $.ajax({
    type: "get",
    async: true,
    url: "https://apis.juhe.cn/springTravel/query?key="+appKey+"&from="+fromVal+"&to="+toVal+"&nid="+getQueryVariable("nid"),
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      $('.loading').fadeOut(300);

      from_info = res.result && res.result.from_info;
      to_info = res.result && res.result.to_info;
      fromCodeDes = from_info.health_code_desc;
      fromCodeImg = from_info.health_code_picture;
      toCodeDes = to_info.health_code_desc;
      toCodeImg = to_info.health_code_picture;
      fromCovidInfo = res.result && res.result.from_covid_info;
      toCovidInfo = res.result && res.result.to_covid_info;

      outFrom.innerHTML = `
        <div class="outin-city">
          <div class="city-name title-city">
            <div class="city-left">
              <b>出${from_info.city_name}</b>
              <img src="./img/risk-level-${from_info.risk_level}.png">
            </div>
            <span class="health-code from-health-code">出发地健康码</span>
          </div>
          <div class="zhengce">${from_info.out_desc}</div>
        </div>
      `;
      if(fromCovidInfo){
        var fromInfoHtml = `
          <div class="confirm-wrap covid-wrap">
          <h4>${fromCovidInfo.city_name}疫情</h4>
          <ul class="covid-ul">
            <li>
              <p>新增确诊</p>
              <div>${fromCovidInfo.today_confirm}</div>
            </li>
            <li>
              <p>累计确诊</p>
              <div>${fromCovidInfo.total_confirm}</div>
            </li>
            <li>
              <p>治愈</p>
              <div>${fromCovidInfo.total_heal}</div>
            </li>
            <li>
              <p>死亡</p>
              <div>${fromCovidInfo.total_dead}</div>
            </li>
          </ul>
        </div>
        `
        outFrom.innerHTML += fromInfoHtml
      }
      inFrom.innerHTML = `
        <div class="outin-city">
          <div class="city-name title-city">
            <div class="city-left">
              <b>进${to_info.city_name}</b>
              <img src="./img/risk-level-${to_info.risk_level}.png">
            </div>
            <span class="health-code to-health-code">目的地健康码</span>
          </div>
          <div class="zhengce">${to_info.high_in_desc}<br>${to_info.low_in_desc}</div>
        </div>
        `;
        if(toCovidInfo){
          var toInfoHtml = `
            <div class="confirm-wrap covid-wrap">
            <h4>${toCovidInfo.city_name}疫情</h4>
            <ul class="covid-ul">
              <li>
                <p>新增确诊</p>
                <div>${toCovidInfo.today_confirm}</div>
              </li>
              <li>
                <p>累计确诊</p>
                <div>${toCovidInfo.total_confirm}</div>
              </li>
              <li>
                <p>治愈</p>
                <div>${toCovidInfo.total_heal}</div>
              </li>
              <li>
                <p>死亡</p>
                <div>${toCovidInfo.total_dead}</div>
              </li>
            </ul>
          </div>
          `
        inFrom.innerHTML += toInfoHtml
        }
      inTo.innerHTML = `
      <div class="outin-city line">
        <div class="city-name title-city">
          <div class="city-left">
            <b>出${to_info.city_name}</b>
            <img src="./img/risk-level-${to_info.risk_level}.png">
          </div>
        </div>
        <div class="zhengce">${to_info.out_desc}</div>
      </div>
      `;
      outTo.innerHTML = `
      <div class="outin-city">
        <div class="city-name title-city">
          <div class="city-left">
            <b>进${from_info.city_name}</b>
            <img src="./img/risk-level-${from_info.risk_level}.png">
          </div>
        </div>
        <div class="zhengce">${from_info.high_in_desc}<br>${from_info.low_in_desc}</div>
      </div>
      `;
      fromCode.innerHTML = `
        <div class="code-wrap">
          <div class="zhengce">${from_info.city_name}</div>
          <span>${from_info.health_code_name}</span>
        </div>
      `;
      toCode.innerHTML = `
        <div class="code-wrap">
          <div class="zhengce">${to_info.city_name}</div>
          <span>${to_info.health_code_name}</span>
        </div>
      `;
      seeMore($('.zhengce'))
    },
    error: function(){
      $('.loading').fadeOut(200)
    }
  })
}

//当前城市防疫政策
function getCurrent(urlJson){
  $('.loading').show();
  $.ajax({
    type: "get",
    async: true,
    url: urlJson,
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      $('.loading').fadeOut(200);
      from_info = res.result && res.result.from_info;
      fromVal = from_info.city_id;
      currentCity = from_info.city_id;
      currentCityVal = from_info.city_name;
      fromCodeDes = from_info.health_code_desc;
      fromCodeImg = from_info.health_code_picture;
      currentCovidInfo = res.result && res.result.from_covid_info;
      $('.fromVal').html(from_info.city_name);

      outFrom.innerHTML = `
        <div class="city-name">
          <div class="city-left">
            <b>${from_info.city_name}</b>
            <img src="./img/risk-level-${from_info.risk_level}.png">
          </div>
          <span class="health-code from-health-code">出发地健康码</span>
        </div>
      <h3>外出政策</h3>
        <div class="zhengce">${from_info.out_desc}</div>
      `;
      inFrom.innerHTML = `
        <h3>进入政策</h3>
        <div class="zhengce">${from_info.high_in_desc}<br>${from_info.low_in_desc}</div>
        `;
      if(currentCovidInfo){
        var currentInfoHtml = `
          <div class="confirm-wrap">
          <h4>${currentCovidInfo.city_name}疫情</h4>
          <ul class="covid-ul">
            <li>
              <p>新增确诊</p>
              <div>${currentCovidInfo.today_confirm}</div>
            </li>
            <li>
              <p>累计确诊</p>
              <div>${currentCovidInfo.total_confirm}</div>
            </li>
            <li>
              <p>治愈</p>
              <div>${currentCovidInfo.total_heal}</div>
            </li>
            <li>
              <p>死亡</p>
              <div>${currentCovidInfo.total_dead}</div>
            </li>
          </ul>
        </div>
        `
        inFrom.innerHTML += currentInfoHtml
      }
      fromCode.innerHTML = `
        <div class="code-wrap">
          <div>${from_info.city_name}</div>
          <span>${from_info.health_code_name}</span>
        </div>
      `;
      if(!$('.fromVal').hasClass('city-select-color')) {
        $('.fromVal').addClass('city-select-color')
      }
      seeMore($('.zhengce'));
    },
    error: function(){
      $('.loading').fadeOut(200)
    }
  })
}
//查看更多
function seeMore(selector){
  selector.each(function(){
    var str = $(this).html()
    var sliceStr = str.substring(0, 120)
    var _this = $(this)
    _this.html(sliceStr + (sliceStr.length>119?'<span class="more-click"><i>...</i><em>更多</em></span>':''))
    _this.find('.more-click').click(function(){
      _this.html(str)
    })
  })
}

// $('.top-ban').css('background-image', 'url(https://huijia.juhekeji.com/img/newban2.png?v=1.1)');
// $('.juhelogo img').attr('src', 'https://huijia.juhekeji.com/img/juhe-logo.png');

function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
  }
  return null;
}

tabs(".tabul", "active", ".tab-wrap");
function tabs(tabTit, on, tabCon) {
  $(tabTit).children().click(function () {
    $(this).addClass(on).siblings().removeClass(on);
    var index = $(tabTit).children().index(this);
    $(tabCon).children().eq(index).show().siblings().hide();
  });
}

// 核算机构查询
var resultInfo2 = null;
getCurrent2();

$('.city-title').on('click', function(){
  weui.picker(
      cityData2, {
        defaultValue: [2, 1],
        onConfirm: function (result) {
          if(result[0].label == result[1].label) {
            $('.city-title').html(result[0].label);
          } else {
            $('.city-title').html(result[0].label + ' ' + result[1].label);
          }
          hsjcFn(result[1].value);
          $('.search').val('')
        }
      }
  );
})

// 搜索
$('.search').on('change', function(){
  $('.loading').fadeIn(10).fadeOut(300)
  var keyInput = $(this).val();
  var len = $('.list-item').length;
  for (var i = 0; i < len; i++) {
    var searchText = $('.list-item:eq(' + i + ')').find('.address').html() + $('.list-item:eq(' + i + ')').find('.dt-name').html();
    var reg = new RegExp(keyInput, 'i');
    if (searchText.match(reg)) {
      $('.list-item:eq(' + i +')').show()
    } else {
      $('.list-item:eq(' + i + ')').hide();
    }
  }
})

//当前城市核算检测机构
function getCurrent2(){
  $('.loading').show();
  $.ajax({
    type: "get",
    async: true,
    url: 'https://apis.juhe.cn/springTravel/currentHsjg?key='+appKey,
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      $('.loading').fadeOut(200);
      resultInfo2 = res.result && res.result.data
      $('.city-title').html(res.result.province +' '+ res.result.city);
      var hsjcStr = ''
      if(resultInfo2){
        for (item in resultInfo2) {
          hsjcStr += `
            <div class="list-item">
              <dl>
                <dt class="dt-name">${resultInfo2[item].name}</dt>
                <dd>所在区县：${resultInfo2[item].province}${resultInfo2[item].city}</dd>
                <dd>联系电话：<a href='tel:${resultInfo2[item].phone}'>${resultInfo2[item].phone}</a></dd>
                <dd><em>详细地址：</em><span class="address">${resultInfo2[item].address}</span></dd>
              </dl>
            </div>
          `
        }
        $('#institution').html(hsjcStr)
      } else {
        $('#institution').html('')
      }
    },
    error: function(){
      $('.loading').fadeOut(200)
    }
  })
}

//获取检测机构
function hsjcFn(cityCode){
  $.ajax({
    type: "get",
    async: true,
    url: 'https://apis.juhe.cn/springTravel/hsjg?key='+appKey+'&city_id='+cityCode,
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      resultInfo2 = res.result && res.result.data
      var hsjcStr = ''
      if(resultInfo2){
        for (item in resultInfo2) {
          hsjcStr += `
            <div class="list-item">
              <dl>
                <dt class="dt-name">${resultInfo2[item].name}</dt>
                <dd>所在区县：${resultInfo2[item].province}${resultInfo2[item].city}</dd>
                <dd>联系电话：<a href='tel:${resultInfo2[item].phone}'>${resultInfo2[item].phone}</a></dd>
                <dd><em>详细地址：</em><span class="address">${resultInfo2[item].address}</span></dd>
              </dl>
            </div>
          `
        }
        $('#institution').html(hsjcStr)
      } else {
        $('#institution').html('')
      }
    },
    error: function() {
      $('.loading').fadeOut(200)
    }
  });

}
