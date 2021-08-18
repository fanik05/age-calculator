const wrapper = document.getElementById('root')
wrapper.style.textAlign = 'center'
wrapper.style.marginTop = '5vh'

const getInfoFromLocalStorage = () => {   
    let data 

    if (!localStorage.getItem('data')) {
        data = []
    } else {
        data = JSON.parse(localStorage.getItem('data'))
    }

    return data
}

const setInfoToLocalStorage = info => {
   const data = getInfoFromLocalStorage()
   
   data.push(info)
   localStorage.setItem('data', JSON.stringify(data))
}

let userName, heading

const displayGreetings = () => {
    userName = prompt('Enter your name:')

    if (userName) {
        heading = document.createElement('h1')
        heading.innerText = 'Hello, ' + userName + '!'
        heading.style.marginTop = '5vh'
        wrapper.appendChild(heading)
    } else {
        displayGreetings()
    }
}

displayGreetings()

const calculateAge = age => {
    const dobString = age.split('\/')
    const dob = new Date()
    dob.setDate(dobString[0])
    dob.setMonth(dobString[1] === '01' ? 0: parseInt(dobString[1]) - 1)
    dob.setFullYear(dobString[2])

    const ageElement = document.createElement('h1')
    wrapper.appendChild(ageElement)

    setInterval(() => {
        const today = new Date()
        const second = today.getSeconds()
        const minute = today.getMinutes()
        const hour = today.getHours()

        const day = (function () {
            if (today.getDate() > dob.getDate()) {
                return today.getDate() - dob.getDate() - 1;
            } else if (today.getDate() === dob.getDate()) {
                return today.getDate() - dob.getDate();
            } else {
                let calDate = new Date(dob.getFullYear(), dob.getMonth() + 1, 0)
                return (today.getDate() + calDate.getDate()) - dob.getDate() - 1
            }
        }());

        const month = (function () {
            if (today.getMonth() >= dob.getMonth()) {
                if (today.getDate() >= dob.getDate()) {
                    return today.getMonth() - dob.getMonth()
                } else {
                    if((today.getMonth() - 1) >= dob.getMonth()) {
                        return (today.getMonth() - 1) - dob.getMonth()
                    } else {
                        return ((today.getMonth() - 1) + 12) - dob.getMonth()
                    }
                }
            } else {
                if(today.getDate() >= dob.getDate()) {
                    return (today.getMonth() + 12) - dob.getMonth()
                } else {
                    return ((today.getMonth() - 1) + 12) - dob.getMonth()
                }
            }
        }());

        const year = (function () {
            if (dob.getMonth() === today.getMonth()) {
                if (dob.getDate() > today.getDate()) {
                    return (today.getFullYear() - 1) - dob.getFullYear()
                } else {
                    return today.getFullYear() - dob.getFullYear()
                }
            } else {
                if (dob.getMonth() > today.getMonth()) {
                    return (today.getFullYear() - 1) - dob.getFullYear()
                } else {
                    return today.getFullYear() - dob.getFullYear()
                }
            }
        }());

        ageElement.innerText = `Your age: ${year} years ${month} months ${day} days ${hour} hours ${minute} minutes ${second} seconds`
    }, 1000)
}

let age

const displayAge = () => {
    const data = getInfoFromLocalStorage()

    if (data.some(info => info.name === userName)) {
        age = data.filter(info => info.name === userName)[0].dob

        calculateAge(age)
    } else {
        while (true) {
            age = prompt('Enter your date of birth: (dd/mm/yyyy)')

            if (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(age)) {
                break    
            }
        }

        calculateAge(age)
    }
}

displayAge()

const resetButton = document.createElement('button')
resetButton.style.alignSelf = 'center'
resetButton.innerText = 'Reset'
resetButton.addEventListener('click', () => location.reload())
wrapper.append(resetButton)

const clearAllDataButton = document.createElement('button')
clearAllDataButton.style.alignSelf = 'center'
clearAllDataButton.style.marginLeft = '20px'
clearAllDataButton.innerText = 'Clear All Data'
clearAllDataButton.addEventListener('click', () => localStorage.clear())
wrapper.append(clearAllDataButton)

let image

const addImage = image => {
    const img = document.createElement('img')
    img.setAttribute('src', image)
    img.setAttribute('width', '480px')
    img.setAttribute('height', '360px')
    wrapper.insertBefore(img, heading)
}

const displayImage = () => {
    const data = getInfoFromLocalStorage()
    
    if (data.some(info => info.image && info.name === userName)) {
        image = data.filter(info => info.name === userName)[0].image
        
        addImage(image)
    } else {
        wrapper.style.display = 'none'
        const takePictureElement = document.createElement('div')
        takePictureElement.setAttribute('id', 'take-picture')
        takePictureElement.style.textAlign = 'center'
        document.body.appendChild(takePictureElement)
        const videoElement = document.createElement('video')
        videoElement.setAttribute('width', '480px')
        videoElement.setAttribute('height', '360px')
        videoElement.setAttribute('autoplay', '')
        const takePicture = document.getElementById('take-picture')
        takePicture.appendChild(videoElement)
        const video = document.querySelector('video')
        video.style.display = 'block'
        video.style.margin = '5vh auto'

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                video.srcObject = stream
                video.play()
            })
        }

        const takePhotoButton = document.createElement('button')
        takePhotoButton.style.alignSelf = 'center'
        takePhotoButton.innerText = 'Take Photo'
        takePicture.appendChild(takePhotoButton)
        takePhotoButton.addEventListener('click', () => {
            document.querySelector('canvas').getContext('2d').drawImage(video, 0, 0, 480, 360)
        })

        let image

        const confirmPhotoButton = document.createElement('button')
        confirmPhotoButton.style.alignSelf = 'center'
        confirmPhotoButton.style.marginLeft = '20px'
        confirmPhotoButton.innerText = 'Confirm'
        takePicture.appendChild(confirmPhotoButton)
        confirmPhotoButton.addEventListener('click', () => {
            image = document.querySelector('canvas').toDataURL()

            setInfoToLocalStorage({ name: userName, dob: age, image })

            takePicture.style.display = 'none'
            wrapper.style.display = 'block'

            addImage(image)
        })

        const outputCanvas = document.createElement('canvas')
        outputCanvas.setAttribute('width', '480px')
        outputCanvas.setAttribute('height', '360px')
        outputCanvas.style.display = 'block'
        outputCanvas.style.margin = '5vh auto'
        takePicture.appendChild(outputCanvas)
    }
}

displayImage()