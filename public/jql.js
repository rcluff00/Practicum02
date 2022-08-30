class ElementCollection extends Array {
  // wait for page to finish loading
  ready(callback) {
    const isReady = this.some((e) => {
      return e.readyState != null && e.readyState != 'loading'
    })
    if (isReady) {
      callback()
    } else {
      this.on('DOMContentLoaded', cb)
    }
  }

  on(event, callback) {
    this.forEach((elem) => elem.addEventListener(event, callback))
  }

  css(prop, val) {
    const propCamel = prop.replace(/-(a-z)/, (regexGroup) => {
      return regexGroup.replace('-', '').toUpperCase()
    })

    if (val)
      this.forEach((elem) => {
        elem.style[propCamel] = val
      })
    else return this[0].style[propCamel]
  }

  append(str) {
    this.forEach((elem) => {
      elem.innerHTML += str
    })
  }

  remove() {
    this.forEach((elem) => {
      elem.remove()
    })
  }

  children(param) {
    if (typeof param === 'string' || param instanceof String) {
      return new ElementCollection(...this.querySelectorAll(param))
    } else {
      return new ElementCollection(param)
    }
  }

  val(param) {
    if (typeof param === 'string' || param instanceof String) {
      this.forEach((elem) => {
        elem.value = param
      })
    } else {
      return this[0].value
    }
  }

  text(param) {
    if (typeof param === 'string' || param instanceof String) {
      this.forEach((elem) => {
        elem.innerText = param
      })
    } else {
      return this[0].innerText
    }
  }
}

function $(param) {
  if (typeof param === 'string' || param instanceof String) {
    return new ElementCollection(...document.querySelectorAll(param))
  } else {
    return new ElementCollection(param)
  }
}
