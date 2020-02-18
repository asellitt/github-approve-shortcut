console.log("[GAS] Github Approve Shortcut")

const approvalRadio = 'form[action*="/reviews"] input[value="approve"]'
const approvalButton = 'form[action*="/reviews"] button[type="submit"]'
const approvalComment = 'form[action*="/reviews"] #pull_request_review_body'
const sessionStorageTrigger = 'github-approve-shortcut-triggered'

let commandDown = false
let shiftDown = false

const debug = (message, object = null) => {
  const debugEnabled = localStorage.getItem('github-approve-shortcut-debug')
  if(debugEnabled === 'true') {
    object
      ? console.debug(message, object)
      : console.debug(message)
  }
}

document.addEventListener("keydown", (event) =>{
  debug(">>> keydown", { keyCode: event.keyCode })
  // command === 93
  if(event.keyCode === 93) {
    debug("  command pressed")
    commandDown = true
  }
  // shift === 16
  if(event.keyCode === 16) {
    debug("  shift pressed")
    shiftDown = true
  }
  // a === 65
  if(event.keyCode === 65 && commandDown && shiftDown) {
    debug("  command+shift+a pressed")
    event.preventDefault()
    event.stopPropagation()
    openReviewDialog()
  }
  debug("<<<")
})

document.addEventListener("keyup", (event) =>{
  debug(">>> keyUp", { keyCode: event.keyCode })
  // command === 93
  if(event.keyCode === 93) {
    debug("  command released")
    commandDown = false
  }
  // shift === 16
  if(event.keyCode === 16) {
    debug("  shift released")
    shiftDown = false
  }
  debug("<<<")
})

const openReviewDialog = () => {
  debug(">>> openReviewDialog")
  let newLocation = window.location.toString()
  newLocation.includes("/files")
    ? newLocation
    : newLocation += "/files"
  newLocation.includes("#submit-review")
    ? newLocation
    : newLocation += "#submit-review"

  debug("  ", { newLocation })

  newLocation === window.location.toString()
    ? window.location.reload()
    : window.location.replace(newLocation)
  sessionStorage.setItem(sessionStorageTrigger, 'true')
  debug("<<<")
}

const onMutation = (mutationList, observer) => {
  debug(">>> onMutation")
  const approvalRadioExists = document.querySelector(approvalRadio) !== null
  const triggered = sessionStorage.getItem(sessionStorageTrigger) === 'true'
  debug("  ", { approvalRadioExists, triggered })

  if(approvalRadioExists && triggered) {
    console.log("[GAS] Approving pull request")
    sessionStorage.setItem(sessionStorageTrigger, 'false')
    document.querySelector(approvalRadio).click()
    document.querySelector(approvalButton).click()
  }
  debug("<<<")
}

if (document.getElementById("files_bucket") !== null) {
  debug("Registering MutationObserver")
  new MutationObserver(onMutation).observe(
    document.getElementById("files_bucket"),
    { attributes: true, childList: true, subtree: true }
  )
}
