let $uvuIdInputDiv = $('.uvu-id')
let $uvuIdInput = $('#uvuId')
let $courseInput = $('#course')
let $logsDiv = $('.logs-div')

$logsDiv.addClass('farty shite shoop')

// $logsDiv.css('display', 'none') NEEDED

// EVENT LISTENERS ====================================

$('#logForm').on('submit', function (event) {
  event.preventDefault()
})

$('#submit').on('click', postLog)

// show uvuId textbox after course is selected
$courseInput.on('change', () => {
  if ($courseInput[0].selectedIndex != 0) {
    $uvuIdInputDiv.css('display', 'block')
    checkUvuId()
  } else {
    $uvuIdInputDiv.css('display', 'none')
  }
})

$uvuIdInput.on('input', checkUvuId)

// FUNCTION DEFINITIONS ===============================

// check uvuId for proper input
function checkUvuId() {
  uvuId = $uvuIdInput.val()

  if (uvuId.length == 8) {
    refreshLogs()
  }
}

function bindEventToLogs() {
  $('#logsUl li').on('click', function () {
    showHideLog($(this))
  })
}

// toggle displaying of log text
function showHideLog($log) {
  logPre = $log.children('pre')
  if (logPre.css('display') != 'none') logPre.css('display', 'none')
  else logPre.css('display', 'block')
}

// replace static course options with options from API
async function refreshCourseSelect() {
  let courseSelect = $('#course')
  let courseOptions = $('#course option:not(:first-child')
  courseOptions.remove()
  let url =
    'https://json-server-5phigi--3000.local.webcontainer.io/api/v1/courses'

  let json = await fetchJson(url)

  for (let i = 0; i < json.length; i++) {
    courseSelect.append(
      `<option value="${json[i].id}">${json[i].display}</option>`
    )
  }
}

// replace static course logs with logs from API
async function refreshLogs() {
  let $logsList = $('#logsUl')

  // clear log list
  $logsList.empty()

  // fetch log info
  let courseId = $('#course').val()
  let uvuId = $('#uvuId').val()
  let json = await fetchJson(
    `https://json-server-5phigi--3000.local.webcontainer.io/api/v1/logs?courseId=${courseId}&uvuId=${uvuId}`
  )

  //print log info
  for (log of json) {
    $logsList.append(
      `<li>
        <div><small>${log.date}</small></div>
        <pre><p>${log.text}</p></pre>
      </li>`
    )
  }
  $logsDiv.css('display', 'block')

  $('#uvuIdSpan').text(`for ${$uvuIdInput.val()}`)
  bindEventToLogs()

  // document.querySelector('button').setAttribute('disabled','')
  // document.querySelector('button').setAttribute('disabled', 'true')
  $('button').attr('disabled', 'false')
}

function postData(url, data) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

function postLog(event) {
  event.preventDefault()
  let d = new Date()
  let date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  let amPm = d.getHours() < 12 ? 'AM' : 'PM'
  let time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${amPm}`

  let json = {}
  json.courseId = $courseInput.val()
  json.uvuId = $uvuIdInput.val()
  json.date = `${date}, ${time}`
  json.text = $('#logBodyInput').val()
  json.id = createUUID()

  postData(
    'https://json-server-5phigi--3000.local.webcontainer.io/api/v1/logs',
    json
  )

  refreshLogs()
  $('#logBodyInput').val('')
}

// return json from fetch
async function fetchJson(src) {
  let response = await fetch(src)
  let myJson = await response.json()
  return myJson
}

refreshCourseSelect()

function createUUID() {
  return 'xxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
