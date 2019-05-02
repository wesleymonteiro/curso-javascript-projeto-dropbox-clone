class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file')
    this.inputFilesEl = document.querySelector('#files')
    this.snackModalEl = document.querySelector('#react-snackbar-root')
    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg')
    this.fileNameEl = this.snackModalEl.querySelector('.filename')
    this.timeLeftEl = this.snackModalEl.querySelector('.timeleft')
    this.initEvents()
  }

  initEvents() {
    this.btnSendFileEl.addEventListener('click', event => {
      this.inputFilesEl.click()
    })

    this.inputFilesEl.addEventListener('change', event => {
      this.uploadTask(event.target.files)

      this.showModal()

      this.inputFilesEl.value = ''
    })
  }

  showModal(show = true) {
    this.snackModalEl.style.display = show ? 'block' : 'none'
  }

  uploadTask(files) {
    let promises = []

    let filesArray = [...files]
    filesArray.forEach(file=>{
      promises.push(new Promise((resolve,reject)=>{
        let ajax = new XMLHttpRequest()

        ajax.open('POST', '/upload')
        ajax.onload = event=>{
          try {
            resolve(JSON.parse(ajax.responseText))
          } catch (e) {
            reject(e)
          }

          this.showModal(false)
        }
        ajax.onerror = error=>{
          reject(error)

          this.showModal(false)
        }
        ajax.upload.onprogress = event=>{
          this.uploadProgress(event, file)
        }

        let formData = new FormData()

        formData.append('input-file', file)

        this.startTime = Date.now()
        ajax.send(formData)
      }))
    })

    return Promise.all(promises);
  }

  uploadProgress(event, file) {
    let timeSpent = Date.now() - this.startTime
    let percent = parseInt((event.loaded / event.total) * 100)
    let timeLeft = ((100 - percent) * timeSpent) / percent
    this.progressBarEl.style.width = `${percent}%`

    this.fileNameEl.innerHTML = file.name
    this.timeLeftEl.innerHTML = this.formatTime(timeLeft)
  }

  formatTime(dur) {
    let seconds = parseInt((dur / 1000) % 60)
    let minutes = parseInt((dur / (1000 * 60)) % 60)
    let hours = parseInt((dur / (1000 * 60 * 60)) % 24)

    if (hours > 0)
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
    if (minutes > 0)
      return `${minutes} minutos e ${seconds} segundos`
    if (seconds > 0)
      return `${seconds} segundos`

    return ''
  }

}