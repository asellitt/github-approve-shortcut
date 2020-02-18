console.log("Github Approve Shortcut")

const approvalRadio = 'form[action*="/reviews"] input[value="approve"]'
const approvalButton = 'form[action*="/reviews"] button[type="submit"]'
const approvalComment = 'form[action*="/reviews"] #pull_request_review_body'
const approvalUrl = '#submit-review'
const sessionStorageTrigger = 'github-approve-shortcut-triggered'

let cmdDown = false

document.addEventListener("keydown", (event) =>{
  // cmd === 93
  if(event.keyCode === 93){
    cmdDown = true
  }
  // a === 65
  if(event.keyCode === 65 && cmdDown) {
    event.preventDefault()
    event.stopPropagation()
    openReviewDialog()
  }
})

document.addEventListener("keyup", (event) =>{
  // cmd === 93
  if(event.keyCode === 93) {
    cmdDown = false
  }
})

const openReviewDialog = () => {
  const toAppend = window.location.pathname.includes("files")
    ? approvalUrl
    : "/files" + approvalUrl
  window.location.replace(window.location + toAppend)
  sessionStorage.setItem(sessionStorageTrigger, true)
}

const onMutation = (mutationList, observer) => {
  const approvalRadioExists = document.querySelector(approvalRadio) !== null
  const triggered = sessionStorage.getItem(sessionStorageTrigger)

  if(approvalRadioExists && triggered) {
    sessionStorage.setItem(sessionStorageTrigger, false)
    document.querySelector(approvalRadio).click()
    document.querySelector(approvalButton).click()
  }
}

const observer = new MutationObserver(onMutation)
observer.observe(
  document.getElementById("js-repo-pjax-container"),
  { attributes: true, childList: true, subtree: true }
)
