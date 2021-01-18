// "http:"===window.location.protocol&&(window.location="https://"+window.location.host+window.location.pathname)

var fromCity = document.getElementById('fromCity')
    toCity = document.getElementById('toCity')
    fromVal = ''
    toVal = ''
    outFrom = document.getElementById('outFrom')
    inFrom = document.getElementById('inFrom')
    inTo = document.getElementById('inTo')
    outTo = document.getElementById('outTo')
    fromCode = document.getElementById('fromCode')
    ToCode = document.getElementById('ToCode')
    from_info = ''
    to_info = ''
    fromCodeDes = ''
    fromCodeImg = ''
    toCodeDes = ''
    toCodeImg = ''
    appKey = 'fa7914d4eec67d44499d2eca5eaea6e1'

getCurrent()
$('.changeCity').click(function(){
  var fromValue = $('.fromVal').html()
  var toValue = $('.toVal').html()
  if(fromValue === '出发地' && toValue === '目的地') {
    return;
  } else if (fromValue === '出发地' && toValue !== '目的地') {
    $('.fromVal').html(toValue)
    $('.toVal').html('目的地')
    $('.fromVal').addClass('city-select-color')
    $('.toVal').removeClass('city-select-color')
    fromVal = toVal;
    toVal = ''
  } else if (fromValue !== '出发地' && toValue === '目的地') {
    $('.fromVal').html('出发地')
    $('.toVal').html(fromValue)
    $('.fromVal').removeClass('city-select-color')
    $('.toVal').addClass('city-select-color')
    toVal = fromVal;
    fromVal = ''
  } else {
    $('.fromVal').html(toValue)
    $('.toVal').html(fromValue)
    var fromVal1 = fromVal
    var toVal1 = toVal
    fromVal = toVal1;
    toVal = fromVal1;
    getData()
  }
})
fromCity.onclick = function () {
  weui.picker(
    cityData, {
      defaultValue: [2, 1],
      onConfirm: function (result) {
        $('.fromVal').html(result[1].label);
        fromVal = result[1].value
        if (toVal) {
          getData()
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
        toVal = result[1].value
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

function getData() {
  $.ajax({
    type: "get",
    async: true,
    url: "https://apis.juhe.cn/springTravel/query?key="+appKey+"&from="+fromVal+"&to="+toVal+"&callback=_",
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      from_info = res.result?.from_info;
      to_info = res.result?.to_info;
      fromCodeDes = from_info?.health_code_desc;
      fromCodeImg = from_info?.health_code_picture;
      toCodeDes = to_info?.health_code_desc;
      toCodeImg = to_info?.health_code_picture;

      outFrom.innerHTML = `
        <div class="outin-city">
          <div class="city-name title-city">
            <div class="city-left">
              <b>出${from_info?.city_name}</b>
              <img src="./img/risk-level-${from_info.risk_level}.png">
            </div>
            <span class="health-code from-health-code">出发地健康码</span>
          </div>
          <div class="zhengce">${from_info?.out_desc}</div>
        </div>
      `;
      inFrom.innerHTML = `
        <div class="outin-city">
          <div class="city-name title-city">
            <div class="city-left">
              <b>进${to_info?.city_name}</b>
              <img src="./img/risk-level-${to_info.risk_level}.png">
            </div>
            <span class="health-code to-health-code">目的地健康码</span>
          </div>
          <div class="zhengce">${to_info?.high_in_desc}</div>
          <div class="zhengce">${to_info?.low_in_desc}</div>
        </div>
        `;
      inTo.innerHTML = `
      <div class="outin-city line">
        <div class="city-name title-city">
          <div class="city-left">
            <b>出${to_info?.city_name}</b>
            <img src="./img/risk-level-${to_info.risk_level}.png">
          </div>
        </div>
        <div class="zhengce">${to_info?.out_desc}</div>
      </div>
      `;
      outTo.innerHTML = `
      <div class="outin-city">
        <div class="city-name title-city">
          <div class="city-left">
            <b>进${from_info?.city_name}</b>
            <img src="./img/risk-level-${from_info.risk_level}.png">
          </div>
        </div>
        <div class="zhengce">${from_info?.high_in_desc}</div>
        <div class="zhengce">${from_info?.low_in_desc}</div>
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
      `
    }
  })
}

function getCurrent(){
  $.ajax({
    type: "get",
    async: true,
    url: "https://apis.juhe.cn/springTravel/current?key="+appKey+"&callback=_",
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      from_info = res.result?.from_info;
      $('.fromVal').html(from_info?.city_name);
      fromVal = from_info?.city_id;
      fromCodeDes = from_info?.health_code_desc;
      fromCodeImg = from_info?.health_code_picture;
      outFrom.innerHTML = `
        <div class="city-name">
          <div class="city-left">
            <b>${from_info?.city_name}</b>
            <img src="./img/risk-level-${from_info.risk_level}.png">
          </div>
          <span class="health-code from-health-code">出发地健康码</span>
        </div>
      <h3>外出政策</h3>
        <div class="zhengce">${from_info?.out_desc}</div>
      `;
      inFrom.innerHTML = `
        <h3>进入政策</h3>
        <div class="zhengce">${from_info?.high_in_desc}</div>
        <div class="zhengce">${from_info?.low_in_desc}</div>
        `;
      fromCode.innerHTML = `
        <div class="code-wrap">
          <div>${from_info.city_name}</div>
          <span>${from_info.health_code_name}</span>
        </div>
      `;
      if(!$('.fromVal').hasClass('city-select-color')) {
        $('.fromVal').addClass('city-select-color')
      }
    }
  })
}
