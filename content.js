console.log("Github Approve Shortcut")

const approvalRadio = 'form[action*="/reviews"] input[value="approve"]'
const approvalButton = 'form[action*="/reviews"] button[type="submit"]'
const approvalComment = 'form[action*="/reviews"] #pull_request_review_body'
const approvalUrl = '#submit-review'
const sessionStorageTrigger = 'github-approve-shortcut-triggered'

let cmdDown = false

const debug = (message, object = null) => {
  const debugEnabled = localStorage.getItem('github-approve-shortcut-debug')
  if(debugEnabled) {
    console.debug(message, object)
  }
}

document.addEventListener("keydown", (event) =>{
  debug(">>> keydown", { keyCode: event.keyCode })
  // cmd === 93
  if(event.keyCode === 93) {
    debug("  cmd pressed")
    cmdDown = true
  }
  // a === 65
  if(event.keyCode === 65 && cmdDown) {
    debug("  cmd+a pressed")
    event.preventDefault()
    event.stopPropagation()
    openReviewDialog()
  }
})

document.addEventListener("keyup", (event) =>{
  debug(">>> keyUp", { keyCode: event.keyCode })
  // cmd === 93
  if(event.keyCode === 93) {
    debug("  cmd released")
    cmdDown = false
  }
})

const openReviewDialog = () => {
  debug(">>> openReviewDialog")
  const toAppend = window.location.pathname.includes("files")
    ? approvalUrl
    : "/files" + approvalUrl
  debug("  ", { toAppend })
  window.location.replace(window.location + toAppend)
  sessionStorage.setItem(sessionStorageTrigger, 'true')
}

const onMutation = (mutationList, observer) => {
  debug(">>> onMutation")
  const approvalRadioExists = document.querySelector(approvalRadio) !== null
  const triggered = sessionStorage.getItem(sessionStorageTrigger) === 'true'
  debug("  ", { approvalRadioExists, triggered })

  if(approvalRadioExists && triggered) {
    console.log("Approving pull request")
    sessionStorage.setItem(sessionStorageTrigger, 'false')
    document.querySelector(approvalRadio).click()
    document.querySelector(approvalButton).click()
  }
}

if (document.getElementById("files_bucket") !== null) {
  debug("Registering MutationObserver")
  new MutationObserver(onMutation).observe(
    document.getElementById("files_bucket"),
    { attributes: true, childList: true, subtree: true }
  )
}
